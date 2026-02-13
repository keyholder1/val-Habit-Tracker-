import { prisma } from '@/lib/db'
import {
    AnalyticsPayload,
    DailyRecord,
    DailyTrendPoint,
    WeeklyTrendPoint,
    MonthlyTrendPoint,
    GoalCompletionData,
    HeatmapCell,
    TargetVsActualPoint,
    ConsistencyScore,
    LifetimeStats,
    StreakData,
    TimeOfWeekCell
} from './types'
import { generateCalendarHeatmap, generateTimeOfWeekHeatmap } from './generateHeatmapData'

// In-memory cache for ultra-fast repeated loads (Private production: 2 users)
const cache = new Map<string, { data: AnalyticsPayload; timestamp: number }>()
const CACHE_TTL = 60 * 1000 // 60 seconds

/**
 * Invalidate cache for a specific user and trigger a background warm-up
 */
export function invalidateAnalyticsCache(userId: string) {
    console.log(`🧹 [Analytics Cache] Invalidating for user: ${userId}`)
    for (const key of cache.keys()) {
        if (key.startsWith(`analytics:${userId}`)) {
            cache.delete(key)
        }
    }

    // Background cache warming - fire and forget
    // This ensures the next request is fast by pre-populating the snapshot and memory cache
    warmAnalyticsCache(userId).catch(err => console.error('⚠️ [Analytics] Cache warming failed:', err))
}

/**
 * Background worker to precompute analytics
 */
export async function warmAnalyticsCache(userId: string) {
    console.log(`🔥 [Analytics Cache] Warming for user: ${userId}`)
    // We force a refresh and target the default view (365 days)
    await getAnalyticsData(userId, 365, true)
}

/**
 * Main analytics orchestration function
 */
export async function getAnalyticsData(userId: string, daysRange: number = 365, forceRefresh: boolean = false, year?: number): Promise<AnalyticsPayload> {
    const CACHE_VERSION = 'v2'
    const cacheKey = `analytics:${userId}:${year || daysRange}:${CACHE_VERSION}`
    const cached = cache.get(cacheKey)

    if (cached && (Date.now() - cached.timestamp) < CACHE_TTL && !forceRefresh) {
        return cached.data
    }

    if ((daysRange === 365 || year) && !forceRefresh) {
        if (!year && daysRange === 365) {
            const snapshot = await (prisma as any).analyticsSnapshot.findUnique({
                where: { userId }
            })

            if (snapshot) {
                const data = snapshot.snapshotJson as unknown as AnalyticsPayload
                if (data.lifetimeContributionPie) {
                    cache.set(cacheKey, { data, timestamp: Date.now() })
                    return data
                }
            }
        }
    }

    let cutoffDate: Date
    let endDate: Date

    if (year) {
        cutoffDate = new Date(year, 0, 1)
        endDate = new Date(year, 11, 31, 23, 59, 59)
    } else {
        cutoffDate = new Date()
        cutoffDate.setDate(cutoffDate.getDate() - daysRange)
        endDate = new Date()
    }

    const dbStartTime = Date.now()
    const staleFallback = cache.get(cacheKey)?.data

    const fetchPromise = Promise.all([
        prisma.weeklyLog.findMany({
            where: {
                userId,
                weekStartDate: { gte: cutoffDate, lte: endDate },
            },
            include: { goal: true },
            orderBy: { weekStartDate: 'asc' },
        }),
        prisma.goal.findMany({
            where: {
                userId,
                deletedAt: null,
            },
        }),
    ])

    let weeklyLogs: any[], userGoals: any[]
    try {
        if (staleFallback) {
            const timeoutPromise = new Promise((_, reject) =>
                setTimeout(() => reject(new Error('DB_LATENCY_TIMEOUT')), 500)
            )
            const result = await Promise.race([fetchPromise, timeoutPromise]) as [any[], any[]]
            weeklyLogs = result[0]
            userGoals = result[1]
        } else {
            const result = await fetchPromise
            weeklyLogs = result[0]
            userGoals = result[1]
        }
    } catch (error: any) {
        if (error.message === 'DB_LATENCY_TIMEOUT' && staleFallback) {
            console.warn(`⚡ [Performance Safe Mode] DB latency > 500ms, serving stale cache for user: ${userId}`)
            return staleFallback
        }
        throw error
    }

    const dbLatency = Date.now() - dbStartTime
    if (dbLatency > 500) {
        console.warn(`🕒 [Analytics] Slow DB query detected: ${dbLatency}ms for user: ${userId}`)
    }

    const dailyRecords = normalizeDailyRecords(weeklyLogs as any)
    const dailyTrend = aggregateDaily(dailyRecords, 30)
    const weeklyTrend = aggregateWeekly(dailyRecords, 12)
    const monthlyTrend = aggregateMonthly(dailyRecords, 6)
    const calendarHeatmap = generateCalendarHeatmap(dailyRecords, daysRange, year)
    const timeOfWeekHeatmap = generateTimeOfWeekHeatmap(dailyRecords)
    const streaks = calculateStreaks(dailyRecords, userGoals)
    const goalCompletionPie = calculateGoalCompletionPie(dailyRecords)
    const lifetimeContributionPie = calculateLifetimeContributionPie(dailyRecords)
    const targetVsActual = calculateTargetVsActual(dailyRecords)
    const consistencyScore = calculateConsistencyScore(dailyRecords)
    const lifetimeStats = calculateLifetimeStats(dailyRecords)

    const payload: AnalyticsPayload = {
        dailyTrend,
        weeklyTrend,
        monthlyTrend,
        calendarHeatmap,
        timeOfWeekHeatmap,
        goalCompletionPie,
        lifetimeContributionPie,
        targetVsActual,
        streakTimeline: streaks,
        longestStreaks: streaks.slice(0, 5),
        consistencyScore,
        lifetimeStats,
    }

    cache.set(cacheKey, { data: payload, timestamp: Date.now() })

    if (daysRange === 365 && !year) {
        (prisma as any).analyticsSnapshot.upsert({
            where: { userId },
            update: { snapshotJson: payload as any },
            create: { userId, snapshotJson: payload as any }
        }).catch((err: Error) => console.error('⚠️ [Analytics] Failed to save snapshot:', err))
    }

    return payload
}

