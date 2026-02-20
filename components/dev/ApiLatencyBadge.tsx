'use client'

import { useState, useEffect, useRef, useCallback } from 'react'

const POLL_INTERVAL = 20_000   // 20s
const FETCH_TIMEOUT = 5_000    // 5s abort
const ROLLING_WINDOW = 5       // last N samples

type Status = 'checking' | 'ok' | 'slow' | 'critical' | 'offline'

function getAvg(samples: number[]): number {
    if (!samples.length) return 0
    return Math.round(samples.reduce((a, b) => a + b, 0) / samples.length)
}

function getStatus(avg: number, offline: boolean): Status {
    if (offline) return 'offline'
    if (avg < 150) return 'ok'
    if (avg < 500) return 'slow'
    return 'critical'
}

function isDesktopMouse(): boolean {
    if (typeof window === 'undefined') return false
    if (window.innerWidth < 1024) return false
    if (navigator.maxTouchPoints > 0) return false
    if (window.matchMedia('(pointer: coarse)').matches) return false
    return true
}

function showBadge(): boolean {
    const forceShow = process.env.NEXT_PUBLIC_SHOW_DEV_BADGE === 'true'
    const isDev = process.env.NODE_ENV !== 'production'
    return (isDev || forceShow) && isDesktopMouse()
}

export default function ApiLatencyBadge() {
    const [visible, setVisible] = useState(false)
    const [avgLatency, setAvgLatency] = useState<number | null>(null)
    const [status, setStatus] = useState<Status>('checking')

    const samplesRef = useRef<number[]>([])
    const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)

    const check = useCallback(async () => {
        if (document.hidden) return  // pause when tab hidden

        const controller = new AbortController()
        const timeoutId = setTimeout(() => controller.abort(), FETCH_TIMEOUT)
        const start = performance.now()

        try {
            const res = await fetch('/api/health', {
                signal: controller.signal,
                cache: 'no-store',
            })
            clearTimeout(timeoutId)

            if (res.ok) {
                const elapsed = Math.round(performance.now() - start)
                // Rolling window: keep last N samples
                samplesRef.current = [...samplesRef.current.slice(-(ROLLING_WINDOW - 1)), elapsed]
                const avg = getAvg(samplesRef.current)
                setAvgLatency(avg)
                setStatus(getStatus(avg, false))
            } else {
                setStatus('offline')
            }
        } catch {
            clearTimeout(timeoutId)
            setStatus('offline')
        }
    }, [])

    useEffect(() => {
        // Evaluate after hydration (client-only)
        if (!showBadge()) return

        setVisible(true)
        check()

        intervalRef.current = setInterval(check, POLL_INTERVAL)

        // Pause/resume on tab visibility
        const onVisibility = () => {
            if (!document.hidden && intervalRef.current === null) {
                check()
                intervalRef.current = setInterval(check, POLL_INTERVAL)
            } else if (document.hidden && intervalRef.current !== null) {
                clearInterval(intervalRef.current)
                intervalRef.current = null
            }
        }

        document.addEventListener('visibilitychange', onVisibility)

        return () => {
            if (intervalRef.current) clearInterval(intervalRef.current)
            document.removeEventListener('visibilitychange', onVisibility)
        }
    }, [check])

    if (!visible) return null

    const dotColor =
        status === 'ok' ? 'bg-green-500' :
            status === 'slow' ? 'bg-yellow-500' :
                status === 'critical' ? 'bg-red-500' :
                    status === 'offline' ? 'bg-neutral-600' :
                        'bg-yellow-500' // checking

    const textColor =
        status === 'ok' ? 'text-green-400' :
            status === 'slow' ? 'text-yellow-400' :
                status === 'critical' ? 'text-red-400' :
                    status === 'offline' ? 'text-neutral-500' :
                        'text-neutral-400'

    const label =
        status === 'offline' ? 'API ⚫' :
            status === 'checking' ? 'API …' :
                `API ${avgLatency}ms`

    return (
        // CSS breakpoint guard (belt-and-suspenders with JS guard above)
        <div className="hidden lg:flex fixed bottom-8 left-8 z-30 items-center gap-1.5 px-2.5 py-1 bg-neutral-900/70 backdrop-blur-sm rounded-full pointer-events-none select-none transition-opacity duration-300">
            <div className={`w-1.5 h-1.5 rounded-full shrink-0 ${dotColor}`} />
            <span className={`text-[10px] font-mono font-medium ${textColor}`}>
                {label}
            </span>
        </div>
    )
}
