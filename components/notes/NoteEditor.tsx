'use client'

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Note } from '@/hooks/useNotes'

interface NoteEditorProps {
    note: Note | null // null for new note
    onSave: (data: { title: string; content: string }) => void
    onCancel: () => void
    onDelete?: (id: string) => void
    isSaving: boolean
}

export default function NoteEditor({ note, onSave, onCancel, onDelete, isSaving }: NoteEditorProps) {
    const [title, setTitle] = useState(note?.title || '')
    const [content, setContent] = useState(note?.content || '')

    useEffect(() => {
        if (note) {
            setTitle(note.title)
            setContent(note.content)
        } else {
            setTitle('')
            setContent('')
        }
    }, [note])

    const handleSave = () => {
        if (!title.trim() || !content.trim()) return
        onSave({ title, content })
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="fixed inset-0 z-[100] bg-white lg:bg-black/20 lg:backdrop-blur-sm lg:flex lg:items-center lg:justify-center lg:p-6"
        >
            <div className="w-full h-full lg:h-auto lg:max-w-3xl lg:max-h-[85vh] bg-white lg:rounded-3xl lg:shadow-2xl overflow-hidden flex flex-col relative">
                {/* Header */}
                <header className="px-6 py-4 border-b border-neutral-100 flex items-center justify-between sticky top-0 bg-white z-10">
                    <button
                        onClick={onCancel}
                        className="p-2 hover:bg-neutral-100 rounded-lg text-neutral-500 transition-colors"
                    >
                        ✕
                    </button>
                    <h2 className="text-lg font-bold text-neutral-800">
                        {note ? 'Edit Note' : 'New Note'}
                    </h2>
                    <div className="flex items-center gap-2">
                        {note && onDelete && (
                            <button
                                onClick={() => onDelete(note.id)}
                                className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                                title="Delete Note"
                            >
                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                </svg>
                            </button>
                        )}
                        <button
                            onClick={handleSave}
                            disabled={isSaving || !title.trim() || !content.trim()}
                            className="bg-primary-600 hover:bg-primary-700 disabled:bg-neutral-200 text-white px-5 py-2 rounded-xl text-sm font-bold transition-all shadow-md active:scale-95"
                        >
                            {isSaving ? 'Saving...' : 'Save'}
                        </button>
                    </div>
                </header>

                {/* Editor Surface */}
                <div className="flex-1 overflow-y-auto p-6 space-y-4 pb-24">
                    <input
                        type="text"
                        placeholder="Untitled Note"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        className="w-full text-2xl sm:text-3xl font-black text-neutral-900 placeholder:text-neutral-200 outline-none border-none bg-transparent"
                        autoFocus
                    />
                    <textarea
                        placeholder="Tell your story..."
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        className="w-full h-full min-h-[300px] text-base sm:text-lg text-neutral-600 placeholder:text-neutral-300 outline-none border-none bg-transparent resize-none leading-relaxed"
                    />
                </div>

                {/* Mobile Sticky Save Button - Extra reinforcement */}
                <div className="lg:hidden fixed bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-white via-white to-white/0 z-20 pointer-events-none">
                    <div className="pointer-events-auto flex items-center gap-3">
                        <button
                            onClick={onCancel}
                            className="flex-1 bg-neutral-100 text-neutral-600 h-14 rounded-2xl font-bold transition-all"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleSave}
                            disabled={isSaving || !title.trim() || !content.trim()}
                            className="flex-[2] bg-primary-600 text-white h-14 rounded-2xl font-bold shadow-xl shadow-primary-500/20 transition-all active:scale-95 disabled:bg-neutral-200"
                        >
                            {isSaving ? 'Saving...' : 'Save Note'}
                        </button>
                    </div>
                </div>
            </div>
        </motion.div>
    )
}
