'use client'

import { useState, useEffect, useRef } from 'react'

type IndicatorState = 'idle' | 'saving' | 'saved'

interface AutoSaveIndicatorProps {
    /** The content string to watch for changes */
    content: string
}

export default function AutoSaveIndicator({ content }: AutoSaveIndicatorProps) {
    const [state, setState] = useState<IndicatorState>('idle')
    const prevContentRef = useRef(content)
    const debounceRef = useRef<NodeJS.Timeout | null>(null)
    const fadeRef = useRef<NodeJS.Timeout | null>(null)
    const mountedRef = useRef(true)

    useEffect(() => {
        mountedRef.current = true
        return () => {
            mountedRef.current = false
            if (debounceRef.current) clearTimeout(debounceRef.current)
            if (fadeRef.current) clearTimeout(fadeRef.current)
        }
    }, [])

    useEffect(() => {
        // Skip on initial mount or if content hasn't changed
        if (prevContentRef.current === content) return
        prevContentRef.current = content

        // Clear any existing timers
        if (debounceRef.current) clearTimeout(debounceRef.current)
        if (fadeRef.current) clearTimeout(fadeRef.current)

        // Immediately show "Saving..."
        setState('saving')

        // Debounce: after 800ms of no changes, switch to "Saved ✓"
        debounceRef.current = setTimeout(() => {
            if (!mountedRef.current) return
            setState('saved')

            // Fade back to idle after 2s
            fadeRef.current = setTimeout(() => {
                if (!mountedRef.current) return
                setState('idle')
            }, 2000)
        }, 800)
    }, [content])

    if (state === 'idle') return null

    return (
        <div
            aria-live="polite"
            className={`
                fixed bottom-24 right-4
                lg:absolute lg:bottom-auto lg:top-2 lg:right-2
                z-30
                px-3 py-1 rounded-full text-xs font-medium
                backdrop-blur-sm shadow-sm
                transition-all duration-300
                pointer-events-none select-none
                ${state === 'saving'
                    ? 'bg-amber-100/80 text-amber-700 opacity-70'
                    : 'bg-emerald-100/80 text-emerald-700 opacity-70'
                }
            `}
        >
            {state === 'saving' ? 'Saving…' : 'Saved ✓'}
        </div>
    )
}
