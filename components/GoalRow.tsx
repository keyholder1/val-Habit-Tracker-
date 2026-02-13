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

const DAY_LABELS = ['M', 'T', 'W', 'T', 'F', 'S', 'S']

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

    // Build checkbox data with disabled state
    const checkboxData = checkboxes.map((checked: boolean, index: number) => {
        const dayDate = new Date(weekStartDate)
        dayDate.setDate(dayDate.getDate() + index)
        dayDate.setHours(0, 0, 0, 0)
        const activeDate = goalActiveFrom ? new Date(goalActiveFrom) : null
        if (activeDate) activeDate.setHours(0, 0, 0, 0)
        const isDisabled = activeDate ? dayDate < activeDate : false
        return { checked, isDisabled, index }
    })

    return (
        <div
            className="group bg-white rounded-xl p-3 sm:p-4 hover:bg-white transition-all duration-200 border-2 border-neutral-200 hover:border-neutral-400 shadow-sm hover:shadow-md"
            style={{ marginBottom: '12px' }}
        >
            {/* ===== DESKTOP: 8-column grid matching header ===== */}
            <div className="hidden sm:grid sm:grid-cols-[240px_repeat(7,1fr)] gap-2 items-center">
                {/* Goal Info */}
                <div className="flex items-center gap-3 min-w-0">
                    <span className="text-xl bg-neutral-100 p-2 rounded-lg shrink-0">{goalSymbol || ''}</span>
                    <div className="min-w-0 flex-1">
                        <h4 className="font-semibold text-neutral-800 text-base leading-tight truncate" title={goalName}>
                            {goalName}
                        </h4>
                        <div className="flex items-center gap-1 mt-1 font-medium">
                            <span className="text-sm text-neutral-600">Target:</span>
                            <div className="flex items-center text-sm text-neutral-700">
                                <input
                                    type="number"
                                    min="0"
                                    max="7"
                                    value={target}
                                    onChange={(e) => handleTargetChange(parseInt(e.target.value) || 0)}
                                    className="w-8 text-center font-bold bg-white/50 border-b-2 border-primary-300 focus:border-primary-600 focus:outline-none px-0.5 mx-0.5 rounded-sm"
                                />
                                <span className="text-neutral-600">/ week</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Checkboxes — one per column */}
                {checkboxData.map(({ checked, isDisabled, index }) => (
                    <div
                        key={index}
                        className={`
                            flex justify-center items-center rounded-lg transition-all duration-200 py-2
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
                ))}
            </div>

            {/* ===== MOBILE: Stacked layout ===== */}
            <div className="flex flex-col gap-3 sm:hidden">
                {/* Row 1: Goal Info */}
                <div className="flex items-center gap-2 min-w-0">
                    <span className="text-lg bg-neutral-100 p-1.5 rounded-lg shrink-0">{goalSymbol || ''}</span>
                    <div className="min-w-0 flex-1">
                        <h4 className="font-semibold text-neutral-800 text-sm leading-tight truncate" title={goalName}>
                            {goalName}
                        </h4>
                        <div className="flex items-center gap-1 mt-0.5 font-medium">
                            <span className="text-[11px] text-neutral-600">Target:</span>
                            <div className="flex items-center text-[11px] text-neutral-700">
                                <input
                                    type="number"
                                    min="0"
                                    max="7"
                                    value={target}
                                    onChange={(e) => handleTargetChange(parseInt(e.target.value) || 0)}
                                    className="w-6 text-center font-bold bg-white/50 border-b-2 border-primary-300 focus:border-primary-600 focus:outline-none px-0.5 mx-0.5 rounded-sm"
                                />
                                <span className="text-neutral-600">/ week</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Row 2: Checkboxes — full width, flex row, with day labels */}
                <div className="flex items-center justify-between w-full overflow-hidden" style={{ gap: '2px' }}>
                    {checkboxData.map(({ checked, isDisabled, index }) => (
                        <div
                            key={index}
                            className={`
                                flex flex-col items-center gap-0.5 rounded-lg transition-all duration-200 py-1 min-w-0
                                ${index === highlightIndex
                                    ? 'bg-primary-50 ring-1 ring-primary-100'
                                    : ''}
                                ${isDisabled ? 'opacity-40' : ''}
                            `}
                            style={{ flex: '1 1 0%' }}
                        >
                            <span className="text-[9px] font-semibold text-neutral-400 uppercase">{DAY_LABELS[index]}</span>
                            <Checkbox
                                checked={checked}
                                onChange={() => handleCheckboxChange(index)}
                                disabled={isDisabled}
                            />
                        </div>
                    ))}
                </div>
            </div>

            {/* Progress Bar — shared */}
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
