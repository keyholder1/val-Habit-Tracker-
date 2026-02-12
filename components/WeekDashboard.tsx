'use client'

import React, { useEffect, useState, useRef, useCallback, useMemo } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import GoalRow from './GoalRow'
import { useBulkWeeklyLogs } from '@/hooks/useWeeklyLogs'

interface Goal {
    id: string
    name: string
    symbol?: string
    weeklyTarget: number
    activeFrom: string
    archivedFromWeek?: string | null
    deletedAt?: string | null
    createdAt: string
}

interface WeekDashboardProps {
    weekStartDate: Date
    goals: Goal[]
    highlightDate?: Date | null
    onDateSelect?: (date: Date) => void
}

// Cache for recently viewed weeks' fetch results
const weekDataCache = new Map<string, { timestamp: number }>()
const CACHE_TTL = 30_000 // 30 seconds

function WeekDashboardInner({ weekStartDate, goals, highlightDate, onDateSelect }: WeekDashboardProps) {
    const weekStartIso = useMemo(() => {
        const d = new Date(weekStartDate)
        d.setUTCHours(0, 0, 0, 0)
        return d.toISOString()
    }, [weekStartDate])

    const weekEnd = useMemo(() => {
        const d = new Date(weekStartDate)
        d.setDate(d.getDate() + 6)
        return d
    }, [weekStartDate])

    // BULK FETCH OPTIMIZATION
    // Fetch all logs once for the week to prevent N+1 requests in GoalRows
    const { data: bulkLogs } = useBulkWeeklyLogs(weekStartDate)
    const queryClient = useQueryClient()

    // Seed the cache for individual goal hooks
    useEffect(() => {
        if (bulkLogs && bulkLogs.length > 0) {
            bulkLogs.forEach(log => {
                const dateKey = weekStartDate.toISOString()
                // Must match the queryKey in useWeeklyLog: ['weeklyLog', goalId, dateKey]
                const queryKey = ['weeklyLog', log.goalId, dateKey]

                // Only set if not already in cache to avoid overwriting newer data?
                // Actually, ensure we don't trigger re-renders loop. setQueryData is safe.
                const existing = queryClient.getQueryData(queryKey)
                if (!existing) {
                    queryClient.setQueryData(queryKey, log)
                }
            })
        }
    }, [bulkLogs, weekStartDate, queryClient])

    const formatDate = useCallback((date: Date) => {
        return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
    }, [])

    const highlightIndex = useMemo(() => {
        if (!highlightDate) return -1
        const target = new Date(highlightDate)
        target.setHours(0, 0, 0, 0)
        const start = new Date(weekStartDate)
        start.setHours(0, 0, 0, 0)
        const diffTime = target.getTime() - start.getTime()
        const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24))
        if (diffDays >= 0 && diffDays <= 6) return diffDays
        return -1
    }, [highlightDate, weekStartDate])

    const handleDayClick = (dayIndex: number) => {
        if (!onDateSelect) return
        const date = new Date(weekStartDate)
        date.setDate(date.getDate() + dayIndex)
        date.setHours(0, 0, 0, 0)
        onDateSelect(date)
    }

    return (
        <div className="glass rounded-2xl shadow-soft p-6 border border-neutral-200 transition-all">
            {/* Week Header */}
            <div className="mb-6 pb-4 border-b border-neutral-200 flex justify-between items-center">
                <div className="flex items-center gap-4">
                    <div>
                        <h3 className="text-xl font-semibold text-neutral-800">
                            {formatDate(weekStartDate)} — {formatDate(weekEnd)}
                        </h3>
                        <p className="text-sm text-neutral-500 mt-1">
                            Week of {weekStartDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                        </p>
                    </div>
                    <div className="flex gap-2">
                        {highlightIndex !== -1 && (
                            <span className="px-3 py-1 bg-primary-100 text-primary-700 text-xs font-medium rounded-full">
                                📍 {highlightDate?.toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })}
                            </span>
                        )}
                    </div>
                </div>
            </div>

            {/* Day Labels */}
            <div className="grid grid-cols-[240px_repeat(7,1fr)] gap-2 mb-4 px-4 items-center">
                <div className="text-xs font-medium text-neutral-500 uppercase tracking-wider pl-2">Goal</div>
                {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day, index) => (
                    <button
                        key={day}
                        onClick={() => handleDayClick(index)}
                        className={`text-xs font-medium text-center transition-all duration-200 rounded py-2 ${index === highlightIndex
                            ? 'text-primary-700 bg-primary-100 font-bold'
                            : 'text-neutral-500 hover:bg-neutral-100 hover:text-neutral-700'
                            }`}
                    >
                        {day}
                    </button>
                ))}
            </div>

            {/* Goals */}
            <div className="space-y-4">
                {goals.length === 0 ? (
                    <div className="text-center py-12 text-neutral-400">
                        <p className="text-lg mb-2">No goals yet</p>
                        <p className="text-sm">Add goals from the sidebar to start tracking.</p>
                    </div>
                ) : (
                    goals
                        .filter(goal => {
                            const weekStart = new Date(weekStartDate)
                            weekStart.setUTCHours(0, 0, 0, 0)

                            const weekEnd = new Date(weekStartDate)
                            weekEnd.setDate(weekEnd.getDate() + 6)
                            weekEnd.setUTCHours(23, 59, 59, 999)

                            const isDeleted = !!goal.deletedAt
                            if (isDeleted) return false

                            const activeFromDate = goal.activeFrom ? new Date(goal.activeFrom) : null
                            const activeAfterWeek = activeFromDate && !isNaN(activeFromDate.getTime()) && activeFromDate > weekEnd
                            if (activeAfterWeek) return false

                            const isArchivedThisWeek = goal.archivedFromWeek && new Date(goal.archivedFromWeek) <= weekStartDate
                            if (isArchivedThisWeek) return false

                            return true
                        })
                        .map((goal) => (
                            <GoalRow
                                key={goal.id}
                                goalId={goal.id}
                                goalName={goal.name}
                                goalSymbol={goal.symbol}
                                weekStartDate={weekStartIso}
                                defaultTarget={goal.weeklyTarget}
                                highlightIndex={highlightIndex}
                                goalActiveFrom={goal.activeFrom}
                            />
                        ))
                )}
            </div>
        </div>
    )
}

const WeekDashboard = React.memo(WeekDashboardInner)
export default WeekDashboard
