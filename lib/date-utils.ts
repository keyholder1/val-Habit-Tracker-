// Date utility functions for the habit tracker

// Get the Monday of the week for a given date
export function getWeekStart(date: Date): Date {
    const d = new Date(date)
    const day = d.getDay()
    const diff = d.getDate() - day + (day === 0 ? -6 : 1) // Adjust for Sunday
    d.setDate(diff)
    d.setHours(0, 0, 0, 0)
    return d
}

// Get the Sunday of the week for a given date
export function getWeekEnd(date: Date): Date {
    const weekStart = getWeekStart(date)
    const weekEnd = new Date(weekStart)
    weekEnd.setDate(weekStart.getDate() + 6)
    weekEnd.setHours(23, 59, 59, 999)
    return weekEnd
}

// Format date for display
export function formatDate(date: Date, format: 'short' | 'long' = 'short'): string {
    if (format === 'long') {
        return date.toLocaleDateString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        })
    }
    return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
    })
}

// Get array of dates for a week
export function getWeekDates(weekStart: Date): Date[] {
    const dates: Date[] = []
    for (let i = 0; i < 7; i++) {
        const date = new Date(weekStart)
        date.setDate(weekStart.getDate() + i)
        dates.push(date)
    }
    return dates
}

// Generate week ranges for analytics
export function generateWeekRanges(count: number, endDate: Date = new Date()): Date[] {
    const weeks: Date[] = []
    for (let i = 0; i < count; i++) {
        const date = new Date(endDate)
        date.setDate(endDate.getDate() - (i * 7))
        weeks.push(getWeekStart(date))
    }
    return weeks.reverse()
}

// Get ISO week number
export function getISOWeek(date: Date): number {
    const d = new Date(date)
    d.setHours(0, 0, 0, 0)
    d.setDate(d.getDate() + 4 - (d.getDay() || 7))
    const yearStart = new Date(d.getFullYear(), 0, 1)
    const weekNo = Math.ceil((((d.getTime() - yearStart.getTime()) / 86400000) + 1) / 7)
    return weekNo
}
