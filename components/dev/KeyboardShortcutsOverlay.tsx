'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { useDevice } from '@/components/providers/DeviceProvider'

const SHORTCUTS = [
    { key: 'D', action: 'Dashboard' },
    { key: 'A', action: 'Analytics' },
    { key: 'N', action: 'Notes' },
    { key: 'Esc', action: 'Close Panels' },
    { key: '?', action: 'This Cheatsheet' },
]

function isEditableTarget(el: Element | null): boolean {
    if (!el) return false
    const tag = el.tagName
    if (tag === 'INPUT' || tag === 'TEXTAREA') return true
    if ((el as HTMLElement).isContentEditable) return true
    return false
}

export default function KeyboardShortcutsOverlay() {
    const { isDesktop, isTouch, isHydrated } = useDevice()
    const [isOpen, setIsOpen] = useState(false)
    const panelRef = useRef<HTMLDivElement>(null)

    // Environment guard: dev-only OR explicit flag
    const isDev =
        process.env.NODE_ENV !== 'production' ||
        process.env.NEXT_PUBLIC_SHOW_DEV_BADGE === 'true'

    const handleKeyDown = useCallback(
        (e: KeyboardEvent) => {
            // Ignore when typing in editable fields
            if (isEditableTarget(document.activeElement)) return

            if (e.key === '?') {
                e.preventDefault()
                setIsOpen((prev) => !prev)
                return
            }

            if (e.key === 'Escape') {
                setIsOpen(false)
            }
        },
        []
    )

    useEffect(() => {
        if (!isDev) return
        window.addEventListener('keydown', handleKeyDown)
        return () => window.removeEventListener('keydown', handleKeyDown)
    }, [handleKeyDown, isDev])

    // Focus trap: focus the panel when opened
    useEffect(() => {
        if (isOpen && panelRef.current) {
            panelRef.current.focus()
        }
    }, [isOpen])

    // Guards: environment, hydration, desktop, non-touch
    if (!isDev) return null
    if (!isHydrated || !isDesktop || isTouch) return null
    if (!isOpen) return null

    return (
        <div className="hidden lg:block">
            {/* Fullscreen overlay */}
            <div
                className="fixed inset-0 z-[70] flex items-center justify-center"
                role="dialog"
                aria-modal="true"
                aria-label="Keyboard Shortcuts"
            >
                {/* Backdrop */}
                <div
                    className="absolute inset-0 bg-black/50 backdrop-blur-sm"
                    onClick={() => setIsOpen(false)}
                />

                {/* Content card */}
                <div
                    ref={panelRef}
                    tabIndex={-1}
                    className="relative z-10 w-full max-w-sm mx-4 bg-neutral-900/95 backdrop-blur-md border border-white/10 rounded-2xl shadow-2xl p-6 outline-none"
                    onKeyDown={(e) => {
                        if (e.key === 'Escape') {
                            e.stopPropagation()
                            setIsOpen(false)
                        }
                    }}
                >
                    {/* Header */}
                    <div className="flex items-center justify-between mb-5">
                        <h2 className="text-sm font-bold uppercase tracking-widest text-neutral-300">
                            Keyboard Shortcuts
                        </h2>
                        <button
                            onClick={() => setIsOpen(false)}
                            className="text-neutral-500 hover:text-white transition-colors text-lg leading-none p-1"
                            aria-label="Close shortcuts overlay"
                        >
                            ✕
                        </button>
                    </div>

                    {/* Shortcut list */}
                    <ul className="space-y-3">
                        {SHORTCUTS.map(({ key, action }) => (
                            <li
                                key={key}
                                className="flex items-center justify-between text-sm"
                            >
                                <span className="text-neutral-400">{action}</span>
                                <kbd className="min-w-[2rem] text-center px-2 py-0.5 bg-white/10 border border-white/15 rounded-md text-xs font-mono text-neutral-200 shadow-sm">
                                    {key}
                                </kbd>
                            </li>
                        ))}
                    </ul>

                    {/* Footer hint */}
                    <div className="mt-5 pt-4 border-t border-white/10 text-center">
                        <span className="text-[11px] text-neutral-500">
                            Press <kbd className="px-1 py-0.5 bg-white/10 rounded text-neutral-400 text-[10px] font-mono">?</kbd> or <kbd className="px-1 py-0.5 bg-white/10 rounded text-neutral-400 text-[10px] font-mono">Esc</kbd> to close
                        </span>
                    </div>
                </div>
            </div>
        </div>
    )
}
