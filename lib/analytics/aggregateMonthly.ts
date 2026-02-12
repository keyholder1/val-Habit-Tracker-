import { DailyRecord, MonthlyTrendPoint } from './types'

/**
 * Aggregates daily records into monthly completion trend
 * Returns percentage completion for each month
 */
export function aggregateMonthly(dailyRecords: DailyRecord[], months: number = 6): MonthlyTrendPoint[] {
    if (dailyRecords.length === 0) return []

    const result: MonthlyTrendPoint[] = []
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

    for (let monthOffset = months - 1; monthOffset >= 0; monthOffset--) {
        const targetDate = new Date()
        targetDate.setMonth(targetDate.getMonth() - monthOffset)

        const year = targetDate.getFullYear()
        const month = targetDate.getMonth()

        // Filter records in this month
        const monthRecords = dailyRecords.filter(r => {
            const recordDate = new Date(r.date)
            return recordDate.getFullYear() === year && recordDate.getMonth() === month
        })

        const completed = monthRecords.filter(r => r.completed).length
        const total = monthRecords.length
        const completion = total > 0 ? Math.round((completed / total) * 100) : 0

        const monthKey = `${year}-${String(month + 1).padStart(2, '0')}`

        result.push({
            month: monthKey,
            completion,
        })
    }

    return result
}
