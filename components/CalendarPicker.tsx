'use client'

import React, { useMemo, useCallback, useState, useEffect } from 'react'
import MigraineIndicator from './migraine/MigraineIndicator'

interface CalendarPickerProps {
    selectedDate: Date
    onDateSelect: (date: Date) => void
    /** The currently displayed month (controlled from parent for month nav) */
    displayMonth: Date
    onDisplayMonthChange: (month: Date) => void
}

interface CalendarCell {
    date: Date
    isCurrentMonth: boolean
    isToday: boolean
}

function getWeekStart(date: Date): Date {
    const d = new Date(date)
    const day = d.getDay()
    // Shift to Monday (day=0 is Sunday, so Monday = day-1, wrapping Sunday to 6)
    const diff = day === 0 ? 6 : day - 1
    d.setDate(d.getDate() - diff)
    d.setHours(0, 0, 0, 0)
    return d
}

function isSameDay(a: Date, b: Date): boolean {
    return a.getFullYear() === b.getFullYear() &&
        a.getMonth() === b.getMonth() &&
        a.getDate() === b.getDate()
}

function isSameWeek(a: Date, b: Date): boolean {
    const wa = getWeekStart(a)
    const wb = getWeekStart(b)
    return isSameDay(wa, wb)
}

/**
 * Generate a full calendar grid for a given month.
 * Always produces 5 or 6 complete weeks (35 or 42 cells).
 * Weeks start on Monday.
 */
function generateCalendarGrid(year: number, month: number, today: Date): CalendarCell[] {
    const firstOfMonth = new Date(year, month, 1)
    firstOfMonth.setHours(0, 0, 0, 0)
    const lastOfMonth = new Date(year, month + 1, 0)
    lastOfMonth.setHours(0, 0, 0, 0)

    // Monday = 0, Tuesday = 1, ..., Sunday = 6
    let startDow = firstOfMonth.getDay()
    startDow = startDow === 0 ? 6 : startDow - 1

    // Calculate the first cell date (Monday of the week containing the 1st)
    const gridStart = new Date(firstOfMonth)
    gridStart.setDate(gridStart.getDate() - startDow)
    gridStart.setHours(0, 0, 0, 0)

    // Calculate total cells: minimum 5 weeks (35), extend to 6 (42) if needed
    const daysInMonth = lastOfMonth.getDate()
    const totalDaysNeeded = startDow + daysInMonth
    const totalWeeks = totalDaysNeeded > 35 ? 6 : 5
    const totalCells = totalWeeks * 7

    const cells: CalendarCell[] = []
    const current = new Date(gridStart)

    for (let i = 0; i < totalCells; i++) {
        cells.push({
            date: new Date(current),
            isCurrentMonth: current.getMonth() === month && current.getFullYear() === year,
            isToday: isSameDay(current, today),
        })
        current.setDate(current.getDate() + 1)
    }

    return cells
}

