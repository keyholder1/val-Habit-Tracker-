// Analytics type definitions

export interface DailyRecord {
    date: Date | string
    goalId: string
    goalName: string
    completed: boolean
    target: number
}

export interface DailyTrendPoint {
    date: string
    completion: number
}

export interface WeeklyTrendPoint {
    week: string
    completion: number
}

export interface MonthlyTrendPoint {
    month: string
    completion: number
}

export interface HeatmapCell {
    day: string
    intensity: number
}

export interface GoalCompletionData {
    name: string
    value: number
    color: string
}

export interface TargetVsActualPoint {
    date: string
    dateIso: string
    target: number
    actual: number
}

export interface StreakData {
    goalName: string
    currentStreak: number
    longestStreak: number
    startDate: string | null
}

export interface TimeOfWeekCell {
    day: string
    goalName: string
    completion: number
}

export interface ConsistencyScore {
    overall: number
    byGoal: Record<string, number>
}

export interface LifetimeStats {
    totalCompletions: number
    totalDays: number
    overallRate: number
    goalsTracked: number
}

export interface AnalyticsPayload {
    dailyTrend: DailyTrendPoint[]
    weeklyTrend: WeeklyTrendPoint[]
    monthlyTrend: MonthlyTrendPoint[]
    calendarHeatmap: HeatmapCell[]
    timeOfWeekHeatmap: TimeOfWeekCell[]
    goalCompletionPie: GoalCompletionData[]
    lifetimeContributionPie: GoalCompletionData[]
    targetVsActual: TargetVsActualPoint[]
    streakTimeline: StreakData[]
    longestStreaks: StreakData[]
    consistencyScore: ConsistencyScore
    lifetimeStats: LifetimeStats
}
