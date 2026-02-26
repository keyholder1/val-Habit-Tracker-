import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/db'
import { invalidateAnalyticsCache } from '@/lib/analytics/getAnalyticsData'
import { EVENTS, logEventSafe } from '@/lib/events'
import { checkIdempotency } from '@/lib/idempotency'
import { withTiming } from '@/lib/timing'
import { weeklyLogSchema } from '@/lib/validations'
import { logger } from '@/lib/logger'
import { withRateLimit } from '@/lib/withRateLimit'

export const dynamic = 'force-dynamic'

// GET - Get weekly log for a specific goal and week
export const GET = withRateLimit(async function GET(req: NextRequest) {
    try {
        const session = await getServerSession(authOptions)
        if (!session?.user?.email) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const user = await prisma.user.findUnique({
            where: { email: session.user.email.toLowerCase() },
            select: { id: true },
        })

        if (!user) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 })
        }

        const { searchParams } = new URL(req.url)
        const goalId = searchParams.get('goalId')
        const weekStartDate = searchParams.get('weekStartDate')

        // BULK FETCH: If no goalId, but weekStartDate exists, return ALL logs for that week
        if (weekStartDate && !goalId) {
            const parsedDate = new Date(weekStartDate)
            parsedDate.setUTCHours(0, 0, 0, 0)

            console.log(`🔵 [weekly-logs GET BULK] fetching all logs for user=${user.id}, date=${parsedDate.toISOString()}`)

            const logs = await prisma.weeklyLog.findMany({
                where: {
                    userId: user.id,
                    weekStartDate: parsedDate
                },
                select: {
                    id: true,
                    weekStartDate: true,
                    checkboxStates: true,
                    weeklyTarget: true,
                    goalId: true,
                    updatedAt: true,
                }
            })

            return NextResponse.json(logs)
        }

        if (!goalId || !weekStartDate) {
            return NextResponse.json({ error: 'Missing parameters' }, { status: 400 })
        }


        const parsedDate = new Date(weekStartDate)
        // Force normalize to midnight UTC to ensure consistency
        parsedDate.setUTCHours(0, 0, 0, 0)

        console.log(`🔵 [weekly-logs GET] Looking for: userId=${user.id}, goalId=${goalId}, weekStartDate=${parsedDate.toISOString()}`)

        const log = await prisma.weeklyLog.findUnique({
            where: {
                userId_goalId_weekStartDate: {
                    userId: user.id,
                    goalId,
                    weekStartDate: parsedDate,
                },
            },
            select: {
                id: true,
                weekStartDate: true,
                checkboxStates: true,
                weeklyTarget: true,
                goalId: true,
                updatedAt: true,
            }
        })

        if (!log) {
            console.log(`🔵 [weekly-logs GET] NOT FOUND`)
            return NextResponse.json({ error: 'Log not found' }, { status: 404 })
        }

        console.log(`🔵 [weekly-logs GET] FOUND log id=${log.id}, stored date=${log.weekStartDate}`)
        return NextResponse.json(log)
    } catch (error) {
        console.error('Error fetching weekly log:', error)
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }
})

// POST - Create or update weekly log
export const POST = withRateLimit(async function POST(req: NextRequest) {
    return withTiming('weekly-logs POST', async () => {
        try {
            const session = await getServerSession(authOptions)
            if (!session?.user?.id) {
                return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
            }

            const body = await req.json()
            const result = weeklyLogSchema.safeParse(body)

            if (!result.success) {
                return NextResponse.json({ error: 'Invalid input', details: result.error.format() }, { status: 400 })
            }

            const { goalId, weekStartDate, weeklyTarget, checkboxStates, requestId, expectedUpdatedAt } = result.data

            // 1. Idempotency Check
            const existingEntityId = await checkIdempotency(requestId, session.user.id)
            if (existingEntityId) {
                console.log(`🔄 [Idempotency] Request ${requestId} already processed. Returning success.`)
                const existingLog = await prisma.weeklyLog.findUnique({ where: { id: existingEntityId } })
                return NextResponse.json(existingLog)
            }

            // Upsert the log
            const parsedDate = new Date(weekStartDate)
            parsedDate.setUTCHours(0, 0, 0, 0)

            // 2. Conflict Detection (Multi-tab safety)
            if (expectedUpdatedAt) {
                const currentLog = await prisma.weeklyLog.findUnique({
                    where: {
                        userId_goalId_weekStartDate: {
                            userId: session.user.id,
                            goalId,
                            weekStartDate: parsedDate,
                        },
                    },
                    select: { updatedAt: true }
                })

                if (currentLog && currentLog.updatedAt.getTime() > new Date(expectedUpdatedAt).getTime()) {
                    console.warn(`🛑 [Conflict] WeeklyLog ${goalId} was updated by another client. Rejecting write.`)
                    return NextResponse.json({ error: 'Conflict: Data has changed on server' }, { status: 409 })
                }
            }

            // 3. Perform Write (Atomic UPSERT inside transaction if needed, but upsert is atomic enough for this)
            const updatedLog = await prisma.weeklyLog.upsert({
                where: {
                    userId_goalId_weekStartDate: {
                        userId: session.user.id,
                        goalId,
                        weekStartDate: parsedDate,
                    },
                },
                update: {
                    weeklyTarget,
                    checkboxStates,
                },
                create: {
                    userId: session.user.id,
                    goalId,
                    weekStartDate: parsedDate,
                    weeklyTarget,
                    checkboxStates,
                },
            })

            // 4. Safe Event Logging
            logEventSafe({
                userId: session.user.id,
                eventType: EVENTS.WEEKLY_LOG_UPDATED,
                entityType: 'WeeklyLog',
                entityId: updatedLog.id,
                payload: {
                    goalId,
                    weekStartDate: parsedDate.toISOString(),
                    checkboxStates,
                    requestId,
                    method: 'POST'
                },
            })

            // Invalidate analytics cache
            invalidateAnalyticsCache(session.user.id)

            return NextResponse.json(updatedLog)
        } catch (error) {
            logger.logError('Failed to save weekly log', error)
            return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
        }
    })
})