// --- Helper Functions ---

function normalizeDailyRecords(weeklyLogs: any[]): DailyRecord[] {
    const daily: DailyRecord[] = []
    for (const log of weeklyLogs) {
        const startDate = new Date(log.weekStartDate)
        log.checkboxStates.forEach((completed: boolean, index: number) => {
            const date = new Date(startDate)
            date.setDate(date.getDate() + index)
            daily.push({
                date: date,
                goalId: log.goalId,
                goalName: log.goal.name,
                completed,
                target: log.weeklyTarget,
            })
        })
    }
    return daily
}

function aggregateDaily(daily: DailyRecord[], days: number): DailyTrendPoint[] {
    const byDay = new Map<string, { completed: number; total: number }>()
    const cutoff = new Date()
    cutoff.setDate(cutoff.getDate() - days)

    for (const r of daily) {
        const d = new Date(r.date)
        if (d < cutoff) continue
        const key = d.toISOString().split('T')[0]
        const stats = byDay.get(key) || { completed: 0, total: 0 }
        stats.total++
        if (r.completed) stats.completed++
        byDay.set(key, stats)
    }

    return Array.from(byDay.entries())
        .map(([date, stats]) => ({
            date,
            completion: Math.round((stats.completed / stats.total) * 100)
        }))
        .sort((a, b) => a.date.localeCompare(b.date))
}

function aggregateWeekly(daily: DailyRecord[], weeks: number): WeeklyTrendPoint[] {
    const byWeek = new Map<string, { completed: number; total: number }>()
    for (const r of daily) {
        const date = new Date(r.date)
        const day = date.getUTCDay()
        const diff = date.getUTCDate() - day + (day === 0 ? -6 : 1)
        const monday = new Date(date.setUTCDate(diff))
        monday.setUTCHours(0, 0, 0, 0)
        const key = monday.toISOString().split('T')[0]
        const stats = byWeek.get(key) || { completed: 0, total: 0 }
        stats.total++
        if (r.completed) stats.completed++
        byWeek.set(key, stats)
    }
    return Array.from(byWeek.entries())
        .map(([week, stats]) => ({
            week,
            completion: Math.round((stats.completed / stats.total) * 100)
        }))
        .sort((a, b) => a.week.localeCompare(b.week))
        .slice(-weeks)
}

