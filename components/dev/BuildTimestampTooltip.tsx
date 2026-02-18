'use client'

import { useState } from 'react'
import { useDevice } from '@/components/providers/DeviceProvider'

export default function BuildTimestampTooltip() {
    const { isDesktop, isHydrated } = useDevice()
    const [isHovered, setIsHovered] = useState(false)

    // Strict dev + desktop check
    if (process.env.NODE_ENV !== 'development') return null
    if (!isHydrated || !isDesktop) return null

    const buildTime = process.env.NEXT_PUBLIC_BUILD_TIME
    const formattedTime = buildTime
        ? new Date(buildTime).toLocaleString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            hour12: false
        })
        : 'Unknown Build'

    return (
        <div className="fixed bottom-24 right-24 z-30 flex items-center justify-end pointer-events-none">
            {/* Tooltip Content */}
            <div
                className={`mr-3 px-3 py-1.5 bg-neutral-900/90 backdrop-blur-sm text-white rounded-lg shadow-xl transition-opacity duration-150 flex flex-col items-end border border-white/10 ${isHovered ? 'opacity-100' : 'opacity-0'
                    }`}
            >
                <div className="text-[10px] uppercase tracking-wider text-neutral-400 font-bold mb-0.5">
                    Built
                </div>
                <div className="text-xs font-mono font-medium whitespace-nowrap">
                    {formattedTime}
                </div>
                <div className="text-[9px] text-neutral-500 mt-0.5 font-mono">
                    Env: {process.env.NODE_ENV}
                </div>
            </div>

            {/* Hover Target Dot */}
            <div
                className="w-1.5 h-1.5 bg-white rounded-full transition-all duration-300 pointer-events-auto cursor-help shadow-[0_0_10px_rgba(255,255,255,0.3)]"
                style={{ opacity: isHovered ? 0.9 : 0.25 }}
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
                aria-label="Build Info"
            />
        </div>
    )
}
