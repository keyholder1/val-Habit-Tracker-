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
            <div className="relative bg-white rounded-3xl shadow-2xl w-full max-w-md p-6 sm:p-8 overflow-hidden animate-in fade-in zoom-in-95 duration-300">
                <div className="flex items-center gap-3 mb-2">
                    <div className={`p-2 rounded-xl ${mode === 'delete' ? 'bg-red-50 text-red-600' : 'bg-primary-50 text-primary-600'}`}>
                        {mode === 'delete' ? (
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                        ) : (
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
                            </svg>
                        )}
                    </div>
                    <h3 className="text-xl font-black text-neutral-800 tracking-tight">Manage Goal</h3>
                </div>

                <p className="text-neutral-600 mb-8 leading-relaxed">
                    Choose how to stop tracking <span className="font-bold text-neutral-900 border-b-2 border-primary-200">{goalName}</span>.
                </p>

                <div className="space-y-3 mb-10">
                    {/* Option 1: Next Week */}
                    <label className={`
                        flex items-start gap-3 p-4 rounded-2xl border-2 cursor-pointer transition-all duration-300
                        ${mode === 'next-week' ? 'border-primary-500 bg-primary-50 shadow-sm' : 'border-neutral-100 bg-neutral-50/50 hover:border-neutral-200'}
                    `}>
                        <input
                            type="radio"
                            name="archiveMode"
                            checked={mode === 'next-week'}
                            onChange={() => setMode('next-week')}
                            className="mt-1 w-4 h-4 text-primary-600 border-neutral-300 focus:ring-primary-500"
                        />
                        <div>
                            <span className="block font-bold text-neutral-800 text-sm">Stop from <span className="text-primary-600">Next Week</span></span>
                            <span className="block text-xs text-neutral-500 mt-1 leading-normal">
                                Finishes this week's progress. Stops appearing next Monday.
                            </span>
                        </div>
                    </label>

                    {/* Option 2: This Week */}
                    <label className={`
                        flex items-start gap-3 p-4 rounded-2xl border-2 cursor-pointer transition-all duration-300
                        ${mode === 'this-week' ? 'border-amber-500 bg-amber-50 shadow-sm' : 'border-neutral-100 bg-neutral-50/50 hover:border-neutral-200'}
                    `}>
                        <input
                            type="radio"
                            name="archiveMode"
                            checked={mode === 'this-week'}
                            onChange={() => setMode('this-week')}
                            className="mt-1 w-4 h-4 text-amber-600 border-neutral-300 focus:ring-amber-500"
                        />
                        <div>
                            <span className="block font-bold text-neutral-800 text-sm">Stop from <span className="text-amber-600">This Week</span></span>
                            <span className="block text-xs text-neutral-500 mt-1 leading-normal">
                                Hides immediately. Existing logs are archived safely.
                            </span>
                        </div>
                    </label>

                    {/* Option 3: Delete */}
                    <label className={`
                        flex items-start gap-3 p-4 rounded-2xl border-2 cursor-pointer transition-all duration-300
                        ${mode === 'delete' ? 'border-red-500 bg-red-50 shadow-md ring-1 ring-red-200' : 'border-neutral-100 bg-neutral-50/50 hover:border-red-100'}
                    `}>
                        <input
                            type="radio"
                            name="archiveMode"
                            checked={mode === 'delete'}
                            onChange={() => setMode('delete')}
                            className="mt-1 w-4 h-4 text-red-600 border-neutral-300 focus:ring-red-500"
                        />
                        <div>
                            <span className="block font-bold text-red-700 text-sm italic uppercase tracking-wider">Delete Permanently</span>
                            <span className="block text-xs text-red-600/70 mt-1 leading-normal font-medium">
                                ⚠️ Removes goal history from all standard views.
                            </span>
                        </div>
                    </label>
                </div>

                <div className="flex gap-4">
                    <button
                        onClick={onClose}
                        disabled={isArchiving}
                        className="flex-1 px-4 py-4 bg-neutral-50 hover:bg-neutral-100 text-neutral-500 font-bold text-xs uppercase tracking-[0.2em] rounded-2xl transition-all disabled:opacity-50 border border-neutral-200/50"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={() => onConfirm(mode)}
                        disabled={isArchiving}
                        className={`
                            flex-1 px-4 py-4 text-white font-black text-xs uppercase tracking-[0.2em] rounded-2xl transition-all shadow-xl disabled:opacity-50
                            ${mode === 'delete'
                                ? 'bg-red-600 hover:bg-red-700 shadow-red-500/20 hover:scale-[1.02] active:scale-[0.98]'
                                : 'bg-black hover:bg-neutral-800 shadow-neutral-500/10 hover:scale-[1.02] active:scale-[0.98]'
                            }
                        `}
                    >
                        {isArchiving ? 'Wait...' : (mode === 'delete' ? 'Confirm Delete' : 'Confirm Archive')}
                    </button>
                </div>
            </div>
        </div>
    )
}
