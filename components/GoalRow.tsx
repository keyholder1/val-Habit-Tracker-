'use client'

import React, { useEffect, useState, useCallback, useMemo } from 'react'
import Checkbox from './Checkbox'
import ProgressBar from './ProgressBar'
import GoalArchiveModal from './GoalArchiveModal'
import { useRouter } from 'next/navigation'
import { useWeeklyLog } from '@/hooks/useWeeklyLogs'
import { useGoals } from '@/hooks/useGoals'

interface GoalRowProps {
    goalId: string
    goalName: string
    goalSymbol?: string
    weekStartDate: string
    defaultTarget: number
    highlightIndex?: number
    onRefreshNeeded?: () => void
    goalActiveFrom?: string
}

interface WeeklyLog {
    id: string
    weeklyTarget: number
    checkboxStates: boolean[]
}

function GoalRowInner({ goalId, goalName, goalSymbol, weekStartDate, defaultTarget,
    highlightIndex,
    onRefreshNeeded,
    goalActiveFrom
}: GoalRowProps) {
    const [isArchiveModalOpen, setIsArchiveModalOpen] = useState(false)
    const [isArchiving, setIsArchiving] = useState(false)
    const router = useRouter()

    // Use the new hook
    const { log, isLoading, toggleCheckbox, updateTarget } = useWeeklyLog(
        goalId,
        new Date(weekStartDate)
    )

    const { updateGoal, archiveGoal, deleteGoal } = useGoals()

    // Derived state from hook data
    const checkboxes = useMemo(() => log?.checkboxStates || Array(7).fill(false), [log])
    const target = useMemo(() => {
        const t = log?.weeklyTarget ?? defaultTarget
        return (t === undefined || t === null || isNaN(t)) ? 1 : t
    }, [log, defaultTarget])

    const handleCheckboxChange = useCallback((index: number) => {
        toggleCheckbox.mutate({
            dayIndex: index,
            currentState: checkboxes
        })
    }, [checkboxes, toggleCheckbox])

    const handleTargetChange = useCallback((newTarget: number) => {
        if (newTarget < 0 || newTarget > 7) return
        updateTarget.mutate(newTarget)
    }, [updateTarget])

    const checkedCount = useMemo(() => checkboxes.filter(Boolean).length, [checkboxes])
    // Avoid division by zero
    const progress = useMemo(() => target > 0 ? (checkedCount / target) * 100 : 0, [checkedCount, target])

    const handleArchiveConfirm = async (mode: 'next-week' | 'this-week' | 'delete') => {
        setIsArchiving(true)
        try {
            if (mode === 'next-week') {
                const currentWeekStart = new Date(weekStartDate)
                const nextWeek = new Date(currentWeekStart)
                nextWeek.setDate(nextWeek.getDate() + 7)
                await archiveGoal.mutateAsync({
                    id: goalId,
                    isArchived: true,
                    archivedFromWeek: nextWeek.toISOString()
                })
            } else if (mode === 'this-week') {
                const currentWeekStart = new Date(weekStartDate)
                await archiveGoal.mutateAsync({
                    id: goalId,
                    isArchived: true,
                    archivedFromWeek: currentWeekStart.toISOString()
                })
            } else if (mode === 'delete') {
                // useGoals deleteGoal now handles soft delete via PATCH
                await deleteGoal.mutateAsync(goalId)
            }

            setIsArchiveModalOpen(false)
            if (onRefreshNeeded) onRefreshNeeded()
            // router.refresh() is less critical now due to React Query invalidation, 
            // but good for server components if any.
            router.refresh()
        } catch (error) {
            console.error('Failed to archive:', error)
        } finally {
            setIsArchiving(false)
        }
    }

    if (isLoading) {
        return (
            <div className="animate-pulse bg-neutral-100 rounded-lg h-20 mb-2"></div>
        )
    }

    return (
        <div
            className="group bg-white/50 rounded-xl p-2 sm:p-3 hover:bg-white transition-all duration-200 border border-transparent hover:border-neutral-200 shadow-sm hover:shadow-md overflow-hidden"
            style={{ marginBottom: '8px' }}
        >
            <div className="flex flex-col sm:grid sm:grid-cols-[240px_1fr] gap-3 sm:gap-2 items-stretch sm:items-center">
                {/* 1. Goal Info Column */}
                <div className="relative flex items-center gap-2 sm:gap-3 sm:pr-8 sm:border-r border-neutral-100/50">
                    <span className="text-lg sm:text-xl bg-neutral-100 p-1.5 sm:p-2 rounded-lg shrink-0">{goalSymbol || ''}</span>
                    <div className="min-w-0 flex-1">
                        <h4 className="font-semibold text-neutral-800 text-sm sm:text-base leading-tight truncate" title={goalName}>
                            {goalName}
                        </h4>
                        <div className="flex items-center gap-1 mt-0.5 sm:mt-1 font-medium">
                            <span className="text-[11px] sm:text-sm text-neutral-600">Target:</span>
                            <div className="flex items-center text-[11px] sm:text-sm text-neutral-700">
                                <input
                                    type="number"
                                    min="0"
                                    max="7"
                                    value={target}
                                    onChange={(e) => handleTargetChange(parseInt(e.target.value) || 0)}
                                    className="w-6 sm:w-8 text-center font-bold bg-white/50 border-b-2 border-primary-300 focus:border-primary-600 focus:outline-none px-0.5 mx-0.5 rounded-sm"
                                />
                                <span className="text-neutral-600">/ week</span>
                            </div>
                        </div>
                    </div>
                    {/* Archive Button */}
                    <button
                        onClick={() => setIsArchiveModalOpen(true)}
                        className="opacity-100 sm:opacity-0 sm:group-hover:opacity-100 absolute right-0 sm:right-2 text-neutral-400 hover:text-red-500 transition-all p-2 sm:p-1"
                        title="Archive Goal"
                    >
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                    </button>
                </div>

                {/* 2. Checkboxes Grid (Responsive Wrapping) */}
                <div className="grid grid-cols-7 sm:grid-cols-7 gap-1 sm:gap-2 justify-items-center">
                    {checkboxes.map((checked, index) => {
                        // Calculate if this specific day is before the goal was active
                        const dayDate = new Date(weekStartDate)
                        dayDate.setDate(dayDate.getDate() + index)
                        dayDate.setHours(0, 0, 0, 0)

                        const activeDate = goalActiveFrom ? new Date(goalActiveFrom) : null
                        if (activeDate) activeDate.setHours(0, 0, 0, 0)

                        const isDisabled = activeDate ? dayDate < activeDate : false

                        return (
                            <div
                                key={index}
                                className={`
                                    flex justify-center items-center w-full aspect-square sm:h-full rounded-lg transition-all duration-200
                                    ${index === highlightIndex
                                        ? 'bg-primary-50 ring-1 ring-primary-100 shadow-sm'
                                        : 'hover:bg-neutral-50'}
                                    ${isDisabled ? 'bg-neutral-50/50' : ''}
                                `}
                            >
                                <Checkbox
                                    checked={checked}
                                    onChange={() => handleCheckboxChange(index)}
                                    disabled={isDisabled}
                                />
                            </div>
                        )
                    })}
                </div>
            </div>

            {/* Progress Bar */}
            <div className="mt-3 flex items-center gap-3 px-1 opacity-60 group-hover:opacity-100 transition-opacity">
                <ProgressBar progress={Math.min(progress, 100)} className="h-1" />
                <span className="text-[10px] font-medium text-neutral-400 min-w-[30px] text-right">
                    {Math.round(progress)}%
                </span>
            </div>

            <GoalArchiveModal
                isOpen={isArchiveModalOpen}
                onClose={() => setIsArchiveModalOpen(false)}
                onConfirm={handleArchiveConfirm}
                goalName={goalName}
                isArchiving={isArchiving}
            />
        </div>
    )
}

const GoalRow = React.memo(GoalRowInner)
export default GoalRow
