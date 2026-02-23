'use client'

import { useState, useEffect, useRef, useCallback, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import { useDevice } from '@/components/providers/DeviceProvider'

interface CommandOption {
    id: string
    label: string
    icon: string
    action: () => void
}

interface QuickCommandPaletteProps {
    showMigraineFeatures: boolean
    showProjectFeatures: boolean
    onToggleViewMode: (mode: 'month' | 'week') => void
    onOpenMigraineDiary?: () => void
    onOpenProjectDiary?: () => void
}

export default function QuickCommandPalette({
    showMigraineFeatures,
    showProjectFeatures,
    onToggleViewMode,
    onOpenMigraineDiary,
    onOpenProjectDiary,
}: QuickCommandPaletteProps) {
    const { isDesktop, isHydrated } = useDevice()
    const router = useRouter()
    const [isOpen, setIsOpen] = useState(false)
    const [query, setQuery] = useState('')
    const [selectedIndex, setSelectedIndex] = useState(0)
    const inputRef = useRef<HTMLInputElement>(null)
    const listRef = useRef<HTMLUListElement>(null)

    const options = useMemo<CommandOption[]>(() => {
        const base: CommandOption[] = [
            { id: 'dashboard', label: 'Dashboard', icon: '🏠', action: () => router.push('/dashboard') },
            { id: 'analytics', label: 'Analytics', icon: '📊', action: () => router.push('/analytics') },
            { id: 'notes', label: 'Notes', icon: '📝', action: () => router.push('/notes') },
            { id: 'month-view', label: 'Month View', icon: '📅', action: () => onToggleViewMode('month') },
            { id: 'week-view', label: 'Week View', icon: '📆', action: () => onToggleViewMode('week') },
        ]
        if (showMigraineFeatures) {
            base.push({ id: 'migraine-diary', label: 'Migraine Diary', icon: '🧠', action: () => onOpenMigraineDiary?.() })
        }
        if (showProjectFeatures) {
            base.push({ id: 'project-diary', label: 'Project Diary', icon: '🚀', action: () => onOpenProjectDiary?.() })
        }
        return base
    }, [showMigraineFeatures, showProjectFeatures, router, onToggleViewMode, onOpenMigraineDiary, onOpenProjectDiary])

    const filtered = useMemo(() => {
        if (!query.trim()) return options
        const q = query.toLowerCase()
        return options.filter(o => o.label.toLowerCase().includes(q))
    }, [query, options])

    // Reset selection when filtered list changes
    useEffect(() => {
        setSelectedIndex(0)
    }, [filtered.length])

    // Global Ctrl/Cmd+K listener
    const handleGlobalKeyDown = useCallback((e: KeyboardEvent) => {
        if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
            e.preventDefault()
            setIsOpen(prev => !prev)
            setQuery('')
            setSelectedIndex(0)
        }
    }, [])

    useEffect(() => {
        window.addEventListener('keydown', handleGlobalKeyDown)
        return () => window.removeEventListener('keydown', handleGlobalKeyDown)
    }, [handleGlobalKeyDown])

    // Auto-focus input when opened
    useEffect(() => {
        if (isOpen) {
            requestAnimationFrame(() => inputRef.current?.focus())
        }
    }, [isOpen])

    const selectOption = useCallback((option: CommandOption) => {
        setIsOpen(false)
        setQuery('')
        option.action()
    }, [])

    const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
        switch (e.key) {
            case 'ArrowDown':
                e.preventDefault()
                setSelectedIndex(i => (i + 1) % filtered.length)
                break
            case 'ArrowUp':
                e.preventDefault()
                setSelectedIndex(i => (i - 1 + filtered.length) % filtered.length)
                break
            case 'Enter':
                e.preventDefault()
                if (filtered[selectedIndex]) selectOption(filtered[selectedIndex])
                break
            case 'Escape':
                e.preventDefault()
                setIsOpen(false)
                break
        }
    }, [filtered, selectedIndex, selectOption])

    // Scroll selected item into view
    useEffect(() => {
        if (!listRef.current) return
        const selected = listRef.current.children[selectedIndex] as HTMLElement
        selected?.scrollIntoView({ block: 'nearest' })
    }, [selectedIndex])

    // Desktop-only guard
    if (!isHydrated || !isDesktop) return null
    if (!isOpen) return null

    return (
        <div className="hidden lg:block">
            <div
                className="fixed inset-0 z-[90] flex items-start justify-center pt-[20vh]"
                role="dialog"
                aria-modal="true"
                aria-label="Quick Command Palette"
            >
                {/* Backdrop */}
                <div
                    className="absolute inset-0 bg-black/40 backdrop-blur-sm"
                    onClick={() => setIsOpen(false)}
                />

                {/* Palette card */}
                <div
                    className="relative z-10 w-full max-w-[480px] mx-4 bg-white rounded-2xl shadow-2xl border border-neutral-200/60 overflow-hidden"
                    onKeyDown={handleKeyDown}
                >
                    {/* Search input */}
                    <div className="flex items-center gap-3 px-4 py-3 border-b border-neutral-100">
                        <svg className="w-5 h-5 text-neutral-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                        <input
                            ref={inputRef}
                            type="text"
                            value={query}
                            onChange={e => setQuery(e.target.value)}
                            placeholder="Type a command…"
                            className="flex-1 text-sm text-neutral-800 placeholder:text-neutral-400 outline-none bg-transparent"
                            aria-label="Search commands"
                        />
                        <kbd className="hidden sm:inline-flex px-1.5 py-0.5 text-[10px] font-mono text-neutral-400 bg-neutral-100 rounded border border-neutral-200">
                            ESC
                        </kbd>
                    </div>

                    {/* Options list */}
                    <ul ref={listRef} className="max-h-[300px] overflow-y-auto py-2" role="listbox">
                        {filtered.length === 0 ? (
                            <li className="px-4 py-6 text-sm text-neutral-400 text-center">
                                No results found
                            </li>
                        ) : (
                            filtered.map((option, index) => (
                                <li
                                    key={option.id}
                                    role="option"
                                    aria-selected={index === selectedIndex}
                                    onClick={() => selectOption(option)}
                                    onMouseEnter={() => setSelectedIndex(index)}
                                    className={`flex items-center gap-3 px-4 py-2.5 cursor-pointer transition-colors text-sm ${index === selectedIndex
                                            ? 'bg-primary-50 text-primary-700'
                                            : 'text-neutral-700 hover:bg-neutral-50'
                                        }`}
                                >
                                    <span className="text-base">{option.icon}</span>
                                    <span className="font-medium">{option.label}</span>
                                    {index === selectedIndex && (
                                        <span className="ml-auto text-[10px] text-neutral-400 font-mono">↵</span>
                                    )}
                                </li>
                            ))
                        )}
                    </ul>

                    {/* Footer */}
                    <div className="px-4 py-2 border-t border-neutral-100 flex items-center gap-4 text-[10px] text-neutral-400">
                        <span className="flex items-center gap-1">
                            <kbd className="px-1 py-0.5 bg-neutral-100 rounded border border-neutral-200 font-mono">↑↓</kbd> navigate
                        </span>
                        <span className="flex items-center gap-1">
                            <kbd className="px-1 py-0.5 bg-neutral-100 rounded border border-neutral-200 font-mono">↵</kbd> select
                        </span>
                        <span className="flex items-center gap-1">
                            <kbd className="px-1 py-0.5 bg-neutral-100 rounded border border-neutral-200 font-mono">esc</kbd> close
                        </span>
                    </div>
                </div>
            </div>
        </div>
    )
}
