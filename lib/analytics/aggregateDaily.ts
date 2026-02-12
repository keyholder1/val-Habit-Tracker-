import { DailyRecord, DailyTrendPoint } from './types'

/**
 * Aggregates daily records into daily completion trend
 * Returns percentage completion for each day
 */
export function aggregateDaily(dailyRecords: DailyRecord[], days: number = 30): DailyTrendPoint[] {
    if (dailyRecords.length === 0) return []

    const cutoffDate = new Date()
    cutoffDate.setDate(cutoffDate.getDate() - days)

    // Filter to last N days
    const recentRecords = dailyRecords.filter(r => new Date(r.date) >= cutoffDate)

    // Group by date
    const byDate = new Map<string, { completed: number; total: number }>()

    for (const record of recentRecords) {
        const recordDate = new Date(record.date)
        const dateKey = recordDate.toISOString().split('T')[0]

        if (!byDate.has(dateKey)) {
            byDate.set(dateKey, { completed: 0, total: 0 })
        }

        const stats = byDate.get(dateKey)!
        stats.total += record.target || 1
        if (record.completed) stats.completed += record.target || 1
    }

    // Convert to array and calculate percentages
    const result: DailyTrendPoint[] = []

    for (let i = 0; i < days; i++) {
        const date = new Date()
        date.setDate(date.getDate() - (days - 1 - i))
        const dateKey = date.toISOString().split('T')[0]

        const stats = byDate.get(dateKey)
        const completion = stats ? Math.round((stats.completed / stats.total) * 100) : 0

        result.push({
            date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
            completion,
        })
    }

    return result
}
