'use client'

import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'

interface BottomNavProps {
    activeView: 'week' | 'month'
    onViewChange: (view: 'week' | 'month') => void
    onDiaryToggle: () => void
}

export default function BottomNav({ activeView, onViewChange, onDiaryToggle }: BottomNavProps) {
    return (
        <motion.div
            initial={{ y: 100 }}
            animate={{ y: 0 }}
            className="lg:hidden fixed bottom-0 left-0 right-0 z-[60] safe-area-bottom pb-4 px-6"
        >
            <div className="glass rounded-2xl shadow-xl flex items-center justify-around p-3 border border-white/40">
                <button
                    onClick={() => onViewChange('week')}
                    className={`flex flex-col items-center gap-1 flex-1 transition-all ${activeView === 'week' ? 'text-primary-600 scale-110' : 'text-neutral-400'
                        }`}
                >
                    <span className="text-xl">🏠</span>
                    <span className="text-[10px] font-bold uppercase tracking-tighter">Home</span>
                </button>

                <button
                    onClick={() => onViewChange('month')}
                    className={`flex flex-col items-center gap-1 flex-1 transition-all ${activeView === 'month' ? 'text-primary-600 scale-110' : 'text-neutral-400'
                        }`}
                >
                    <span className="text-xl">📅</span>
                    <span className="text-[10px] font-bold uppercase tracking-tighter">Month</span>
                </button>

                <Link
                    href="/analytics"
                    className="flex flex-col items-center gap-1 flex-1 text-neutral-400 hover:text-primary-600 transition-all"
                >
                    <span className="text-xl">📊</span>
                    <span className="text-[10px] font-bold uppercase tracking-tighter">Stats</span>
                </Link>

                <Link
                    href="/notes"
                    className="flex flex-col items-center gap-1 flex-1 text-neutral-400 hover:text-primary-600 transition-all"
                >
                    <span className="text-xl">📝</span>
                    <span className="text-[10px] font-bold uppercase tracking-tighter">Notes</span>
                </Link>

                <button
                    onClick={onDiaryToggle}
                    className="flex flex-col items-center gap-1 flex-1 text-neutral-400 hover:text-primary-600 transition-all"
                >
                    <span className="text-xl">📖</span>
                    <span className="text-[10px] font-bold uppercase tracking-tighter">Diary</span>
                </button>
            </div>
        </motion.div>
    )
}
