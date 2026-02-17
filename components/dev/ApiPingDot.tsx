'use client'

import { useState, useEffect } from 'react'
import { useDevice } from '@/components/providers/DeviceProvider'

type ApiStatus = 'checking' | 'ok' | 'fail'

export default function ApiPingDot() {
    const { isHydrated } = useDevice()
    const [status, setStatus] = useState<ApiStatus>('checking')

    useEffect(() => {
        // Double check dev mode here, though parent should also block it
        if (process.env.NODE_ENV !== 'development') return

        const checkHealth = async () => {
            try {
                setStatus('checking')
                // Use a short timeout to fail fast
                const controller = new AbortController()
                const timeoutId = setTimeout(() => controller.abort(), 5000)

                const res = await fetch('/api/health', {
                    signal: controller.signal,
                    cache: 'no-store'
                })

                clearTimeout(timeoutId)

                if (res.ok) {
                    setStatus('ok')
                } else {
                    setStatus('fail')
                }
            } catch (error) {
                setStatus('fail')
            }
        }

        // Initial check
        checkHealth()

        // Poll every 15 seconds
        const interval = setInterval(checkHealth, 15000)

        return () => clearInterval(interval)
    }, [])

    // STRICT: Only render in development
    if (process.env.NODE_ENV !== 'development') return null
    if (!isHydrated) return null

    let colorClass = 'bg-yellow-500' // checking
    if (status === 'ok') colorClass = 'bg-green-500'
    if (status === 'fail') colorClass = 'bg-red-500'

    return (
        <div
            className={`fixed top-4 right-4 z-50 w-2.5 h-2.5 rounded-full ${colorClass} opacity-70 pointer-events-none transition-colors duration-300`}
            title={`API Status: ${status}`}
        />
    )
}
