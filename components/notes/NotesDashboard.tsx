'use client'

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useNotes, Note } from '@/hooks/useNotes'
import NoteCard from './NoteCard'
import NoteEditor from './NoteEditor'
import { useSession, signOut } from 'next-auth/react'
import Link from 'next/link'
import { useDevice } from '@/components/providers/DeviceProvider'
import BottomNav from '@/components/navigation/BottomNav'

export default function NotesDashboard() {
    const { notes, isLoading, createNote, updateNote, deleteNote } = useNotes()
    const { data: session } = useSession()
    const { isMobile } = useDevice()
    const [editingNote, setEditingNote] = useState<Note | null>(null)
    const [isEditorOpen, setIsEditorOpen] = useState(false)

    const handleCreateNote = async (data: { title: string; content: string }) => {
        await createNote.mutateAsync(data)
        setIsEditorOpen(false)
    }

    const handleUpdateNote = async (data: { title: string; content: string }) => {
        if (!editingNote) return
        await updateNote.mutateAsync({ id: editingNote.id, data })
        setIsEditorOpen(false)
        setEditingNote(null)
    }

    const handleDeleteNote = async (id: string) => {
        if (confirm('Are you sure you want to delete this note?')) {
            await deleteNote.mutateAsync(id)
            if (editingNote?.id === id) {
                setIsEditorOpen(false)
                setEditingNote(null)
            }
        }
    }

    const openEditor = (note: Note | null = null) => {
        setEditingNote(note)
        setIsEditorOpen(true)
    }

    return (
        <div className="min-h-screen relative flex flex-col bg-transparent">
            {/* Header - Matching DashboardLayout */}
            <header className="glass border-b border-neutral-200/50 sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
                    <div className="flex items-center gap-4 sm:gap-8">
                        <Link href="/dashboard" className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent">
                            Habit Tracker
                        </Link>
                        <h1 className="hidden sm:block text-lg font-medium text-neutral-400">/</h1>
                        <h1 className="text-lg font-bold text-neutral-800">Journal</h1>
                    </div>

                    <nav className="flex items-center gap-6">
                        <Link
                            href="/dashboard"
                            className="hidden sm:block text-neutral-700 hover:text-primary-600 font-medium transition-colors"
                        >
                            Dashboard
                        </Link>
                        <Link
                            href="/analytics"
                            className="text-neutral-700 hover:text-primary-600 font-medium transition-colors"
                        >
                            Analytics
                        </Link>
                        <button
                            onClick={() => signOut({ callbackUrl: '/login' })}
                            className="hidden sm:block px-4 py-2 bg-neutral-100 hover:bg-neutral-200 rounded-lg text-sm font-medium transition-colors"
                        >
                            Sign Out
                        </button>
                    </nav>
                </div>
            </header>

            <main className="flex-1 max-w-5xl w-full mx-auto px-4 sm:px-6 py-8 pb-32 lg:pb-12 relative z-10">
                <div className="flex flex-col gap-8">
                    {/* Top Section */}
                    <div className="flex items-center justify-between">
                        <div className="flex flex-col">
                            <h2 className="text-3xl sm:text-4xl font-black text-neutral-900 tracking-tight">
                                Your Notes
                            </h2>
                            <p className="text-neutral-500 font-medium mt-1">
                                Capture your thoughts and reflections
                            </p>
                        </div>
                        <button
                            onClick={() => openEditor()}
                            className="bg-primary-600 hover:bg-primary-700 text-white p-3 sm:px-6 sm:py-3 rounded-2xl sm:rounded-xl font-bold flex items-center gap-2 transition-all shadow-lg shadow-primary-500/20 active:scale-95"
                        >
                            <span className="text-xl leading-none">+</span>
                            <span className="hidden sm:inline">New Note</span>
                        </button>
                    </div>

                    {/* Notes List */}
                    {isLoading ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                            {[1, 2, 3].map(i => (
                                <div key={i} className="glass rounded-2xl h-48 animate-pulse" />
                            ))}
                        </div>
                    ) : notes?.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-20 text-center">
                            <div className="w-20 h-20 bg-neutral-50 rounded-full flex items-center justify-center text-4xl mb-4">
                                📝
                            </div>
                            <h3 className="text-xl font-bold text-neutral-800">No notes yet</h3>
                            <p className="text-neutral-500 mt-2 max-w-xs">
                                Start your journal by clicking the "New Note" button above.
                            </p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                            {notes?.map(note => (
                                <NoteCard
                                    key={note.id}
                                    note={note}
                                    onEdit={openEditor}
                                    onDelete={handleDeleteNote}
                                />
                            ))}
                        </div>
                    )}
                </div>
            </main>

            {/* Editor Overlay */}
            <AnimatePresence>
                {isEditorOpen && (
                    <NoteEditor
                        note={editingNote}
                        onSave={editingNote ? handleUpdateNote : handleCreateNote}
                        onCancel={() => setIsEditorOpen(false)}
                        onDelete={editingNote ? handleDeleteNote : undefined}
                        isSaving={createNote.isPending || updateNote.isPending}
                    />
                )}
            </AnimatePresence>

            {/* Mobile Navigation */}
            {isMobile && (
                <BottomNav
                    activeView="week" // dummy value, we'll need to handle this if we want it to work as expected
                    onViewChange={(v) => {
                        // If we are in notes, home/month should take us back to dashboard
                        window.location.href = '/dashboard'
                    }}
                    onDiaryToggle={() => {
                        // Toggle something or just stay here?
                    }}
                />
            )}
        </div>
    )
}
