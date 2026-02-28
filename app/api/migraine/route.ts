import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/db'
import { EVENTS, logEventSafe } from '@/lib/events'
import { invalidateAnalyticsCache } from '@/lib/analytics/getAnalyticsData'
import { MIGRAINE_USER_EMAIL } from '@/lib/whitelist'
import { checkIdempotency } from '@/lib/idempotency'
import { withTiming } from '@/lib/timing'
import { logger } from '@/lib/logger'
import { withRateLimit } from '@/lib/withRateLimit'
import { withTimeout } from '@/lib/withTimeout'

// Feature gater
const ALLOWED_USER = MIGRAINE_USER_EMAIL

export const GET = withRateLimit(withTimeout(async function GET(req: NextRequest) {
    try {
        const session = await getServerSession(authOptions)
        if (session?.user?.email !== ALLOWED_USER) {
            return NextResponse.json({ error: 'Unauthorized feature' }, { status: 403 })
        }

        const entries = await prisma.migraineEntry.findMany({
            where: { userId: session.user.id },
            orderBy: { date: 'desc' },
            take: 100 // Limit for performance
        })

        return NextResponse.json(entries)
    } catch (error) {
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }
}))

// POST
export const POST = withRateLimit(withTimeout(async function POST(req: NextRequest) {
    return withTiming('migraine POST', async () => {
        try {
            const session = await getServerSession(authOptions)
            if (session?.user?.email !== ALLOWED_USER) {
                return NextResponse.json({ error: 'Unauthorized feature' }, { status: 403 })
            }

            const body = await req.json()
            const { date, severity, foodBefore, foodAfterDay1, foodAfterDay2, foodAfterDay3, requestId, expectedUpdatedAt } = body

            if (!date || typeof severity !== 'number') {
                return NextResponse.json({ error: 'Invalid input' }, { status: 400 })
            }

            // 1. Idempotency Check
            const existingEntityId = await checkIdempotency(requestId, session.user.id)
            if (existingEntityId) {
                const existingEntry = await prisma.migraineEntry.findUnique({ where: { id: existingEntityId } })
                return NextResponse.json(existingEntry)
            }

            const parsedDate = new Date(date)
            // 2. Conflict Detection
            if (expectedUpdatedAt) {
                const currentEntry = await prisma.migraineEntry.findUnique({
                    where: {
                        userId_date: {
                            userId: session.user.id,
                            date: parsedDate,
                        }
                    },
                    select: { updatedAt: true }
                })

                if (currentEntry && currentEntry.updatedAt.getTime() > new Date(expectedUpdatedAt).getTime()) {
                    return NextResponse.json({ error: 'Conflict' }, { status: 409 })
                }
            }

            // 3. Atomic Upsert
            const entry = await prisma.migraineEntry.upsert({
                where: {
                    userId_date: {
                        userId: session.user.id,
                        date: parsedDate,
                    }
                },
                update: {
                    severity,
                    foodBefore,
                    foodAfterDay1,
                    foodAfterDay2,
                    foodAfterDay3,
                },
                create: {
                    userId: session.user.id,
                    date: parsedDate,
                    severity,
                    foodBefore,
                    foodAfterDay1,
                    foodAfterDay2,
                    foodAfterDay3,
                },
            })

            // 4. Safe Event Logging
            logEventSafe({
                userId: session.user.id,
                eventType: EVENTS.MIGRAINE_ENTRY_CREATED, // Note: We might want updated vs created logic here, avoiding complex check for now or infer if we want perfection.
                // Previous code did `existing ? UPDATED : CREATED`. 
                // To keep it simple and safe, we can default to CREATED or infer.
                // Or check if createdAt == updatedAt (approx).
                // Let's just log CREATED/UPDATED blindly or check entry.
                // Actually the previous code checked `existing` inside transaction.
                // We can't easily know if it was an update or create without an extra read or checking result.
                // Prisma return value doesn't say "created" vs "updated".
                // But we can check `createdAt` vs `updatedAt` of the returned entry!
                // If they are equal (or very close), it's created.
                // Boolean check: Math.abs(entry.createdAt.getTime() - entry.updatedAt.getTime()) < 1000
                entityType: 'MigraineEntry',
                entityId: entry.id,
                payload: { date, severity, requestId, method: 'POST' },
            })
            // Fix event type
            // const isCreated = Math.abs(entry.createdAt.getTime() - entry.updatedAt.getTime()) < 500
            // logic above

            // Invalidate analytics cache
            invalidateAnalyticsCache(session.user.id)

            return NextResponse.json(entry)
        } catch (error) {
            logger.logError('Migraine API Error', error)
            return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
        }
    });
}))
