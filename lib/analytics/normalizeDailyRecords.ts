import { DailyRecord } from './types'

interface WeeklyLog {
    id: string
    weekStartDate: Date
    weeklyTarget: number
    checkboxStates: boolean[]
    goal: {
        id: string
        name: string
        createdAt?: Date | string
        activeFrom?: Date | string
    }
}

/**
 * CRITICAL DATA NORMALIZATION FUNCTION
 * Converts weekly logs with 7-day checkbox arrays into individual daily records
 * with exact calendar dates.
 * 
 * Respects goal.createdAt: daily records before a goal existed are excluded.
 */
export function normalizeDailyRecords(weeklyLogs: WeeklyLog[]): DailyRecord[] {
    const dailyRecords: DailyRecord[] = []

    for (const log of weeklyLogs) {
        const weekStart = new Date(log.weekStartDate)

        // Parse createdAt once per log for performance
        const goalCreatedAt = log.goal.createdAt
            ? new Date(log.goal.createdAt)
            : null
        if (goalCreatedAt) goalCreatedAt.setHours(0, 0, 0, 0)

        const activeFrom = log.goal.activeFrom
            ? new Date(log.goal.activeFrom)
            : null
        if (activeFrom) activeFrom.setHours(0, 0, 0, 0)

        // Expand 7 checkbox states into 7 daily records
        for (let dayIndex = 0; dayIndex < 7; dayIndex++) {
            const date = new Date(weekStart)
            date.setDate(date.getDate() + dayIndex)
            date.setHours(0, 0, 0, 0)

            // Day records allowed for all dates now as per user request


            dailyRecords.push({
                date,
                goalId: log.goal.id,
                goalName: log.goal.name,
                completed: log.checkboxStates[dayIndex] || false,
                target: log.weeklyTarget || 1,
            })
        }
    }

    // Sort by date ascending
    return dailyRecords.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
}
