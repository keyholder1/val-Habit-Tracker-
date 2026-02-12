'use client'

import { useEffect, useState } from 'react'
import { useAnalytics } from '@/hooks/useAnalytics'
import GraphContainer from './GraphContainer'

interface TimeOfWeekCell {
    day: string
    goalName: string
    completion: number
}

export function WeeklyDensityHeatmap({ year }: { year?: number }) {
    const { data: analytics, isLoading } = useAnalytics(year)
    const [data, setData] = useState<TimeOfWeekCell[]>([])
    const [goals, setGoals] = useState<string[]>([])

    useEffect(() => {
        if (analytics?.timeOfWeekHeatmap) {
            const cells: TimeOfWeekCell[] = analytics.timeOfWeekHeatmap || []
            setData(cells)
            const uniqueGoals = [...new Set(cells.map((c: TimeOfWeekCell) => c.goalName))]
            setGoals(uniqueGoals)
        }
    }, [analytics])

    // Use a gradient scale instead of discrete colors (different from TimeOfWeekHeatmap)
    const getColor = (value: number) => {
        if (value >= 90) return '#059669' // emerald-600
        if (value >= 75) return '#10b981' // emerald-500
        if (value >= 50) return '#34d399' // emerald-400
        if (value >= 25) return '#6ee7b7' // emerald-300
        if (value > 0) return '#a7f3d0'   // emerald-200
        return '#27272a'                    // zinc-800
    }

    const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']

    if (isLoading) {
        return (
            <GraphContainer title="Weekly Density" description="Completion density per goal per day" fullWidth>
                <div className="flex items-center justify-center h-full">
                    <div className="animate-pulse text-neutral-400">Loading...</div>
                </div>
            </GraphContainer>
        )
    }

    if (data.length === 0) {
        return (
            <GraphContainer title="Weekly Density" description="Completion density per goal per day" fullWidth>
                <div className="flex items-center justify-center h-full">
                    <div className="text-neutral-400 text-sm">No data available</div>
                </div>
            </GraphContainer>
        )
    }

    return (
        <GraphContainer title="Weekly Density" description="Completion density per goal per day" fullWidth>
            <div className="overflow-x-auto">
                {/* Header row */}
                <div className="grid gap-1 mb-2" style={{ gridTemplateColumns: `120px repeat(${days.length}, minmax(40px, 1fr))` }}>
                    <div />
                    {days.map((d) => (
                        <div key={d} className="text-xs font-medium text-neutral-400 text-center">{d}</div>
                    ))}
                </div>

                {/* Goal rows */}
                <div className="space-y-1">
                    {goals.map((goal) => (
                        <div key={goal} className="grid gap-1 items-center" style={{ gridTemplateColumns: `120px repeat(${days.length}, minmax(40px, 1fr))` }}>
                            <div className="text-xs font-medium text-neutral-300 truncate pr-2" title={goal}>{goal}</div>
                            {days.map((day) => {
                                const cell = data.find((c) => c.goalName === goal && c.day === day)
                                const val = cell ? cell.completion : 0
                                return (
                                    <div
                                        key={day}
                                        className="h-8 rounded flex items-center justify-center cursor-pointer hover:ring-1 hover:ring-emerald-400 transition-all"
                                        style={{ backgroundColor: getColor(val) }}
                                        title={`${goal} - ${day}: ${val}%`}
                                    >
                                        <span className={`text-[10px] font-medium ${val >= 50 ? 'text-white' : val > 0 ? 'text-emerald-900' : ''}`}>
                                            {val > 0 ? `${val}%` : ''}
                                        </span>
                                    </div>
                                )
                            })}
                        </div>
                    ))}
                </div>

                {/* Legend */}
                <div className="flex items-center gap-2 mt-4 text-xs text-neutral-500">
                    <span>Low</span>
                    {[1, 25, 50, 75, 90].map((v) => (
                        <div key={v} className="w-3 h-3 rounded-sm" style={{ backgroundColor: getColor(v) }} />
                    ))}
                    <span>High</span>
                </div>
            </div>
        </GraphContainer>
    )
}
import { memo } from 'react'
export default memo(WeeklyDensityHeatmap)
