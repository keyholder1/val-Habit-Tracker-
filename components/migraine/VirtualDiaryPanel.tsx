'use client'

import React, { useEffect, useState, useRef, useCallback } from 'react'
import MigraineEntryCard from './MigraineEntryCard'

interface MigraineEntry {
    id: string
    date: string
    severity: number
    foodBefore: string | null
    foodAfterDay1: string | null
    foodAfterDay2: string | null
    foodAfterDay3: string | null
}

interface VirtualDiaryPanelProps {
    isOpen: boolean
    onClose: () => void
    onDateSelect: (date: Date) => void
    refreshTrigger?: number // Increment to reload
}

export default function VirtualDiaryPanel({ isOpen, onClose, onDateSelect, refreshTrigger = 0 }: VirtualDiaryPanelProps) {
    const [entries, setEntries] = useState<MigraineEntry[]>([])
    const [page, setPage] = useState(1)
    const [loading, setLoading] = useState(false)
    const [hasMore, setHasMore] = useState(true)
    const [total, setTotal] = useState(0)

    // Filters
    const [severityMin, setSeverityMin] = useState<number | ''>('')
    const [severityMax, setSeverityMax] = useState<number | ''>('')
    const [searchTerm, setSearchTerm] = useState('')

    const loadEntries = useCallback(async (pageNum: number, reset = false) => {
        if (loading) return // Prevent double fetch (though with StrictMode it might still happen, debounce helps)
        setLoading(true)
        try {
            const params = new URLSearchParams({
                page: pageNum.toString(),
                limit: '20'
            })
            if (severityMin !== '') params.append('severityMin', severityMin.toString())
            if (severityMax !== '') params.append('severityMax', severityMax.toString())
            if (searchTerm) params.append('search', searchTerm)

            const res = await fetch(`/api/migraines?${params.toString()}`)
            if (res.ok) {
                const data = await res.json()
                const newEntries = Array.isArray(data.entries) ? data.entries : []

                setEntries(prev => reset ? newEntries : [...prev, ...newEntries])
                setTotal(data.meta.total)
                setHasMore(newEntries.length === 20)
                setPage(pageNum)
            }
        } catch (error) {
            console.error('Failed to load history', error)
        } finally {
            setLoading(false)
        }
    }, [severityMin, severityMax, searchTerm]) // eslint-disable-line react-hooks/exhaustive-deps

    // Reset and load when filters change or panel opens or refreshTrigger changes
    useEffect(() => {
        if (isOpen) {
            loadEntries(1, true)
        }
    }, [isOpen, severityMin, severityMax, searchTerm, refreshTrigger]) // Added refreshTrigger dependency

    const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
        const { scrollTop, clientHeight, scrollHeight } = e.currentTarget
        if (scrollHeight - scrollTop <= clientHeight + 100 && hasMore && !loading) {
            loadEntries(page + 1)
        }
    }

    const handleDeleteEntry = async (entryId: string, date: string) => {
        if (!confirm('Are you sure you want to delete this entry?')) return

        setLoading(true)
        try {
            const res = await fetch(`/api/migraines/${date}`, {
                method: 'DELETE'
            })
            if (res.ok) {
                setEntries(prev => prev.filter(e => e.id !== entryId))
                setTotal(prev => prev - 1)
            } else {
                const data = await res.json()
                alert(data.error || 'Failed to delete entry')
            }
        } catch (error) {
            console.error('Failed to delete entry', error)
            alert('An unexpected error occurred')
        } finally {
            setLoading(false)
        }
    }

    // Close on escape
    useEffect(() => {
        const handleEsc = (e: KeyboardEvent) => {
            if (e.key === 'Escape') onClose()
        }
        window.addEventListener('keydown', handleEsc)
        return () => window.removeEventListener('keydown', handleEsc)
    }, [onClose])

    if (!isOpen) return null

    return (
        <div className="fixed inset-0 z-50 flex justify-end">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/20 backdrop-blur-sm transition-opacity"
                onClick={onClose}
            />

            {/* Panel */}
            <div className="relative w-full max-w-md bg-white h-full shadow-2xl flex flex-col animate-slide-in-right">
                {/* Header */}
                <div className="p-4 border-b border-neutral-100 flex items-center justify-between bg-white z-10">
                    <div>
                        <h2 className="text-xl font-bold text-neutral-800">Your History</h2>
                        <p className="text-xs text-neutral-500">{total} entries found</p>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-neutral-100 rounded-full transition-colors text-neutral-500"
                    >
                        ✕
                    </button>
                </div>

                {/* Filters */}
                <div className="p-4 border-b border-neutral-100 bg-neutral-50 space-y-3">
                    <input
                        type="text"
                        placeholder="Search triggers..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full px-3 py-2 text-sm border border-neutral-200 rounded-lg focus:ring-2 focus:ring-primary-400 outline-none"
                    />
                    <div className="flex gap-2 items-center">
                        <span className="text-xs font-semibold text-neutral-600">Severity:</span>
                        <input
                            type="number"
                            placeholder="Min"
                            min="0" max="10"
                            value={severityMin}
                            onChange={(e) => setSeverityMin(e.target.value ? parseInt(e.target.value) : '')}
                            className="w-16 px-2 py-1 text-sm border rounded"
                        />
                        <span className="text-neutral-400">-</span>
                        <input
                            type="number"
                            placeholder="Max"
                            min="0" max="10"
                            value={severityMax}
                            onChange={(e) => setSeverityMax(e.target.value ? parseInt(e.target.value) : '')}
                            className="w-16 px-2 py-1 text-sm border rounded"
                        />
                    </div>
                </div>

                {/* List */}
                <div
                    className="flex-1 overflow-y-auto p-4 space-y-3 bg-neutral-50/50"
                    onScroll={handleScroll}
                >
                    {(entries || []).map((entry) => (
                        <MigraineEntryCard
                            key={entry.id}
                            entry={entry}
                            onClick={() => {
                                const d = new Date(entry.date)
                                onDateSelect(d)
                                onClose()
                            }}
                            onDelete={() => handleDeleteEntry(entry.id, entry.date)}
                        />
                    ))}

                    {loading && (
                        <div className="py-4 text-center text-neutral-400 text-sm animate-pulse">
                            Loading history...
                        </div>
                    )}

                    {!loading && entries.length === 0 && (
                        <div className="py-10 text-center text-neutral-500">
                            <p>No entries found.</p>
                        </div>
                    )}

                    {!hasMore && entries.length > 0 && (
                        <div className="py-4 text-center text-neutral-400 text-xs">
                            End of history
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
