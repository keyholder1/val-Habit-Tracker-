import { DailyRecord, StreakData } from './types'

/**
 * Calculates current and longest streaks for each goal
 */
// Calculate streaks including goals with 0 progress
export function calculateStreaks(dailyRecords: DailyRecord[], goals: { id: string, name: string }[]): StreakData[] {
    // Initialize map with all active goals
    const goalStreaks = new Map<string, StreakData>()

    // 1. Initialize all goals with 0 stats
    goals.forEach(g => {
        goalStreaks.set(g.id, {
            goalName: g.name,
            currentStreak: 0,
            longestStreak: 0,
            startDate: null
        })
    })

    // 2. Group records by goal
    const recordsByGoal = new Map<string, DailyRecord[]>()
    for (const record of dailyRecords) {
        if (!recordsByGoal.has(record.goalId)) {
            recordsByGoal.set(record.goalId, [])
        }
        recordsByGoal.get(record.goalId)!.push(record)
    }

    // 3. Calculate metrics for each goal that has records
    for (const [goalId, records] of recordsByGoal.entries()) {
        const goalData = goalStreaks.get(goalId)
        if (!goalData) continue // Skip archived or unknown goals if strict, or just process?
        // Actually, we should probably process even if not in the active list (though usually we want active)
        // Check if goal is in our initial list. If not (maybe archived?), we can skip or add.
        // For now, let's assume we want to show stats for the goals passed in.

        // Sort by date ascending
        const sorted = records.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())

        let currentStreak = 0
        let longestStreak = 0
        let tempStreak = 0
        let streakStartDate: Date | string | null = null

        // Iterate for longest streak
        for (const record of sorted) {
            if (record.completed) {
                tempStreak++
                longestStreak = Math.max(longestStreak, tempStreak)
            } else {
                tempStreak = 0
            }
        }

        // Calculate current streak (working backwards from today/latest)
        // We need a robust current streak. Usually implies "consecutive days ending today or yesterday".
        // For simplicity, let's just count backwards from the last record if it's recent?
        // Actually, let's stick to the previous simple logic:

        // Re-scan for current streak specifically
        let activeStreak = 0
        // We need to check gaps. dailyRecords should be normalized (contiguous).
        // If normalized, we can just walk back.

        for (let i = sorted.length - 1; i >= 0; i--) {
            // Check if date is consecutive? 
            // Normalized records should be consecutive.
            if (sorted[i].completed) {
                activeStreak++
            } else {
                break
            }
        }

        // Update the entry
        goalStreaks.set(goalId, {
            ...goalData,
            currentStreak: activeStreak,
            longestStreak: longestStreak,
        })
    }

    // Convert map to array and sort
    return Array.from(goalStreaks.values()).sort((a, b) => b.longestStreak - a.longestStreak)
}
