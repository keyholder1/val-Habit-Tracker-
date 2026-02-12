import { DailyRecord, HeatmapCell, TimeOfWeekCell } from './types'

// lib/analytics/generateHeatmapData.ts

/**
 * Generates calendar heatmap data
 * If a year is provided, generates for Jan-Dec of that year.
 * Otherwise defaults to trailing 365 days.
 */
export function generateCalendarHeatmap(dailyRecords: DailyRecord[], days: number = 365, year?: number): HeatmapCell[] {
    const result: HeatmapCell[] = []

    const byDate = new Map<string, { completed: number; total: number }>()

    for (const record of dailyRecords) {
        const d = new Date(record.date)
        const dateKey = d.toISOString().split('T')[0]

        if (!byDate.has(dateKey)) {
            byDate.set(dateKey, { completed: 0, total: 0 })
        }

        const stats = byDate.get(dateKey)!
        stats.total++
        if (record.completed) stats.completed++
    }

    let startDate: Date
    let endDate: Date

    if (year) {
        // Fixed Calendar Year: Jan 1st to Dec 31st
        startDate = new Date(year, 0, 1)
        endDate = new Date(year, 11, 31)
    } else {
        // Trailing Year
        const today = new Date()
        today.setHours(0, 0, 0, 0)
        endDate = today
        startDate = new Date(today)
        startDate.setDate(startDate.getDate() - (days - 1))
    }

    // Align to previous Sunday for a clean grid
    const dayOfWeek = startDate.getDay()
    startDate.setDate(startDate.getDate() - dayOfWeek)

    // Generate cells
    const current = new Date(startDate)
    while (current <= endDate) {
        const dateKey = current.toISOString().split('T')[0]
        const stats = byDate.get(dateKey)
        const completion = stats ? (stats.completed / stats.total) : 0
        const intensity = stats ? Math.min(4, Math.floor(completion * 5)) : 0

        result.push({
            day: dateKey,
            intensity,
        })

        current.setDate(current.getDate() + 1)
    }

    return result
}

/**
 * Generates time-of-week heatmap (which days are most active per goal)
 */
export function generateTimeOfWeekHeatmap(dailyRecords: DailyRecord[]): TimeOfWeekCell[] {
    if (dailyRecords.length === 0) return []

    const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
    const byGoalAndDay = new Map<string, Map<number, { completed: number; total: number }>>()

    for (const record of dailyRecords) {
        const d = new Date(record.date)
        const dayOfWeek = d.getDay()

        if (!byGoalAndDay.has(record.goalName)) {
            byGoalAndDay.set(record.goalName, new Map())
        }

        const goalMap = byGoalAndDay.get(record.goalName)!

        if (!goalMap.has(dayOfWeek)) {
            goalMap.set(dayOfWeek, { completed: 0, total: 0 })
        }

        const stats = goalMap.get(dayOfWeek)!
        stats.total++
        if (record.completed) stats.completed++
    }

    const result: TimeOfWeekCell[] = []

    for (const [goalName, dayMap] of byGoalAndDay.entries()) {
        for (let day = 0; day < 7; day++) {
            const stats = dayMap.get(day)
            const completion = stats ? Math.round((stats.completed / stats.total) * 100) : 0

            result.push({
                day: dayNames[day],
                goalName,
                completion,
            })
        }
    }

    return result
}
