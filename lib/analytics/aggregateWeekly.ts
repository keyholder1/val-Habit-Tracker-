import { DailyRecord, WeeklyTrendPoint } from './types'

/**
 * Aggregates daily records into weekly completion trend
 * Returns percentage completion for each week
 */
export function aggregateWeekly(dailyRecords: DailyRecord[], weeks: number = 12): WeeklyTrendPoint[] {
    if (dailyRecords.length === 0) return []

    const result: WeeklyTrendPoint[] = []

    for (let weekIndex = 0; weekIndex < weeks; weekIndex++) {
        const weekEnd = new Date()
        weekEnd.setDate(weekEnd.getDate() - (weekIndex * 7))
        weekEnd.setHours(23, 59, 59, 999)

        const weekStart = new Date(weekEnd)
        weekStart.setDate(weekStart.getDate() - 6)
        weekStart.setHours(0, 0, 0, 0)

        // Filter records in this week
        const weekRecords = dailyRecords.filter(r => {
            const d = new Date(r.date)
            return d >= weekStart && d <= weekEnd
        })

        // Calculate completion
        let completed = 0
        let total = 0

        weekRecords.forEach(r => {
            total++
            if (r.completed) completed++
        })

        const completion = total > 0 ? Math.round((completed / total) * 100) : 0

        result.unshift({
            week: weekStart.toISOString(), // ISO String for correct date parsing
            completion,
        })
    }

    return result
}
