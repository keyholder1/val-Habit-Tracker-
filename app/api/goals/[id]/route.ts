import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/db'
import { EVENTS, logEvent } from '@/lib/events'
import { invalidateAnalyticsCache } from '@/lib/analytics/getAnalyticsData'

export async function PATCH(
    req: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const session = await getServerSession(authOptions)
        if (!session?.user?.id) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const body = await req.json()
        const { symbol, name, weeklyTarget, isArchived, archivedFromWeek, deletedAt, expectedUpdatedAt } = body

        // Validation
        if (symbol && symbol.length > 8) {
            return NextResponse.json({ error: 'Symbol too long' }, { status: 400 })
        }

        // Verify ownership and fetch current state for concurrency check
        const existingGoal = await prisma.goal.findUnique({
            where: { id: params.id },
        })

        if (!existingGoal || existingGoal.userId !== session.user.id) {
            return NextResponse.json({ error: 'Goal not found' }, { status: 404 })
        }

        // Concurrency Check
        if (expectedUpdatedAt && new Date(expectedUpdatedAt).getTime() !== existingGoal.updatedAt.getTime()) {
            return NextResponse.json({ error: 'Conflict: Goal has been modified by another process.' }, { status: 409 })
        }

        const dataToUpdate: any = {}

        if (symbol !== undefined) dataToUpdate.symbol = symbol
        if (name !== undefined) dataToUpdate.name = name
        if (weeklyTarget !== undefined) dataToUpdate.weeklyTarget = weeklyTarget
        if (isArchived !== undefined) dataToUpdate.isArchived = isArchived
        if (archivedFromWeek !== undefined) dataToUpdate.archivedFromWeek = new Date(archivedFromWeek)
        if (deletedAt !== undefined) dataToUpdate.deletedAt = new Date(deletedAt)

        // Update
        const updatedGoal = await prisma.$transaction(async (tx) => {
            const updated = await tx.goal.update({
                where: { id: params.id },
                data: dataToUpdate,
            })

            let eventType = null
            if (dataToUpdate.isArchived === true) eventType = EVENTS.GOAL_ARCHIVED
            if (dataToUpdate.deletedAt) eventType = EVENTS.GOAL_DELETED

            if (eventType) {
                await logEvent(tx, {
                    userId: session.user.id,
                    eventType,
                    entityType: 'Goal',
                    entityId: updated.id,
                    payload: dataToUpdate,
                })
            }

            return updated
        })

        // Invalidate analytics cache
        invalidateAnalyticsCache(session.user.id)

        return NextResponse.json(updatedGoal)
    } catch (error) {
        console.error('Failed to update goal:', error)
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }
}

export async function DELETE(
    req: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const session = await getServerSession(authOptions)
        if (!session?.user?.id) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const deletedGoal = await prisma.$transaction(async (tx) => {
            // Verify and find first (since deleteMany doesn't return the record)
            const existing = await tx.goal.findFirst({
                where: {
                    id: params.id,
                    userId: session.user.id
                }
            })

            if (!existing) return null

            await tx.goal.delete({
                where: { id: params.id }
            })

            await logEvent(tx, {
                userId: session.user.id,
                eventType: EVENTS.GOAL_DELETED,
                entityType: 'Goal',
                entityId: params.id,
                payload: { method: 'HARD_DELETE' }
            })

            return existing
        })

        if (!deletedGoal) {
            return NextResponse.json({ error: 'Goal not found' }, { status: 404 })
        }


        // Invalidate analytics cache
        invalidateAnalyticsCache(session.user.id)

        return NextResponse.json({ success: true })
    } catch (error) {
        console.error('Failed to delete goal:', error)
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }
}
