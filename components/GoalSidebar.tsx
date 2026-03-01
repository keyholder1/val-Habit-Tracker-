'use client'

import { useState, useEffect } from 'react'
import { Goal, useGoals } from '@/hooks/useGoals'
import { useBreakpoint } from '@/hooks/useBreakpoint'
import { useIsTouchDevice } from '@/hooks/useIsTouchDevice'
import GoalArchiveModal from './GoalArchiveModal'
import ManageGoalsModal from './ManageGoalsModal'
import { getWeekStart } from '@/lib/dateUtils'

export interface GoalSidebarProps {
    selectedDate: Date
}

// getWeekStart is now imported from @/lib/dateUtils

export function GoalSidebar({ selectedDate }: GoalSidebarProps) {
    const { goals, createGoal, updateGoal, archiveGoal, deleteGoal } = useGoals()
    const { isMobile } = useBreakpoint()
    const isTouch = useIsTouchDevice()
    const [showManageModal, setShowManageModal] = useState(false)
    const [showAddForm, setShowAddForm] = useState(false)
    const [newGoalName, setNewGoalName] = useState('')
    const [newGoalSymbol, setNewGoalSymbol] = useState('')
    const [newGoalTarget, setNewGoalTarget] = useState(7)

    // Default startDate to the start of the week for selectedDate
    const [newGoalStartDate, setNewGoalStartDate] = useState(
        getWeekStart(selectedDate).toISOString().split('T')[0]
    )

    // Synchronize if selectedDate changes
    useEffect(() => {
        setNewGoalStartDate(getWeekStart(selectedDate).toISOString().split('T')[0])
    }, [selectedDate])

    // Edit Start Date State (Dedicated Section)
    const [editGoalId, setEditGoalId] = useState<string>('')
    const [editGoalStartDate, setEditGoalStartDate] = useState<string>(
        new Date().toISOString().split('T')[0]
    )
    const [isEditCollapsibleOpen, setIsEditCollapsibleOpen] = useState(false)

    // Edit Mode State
    const [editingId, setEditingId] = useState<string | null>(null)
    const [editName, setEditName] = useState('')
    const [editSymbol, setEditSymbol] = useState('')
    const [editTarget, setEditTarget] = useState(7)

    const startEditing = (goal: Goal) => {
        setEditingId(goal.id)
        setEditName(goal.name)
        setEditSymbol(goal.symbol || '')
        setEditTarget(goal.weeklyTarget || 7)
    }

    const saveEdit = async () => {
        if (!editingId) return
        try {
            await updateGoal.mutateAsync({
                id: editingId,
                data: {
                    name: editName,
                    symbol: editSymbol,
                    weeklyTarget: editTarget,
                }
            })
            setEditingId(null)
        } catch (error) {
            console.error('Failed to update goal:', error)
        }
    }

    const handleEditStartDate = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!editGoalId) return
        try {
            await updateGoal.mutateAsync({
                id: editGoalId,
                data: {
                    startDate: new Date(editGoalStartDate).toISOString()
                }
            })
            // Feedback is immediate via Query invalidation in useGoals
            setEditGoalId('')
        } catch (error) {
            console.error('Failed to update goal start date:', error)
        }
    }

    const cancelEdit = () => {
        setEditingId(null)
    }

    const handleAddGoal = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!newGoalName.trim()) return

        try {
            await createGoal.mutateAsync({
                name: newGoalName,
                symbol: newGoalSymbol,
                weeklyTarget: newGoalTarget,
                startDate: new Date(newGoalStartDate).toISOString(),
            })

            setNewGoalName('')
            setNewGoalSymbol('')
            setNewGoalTarget(7)
            setShowAddForm(false)
        } catch (error) {
            console.error('Failed to add goal:', error)
        }
    }

    const [isArchiveModalOpen, setIsArchiveModalOpen] = useState(false)
    const [isArchiving, setIsArchiving] = useState(false)
    const [selectedGoal, setSelectedGoal] = useState<Goal | null>(null)

    const triggerArchive = (goal: Goal) => {
        setSelectedGoal(goal)
        setIsArchiveModalOpen(true)
    }

    const handleArchiveConfirm = async (mode: 'next-week' | 'this-week' | 'delete') => {
        if (!selectedGoal) return
        setIsArchiving(true)
        try {
            if (mode === 'next-week') {
                const thisMonday = getWeekStart(new Date())
                const nextMonday = new Date(thisMonday)
                nextMonday.setDate(nextMonday.getDate() + 7)
                nextMonday.setHours(0, 0, 0, 0)
                await archiveGoal.mutateAsync({ id: selectedGoal.id, isArchived: true, archivedFromWeek: nextMonday.toISOString() })
            } else if (mode === 'this-week') {
                const thisMonday = getWeekStart(new Date())
                await archiveGoal.mutateAsync({ id: selectedGoal.id, isArchived: true, archivedFromWeek: thisMonday.toISOString() })
            } else if (mode === 'delete') {
                await deleteGoal.mutateAsync(selectedGoal.id)
            }
            setIsArchiveModalOpen(false)
        } catch (error) {
            console.error('Failed to handle goal change:', error)
        } finally {
            setIsArchiving(false)
        }
    }

    const filteredGoals = goals?.filter(g => {
        if (g.deletedAt) return false
        if (!g.isArchived) return true
        if (g.archivedFromWeek) {
            return new Date(g.archivedFromWeek) > new Date()
        }
        return false
    }) || []

    return (
        <div className={`glass rounded-2xl shadow-soft-lg p-4 sm:p-6 ${isMobile ? '' : 'sticky top-24'}`}>
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg sm:text-xl font-bold text-neutral-800">Your Goals</h3>
                <button
                    onClick={() => setShowManageModal(true)}
                    className="p-2 text-neutral-400 hover:text-primary-500 transition-colors"
                    title="Manage goals"
                >
                    <svg className="w-6 h-6 sm:w-5 sm:h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                </button>
            </div>

            <div className="space-y-4">
                {/* Add Goal Section */}
                <div className="bg-white/40 rounded-xl p-3 border border-dashed border-neutral-300 hover:border-primary-400 transition-colors">
                    {!showAddForm ? (
                        <button
                            onClick={() => setShowAddForm(true)}
                            className="w-full py-4 sm:py-2 flex items-center justify-center gap-2 text-sm font-medium text-neutral-600 hover:text-primary-600 transition-colors"
                        >
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                            </svg>
                            Add New Goal
                        </button>
                    ) : (
                        <form onSubmit={handleAddGoal} className="space-y-3 animate-in fade-in slide-in-from-top-2 duration-200">
                            <div className="flex gap-2 min-w-0 flex-wrap sm:flex-nowrap overflow-hidden">
                                <input
                                    type="text"
                                    placeholder="Goal name..."
                                    value={newGoalName}
                                    onChange={(e) => setNewGoalName(e.target.value)}
                                    className="flex-1 min-w-0 p-3 sm:p-2 border rounded-lg text-base sm:text-sm bg-white/80 focus:ring-1 focus:ring-primary-400 outline-none"
                                    autoFocus
                                />
                                <input
                                    type="text"
                                    placeholder=""
                                    value={newGoalSymbol}
                                    onFocus={(e) => e.target.select()}
                                    onMouseUp={(e) => {
                                        e.preventDefault();
                                        e.currentTarget.select();
                                    }}
                                    onChange={(e) => setNewGoalSymbol(e.target.value)}
                                    className={`w-full sm:w-16 max-w-[4rem] sm:max-w-[4rem] min-w-0 p-3 sm:p-2 border rounded-lg text-center text-base sm:text-sm bg-white/80 focus:ring-1 focus:ring-primary-400 outline-none overflow-hidden text-ellipsis ${newGoalSymbol ? 'caret-transparent' : ''}`}
                                />
                            </div>
                            <div className="space-y-3 sm:space-y-2">
                                <div className="flex items-center gap-2">
                                    <label className="text-xs text-neutral-600 w-12 text-right">Target:</label>
                                    <input
                                        type="number"
                                        min="1"
                                        max="7"
                                        value={newGoalTarget}
                                        onChange={(e) => setNewGoalTarget(parseInt(e.target.value) || 1)}
                                        className="flex-1 p-2 sm:p-1 border rounded text-sm focus:ring-1 focus:ring-primary-400 outline-none"
                                    />
                                    <span className="text-xs text-neutral-500">/week</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <label className="text-xs text-neutral-600 w-12 text-right">Start:</label>
                                    <input
                                        type="date"
                                        value={newGoalStartDate}
                                        onChange={(e) => setNewGoalStartDate(e.target.value)}
                                        className="flex-1 p-2 sm:p-1 border rounded text-sm focus:ring-1 focus:ring-primary-400 outline-none"
                                    />
                                </div>
                            </div>
                            <div className="flex justify-end gap-2 pt-1 border-t border-neutral-100/50">
                                <button
                                    type="button"
                                    onClick={() => setShowAddForm(false)}
                                    className="px-4 py-3 sm:px-3 sm:py-1.5 text-xs font-medium text-neutral-500"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={!newGoalName.trim() || createGoal.isPending}
                                    className="px-4 py-3 sm:px-3 sm:py-1.5 bg-primary-500 text-white rounded-lg text-xs font-medium hover:bg-primary-600 shadow-sm"
                                >
                                    {createGoal.isPending ? 'Adding...' : 'Add Goal'}
                                </button>
                            </div>
                        </form>
                    )}
                </div>

                {/* Edit Existing Goal Section (Desktop) / Collapsible (Mobile) */}
                <div className="bg-white/40 rounded-xl p-3 border border-neutral-200">
                    <button
                        onClick={() => setIsEditCollapsibleOpen(!isEditCollapsibleOpen)}
                        className="w-full py-2 flex items-center justify-between gap-2 text-sm font-bold text-neutral-700 hover:text-primary-600 transition-colors"
                    >
                        <span className="flex items-center gap-2 text-left">
                            {isMobile ? (isEditCollapsibleOpen ? '▼' : '▶') : ''} Edit Existing Goal
                        </span>
                    </button>

                    {(isEditCollapsibleOpen || !isMobile) && (
                        <form onSubmit={handleEditStartDate} className="mt-3 space-y-3 animate-in fade-in slide-in-from-top-2 duration-200">
                            <div className="space-y-2">
                                <select
                                    value={editGoalId}
                                    onChange={(e) => {
                                        const id = e.target.value
                                        setEditGoalId(id)
                                        const goal = goals?.find(g => g.id === id)
                                        if (goal?.startDate) {
                                            setEditGoalStartDate(new Date(goal.startDate).toISOString().split('T')[0])
                                        }
                                    }}
                                    className="w-full p-3 sm:p-2 border rounded-lg text-base sm:text-sm bg-white/80 focus:ring-1 focus:ring-primary-400 outline-none"
                                >
                                    <option value="">Select a goal...</option>
                                    {goals?.filter(g => !g.deletedAt).map(g => (
                                        <option key={g.id} value={g.id}>{g.symbol} {g.name}</option>
                                    ))}
                                </select>

                                <div className="flex items-center gap-2">
                                    <label className="text-xs text-neutral-600 w-12 text-right">Start:</label>
                                    <input
                                        type="date"
                                        value={editGoalStartDate}
                                        max={new Date().toISOString().split('T')[0]}
                                        onChange={(e) => setEditGoalStartDate(e.target.value)}
                                        className="flex-1 p-3 sm:p-2 border rounded-lg text-base sm:text-sm bg-white/80 focus:ring-1 focus:ring-primary-400 outline-none"
                                    />
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={!editGoalId || updateGoal.isPending}
                                className="w-full py-3 sm:py-2 bg-primary-500 text-white rounded-lg text-sm font-medium hover:bg-primary-600 shadow-sm disabled:opacity-50 transition-all flex items-center justify-center min-h-[44px]"
                            >
                                {updateGoal.isPending ? 'Saving...' : 'Save Changes'}
                            </button>
                        </form>
                    )}
                </div>

                <div className="space-y-2">
                    {filteredGoals.length === 0 ? (
                        <p className="text-sm text-neutral-500 italic text-center py-4">No active goals</p>
                    ) : (
                        filteredGoals.map((goal) => (
                            <div
                                key={goal.id}
                                className="bg-white/50 rounded-xl p-3 sm:p-3 hover:bg-white/80 transition-all group border border-transparent hover:border-neutral-200"
                            >
                                {editingId === goal.id ? (
                                    <div className="space-y-3">
                                        <div className="flex gap-2 min-w-0 overflow-hidden">
                                            <input
                                                value={editSymbol}
                                                onFocus={(e) => e.target.select()}
                                                onMouseUp={(e) => {
                                                    e.preventDefault();
                                                    e.currentTarget.select();
                                                }}
                                                onChange={(e) => setEditSymbol(e.target.value)}
                                                className={`w-14 max-w-[3.5rem] min-w-0 p-2 text-center border rounded text-base sm:text-sm bg-white/80 focus:ring-1 focus:ring-primary-400 outline-none overflow-hidden text-ellipsis ${editSymbol ? 'caret-transparent' : ''}`}
                                                maxLength={8}
                                            />
                                            <input
                                                value={editName}
                                                onChange={(e) => setEditName(e.target.value)}
                                                className="flex-1 min-w-0 p-2 border rounded text-base sm:text-sm"
                                            />
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <label className="text-xs text-neutral-600">Target:</label>
                                            <input
                                                type="number"
                                                min="1"
                                                max="7"
                                                value={editTarget}
                                                onChange={(e) => setEditTarget(parseInt(e.target.value) || 7)}
                                                className="w-16 px-2 py-2 sm:py-1 border border-neutral-300 rounded text-sm"
                                            />
                                            <span className="text-xs text-neutral-500">/week</span>
                                        </div>
                                        <div className="flex justify-end gap-2">
                                            <button onClick={saveEdit} className="px-3 py-2 text-xs text-primary-600 font-black uppercase tracking-widest">Save</button>
                                            <button onClick={cancelEdit} className="px-3 py-2 text-xs text-neutral-500 font-black uppercase tracking-widest">Cancel</button>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="flex items-center justify-between min-h-[44px]">
                                        <div className="flex-1 cursor-pointer py-1" onClick={() => startEditing(goal)}>
                                            <p className="font-semibold text-neutral-800 text-sm sm:text-sm flex items-center gap-2">
                                                <span className="text-lg sm:text-base" role="button">{goal.symbol || ''}</span>
                                                {goal.name}
                                            </p>
                                            <p className="text-[10px] sm:text-xs text-neutral-500 mt-0.5">
                                                Target: <span className="font-bold text-neutral-600">{goal.weeklyTarget}</span>/week
                                            </p>
                                        </div>
                                        <button
                                            onClick={(e) => { e.stopPropagation(); triggerArchive(goal); }}
                                            className={`transition-all ${isTouch ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'} text-neutral-400 hover:text-red-500 z-10 flex items-center justify-center`}
                                            style={{ minWidth: 44, minHeight: 44, pointerEvents: 'auto' }}
                                            title="Archive goal"
                                        >
                                            <svg className="w-5 h-5 sm:w-4 sm:h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
                                            </svg>
                                        </button>
                                    </div>
                                )}
                            </div>
                        ))
                    )}
                </div>
            </div>

            <GoalArchiveModal
                isOpen={isArchiveModalOpen}
                onClose={() => setIsArchiveModalOpen(false)}
                onConfirm={handleArchiveConfirm}
                goalName={selectedGoal?.name || ''}
                isArchiving={isArchiving}
            />

            <ManageGoalsModal
                isOpen={showManageModal}
                onClose={() => setShowManageModal(false)}
            />
        </div >
    )
}
