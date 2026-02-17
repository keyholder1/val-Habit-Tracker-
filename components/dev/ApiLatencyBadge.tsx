'use client'

import { useState, useEffect } from 'react'
import { useDevice } from '@/components/providers/DeviceProvider'

export default function ApiLatencyBadge() {
    const { isHydrated } = useDevice()
    const [latency, setLatency] = useState<number | null>(null)
    const [error, setError] = useState(false)

    useEffect(() => {
        if (process.env.NODE_ENV !== 'development') return

        const checkLatency = async () => {
            const start = performance.now()
            try {
                // Use a short timeout
                const controller = new AbortController()
                const timeoutId = setTimeout(() => controller.abort(), 5000)

                const res = await fetch('/api/health', {
                    signal: controller.signal,
                    cache: 'no-store'
                })

                clearTimeout(timeoutId)

                const end = performance.now()

                if (res.ok) {
                    setLatency(Math.round(end - start))
                    setError(false)
                } else {
                    setError(true)
                }
            } catch {
                setError(true)
            }
        }

        checkLatency()
        const interval = setInterval(checkLatency, 20000)

        return () => clearInterval(interval)
    }, [])

    if (process.env.NODE_ENV !== 'development') return null
    if (!isHydrated) return null

    let colorClass = 'text-green-400'
    let text = `API ${latency}ms`

    if (error) {
        colorClass = 'text-red-400'
        text = 'API ?'
    } else if (latency !== null) {
        if (latency < 80) colorClass = 'text-green-400'
        else if (latency < 200) colorClass = 'text-yellow-400'
        else colorClass = 'text-red-400'
    } else {
        text = 'API ...'
        colorClass = 'text-neutral-400'
    }

    return (
        <div
            className="fixed top-4 left-4 z-50 px-2 py-1 bg-black/60 backdrop-blur-sm rounded-full pointer-events-none select-none transition-colors duration-300"
        >
            <span className={`text-[10px] font-mono font-medium ${colorClass}`}>
                {text}
            </span>
        </div>
    )
}
