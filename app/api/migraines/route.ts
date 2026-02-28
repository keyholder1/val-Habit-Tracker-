import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { assertMigraineAccess } from '@/lib/whitelist'
import { EVENTS, logEvent } from '@/lib/events'
import { withTiming } from '@/lib/timing'
import { migraineEntrySchema } from '@/lib/validations'
import { logger } from '@/lib/logger'
import { invalidateAnalyticsCache } from '@/lib/analytics/getAnalyticsData'
import { withRateLimit } from '@/lib/withRateLimit'
import { withTimeout } from '@/lib/withTimeout'
import { formatApiError } from '@/lib/apiError'

export const dynamic = 'force-dynamic'

// GET - List all migraine entries for the user
export const GET = withRateLimit(withTimeout(async function GET(req: NextRequest) {
    return withTiming('migraines GET', async () => {
        try {
            const session = await getServerSession(authOptions)
            if (!session?.user?.id) {
                return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
            }

            try {
                assertMigraineAccess(session)
            } catch (error) {
                return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
            }

            const { searchParams } = new URL(req.url)
            const cursor = searchParams.get('cursor')
            const limit = parseInt(searchParams.get('limit') || '20')

            const entries = await prisma.migraineEntry.findMany({
                where: {
                    userId: session.user.id,
                },
                orderBy: {
                    date: 'desc',
                },
                take: limit + 1,
                cursor: cursor ? { id: cursor } : undefined,
            })

            let nextCursor: typeof cursor | undefined = undefined
            if (entries.length > limit) {
                const nextItem = entries.pop()
                nextCursor = nextItem?.id
            }

            const total = await prisma.migraineEntry.count({
                where: { userId: session.user.id }
            })

            return NextResponse.json({
                entries,
                nextCursor,
                total,
            })
        } catch (error) {
            const apiErr = formatApiError(error)
            return NextResponse.json({ error: apiErr.message }, { status: apiErr.status })
        }
    })
}))

// POST - Create or update migraine entry
export const POST = withRateLimit(withTimeout(async function POST(req: NextRequest) {
    return withTiming('migraines POST', async () => {
        try {
            const session = await getServerSession(authOptions)
            if (!session?.user?.id) {
                return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
            }

            try {
                assertMigraineAccess(session)
            } catch (error) {
                return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
            }

            const body = await req.json()
            const result = migraineEntrySchema.safeParse(body)

            if (!result.success) {
                return NextResponse.json({ error: 'Invalid input', details: result.error.format() }, { status: 400 })
            }

            const { date, severity, foodBefore, foodAfterDay1, foodAfterDay2, foodAfterDay3 } = result.data

            const queryDate = new Date(date)
            queryDate.setUTCHours(0, 0, 0, 0)

            const entry = await prisma.$transaction(async (tx) => {
                const updatedEntry = await tx.migraineEntry.upsert({
                    where: {
                        userId_date: {
                            userId: session.user.id as string,
                            date: queryDate,
                        },
                    },
                    update: {
                        severity,
                        foodBefore,
                        foodAfterDay1,
                        foodAfterDay2,
                        foodAfterDay3,
                    },
                    create: {
                        userId: session.user.id as string,
                        date: queryDate,
                        severity,
                        foodBefore,
                        foodAfterDay1,
                        foodAfterDay2,
                        foodAfterDay3,
                    },
                })

                await logEvent(tx, {
                    userId: session.user.id as string,
                    eventType: EVENTS.MIGRAINE_ENTRY_UPDATED,
                    entityType: 'MigraineEntry',
                    entityId: updatedEntry.id,
                    payload: {
                        date: queryDate.toISOString(),
                        severity,
                    },
                })

                return updatedEntry
            })

            invalidateAnalyticsCache(session.user.id)

            return NextResponse.json(entry)
        } catch (error) {
            const apiErr = formatApiError(error)
            return NextResponse.json({ error: apiErr.message }, { status: apiErr.status })
        }
    })
}))
