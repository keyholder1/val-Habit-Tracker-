'use client'

import { useState } from 'react'
import { Goal, useGoals } from '@/hooks/useGoals'

interface ManageGoalsModalProps {
    isOpen: boolean
    onClose: () => void
}

export default function ManageGoalsModal({ isOpen, onClose }: ManageGoalsModalProps) {
    const { goals, deleteGoalPermanently } = useGoals()
    const [deletingId, setDeletingId] = useState<string | null>(null)
    const [confirmId, setConfirmId] = useState<string | null>(null)
    const [error, setError] = useState<string | null>(null)
    const [successMsg, setSuccessMsg] = useState<string | null>(null)

    if (!isOpen) return null

    const activeGoals = goals?.filter(g => !g.deletedAt) || []

    const handleDeleteClick = (id: string) => {
        setError(null)
        setSuccessMsg(null)
        if (confirmId === id) {
            handleConfirmDelete(id)
        } else {
            setConfirmId(id)
            setTimeout(() => setConfirmId(prev => prev === id ? null : prev), 4000)
        }
    }

    const handleConfirmDelete = async (id: string) => {
        const goalName = activeGoals.find(g => g.id === id)?.name || 'Goal'
        setDeletingId(id)
        setError(null)
        setSuccessMsg(null)
        try {
            await deleteGoalPermanently.mutateAsync(id)
            setSuccessMsg(`"${goalName}" deleted permanently.`)
            setTimeout(() => setSuccessMsg(null), 3000)
        } catch (err: any) {
            console.error('Failed to delete goal:', err)
            setError(err?.message || 'Failed to delete goal. Please try again.')
        } finally {
            setDeletingId(null)
            setConfirmId(null)
        }
    }

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
            <div className="relative bg-white rounded-3xl shadow-2xl w-full max-w-2xl max-h-[85vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">

                {/* Header */}
                <div className="p-5 sm:p-6 border-b border-neutral-100 flex items-center justify-between bg-white text-neutral-900 flex-shrink-0">
                    <div>
                        <h2 className="text-xl font-bold">Manage Goals</h2>
                        <p className="text-sm text-neutral-500 mt-0.5">Permanently remove goals from your account.</p>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-3 hover:bg-neutral-100 rounded-full text-neutral-400 hover:text-neutral-600 transition-colors"
                        style={{ minWidth: 44, minHeight: 44 }}
                    >
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                {/* Feedback messages */}
                {error && (
                    <div className="mx-5 sm:mx-6 mt-4 p-3 bg-red-50 text-red-600 text-sm rounded-xl flex items-center gap-2 flex-shrink-0">
                        <svg className="w-5 h-5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        {error}
                    </div>
                )}
                {successMsg && (
                    <div className="mx-5 sm:mx-6 mt-4 p-3 bg-green-50 text-green-700 text-sm rounded-xl flex items-center gap-2 flex-shrink-0">
                        <svg className="w-5 h-5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        {successMsg}
                    </div>
                )}

                {/* Goal List */}
                <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-3" style={{ minHeight: 120 }}>
                    {activeGoals.length === 0 ? (
                        <div className="text-center py-12 text-neutral-400">
                            <p>No goals to manage.</p>
                        </div>
                    ) : (
                        activeGoals.map(goal => (
                            <div
                                key={goal.id}
                                className="flex flex-col p-4 bg-neutral-50 rounded-xl border border-neutral-100 hover:border-neutral-200 transition-all gap-3"
                            >
                                {/* Goal Info — always on its own row */}
                                <div className="flex items-center gap-3">
                                    <span className="text-2xl bg-white p-2 rounded-lg shadow-sm flex-shrink-0">{goal.symbol || '🎯'}</span>
                                    <div className="min-w-0 flex-1">
                                        <h3 className="font-semibold text-neutral-800 truncate">{goal.name}</h3>
                                        <div className="flex gap-2 text-xs text-neutral-500 mt-0.5">
                                            <span>Target: {goal.weeklyTarget}/week</span>
                                            <span>•</span>
                                            <span className={goal.isArchived ? 'text-amber-600 font-medium' : 'text-green-600 font-medium'}>
                                                {goal.isArchived ? 'Archived' : 'Active'}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                {/* Delete Button — always full width, on its own row, never overlaps */}
                                <button
                                    onClick={() => handleDeleteClick(goal.id)}
                                    disabled={deletingId === goal.id}
                                    style={{ minHeight: 44, pointerEvents: 'auto' }}
                                    className={`
                                        w-full px-5 py-3 font-medium text-sm rounded-xl transition-all border flex items-center justify-center gap-2
                                        ${confirmId === goal.id
                                            ? 'bg-red-600 text-white border-red-600 hover:bg-red-700 shadow-lg shadow-red-500/20'
                                            : 'bg-white text-neutral-600 border-neutral-200 hover:bg-red-50 hover:text-red-600 hover:border-red-200'}
                                        ${deletingId === goal.id ? 'opacity-50 cursor-not-allowed' : ''}
                                    `}
                                >
                                    {deletingId === goal.id ? (
                                        <span className="flex items-center gap-2">
                                            <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                                            </svg>
                                            Deleting...
                                        </span>
                                    ) : confirmId === goal.id ? (
                                        <>
                                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                            </svg>
                                            <span>Tap again to confirm</span>
                                        </>
                                    ) : (
                                        <>
                                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                            </svg>
                                            <span>Delete</span>
                                        </>
                                    )}
                                </button>
                            </div>
                        ))
                    )}
                </div>

                {/* Footer */}
                <div className="p-4 border-t border-neutral-100 bg-neutral-50/50 flex-shrink-0">
                    <button
                        onClick={onClose}
                        style={{ minHeight: 44 }}
                        className="w-full py-3 text-sm font-medium text-neutral-600 hover:text-neutral-800 rounded-xl hover:bg-neutral-100 transition-colors"
                    >
                        Done
                    </button>
                </div>
            </div>
        </div>
    )
}
