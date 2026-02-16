import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/db'
import { isMigraineUser } from '@/lib/whitelist'

export const dynamic = 'force-dynamic'

export async function GET(req: NextRequest) {
    try {
        const session = await getServerSession(authOptions)
        if (!session?.user?.id || !session?.user?.email) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const isAuthorized = isMigraineUser(session.user.email)

        const { searchParams } = new URL(req.url)
        const startDateStr = searchParams.get('startDate')
        const endDateStr = searchParams.get('endDate')

        // Default to current month if not provided
        const now = new Date()
        const start = startDateStr ? new Date(startDateStr) : new Date(now.getFullYear(), now.getMonth(), 1)
        const end = endDateStr ? new Date(endDateStr) : new Date(now.getFullYear(), now.getMonth() + 1, 0)

        // 1. Fetch Migraines (Only if authorized)
        let migraines: { date: Date, severity: number }[] = []
        if (isAuthorized) {
            migraines = await prisma.migraineEntry.findMany({
                where: {
                    userId: session.user.id,
                    date: {
                        gte: start,
                        lte: end
                    }
                },
                select: { date: true, severity: true }
            })
        }

        // 2. Fetch Goals and Logs
        const logStart = new Date(start)
        logStart.setDate(logStart.getDate() - 7)

        const [logs, allGoals] = await Promise.all([
            prisma.weeklyLog.findMany({
                where: {
                    userId: session.user.id,
                    weekStartDate: {
                        gte: logStart,
                        lte: end
                    }
                },
                include: {
                    goal: {
                        select: { id: true, name: true, symbol: true, isArchived: true, archivedFromWeek: true, deletedAt: true, createdAt: true, weeklyTarget: true, startDate: true }
                    }
                }
            }),
            prisma.goal.findMany({
                where: {
                    userId: session.user.id,
                    deletedAt: null
                },
                select: { id: true, createdAt: true, archivedFromWeek: true, weeklyTarget: true, startDate: true }
            })
        ]) as [any[], any[]]

        // 3. Aggregate Data by Day
        const dailyData: Record<string, {
            date: string,
            migraineSeverity: number | null,
            completedGoals: number,
            totalGoals: number,
            completedGoalIds: string[]
        }> = {}

        // Initialize dictionary for range
        const current = new Date(start)
        while (current <= end) {
            const dateIso = current.toISOString().split('T')[0]
            dailyData[dateIso] = {
                date: dateIso,
                migraineSeverity: null,
                completedGoals: 0,
                totalGoals: 0,
                completedGoalIds: []
            }

            // Calculate Total Active Goals for this day
            // Only hide if archived BEFORE this day. Otherwise show everything.
            let activeCount = 0
            const dayTime = current.getTime()

            for (const goal of allGoals) {
                const dayTime = current.getTime()

                // Goal must be active on this day
                if (goal.startDate) {
                    const activeDate = new Date(goal.startDate)
                    activeDate.setUTCHours(0, 0, 0, 0)
                    const active = activeDate.getTime()
                    if (dayTime < active) continue
                }

                if (goal.archivedFromWeek) {
                    const archivedDate = new Date(goal.archivedFromWeek)
                    archivedDate.setUTCHours(0, 0, 0, 0)
                    const archived = archivedDate.getTime()
                    if (dayTime >= archived) continue
                }
                activeCount++
            }
            dailyData[dateIso].totalGoals = activeCount

            current.setDate(current.getDate() + 1)
        }

        // Fill Migraines
        if (isAuthorized) {
            migraines.forEach((m: any) => {
                const d = m.date.toISOString().split('T')[0]
                if (dailyData[d]) {
                    dailyData[d].migraineSeverity = m.severity
                }
            })
        }

        // Fill Goals (Completions)
        logs.forEach((log: any) => {
            if (log.goal.deletedAt) return

            const weekStart = new Date(log.weekStartDate)
            const checkboxStates = log.checkboxStates as boolean[]

            checkboxStates.forEach((isChecked, dayIndex) => {
                if (isChecked) {
                    const logDay = new Date(weekStart)
                    // Use UTC methods to prevent server timezone offsets (e.g. US East) from shifting the date
                    logDay.setUTCDate(logDay.getUTCDate() + dayIndex)
                    logDay.setUTCHours(0, 0, 0, 0)

                    const d = logDay.toISOString().split('T')[0]

                    if (dailyData[d]) {
                        // Check if archived starting this week
                        let isActive = true

                        if (log.goal.startDate) {
                            const active = new Date(log.goal.startDate).setHours(0, 0, 0, 0)
                            if (logDay.getTime() < active) isActive = false
                        }

                        if (log.goal.archivedFromWeek) {
                            const archived = new Date(log.goal.archivedFromWeek).setHours(0, 0, 0, 0)
                            if (logDay.getTime() >= archived) isActive = false
                        }

                        if (isActive) {
                            dailyData[d].completedGoals += 1
                            dailyData[d].completedGoalIds.push(log.goal.id)
                        }
                    }
                }
            })
        })

        return NextResponse.json({
            data: Object.values(dailyData),
            migraineEnabled: isAuthorized
        })
    } catch (error) {
        console.error('Month View API Error:', error)
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
    }
}