function CalendarPickerInner({ selectedDate, onDateSelect, displayMonth, onDisplayMonthChange }: CalendarPickerProps) {
    const today = useMemo(() => {
        const t = new Date()
        t.setHours(0, 0, 0, 0)
        return t
    }, [])

    const year = displayMonth.getFullYear()
    const month = displayMonth.getMonth()

    // Build complete calendar grid with leading/trailing days
    const calendarDays = useMemo(() => {
        return generateCalendarGrid(year, month, today)
    }, [year, month, today])

    const monthLabel = useMemo(() => {
        return new Date(year, month).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
    }, [year, month])

    const goToPrevMonth = useCallback(() => {
        onDisplayMonthChange(new Date(year, month - 1, 1))
    }, [year, month, onDisplayMonthChange])

    const goToNextMonth = useCallback(() => {
        onDisplayMonthChange(new Date(year, month + 1, 1))
    }, [year, month, onDisplayMonthChange])

    const goToToday = useCallback(() => {
        const t = new Date()
        t.setHours(0, 0, 0, 0)
        onDisplayMonthChange(new Date(t.getFullYear(), t.getMonth(), 1))
        onDateSelect(t)
    }, [onDisplayMonthChange, onDateSelect])

    const isInFuture = useCallback((date: Date) => {
        return date > today
    }, [today])

    // Fetch migraine indicators for the visible date range
    const [monthData, setMonthData] = useState<{ date: string, severity: number }[]>([])

    useEffect(() => {
        const fetchIndicators = async () => {
            if (calendarDays.length === 0) return

            const firstDay = calendarDays[0].date
            const lastDay = calendarDays[calendarDays.length - 1].date

            const startStr = firstDay.toISOString().split('T')[0]
            const endStr = lastDay.toISOString().split('T')[0]

            try {
                const res = await fetch(`/api/migraines?startDate=${startStr}&endDate=${endStr}`, { cache: 'no-store' })
                if (res.ok) {
                    const data = await res.json()
                    setMonthData(data.map((d: any) => ({
                        date: new Date(d.date).toISOString().split('T')[0],
                        severity: d.severity
                    })))
                }
            } catch (error) {
                console.error('Failed to fetch calendar data', error)
            }
        }
        fetchIndicators()
    }, [calendarDays])

    return (
        <div className="glass rounded-2xl shadow-soft-lg p-5">
            {/* Month Navigation */}
            <div className="flex items-center justify-between mb-4">
                <button
                    onClick={goToPrevMonth}
                    className="p-1.5 rounded-lg hover:bg-neutral-100 text-neutral-600 hover:text-neutral-800 transition-colors"
                    aria-label="Previous month"
                >
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                </button>

                <div className="flex items-center gap-3">
                    <h3 className="text-base font-semibold text-neutral-800">{monthLabel}</h3>
                    <button
                        onClick={goToToday}
                        className="text-xs px-2 py-1 bg-primary-50 text-primary-600 hover:bg-primary-100 rounded-md font-medium transition-colors"
                    >
                        Today
                    </button>
                </div>

                <button
                    onClick={goToNextMonth}
                    className="p-1.5 rounded-lg hover:bg-neutral-100 text-neutral-600 hover:text-neutral-800 transition-colors"
                    aria-label="Next month"
                >
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                </button>
            </div>

            {/* Day of Week Headers */}
            <div className="grid grid-cols-7 gap-0.5 mb-1">
                {['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'].map(d => (
                    <div key={d} className="text-center text-xs font-medium text-neutral-400 py-1">
                        {d}
                    </div>
                ))}
            </div>

            {/* Calendar Grid */}
            <div className="grid grid-cols-7 gap-0.5">
                {calendarDays.map((cell, i) => {
                    const { date, isCurrentMonth, isToday } = cell
                    const isSelected = isSameDay(date, selectedDate)
                    const inSelectedWeek = isSameWeek(date, selectedDate)
                    const future = isInFuture(date)

                    const dateIso = date.toISOString().split('T')[0]
                    const migraine = monthData.find(m => m.date === dateIso)

                    return (
                        <button
                            key={dateIso}
                            onClick={() => {
                                if (!future) {
                                    onDateSelect(date)
                                    // If clicking a day outside current month, navigate to that month
                                    if (!isCurrentMonth) {
                                        onDisplayMonthChange(new Date(date.getFullYear(), date.getMonth(), 1))
                                    }
                                }
                            }}
                            disabled={future}
                            className={`
                                h-9 text-sm font-medium rounded-lg transition-all relative flex flex-col items-center justify-center
                                ${!isCurrentMonth
                                    ? 'text-neutral-300'
                                    : ''
                                }
                                ${future
                                    ? 'text-neutral-300 cursor-not-allowed'
                                    : 'cursor-pointer hover:bg-primary-50'
                                }
                                ${isCurrentMonth && inSelectedWeek && !isSelected
                                    ? 'bg-primary-50/60 text-primary-700'
                                    : ''
                                }
                                ${isSelected
                                    ? 'bg-gradient-to-br from-primary-500 to-secondary-500 text-white shadow-sm'
                                    : ''
                                }
                                ${isToday && !isSelected
                                    ? 'ring-2 ring-primary-400 ring-inset text-primary-600 font-bold'
                                    : ''
                                }
                                ${isCurrentMonth && !isSelected && !inSelectedWeek && !isToday && !future
                                    ? 'text-neutral-700'
                                    : ''
                                }
                            `}
                        >
                            <span className="z-10 relative">{date.getDate()}</span>
                            {migraine && !isSelected && (
                                <span className={`w-1.5 h-1.5 rounded-full absolute bottom-1 ${migraine.severity >= 7 ? 'bg-red-500' :
                                    migraine.severity >= 4 ? 'bg-orange-500' : 'bg-green-500'
                                    }`} />
                            )}
                            {migraine && isSelected && (
                                <span className="w-1.5 h-1.5 rounded-full absolute bottom-1 bg-white/80" />
                            )}
                        </button>
                    )
                })}
            </div>
        </div>
    )
}

const CalendarPicker = React.memo(CalendarPickerInner)
export default CalendarPicker

// Export utility for parent components
export { getWeekStart }
