import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/db'
import { assertProjectAccess } from '@/lib/whitelist'
import { EVENTS, logEvent } from '@/lib/events'
import { invalidateAnalyticsCache } from '@/lib/analytics/getAnalyticsData'
import { logger } from '@/lib/logger'
import { withTiming } from '@/lib/timing'
import { projectEntrySchema } from '@/lib/validations'

export const dynamic = 'force-dynamic'

// POST - Create a new project diary entry
export async function POST(req: NextRequest) {
    return withTiming('projects POST', async () => {
        try {
            const session = await getServerSession(authOptions)
            if (!session?.user?.id) {
                return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
            }

            try {
                assertProjectAccess(session)
            } catch (error) {
                return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
            }

            const body = await req.json()
            const result = projectEntrySchema.safeParse(body)

            if (!result.success) {
                return NextResponse.json({ error: 'Invalid input', details: result.error.format() }, { status: 400 })
            }

            const {
                projectName,
                techStack,
                projectType,
                projectDescription,
                targetAudience,
                uniqueSellingPoint,
                status
            } = result.data

            const project = await prisma.$transaction(async (tx) => {
                const entry = await tx.projectDiaryEntry.create({
                    data: {
                        userId: session.user.id as string,
                        projectName,
                        techStack: techStack || '',
                        projectType: projectType || 'Web App',
                        projectDescription: projectDescription || '',
                        targetAudience: targetAudience || 'Developers',
                        uniqueSellingPoint: uniqueSellingPoint || 'High performance',
                        status: status || 'Ideation',
                    }
                })

                await logEvent(tx, {
                    userId: session.user.id as string,
                    eventType: EVENTS.PROJECT_ENTRY_CREATED,
                    entityType: 'ProjectDiaryEntry',
                    entityId: entry.id,
                    payload: { projectName, projectType },
                })

                return entry
            })

            // Invalidate analytics cache
            invalidateAnalyticsCache(session.user.id)

            return NextResponse.json(project)
        } catch (error: any) {
            logger.logError('Create Project Error', error)
            return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
        }
    })
}

// GET - List projects for the user
export async function GET(req: NextRequest) {
    return withTiming('projects GET', async () => {
        try {
            const session = await getServerSession(authOptions)
            if (!session?.user?.id) {
                return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
            }

            try {
                assertProjectAccess(session)
            } catch (error) {
                return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
            }

            const { searchParams } = new URL(req.url)
            const page = parseInt(searchParams.get('page') || '1')
            const limit = parseInt(searchParams.get('limit') || '10')
            const skip = (page - 1) * limit

            const [projects, total] = await prisma.$transaction([
                prisma.projectDiaryEntry.findMany({
                    where: { userId: session.user.id },
                    orderBy: { createdAt: 'desc' },
                    skip,
                    take: limit,
                    select: {
                        id: true,
                        projectName: true,
                        techStack: true,
                        projectType: true,
                        status: true,
                        createdAt: true,
                        projectDescription: true,
                        targetAudience: true,
                        uniqueSellingPoint: true,
                    }
                }),
                prisma.projectDiaryEntry.count({
                    where: { userId: session.user.id }
                })
            ])

            return NextResponse.json({
                data: projects,
                pagination: {
                    page,
                    limit,
                    total,
                    totalPages: Math.ceil(total / limit)
                }
            })
        } catch (error: any) {
            logger.logError('List Projects Error', error)
            return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
        }
    })
}