function aggregateMonthly(daily: DailyRecord[], months: number): MonthlyTrendPoint[] {
    const byMonth = new Map<string, { completed: number; total: number }>()
    for (const r of daily) {
        const d = new Date(r.date)
        const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`
        const stats = byMonth.get(key) || { completed: 0, total: 0 }
        stats.total++
        if (r.completed) stats.completed++
        byMonth.set(key, stats)
    }
    return Array.from(byMonth.entries())
        .map(([month, stats]) => ({
            month,
            completion: Math.round((stats.completed / stats.total) * 100)
        }))
        .sort((a, b) => a.month.localeCompare(b.month))
        .slice(-months)
}

// Local heatmap functions removed in favor of lib/analytics/generateHeatmapData.ts

function calculateStreaks(daily: DailyRecord[], goals: any[]): StreakData[] {
    const streaks: StreakData[] = []
    for (const goal of goals) {
        const goalDays = daily
            .filter(r => r.goalId === goal.id)
            .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())

        let currentStreak = 0
        let longestStreak = 0
        let startDate: string | null = null

        for (const r of goalDays) {
            if (r.completed) {
                if (currentStreak === 0) startDate = new Date(r.date).toISOString()
                currentStreak++
                longestStreak = Math.max(longestStreak, currentStreak)
            } else {
                currentStreak = 0
            }
        }
        streaks.push({
            goalName: goal.name,
            currentStreak,
            longestStreak,
            startDate
        })
    }
    return streaks.sort((a, b) => b.currentStreak - a.currentStreak)
}

function calculateGoalCompletionPie(daily: DailyRecord[]): GoalCompletionData[] {
    const byGoal = new Map<string, { completed: number; total: number }>()
    for (const r of daily) {
        const stats = byGoal.get(r.goalName) || { completed: 0, total: 0 }
        stats.total++
        if (r.completed) stats.completed++
        byGoal.set(r.goalName, stats)
    }
    const colors = ['#6B7FB5', '#5AA49D', '#9077B0', '#5A9970', '#B87B63']
    return Array.from(byGoal.entries()).map(([name, stats], i) => ({
        name,
        value: Math.round((stats.completed / stats.total) * 100),
        color: colors[i % colors.length]
    }))
}

function calculateLifetimeContributionPie(daily: DailyRecord[]): GoalCompletionData[] {
    const byGoal = new Map<string, number>()
    for (const r of daily) {
        if (r.completed) {
            byGoal.set(r.goalName, (byGoal.get(r.goalName) || 0) + 1)
        }
    }
    const colors = ['#6B7FB5', '#5AA49D', '#9077B0', '#5A9970', '#B87B63']
    return Array.from(byGoal.entries()).map(([name, count], i) => ({
        name,
        value: count,
        color: colors[i % colors.length]
    }))
}

function calculateTargetVsActual(daily: DailyRecord[]): TargetVsActualPoint[] {
    const byDate = new Map<string, { actual: number; target: number }>()
    for (const r of daily) {
        const d = new Date(r.date)
        const key = d.toISOString().split('T')[0]
        const stats = byDate.get(key) || { actual: 0, target: 0 }
        stats.target = Math.max(stats.target, r.target)
        if (r.completed) stats.actual++
        byDate.set(key, stats)
    }
    return Array.from(byDate.entries())
        .map(([dateIso, stats]) => ({
            date: new Date(dateIso).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
            dateIso,
            target: stats.target,
            actual: stats.actual
        }))
        .sort((a, b) => a.dateIso.localeCompare(b.dateIso))
        .slice(-30)
}

function calculateConsistencyScore(daily: DailyRecord[]): ConsistencyScore {
    const days = new Set(daily.map(r => {
        const d = new Date(r.date)
        return d.toISOString().split('T')[0]
    }))
    const completedDays = new Set(daily.filter(r => r.completed).map(r => {
        const d = new Date(r.date)
        return d.toISOString().split('T')[0]
    }))
    const overall = days.size > 0 ? Math.round((completedDays.size / days.size) * 100) : 0
    const byGoal: Record<string, number> = {}
    const goals = new Set(daily.map(r => r.goalName))
    for (const g of goals) {
        const gDays = daily.filter(r => r.goalName === g)
        const gCompleted = gDays.filter(r => r.completed).length
        byGoal[g] = gDays.length > 0 ? Math.round((gCompleted / gDays.length) * 100) : 0
    }
    return { overall, byGoal }
}

function calculateLifetimeStats(daily: DailyRecord[]): LifetimeStats {
    const totalCompletions = daily.filter(r => r.completed).length
    const totalDays = new Set(daily.map(r => {
        const d = new Date(r.date)
        return d.toISOString().split('T')[0]
    })).size
    const goalsTracked = new Set(daily.map(r => r.goalId)).size
    const overallRate = daily.length > 0 ? Math.round((totalCompletions / daily.length) * 100) : 0
    return { totalCompletions, totalDays, overallRate, goalsTracked }
}
