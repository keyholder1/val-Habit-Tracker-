import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/db'
import { assertProjectAccess } from '@/lib/whitelist'
import { EVENTS, logEvent, logEventSafe } from '@/lib/events'
import { invalidateAnalyticsCache } from '@/lib/analytics/getAnalyticsData'
import { checkIdempotency } from '@/lib/idempotency'
import { withTiming } from '@/lib/timing'
import { projectEntrySchema } from '@/lib/validations'
import { withRateLimit } from '@/lib/withRateLimit'

export const dynamic = 'force-dynamic'

// GET - Get a single project diary entry with its code blocks
export async function GET(
    req: NextRequest,
    { params }: { params: { id: string } }
) {
    return withTiming('projects GET single', async () => {
        try {
            const session = await getServerSession(authOptions)
            if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

            try {
                assertProjectAccess(session)
            } catch {
                return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
            }

            const project = await prisma.projectDiaryEntry.findUnique({
                where: {
                    id: params.id,
                    userId: session.user.id
                },
                include: {
                    codeBlocks: {
                        where: { isDeleted: false },
                        orderBy: { createdAt: 'desc' },
                        select: {
                            id: true,
                            title: true,
                            language: true,
                            createdAt: true,
                            codeContent: true,
                            notes: true
                        }
                    }
                }
            })

            if (!project) {
                return NextResponse.json({ error: 'Project not found' }, { status: 404 })
            }

            return NextResponse.json(project)
        } catch (error: any) {
            console.error('Get Project Error:', error)
            return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
        }
    })
}

// PATCH - Update a project diary entry
export const PATCH = withRateLimit(async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
    return withTiming('projects PATCH', async () => {
        try {
            const session = await getServerSession(authOptions)
            if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

            try {
                assertProjectAccess(session)
            } catch {
                return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
            }

            const body = await req.json()
            const result = projectEntrySchema.partial().safeParse(body)

            if (!result.success) {
                return NextResponse.json({ error: 'Invalid input', details: result.error.format() }, { status: 400 })
            }

            const { requestId, expectedUpdatedAt, ...updateData } = body // Use partial data from body safely

            // 1. Idempotency
            const existingEntityId = await checkIdempotency(requestId, session.user.id)
            if (existingEntityId) {
                const existingProject = await prisma.projectDiaryEntry.findUnique({ where: { id: existingEntityId } })
                return NextResponse.json(existingProject)
            }

            // 2. Conflict Detection
            if (expectedUpdatedAt) {
                const currentProject = await prisma.projectDiaryEntry.findUnique({
                    where: { id: params.id, userId: session.user.id },
                    select: { updatedAt: true }
                })

                if (currentProject && currentProject.updatedAt.getTime() > new Date(expectedUpdatedAt).getTime()) {
                    return NextResponse.json({ error: 'Conflict: Data has changed on server' }, { status: 409 })
                }
            }

            // 3. Update with transaction and logging
            const updated = await prisma.$transaction(async (tx) => {
                const project = await tx.projectDiaryEntry.update({
                    where: {
                        id: params.id,
                        userId: session.user.id
                    },
                    data: {
                        projectName: updateData.projectName,
                        techStack: updateData.techStack,
                        projectType: updateData.projectType,
                        projectDescription: updateData.projectDescription,
                        targetAudience: updateData.targetAudience,
                        uniqueSellingPoint: updateData.uniqueSellingPoint,
                        status: updateData.status
                    }
                })

                await logEvent(tx, {
                    userId: session.user.id as string,
                    eventType: EVENTS.PROJECT_ENTRY_UPDATED,
                    entityType: 'ProjectDiaryEntry',
                    entityId: project.id,
                    payload: { requestId, method: 'PATCH' },
                })

                return project
            })

            // Invalidate analytics cache
            invalidateAnalyticsCache(session.user.id)

            return NextResponse.json(updated)
        } catch (error: any) {
            if (error.code === 'P2025') {
                return NextResponse.json({ error: 'Project not found' }, { status: 404 })
            }
            console.error('Error updating project:', error)
            return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
        }
    })
})

// DELETE - Delete a project diary entry
export const DELETE = withRateLimit(async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
    return withTiming('projects DELETE', async () => {
        try {
            const session = await getServerSession(authOptions)
            if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

            try {
                assertProjectAccess(session)
            } catch {
                return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
            }

            await prisma.projectDiaryEntry.delete({
                where: {
                    id: params.id,
                    userId: session.user.id
                }
            })

            logEventSafe({
                userId: session.user.id,
                eventType: EVENTS.PROJECT_ENTRY_DELETED,
                entityType: 'ProjectDiaryEntry',
                entityId: params.id,
                payload: { method: 'HARD_DELETE' },
            })

            // Invalidate analytics cache
            invalidateAnalyticsCache(session.user.id)

            return new NextResponse(null, { status: 204 })
        } catch (error: any) {
            if (error.code === 'P2025') {
                return NextResponse.json({ error: 'Project not found' }, { status: 404 })
            }
            console.error('Error deleting project:', error)
            return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
        }
    })
})
