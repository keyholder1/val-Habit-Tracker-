import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/db'
import { EVENTS, logEvent } from '@/lib/events'
import { invalidateAnalyticsCache } from '@/lib/analytics/getAnalyticsData'
import { withTiming } from '@/lib/timing'
import { goalSchema } from '@/lib/validations'
import { logger } from '@/lib/logger'
import { withRateLimit } from '@/lib/withRateLimit'

export const dynamic = 'force-dynamic'

// GET - List all goals for the user
export async function GET(req: NextRequest) {
    console.log('🔵 [API /api/goals GET] Handler called')
    try {
        const session = await getServerSession(authOptions)
        console.log('🔵 [API /api/goals GET] Session:', session?.user?.email)
        if (!session?.user?.email) {
            console.log('🔵 [API /api/goals GET] No session, returning 401')
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        console.log('🔵 [API /api/goals GET] Looking up user...')
        const user = await prisma.user.findUnique({
            where: { email: session.user.email.toLowerCase() },
        })
        console.log('🔵 [API /api/goals GET] User found:', !!user, user?.id)

        if (!user) {
            console.log('🔵 [API /api/goals GET] User NOT found in database!')
            return NextResponse.json({ error: 'User not found' }, { status: 404 })
        }

        console.log('🔵 [API /api/goals GET] Fetching goals for user:', user.id)
        const goals = await prisma.goal.findMany({
            where: {
                userId: user.id,
                // Only show not-deleted goals or future-archived?
                // Actually, for the "Active Goals" list, we might want to filter out those that are "deletedAt" set.
                // "archivedFromWeek" logic is handled by frontend for display, but we should return them so we can show them in past views.
                deletedAt: null,
            },
            orderBy: { createdAt: 'asc' },
        })
        console.log(`🔵 [API /api/goals GET] Found ${goals.length} goals`)

        if (goals.length === 0) {
            console.log('🔵 [API /api/goals GET] No goals found')
            return NextResponse.json([])
        }

        console.log('🔵 [API /api/goals GET] Returning goals:', goals)
        return NextResponse.json(goals)
    } catch (error) {
        console.error('🔵 [API /api/goals GET] ERROR:', error)
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }
}

// POST - Create a new goal
export const POST = withRateLimit(async function POST(req: NextRequest) {
    return withTiming('goals POST', async () => {
        try {
            console.log('🟢 [API /api/goals POST] Handler called')
            const session = await getServerSession(authOptions)
            if (!session?.user?.email) {
                console.log('🟢 [API /api/goals POST] No session, returning 401')
                return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
            }

            // Robust User Lookup (match GET/PATCH pattern)
            const user = await prisma.user.findUnique({
                where: { email: session.user.email.toLowerCase() },
                select: { id: true }
            })

            if (!user) {
                console.log('🟢 [API /api/goals POST] User NOT found for email:', session.user.email)
                return NextResponse.json({ error: 'User not found' }, { status: 404 })
            }

            const userId = user.id
            console.log('🟢 [API /api/goals POST] Resolved userId:', userId)

            const body = await req.json()
            console.log('🟢 [API /api/goals POST] Body:', JSON.stringify(body))
            const result = goalSchema.safeParse(body)

            if (!result.success) {
                console.log('🟢 [API /api/goals POST] Validation failed:', result.error.format())
                return NextResponse.json({ error: 'Invalid input', details: result.error.format() }, { status: 400 })
            }

            const { name, weeklyTarget, symbol, startDate } = result.data

            // Normalize startDate
            const startDateDate = startDate ? new Date(startDate) : new Date()
            startDateDate.setHours(0, 0, 0, 0)

            // Cannot be future beyond today
            const today = new Date()
            today.setHours(23, 59, 59, 999)
            if (startDateDate > today) {
                console.log('🟢 [API /api/goals POST] Start date in future:', startDateDate)
                return NextResponse.json({ error: 'Start date cannot be in the future' }, { status: 400 })
            }

            const goal = await prisma.$transaction(async (tx) => {
                const newGoal = await tx.goal.create({
                    data: {
                        userId: userId,
                        name,
                        symbol: symbol || "",
                        weeklyTarget,
                        startDate: startDateDate,
                    },
                })

                await logEvent(tx, {
                    userId: userId,
                    eventType: EVENTS.GOAL_CREATED,
                    entityType: 'Goal',
                    entityId: newGoal.id,
                    payload: {
                        name,
                        weeklyTarget,
                        symbol,
                        startDate: startDateDate.toISOString(),
                    },
                })

                console.log('🟢 [API /api/goals POST] Goal created:', newGoal.id, newGoal.name)
                return newGoal
            })

            // Invalidate analytics cache
            invalidateAnalyticsCache(userId)

            return NextResponse.json(goal)
        } catch (error) {
            console.error('🟢 [API /api/goals POST] ❌ ERROR:', error)
            logger.logError('Failed to create goal', error)
            return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
        }
    })
})
