'use client'

import { useEffect, useState } from 'react'
import { useAnalytics } from '@/hooks/useAnalytics'
import GraphContainer from './GraphContainer'
import { useRouter } from 'next/navigation'

interface HeatmapCell {
    day: string
    intensity: number
}

export function CalendarHeatmap({ year }: { year?: number }) {
    const router = useRouter()
    const { data: analytics, isLoading } = useAnalytics(year)
    const [data, setData] = useState<HeatmapCell[]>([])

    useEffect(() => {
        if (analytics?.calendarHeatmap) {
            setData(analytics.calendarHeatmap)
        } else {
            setData([])
        }
    }, [analytics])

    const getColor = (intensity: number) => {
        // High contrast blue palette for dark mode
        const colors = ['#1a1a1a', '#1e3a8a', '#2563eb', '#3b82f6', '#60a5fa']
        return colors[intensity] || colors[0]
    }

    if (isLoading) {
        return (
            <GraphContainer title="Contribution Heatmap" description="Daily completion intensity overview" fullWidth tall>
                <div className="flex items-center justify-center h-full">
                    <div className="animate-pulse text-neutral-500 font-bold uppercase tracking-widest text-xs">Loading {year} Activity...</div>
                </div>
            </GraphContainer>
        )
    }

    // Organize into weeks (columns) and days (rows)
    const weeks: HeatmapCell[][] = []
    if (data.length > 0) {
        for (let i = 0; i < data.length; i += 7) {
            const week = data.slice(i, i + 7)
            if (week.length > 0) weeks.push(week)
        }
    }

    const getMonthLabel = (week: HeatmapCell[], index: number) => {
        if (!week[0]?.day) return ''
        const date = new Date(week[0].day + 'T00:00:00')
        const prevWeek = weeks[index - 1]
        const prevDate = prevWeek?.[0]?.day ? new Date(prevWeek[0].day + 'T00:00:00') : null

        if (index === 0 || (prevDate && date.getMonth() !== prevDate.getMonth())) {
            return date.toLocaleDateString('en-US', { month: 'short' })
        }
        return ''
    }

    const dayLabels = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

    return (
        <GraphContainer
            title="Contribution Heatmap"
            description={`Activity overview for the year ${year || 'current'}`}
            fullWidth
            tall
        >
            <div className="overflow-x-auto pb-6 custom-scrollbar h-full flex flex-col justify-center">
                <div className="min-w-fit px-8">
                    {/* Month labels */}
                    <div className="flex gap-[4px] mb-4 text-[9px] text-neutral-500 uppercase tracking-[0.2em] font-black">
                        <div className="w-12 mr-4 shrink-0" />
                        {weeks.map((week, i) => (
                            <div key={i} className="w-5 overflow-visible whitespace-nowrap">
                                {getMonthLabel(week, i)}
                            </div>
                        ))}
                    </div>

                    <div className="flex gap-[4px]">
                        {/* Day labels column */}
                        <div className="flex flex-col gap-[4px] mr-4">
                            {dayLabels.map((label) => (
                                <div key={label} className="h-5 w-12 text-[9px] text-neutral-600 font-black flex items-center leading-none uppercase pr-4 justify-end">
                                    {label}
                                </div>
                            ))}
                        </div>

                        {/* Weeks (columns) */}
                        {weeks.map((week, wi) => (
                            <div key={wi} className="flex flex-col gap-[4px]">
                                {week.map((cell, di) => (
                                    <div
                                        key={di}
                                        className="w-5 h-5 rounded-[4px] cursor-pointer hover:scale-110 hover:ring-2 hover:ring-white/20 transition-all border border-white/5 shadow-inner"
                                        style={{ backgroundColor: getColor(cell.intensity) }}
                                        title={`${new Date(cell.day + 'T00:00:00').toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' })}`}
                                    />
                                ))}
                            </div>
                        ))}
                    </div>

                    {/* Legend */}
                    <div className="flex items-center gap-2 mt-12 text-[10px] text-neutral-600 font-black ml-16 uppercase tracking-widest bg-white/5 w-fit px-4 py-2 rounded-xl border border-white/5 shadow-2xl">
                        <span className="mr-3 opacity-40">LESS</span>
                        {[0, 1, 2, 3, 4].map((i) => (
                            <div
                                key={i}
                                className="w-4 h-4 rounded-[3px] border border-white/5"
                                style={{ backgroundColor: getColor(i) }}
                            />
                        ))}
                        <span className="ml-3 opacity-40">MORE</span>
                    </div>
                </div>
            </div>
        </GraphContainer>
    )
}
import { memo } from 'react'
export default memo(CalendarHeatmap)
