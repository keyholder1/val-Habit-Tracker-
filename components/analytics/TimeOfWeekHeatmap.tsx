'use client'

import { useEffect, useState } from 'react'
import { useAnalytics } from '@/hooks/useAnalytics'
import GraphContainer from './GraphContainer'

interface TimeOfWeekCell {
    day: string
    goalName: string
    completion: number
}

export function TimeOfWeekHeatmap() {
    const { data: analytics, isLoading } = useAnalytics()
    const [data, setData] = useState<TimeOfWeekCell[]>([])
    const [goals, setGoals] = useState<string[]>([])

    useEffect(() => {
        if (analytics?.timeOfWeekHeatmap) {
            const cells: TimeOfWeekCell[] = analytics.timeOfWeekHeatmap || []
            setData(cells)
            const uniqueGoals = [...new Set(cells.map((c) => c.goalName))]
            setGoals(uniqueGoals)
        }
    }, [analytics])

    const getColor = (value: number) => {
        if (value >= 90) return '#10b981'
        if (value >= 75) return '#3b82f6'
        if (value >= 50) return '#eab308'
        if (value >= 25) return '#f97316'
        if (value > 0) return '#ef4444'
        return '#27272a'
    }

    const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']

    if (isLoading) {
        return (
            <GraphContainer title="Activity by Day" description="Which days you're most active for each goal" fullWidth>
                <div className="flex items-center justify-center h-full">
                    <div className="animate-pulse text-neutral-400">Loading...</div>
                </div>
            </GraphContainer>
        )
    }

    if (data.length === 0) return null

    return (
        <GraphContainer title="Activity by Day" description="Which days you're most active for each goal" fullWidth>
            <div className="overflow-x-auto">
                {/* Header row */}
                <div className="grid gap-1 mb-2" style={{ gridTemplateColumns: `120px repeat(${days.length}, minmax(40px, 1fr))` }}>
                    <div />
                    {days.map((day) => (
                        <div key={day} className="text-xs font-medium text-neutral-400 text-center">{day}</div>
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
                                        className="h-8 rounded flex items-center justify-center cursor-pointer hover:ring-1 hover:ring-primary-400 transition-all"
                                        style={{ backgroundColor: getColor(val) }}
                                        title={`${goal} on ${day}: ${val}%`}
                                    >
                                        <span className="text-white text-[10px] font-medium">{val > 0 ? `${val}%` : ''}</span>
                                    </div>
                                )
                            })}
                        </div>
                    ))}
                </div>

                {/* Legend */}
                <div className="flex items-center gap-3 mt-4 text-xs text-neutral-500">
                    <span>0%</span>
                    {[0, 25, 50, 75, 90].map((v) => (
                        <div key={v} className="flex items-center gap-1">
                            <div className="w-3 h-3 rounded-sm" style={{ backgroundColor: getColor(v + 1) }} />
                            <span>{v}%+</span>
                        </div>
                    ))}
                </div>
            </div>
        </GraphContainer>
    )
}
import { memo } from 'react'
export default memo(TimeOfWeekHeatmap)
