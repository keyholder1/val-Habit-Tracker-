'use client'

import React from 'react'
import { formatDistanceToNow } from 'date-fns'
import { Note } from '@/hooks/useNotes'

interface NoteCardProps {
    note: Note
    onEdit: (note: Note) => void
    onDelete: (id: string) => void
}

export default function NoteCard({ note, onEdit, onDelete }: NoteCardProps) {
    const previewContent = note.content.length > 100
        ? note.content.substring(0, 100) + '...'
        : note.content

    return (
        <div
            onClick={() => onEdit(note)}
            className="group glass rounded-2xl p-6 border border-white/40 shadow-sm hover:shadow-md transition-all cursor-pointer relative overflow-hidden flex flex-col gap-3"
        >
            <div className="absolute top-0 right-0 p-4 transform translate-x-2 -translate-y-2 group-hover:translate-x-0 group-hover:translate-y-0 transition-all opacity-0 group-hover:opacity-100">
                <button
                    onClick={(e) => {
                        e.stopPropagation()
                        onDelete(note.id)
                    }}
                    className="p-2 bg-red-50 text-red-500 hover:bg-red-100 rounded-lg transition-colors"
                    title="Delete Note"
                >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                </button>
            </div>

            <div className="flex flex-col gap-1">
                <h3 className="font-bold text-lg text-neutral-800 line-clamp-1 group-hover:text-primary-600 transition-colors">
                    {note.title}
                </h3>
                <p className="text-xs text-neutral-400 font-medium uppercase tracking-wider">
                    Updated {formatDistanceToNow(new Date(note.updatedAt), { addSuffix: true })}
                </p>
            </div>

            <p className="text-sm text-neutral-500 line-clamp-3 leading-relaxed">
                {previewContent}
            </p>

            <div className="mt-auto flex items-center gap-2 pt-2">
                <span className="text-[10px] font-bold text-primary-500 uppercase tracking-tighter bg-primary-50 px-2 py-0.5 rounded">
                    Open Note
                </span>
            </div>
        </div>
    )
}
