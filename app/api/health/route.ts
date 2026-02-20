import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/db'

export const dynamic = 'force-dynamic'

export async function GET() {
    // Require authenticated session — no session, no health data
    const session = await getServerSession(authOptions)
    if (!session?.user?.email) {
        return NextResponse.json({ connected: false }, { status: 401 })
    }

    try {
        // Timeout-protected DB ping
        await Promise.race([
            prisma.$queryRaw`SELECT 1`,
            new Promise((_, reject) =>
                setTimeout(() => reject(new Error('DB timeout')), 4000)
            ),
        ])

        return NextResponse.json({
            connected: true,
            db: true,
            timestamp: Date.now(),
        })
    } catch {
        return NextResponse.json({ connected: false }, { status: 503 })
    }
}
