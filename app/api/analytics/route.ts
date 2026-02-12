import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/db'
import { getAnalyticsData } from '@/lib/analytics/getAnalyticsData'


export const dynamic = 'force-dynamic'

/**
 * GET /api/analytics
 * 
 * Returns comprehensive analytics payload for authenticated user
 * 
 * Query parameters:
 * - days: number of days to include (default: 90)
 */
export async function GET(req: NextRequest) {
    console.log('🔵 [API /api/analytics GET] Handler HIT')
    try {
        // Authenticate
        const session = await getServerSession(authOptions)

        if (!session?.user?.email) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        // Get user
        const user = await prisma.user.findUnique({
            where: { email: session.user.email.toLowerCase() },
        })

        if (!user) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 })
        }

        // Parse query parameters
        const searchParams = req.nextUrl.searchParams
        const days = parseInt(searchParams.get('days') || '365', 10)
        const yearParam = searchParams.get('year')
        const year = yearParam ? parseInt(yearParam, 10) : undefined

        // Validate range
        if (days < 1 || days > 365) {
            return NextResponse.json(
                { error: 'Days parameter must be between 1 and 365' },
                { status: 400 }
            )
        }

        if (year && (year < 2000 || year > 2100)) {
            return NextResponse.json(
                { error: 'Invalid year parameter' },
                { status: 400 }
            )
        }

        // Call analytics service layer (NOT doing aggregation here!)
        const analyticsPayload = await getAnalyticsData(user.id, days, false, year)

        return NextResponse.json(analyticsPayload, {
            headers: {
                'Cache-Control': 'private, max-age=60',
            },
        })
    } catch (error) {
        console.error('Error fetching analytics:', error)
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        )
    }
}
