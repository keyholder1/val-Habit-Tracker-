'use client'

import React, { useState, useEffect, useCallback, useRef } from 'react'
import AutoSaveIndicator from '@/components/ui/AutoSaveIndicator'

interface MigraineEntry {
    id: string
    date: string
    severity: number
    // type removed
    foodBefore: string | null
    foodAfterDay1: string | null
    foodAfterDay2: string | null
    foodAfterDay3: string | null
}

interface MigraineDiaryPanelProps {
    date: Date
    onSave?: () => void
}

// MIGRAINE_TYPES removed

export default function MigraineDiaryPanel({ date, onSave }: MigraineDiaryPanelProps) {
    const [entry, setEntry] = useState<Partial<MigraineEntry>>({
        severity: 0,
        // type removed
        foodBefore: '',
        foodAfterDay1: '',
        foodAfterDay2: '',
        foodAfterDay3: ''
    })
    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)
    const [lastSaved, setLastSaved] = useState<Date | null>(null)
    const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null)

    const dateIso = date.toISOString().split('T')[0]

    // Fetch entry when date changes
    useEffect(() => {
        let active = true
        const fetchEntry = async () => {
            setLoading(true)
            try {
                const res = await fetch(`/api/migraines/${dateIso}`)
                if (res.ok) {
                    const data = await res.json()
                    if (active) {
                        if (data) {
                            setEntry(data)
                        } else {
                            // Reset form for new entry - Explicitly set to defaults
                            setEntry({
                                severity: 0,
                                foodBefore: '',
                                foodAfterDay1: '',
                                foodAfterDay2: '',
                                foodAfterDay3: ''
                            })
                        }
                    }
                }
            } catch (err) {
                console.error('Failed to load migraine entry', err)
            } finally {
                if (active) setLoading(false)
            }
        }
        fetchEntry()
        return () => { active = false }
    }, [dateIso])

    const handleSave = useCallback(async () => {
        setSaving(true)
        try {
            const res = await fetch('/api/migraines', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    date: date.toISOString(), // Fix: Send full ISO string for z.datetime() validation
                    ...entry
                })
            })
            if (res.ok) {
                const saved = await res.json()
                setEntry(saved)
                setLastSaved(new Date())
                if (onSave) onSave() // Trigger parent refresh
            }
        } catch (err) {
            console.error('Failed to save', err)
        } finally {
            setSaving(false)
        }
    }, [dateIso, entry, onSave])

    const handleChange = (field: keyof MigraineEntry, value: any) => {
        setEntry(prev => ({ ...prev, [field]: value }))
    }

    if (loading) {
        return <div className="animate-pulse p-6 space-y-4">
            <div className="h-8 bg-neutral-100 rounded w-1/2"></div>
            <div className="h-24 bg-neutral-100 rounded"></div>
            <div className="h-24 bg-neutral-100 rounded"></div>
        </div>
    }

    return (
        <div className="glass rounded-2xl shadow-soft p-6 h-full flex flex-col overflow-y-auto relative">
            <AutoSaveIndicator content={entry.foodBefore || ''} />
            <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-neutral-800 flex items-center gap-2">
                    🧠 Migraine Diary
                </h3>
                <div className="text-xs text-neutral-400 font-medium">
                    {lastSaved ? `Last saved: ${lastSaved.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}` : ''}
                </div>
            </div>

            <div className="space-y-8 flex-1">
                {/* Severity */}
                <div className="space-y-4">
                    <label className="text-sm sm:text-base font-semibold text-neutral-700 flex justify-between">
                        Severity Level
                        <span className={`px-2 py-0.5 rounded text-xs sm:text-sm font-bold ${(entry.severity || 0) > 7 ? 'bg-red-100 text-red-700' :
                            (entry.severity || 0) > 4 ? 'bg-orange-100 text-orange-700' :
                                (entry.severity || 0) > 0 ? 'bg-green-100 text-green-700' : 'bg-neutral-100 text-neutral-500'
                            }`}>
                            {entry.severity || 0} / 10
                        </span>
                    </label>
                    <div className="px-1 py-4 sm:py-0">
                        <input
                            type="range"
                            min="0"
                            max="10"
                            step="1"
                            value={entry.severity || 0}
                            onChange={(e) => handleChange('severity', parseInt(e.target.value))}
                            className="w-full h-4 sm:h-2 accent-primary-600 bg-neutral-200 rounded-lg appearance-none cursor-pointer"
                        />
                    </div>
                    <div className="flex justify-between text-[10px] sm:text-xs text-neutral-400 font-medium px-1">
                        <span>None</span>
                        <span>Mild</span>
                        <span>Moderate</span>
                        <span>Severe</span>
                    </div>
                </div>

                {/* Food Tracking */}
                <div className="space-y-6 pt-4 border-t border-neutral-100">
                    <div className="space-y-2">
                        <label className="text-sm font-semibold text-neutral-700 block">
                            Food Before Migraine
                            <span className="text-xs font-normal text-neutral-400 ml-2">(Triggers?)</span>
                        </label>
                        <textarea
                            value={entry.foodBefore || ''}
                            onChange={(e) => handleChange('foodBefore', e.target.value)}
                            placeholder="What did you eat before the migraine started?"
                            className="w-full p-3 text-sm border border-neutral-200 rounded-xl focus:ring-2 focus:ring-primary-100 focus:border-primary-400 outline-none transition-all min-h-[80px] resize-none"
                        />
                    </div>

                    <div className="space-y-3">
                        <label className="text-sm font-semibold text-neutral-700 block">
                            Post-Migraine Food
                            <span className="text-xs font-normal text-neutral-400 ml-2">(Cravings/Recovery)</span>
                        </label>

                        <div className="grid grid-cols-1 gap-3">
                            <input
                                type="text"
                                value={entry.foodAfterDay1 || ''}
                                onChange={(e) => handleChange('foodAfterDay1', e.target.value)}
                                placeholder="Day 1 (Immediate)"
                                className="w-full px-4 py-3 sm:px-3 sm:py-2 text-base sm:text-sm border border-neutral-200 rounded-lg sm:rounded-lg focus:border-primary-400 outline-none"
                            />
                            <input
                                type="text"
                                value={entry.foodAfterDay2 || ''}
                                onChange={(e) => handleChange('foodAfterDay2', e.target.value)}
                                placeholder="Day 2"
                                className="w-full px-4 py-3 sm:px-3 sm:py-2 text-base sm:text-sm border border-neutral-200 rounded-lg sm:rounded-lg focus:border-primary-400 outline-none"
                            />
                            <input
                                type="text"
                                value={entry.foodAfterDay3 || ''}
                                onChange={(e) => handleChange('foodAfterDay3', e.target.value)}
                                placeholder="Day 3"
                                className="w-full px-4 py-3 sm:px-3 sm:py-2 text-base sm:text-sm border border-neutral-200 rounded-lg sm:rounded-lg focus:border-primary-400 outline-none"
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* Save Button Container */}
            <div className="mt-8 pt-6 border-t border-neutral-100">
                <button
                    onClick={handleSave}
                    disabled={saving}
                    className={`w-full py-4 rounded-xl font-bold text-white shadow-lg transition-all flex items-center justify-center gap-2 ${saving ? 'bg-neutral-400 cursor-not-allowed' : 'bg-primary-600 hover:bg-primary-700 active:scale-[0.98] shadow-primary-200'
                        }`}
                >
                    {saving ? (
                        <>
                            <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            Saving...
                        </>
                    ) : (
                        <>
                            <span>💾</span>
                            Save Entry
                        </>
                    )}
                </button>
            </div>
        </div>
    )
}
