
import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/db'

export const dynamic = 'force-dynamic'

export async function GET(req: NextRequest) {
    const session = await getServerSession(authOptions)

    if (!session?.user?.email) {
        return NextResponse.json({ error: 'No session' })
    }

    const user = await prisma.user.findUnique({
        where: { email: session.user.email },
        include: { _count: { select: { goals: true } } }
    })

    const goalsRaw = await prisma.goal.findMany({
        where: { userId: user?.id, deletedAt: null }
    })

    return NextResponse.json({
        sessionEmail: session.user.email,
        dbUserFound: !!user,
        dbUserId: user?.id,
        dbGoalCount: user?._count.goals,
        activeGoalsFound: goalsRaw.length,
        sampleGoal: goalsRaw[0],
        envDbUrl: process.env.DATABASE_URL ? 'Set' : 'Unset'
    })
}
