'use client'

import React, { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import { motion, AnimatePresence } from 'framer-motion'
import MigraineDiaryPanel from './MigraineDiaryPanel'

interface MigraineModalProps {
    isOpen: boolean
    onClose: () => void
    date: Date
    onEntrySaved?: () => void
}

export default function MigraineModal({ isOpen, onClose, date, onEntrySaved }: MigraineModalProps) {
    const [mounted, setMounted] = useState(false)

    useEffect(() => {
        setMounted(true)
        return () => setMounted(false)
    }, [])

    if (!mounted) return null

    return createPortal(
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-black/30 backdrop-blur-sm z-[70] flex items-center justify-center p-4"
                    />

                    {/* Modal Content */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        className="fixed inset-0 z-[70] pointer-events-none flex items-center justify-center p-4"
                    >
                        <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg pointer-events-auto h-auto max-h-[90vh] overflow-hidden flex flex-col">
                            {/* Header with Close Button */}
                            <div className="p-4 border-b border-neutral-100 flex justify-between items-center bg-white/80 backdrop-blur sticky top-0 z-10">
                                <h3 className="text-lg font-bold text-neutral-800">
                                    Migraine Diary
                                    <span className="text-sm font-normal text-neutral-500 ml-2">
                                        {date.toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' })}
                                    </span>
                                </h3>
                                <button
                                    onClick={onClose}
                                    className="p-2 hover:bg-neutral-100 rounded-lg transition-colors text-neutral-500 hover:text-neutral-700"
                                >
                                    ✕
                                </button>
                            </div>

                            {/* Scrollable Content */}
                            <div className="overflow-y-auto flex-1">
                                <MigraineDiaryPanel date={date} onSave={onEntrySaved} />
                            </div>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>,
        document.body
    )
}
