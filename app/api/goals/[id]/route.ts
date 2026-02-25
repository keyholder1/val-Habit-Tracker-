import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/db'
import { EVENTS, logEvent } from '@/lib/events'
import { invalidateAnalyticsCache } from '@/lib/analytics/getAnalyticsData'
import { withRateLimit } from '@/lib/withRateLimit'

export const PATCH = withRateLimit(async function PATCH(
    req: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const session = await getServerSession(authOptions)
        if (!session?.user?.email) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        // Robust User Lookup
        const user = await prisma.user.findUnique({
            where: { email: session.user.email },
            select: { id: true }
        })

        if (!user) {
            return NextResponse.json({ error: 'User not found in DB' }, { status: 404 })
        }

        const userId = user.id

        const body = await req.json()
        const { symbol, name, weeklyTarget, isArchived, archivedFromWeek, deletedAt, startDate, expectedUpdatedAt } = body

        // Validation
        if (symbol && symbol.length > 8) {
            return NextResponse.json({ error: 'Symbol too long' }, { status: 400 })
        }

        if (startDate) {
            const startDateDate = new Date(startDate)
            const now = new Date()
            now.setHours(23, 59, 59, 999)

            if (isNaN(startDateDate.getTime())) {
                return NextResponse.json({ error: 'Invalid startDate format' }, { status: 400 })
            }
            if (startDateDate > now) {
                return NextResponse.json({ error: 'Start date cannot be in the future' }, { status: 400 })
            }
        }

        // Verify ownership and fetch current state for concurrency check
        const existingGoal = await prisma.goal.findUnique({
            where: { id: params.id },
        })

        if (!existingGoal || existingGoal.userId !== userId) {
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
        if (startDate !== undefined) dataToUpdate.startDate = new Date(startDate)

        // Update
        const updatedGoal = await prisma.$transaction(async (tx) => {
            const updated = await tx.goal.update({
                where: { id: params.id },
                data: dataToUpdate,
            })

            let eventType = null
            let eventPayload: any = dataToUpdate
            if (dataToUpdate.isArchived === true || dataToUpdate.archivedFromWeek) {
                eventType = EVENTS.GOAL_ARCHIVED
                eventPayload = {
                    mode: dataToUpdate.archivedFromWeek ? 'archive' : 'flag',
                    archiveDate: dataToUpdate.archivedFromWeek || null,
                    ...dataToUpdate,
                }
            }
            if (dataToUpdate.deletedAt) eventType = EVENTS.GOAL_DELETED
            if (dataToUpdate.startDate) eventType = 'GOAL_START_DATE_UPDATED'

            if (eventType) {
                await logEvent(tx, {
                    userId: userId,
                    eventType,
                    entityType: 'Goal',
                    entityId: updated.id,
                    payload: eventPayload,
                })
            }

            return updated
        })

        // Invalidate analytics cache
        invalidateAnalyticsCache(userId)

        return NextResponse.json(updatedGoal)
    } catch (error) {
        console.error('Failed to update goal:', error)
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }
})

export const DELETE = withRateLimit(async function DELETE(
    req: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        console.log('🔴 [API DELETE] Attempting to delete goal:', params.id)
        const session = await getServerSession(authOptions)
        if (!session?.user?.email) {
            console.log('🔴 [API DELETE] No session email, returning 401')
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        console.log('🔴 [API DELETE] Session email:', session.user.email)

        // Robust User Lookup
        const user = await prisma.user.findUnique({
            where: { email: session.user.email },
            select: { id: true }
        })

        if (!user) {
            console.log('🔴 [API DELETE] User not found for email:', session.user.email)
            return NextResponse.json({ error: 'User not found' }, { status: 404 })
        }

        const userId = user.id
        console.log('🔴 [API DELETE] Resolved userId:', userId, 'for goal:', params.id)

        const deletedGoal = await prisma.$transaction(async (tx) => {
            const existing = await tx.goal.findFirst({
                where: {
                    id: params.id,
                    userId: userId
                }
            })

            console.log('🔴 [API DELETE] Goal lookup result:', existing ? `Found: ${existing.name}` : 'NOT FOUND')

            if (!existing) return null

            await tx.goal.delete({
                where: { id: params.id }
            })

            await logEvent(tx, {
                userId: userId,
                eventType: EVENTS.GOAL_DELETED,
                entityType: 'Goal',
                entityId: params.id,
                payload: { method: 'HARD_DELETE' }
            })

            console.log('🔴 [API DELETE] Successfully hard-deleted goal:', existing.name)
            return existing
        })

        if (!deletedGoal) {
            console.log('🔴 [API DELETE] Goal not found, returning 404')
            return NextResponse.json({ error: 'Goal not found' }, { status: 404 })
        }

        // Invalidate analytics cache
        invalidateAnalyticsCache(userId)

        console.log('🔴 [API DELETE] ✅ Deletion complete for goal:', deletedGoal.name)
        return NextResponse.json({ success: true })
    } catch (error) {
        console.error('🔴 [API DELETE] ❌ CRASH:', error)
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }
})
