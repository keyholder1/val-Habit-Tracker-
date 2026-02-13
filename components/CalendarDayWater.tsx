'use client'

import React, { useRef, useEffect } from 'react'
import { MonthTheme } from '@/lib/theme-config'

interface CalendarDayWaterProps {
    date: Date
    completionPercentage: number
    theme: MonthTheme
    isCurrentMonth: boolean
    isToday: boolean
    waterColor?: string // Dynamic override
    onClick: () => void
    children?: React.ReactNode // For symbols, indicators
}

export default function CalendarDayWater({
    date,
    completionPercentage,
    theme,
    isCurrentMonth,
    isToday,
    waterColor,
    onClick,
    children
}: CalendarDayWaterProps) {
    // We use CSS transition for the water fill for max performance
    // transform: scaleY(percentage) is GPU accelerated

    // Clamp percentage 0-100
    const safePercent = Math.min(100, Math.max(0, completionPercentage))
    const scaleValue = safePercent / 100

    // Use dynamic color if provided, fallback to theme
    const finalWaterStyle = waterColor ? {
        background: waterColor, // Expecting a gradient string or color
        opacity: 0.8 // much higher opacity (was 0.3)
    } : {
        background: theme.waterGradient,
        opacity: 0.4 // slightly higher (was 0.2)
    }

    return (
        <div
            onClick={onClick}
            className={`
                relative overflow-hidden cursor-pointer transition-all duration-200
                flex flex-col h-full rounded-sm border shadow-sm
                ${isToday ? 'ring-1 ring-offset-1 z-10' : 'hover:border-neutral-300'}
            `}
            style={{
                borderColor: isToday ? theme.primaryColor : isCurrentMonth ? '#E5E7EB' : 'transparent',
                ['--tw-ring-color' as any]: theme.primaryColor
            }}
        >
            {/* 1. Base Background Layer (Bottom) */}
            <div className={`absolute inset-0 z-0 ${isCurrentMonth ? 'bg-white/40' : 'bg-neutral-50/30'}`} />

            {/* 2. Water Fill Layer (Middle) */}
            <div
                className="absolute bottom-0 left-0 right-0 origin-bottom transition-transform duration-[800ms] ease-out-cubic will-change-transform z-0"
                style={{
                    height: '100%',
                    transform: `scaleY(${scaleValue})`,
                    ...finalWaterStyle
                }}
            />

            {/* 3. Content Layer (Top) */}
            <div className="relative z-10 flex flex-col h-full p-1">
                <span
                    className={`
                        text-base font-bold inline-flex items-center justify-center w-8 h-8 rounded-full
                        ${isToday ? 'text-white' : ''}
                    `}
                    style={{
                        backgroundColor: isToday ? theme.primaryColor : 'transparent',
                        color: isToday ? '#fff' : isCurrentMonth ? '#1F2937' : '#9CA3AF'
                    }}
                >
                    {date.getDate()}
                </span>

                {/* Optional Indicators */}
                <div className="mt-auto ml-auto">
                    {children}
                </div>
            </div>
        </div>
    )
}
