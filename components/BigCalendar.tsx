'use client'

import React, { useMemo, useEffect, useState } from 'react'
import MigraineIndicator from './migraine/MigraineIndicator'
import { getTheme, MonthTheme } from '@/lib/theme-config'
import CalendarDayWater from './CalendarDayWater'
import { getCompletionColorRGB, getCompletionWaterGradient } from '@/lib/completion-color'
import CompletionLegend from './CompletionLegend'

interface BigCalendarProps {
    onDateSelect: (date: Date) => void
    goals: { id: string, name: string, symbol?: string }[]
}

interface DayData {
    date: string
    migraineSeverity: number | null
    completedGoals: number
    totalGoals: number
    completedGoalIds: string[]
}

export default React.memo(function BigCalendar({ onDateSelect, goals }: BigCalendarProps) {
    const [displayMonth, setDisplayMonth] = useState(new Date())
    const [monthData, setMonthData] = useState<Record<string, DayData>>({})
    const [loading, setLoading] = useState(true)
    const [migraineEnabled, setMigraineEnabled] = useState(false)

    // Derived values
    const year = displayMonth.getFullYear()
    const month = displayMonth.getMonth()
    const baseTheme = getTheme(month)
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    // Create goal map for O(1) symbol lookup
    const goalMap = useMemo(() => {
        const map = new Map<string, string>()
        // Defensive check: goals might be undefined during initial load/error state
        const safeGoals = Array.isArray(goals) ? goals : []
        safeGoals.forEach(g => map.set(g.id, g.symbol || '🎯'))
        return map
    }, [goals])

    // Helper for safe local ISO strings (YYYY-MM-DD)
    const toLocalISOString = (date: Date): string => {
        const y = date.getFullYear()
        const m = String(date.getMonth() + 1).padStart(2, '0')
        const d = String(date.getDate()).padStart(2, '0')
        return `${y}-${m}-${d}`
    }

    const calendarDays = useMemo(() => {
        const days = []

        // Step 1: Get First Day of Month
        const firstOfMonth = new Date(year, month, 1)
        firstOfMonth.setHours(0, 0, 0, 0)

        // Step 2: Find Start of First Calendar Week (Monday)
        // Monday = 1, Sunday = 0. We want Monday to be the start.
        const dayOfWeek = firstOfMonth.getDay() // Sun=0, Mon=1...Sat=6
        // If Sunday (0), we backtrack 6 days. If Mon (1), backtrack 0. If Tue (2), backtrack 1.
        const diff = dayOfWeek === 0 ? 6 : dayOfWeek - 1

        const gridStart = new Date(firstOfMonth)
        gridStart.setDate(firstOfMonth.getDate() - diff)
        gridStart.setHours(0, 0, 0, 0)

        // Step 3: Generate 42 sequential days
        for (let i = 0; i < 42; i++) {
            const date = new Date(gridStart)
            date.setDate(gridStart.getDate() + i)
            date.setHours(0, 0, 0, 0)

            days.push({
                date,
                isCurrentMonth: date.getMonth() === month,
            })
        }

        return days
    }, [year, month])

    // Fetch data
    useEffect(() => {
        const fetchData = async () => {
            setLoading(true)
            if (calendarDays.length === 0) return

            const firstDay = calendarDays[0].date
            const lastDay = calendarDays[calendarDays.length - 1].date

            const startStr = toLocalISOString(firstDay)
            const endStr = toLocalISOString(lastDay)

            try {
                const res = await fetch(`/api/analytics/month-view?startDate=${startStr}&endDate=${endStr}`)
                if (res.ok) {
                    const json = await res.json()
                    // Handle both old array format (fallback) and new object format
                    const rawData = Array.isArray(json) ? json : (json.data || [])
                    const data: DayData[] = Array.isArray(rawData) ? rawData : []
                    const isEnabled = Array.isArray(json) ? true : !!json.migraineEnabled

                    setMigraineEnabled(isEnabled)

                    // Convert array to map for O(1) lookup
                    const map: Record<string, DayData> = {}
                    data.forEach(d => { map[d.date] = d })

                    console.log('📊 [BigCalendar] Raw Data:', data)
                    console.log('📊 [BigCalendar] Mapped Data:', map)

                    setMonthData(map)
                }
            } catch (error) {
                console.error('Failed to fetch calendar data', error)
            } finally {
                setLoading(false)
            }
        }
        fetchData()
    }, [calendarDays])

    // DATA-DRIVEN THEME CALCULATION
    const { monthTheme, monthCompletionPercent } = useMemo(() => {
        // Only calculate for current/past days in the displayed month
        if (loading || Object.keys(monthData).length === 0) return { monthTheme: baseTheme, monthCompletionPercent: 0 }

        let totalExpected = 0
        let totalCompleted = 0

        // Iterate through all days in monthData
        Object.values(monthData).forEach(day => {
            const date = new Date(day.date)
            date.setHours(0, 0, 0, 0)

            // Only count if it's this month and <= today
            if (date.getMonth() === month && date <= today) {
                totalExpected += day.totalGoals
                totalCompleted += day.completedGoals
            }
        })

        const percent = totalExpected > 0 ? (totalCompleted / totalExpected) * 100 : 0
        const dynamicColor = getCompletionColorRGB(percent)

        // Override the theme primary color
        return {
            monthTheme: {
                ...baseTheme,
                primaryColor: dynamicColor,
                // We keep secondary/border from the monthly preset for some stability, or could override too.
            },
            monthCompletionPercent: percent
        }
    }, [monthData, loading, baseTheme, month, today])

    const navMonth = (offset: number) => {
        setDisplayMonth(new Date(year, month + offset, 1))
    }

    const goToToday = () => {
        setDisplayMonth(new Date())
    }

    return (
        <div className="glass rounded-2xl shadow-soft-lg border border-white/20 p-2 h-full flex flex-col">
            {/* Header - Ultra Compact */}
            <div className="flex items-center justify-between mb-1 px-1">
                <div className="flex items-center gap-2">
                    <h2
                        className="text-lg font-bold font-serif transition-colors duration-500"
                        style={{ color: monthTheme.primaryColor }}
                    >
                        {displayMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                    </h2>
                    <button
                        onClick={goToToday}
                        className="px-2 py-0.5 rounded-full text-xs font-medium hover:opacity-80 transition-opacity"
                        style={{ backgroundColor: monthTheme.secondaryColor, color: monthTheme.primaryColor }}
                    >
                        Today
                    </button>
                </div>

                {/* Legend - Added inline/flex */}
                <div className="hidden sm:block mx-4">
                    <CompletionLegend />
                </div>

                <div className="flex items-center bg-white rounded-full p-1 shadow-sm border border-neutral-200">
                    <button onClick={() => navMonth(-1)} className="p-2 hover:bg-neutral-100 rounded-full transition-colors">
                        <svg className="w-5 h-5 text-neutral-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                    </button>
                    <button onClick={() => navMonth(1)} className="p-2 hover:bg-neutral-100 rounded-full transition-colors">
                        <svg className="w-5 h-5 text-neutral-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                    </button>
                </div>
            </div>

            {/* Days Header */}
            <div className="grid grid-cols-7 mb-4">
                {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(d => (
                    <div key={d} className="text-right pr-4 text-sm font-medium text-neutral-400 uppercase tracking-wider">
                        {d}
                    </div>
                ))}
            </div>

            {/* Grid - Maximized & Boxy */}
            <div className="grid grid-cols-7 grid-rows-6 gap-px p-0.5 flex-1 border border-neutral-200/50 rounded-sm shadow-inner min-h-0 overflow-hidden">
                {calendarDays.map((cell, i) => {
                    const isCurrentMonth = cell.isCurrentMonth
                    // Corporate: Show all days, but mute non-current
                    // No 'invisible' check anymore

                    const dateIso = `${cell.date.getFullYear()}-${String(cell.date.getMonth() + 1).padStart(2, '0')}-${String(cell.date.getDate()).padStart(2, '0')}`
                    const isToday = cell.date.getTime() === today.getTime()
                    const dayData = monthData[dateIso]

                    const completionRate = dayData?.totalGoals ? (dayData.completedGoals / dayData.totalGoals) * 100 : 0
                    const completedIds = dayData?.completedGoalIds || []

                    // Dynamic Water Color based on daily completion
                    const waterColor = getCompletionWaterGradient(completionRate)

                    // Corporate: No emojis in Month View

                    if (isToday) {
                        // Stringify the object so it's readable in plain text
                        const logData = JSON.stringify({
                            date: dateIso,
                            data: dayData || 'UNDEFINED',
                            stats: { completionRate, waterColor }
                        }, null, 2)

                        console.log('🌊 [BigCalendar] TODAY Data (Please Copy This):\n' + logData)
                    }

                    return (
                        <CalendarDayWater
                            key={i}
                            date={cell.date}
                            completionPercentage={completionRate}
                            theme={monthTheme}
                            waterColor={waterColor} // New dynamic prop
                            isCurrentMonth={cell.isCurrentMonth}
                            isToday={isToday}
                            onClick={() => onDateSelect(cell.date)}
                        >
                            {/* Inner Content */}
                            {/* Inner Content - Migraine Indicator Only */}
                            {migraineEnabled && dayData?.migraineSeverity && (
                                <div className="absolute top-2 right-2">
                                    <MigraineIndicator severity={dayData.migraineSeverity} />
                                </div>
                            )}
                        </CalendarDayWater>
                    )
                })}
            </div>
        </div>
    )
})
