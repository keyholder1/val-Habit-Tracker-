'use client'

import React, { useMemo } from 'react'
import GoalRow from './GoalRow'

interface Goal {
    id: string
    name: string
    defaultWeeklyTarget: number
}

interface WeekCardProps {
    weekStartDate: string
    goals: Goal[]
    highlightDate?: string | null
}

function WeekCardInner({ weekStartDate, goals, highlightDate }: WeekCardProps) {
    const weekStart = new Date(weekStartDate)
    const weekEnd = new Date(weekStart)
    weekEnd.setDate(weekStart.getDate() + 6)

    const formatDate = (date: Date) => {
        return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
    }

    // Calculate which index (0-6) should be highlighted if any
    const highlightIndex = useMemo(() => {
        if (!highlightDate) return -1
        const target = new Date(highlightDate)
        target.setUTCHours(0, 0, 0, 0)

        const start = new Date(weekStartDate)
        const diffTime = target.getTime() - start.getTime()
        const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24))

        if (diffDays >= 0 && diffDays <= 6) return diffDays
        return -1
    }, [highlightDate, weekStartDate])

    return (
        <div
            className={`glass rounded-2xl shadow-soft p-6 border transition-colors duration-500 hover:shadow-soft-lg ${highlightIndex !== -1 ? 'border-primary-300 ring-1 ring-primary-100' : 'border-neutral-200'}`}
        >
            {/* Week Header */}
            <div className="mb-6 pb-4 border-b border-neutral-200 flex justify-between items-center">
                <div>
                    <h3 className="text-xl font-semibold text-neutral-800">
                        {formatDate(weekStart)} - {formatDate(weekEnd)}
                    </h3>
                    <p className="text-sm text-neutral-500 mt-1">
                        Week of {weekStart.toLocaleDateString('en-US', { month: 'long' })}
                    </p>
                </div>
                {highlightIndex !== -1 && (
                    <span className="px-3 py-1 bg-primary-100 text-primary-700 text-xs font-medium rounded-full animate-pulse">
                        Selected Date
                    </span>
                )}
            </div>

            {/* Day Labels */}
            <div className="grid grid-cols-8 gap-2 mb-4 px-4 relative">
                <div className="text-xs font-medium text-neutral-500"></div>
                {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day, index) => (
                    <div
                        key={day}
                        className={`text-xs font-medium text-center transition-colors duration-300 rounded py-1 ${index === highlightIndex ? 'text-primary-700 bg-primary-100 font-bold' : 'text-neutral-500'}`}
                    >
                        {day}
                    </div>
                ))}
            </div>

            {/* Goals */}
            <div className="space-y-4">
                {goals.length === 0 ? (
                    <div className="text-center py-8 text-neutral-400">
                        No goals yet. Add goals from the sidebar.
                    </div>
                ) : (
                    goals.map((goal) => (
                        <GoalRow
                            key={goal.id}
                            goalId={goal.id}
                            goalName={goal.name}
                            weekStartDate={weekStartDate}
                            defaultTarget={goal.defaultWeeklyTarget}
                        />
                    ))
                )}
            </div>
        </div>
    )
}

const WeekCard = React.memo(WeekCardInner)
export default WeekCard
