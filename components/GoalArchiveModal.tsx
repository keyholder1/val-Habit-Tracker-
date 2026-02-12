'use client'

import { useState } from 'react'

interface GoalArchiveModalProps {
    isOpen: boolean
    onClose: () => void
    onConfirm: (mode: 'next-week' | 'this-week' | 'delete') => void
    goalName: string
    isArchiving: boolean
}

export default function GoalArchiveModal({ isOpen, onClose, onConfirm, goalName, isArchiving }: GoalArchiveModalProps) {
    const [mode, setMode] = useState<'next-week' | 'this-week' | 'delete'>('next-week')

    if (!isOpen) return null

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
            <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-md p-6 overflow-hidden">
                <h3 className="text-xl font-bold text-neutral-800 mb-2">Archive Goal</h3>
                <p className="text-neutral-600 mb-6">
                    How would you like to stop tracking <span className="font-semibold text-primary-600">{goalName}</span>?
                </p>

                <div className="space-y-3 mb-8">
                    {/* Option 1: Next Week */}
                    <label className={`
                        flex items-start gap-3 p-4 rounded-xl border-2 cursor-pointer transition-all
                        ${mode === 'next-week' ? 'border-primary-500 bg-primary-50/50' : 'border-neutral-200 hover:border-neutral-300'}
                    `}>
                        <input
                            type="radio"
                            name="archiveMode"
                            checked={mode === 'next-week'}
                            onChange={() => setMode('next-week')}
                            className="mt-1 w-4 h-4 text-primary-600 border-neutral-300 focus:ring-primary-500"
                        />
                        <div>
                            <span className="block font-medium text-neutral-800">Stop tracking from <span className="text-primary-600">Next Week</span></span>
                            <span className="block text-sm text-neutral-500 mt-1">
                                Keeps all history and this week's progress. Simply stops appearing starting next Monday.
                            </span>
                        </div>
                    </label>

                    {/* Option 2: This Week */}
                    <label className={`
                        flex items-start gap-3 p-4 rounded-xl border-2 cursor-pointer transition-all
                        ${mode === 'this-week' ? 'border-primary-500 bg-primary-50/50' : 'border-neutral-200 hover:border-neutral-300'}
                    `}>
                        <input
                            type="radio"
                            name="archiveMode"
                            checked={mode === 'this-week'}
                            onChange={() => setMode('this-week')}
                            className="mt-1 w-4 h-4 text-primary-600 border-neutral-300 focus:ring-primary-500"
                        />
                        <div>
                            <span className="block font-medium text-neutral-800">Stop tracking from <span className="text-amber-600">This Week</span></span>
                            <span className="block text-sm text-neutral-500 mt-1">
                                Removes from current view. Historical data remains safe.
                            </span>
                        </div>
                    </label>

                    {/* Option 3: Delete */}
                    <label className={`
                        flex items-start gap-3 p-4 rounded-xl border-2 cursor-pointer transition-all
                        ${mode === 'delete' ? 'border-red-500 bg-red-50/50' : 'border-neutral-200 hover:border-red-200'}
                    `}>
                        <input
                            type="radio"
                            name="archiveMode"
                            checked={mode === 'delete'}
                            onChange={() => setMode('delete')}
                            className="mt-1 w-4 h-4 text-red-600 border-neutral-300 focus:ring-red-500"
                        />
                        <div>
                            <span className="block font-medium text-red-700">Delete Permanently</span>
                            <span className="block text-sm text-red-600/70 mt-1">
                                <b>Warning:</b> This effectively removes the goal. Historical data is preserved in database but hidden from all views.
                            </span>
                        </div>
                    </label>
                </div>

                <div className="flex gap-3">
                    <button
                        onClick={onClose}
                        disabled={isArchiving}
                        className="flex-1 px-4 py-3 bg-neutral-100 hover:bg-neutral-200 text-neutral-700 font-medium rounded-xl transition-colors disabled:opacity-50"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={() => onConfirm(mode)}
                        disabled={isArchiving}
                        className={`
                            flex-1 px-4 py-3 text-white font-medium rounded-xl transition-colors shadow-lg disabled:opacity-50
                            ${mode === 'delete'
                                ? 'bg-red-600 hover:bg-red-700 shadow-red-500/20'
                                : 'bg-primary-600 hover:bg-primary-700 shadow-primary-500/20'
                            }
                        `}
                    >
                        {isArchiving ? 'Processing...' : (mode === 'delete' ? 'Delete Goal' : 'Archive Goal')}
                    </button>
                </div>
            </div>
        </div>
    )
}
