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
    const [mode, setMode] = useState<'next-week' | 'this-week'>('next-week')

    if (!isOpen) return null

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
            <div className="relative bg-white rounded-3xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto flex flex-col p-5 sm:p-8 animate-in fade-in zoom-in-95 duration-300">
                <div className="flex items-center gap-3 mb-2">
                    <div className="p-2 rounded-xl bg-primary-50 text-primary-600">
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
                        </svg>
                    </div>
                    <h3 className="text-xl font-black text-neutral-800 tracking-tight">Archive Goal</h3>
                </div>

                <p className="text-neutral-600 mb-8 leading-relaxed">
                    Choose how to stop tracking <span className="font-bold text-neutral-900 border-b-2 border-primary-200">{goalName}</span>.
                </p>

                <div className="space-y-3 mb-6">
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
                </div>

                {/* Buttons — responsive: stack on mobile, inline on desktop */}
                <div className="flex flex-col-reverse sm:flex-row gap-3 sm:gap-4">
                    <button
                        onClick={onClose}
                        disabled={isArchiving}
                        style={{ minHeight: 48, pointerEvents: 'auto' }}
                        className="flex-1 px-4 py-4 bg-neutral-50 hover:bg-neutral-100 text-neutral-500 font-bold text-xs uppercase tracking-[0.2em] rounded-2xl transition-all disabled:opacity-50 border border-neutral-200/50"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={() => onConfirm(mode)}
                        disabled={isArchiving}
                        style={{ minHeight: 48, pointerEvents: 'auto' }}
                        className="flex-1 px-4 py-4 text-white font-black text-xs uppercase tracking-[0.2em] rounded-2xl transition-all shadow-xl disabled:opacity-50 bg-black hover:bg-neutral-800 shadow-neutral-500/10 hover:scale-[1.02] active:scale-[0.98]"
                    >
                        {isArchiving ? 'Wait...' : 'Confirm Archive'}
                    </button>
                </div>
            </div>
        </div>
    )
}
