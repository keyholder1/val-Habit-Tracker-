'use client'

import { useEffect, useState } from 'react'
import { RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, ResponsiveContainer, Legend } from 'recharts'
import { useAnalytics } from '@/hooks/useAnalytics'
import GraphContainer from './GraphContainer'

export function ConsistencyRadar({ year }: { year?: number }) {
    const { data: analytics, isLoading } = useAnalytics(year)
    const [data, setData] = useState<any[]>([])

    useEffect(() => {
        if (analytics?.consistencyScore) {
            const consistencyByGoal = analytics.consistencyScore?.byGoal || {}
            const radarData = Object.entries(consistencyByGoal).map(([goal, score]) => ({
                goal,
                consistency: score as number,
            }))
            setData(radarData)
        }
    }, [analytics])

    if (isLoading) {
        return (
            <GraphContainer title="Consistency Radar" description="Consistency score across all goals">
                <div className="flex items-center justify-center h-full">
                    <div className="animate-pulse text-neutral-400">Loading...</div>
                </div>
            </GraphContainer>
        )
    }

    if (data.length === 0) {
        return (
            <GraphContainer title="Consistency Radar" description="Consistency score across all goals">
                <div className="flex items-center justify-center h-full">
                    <div className="text-neutral-400 text-sm">No data available</div>
                </div>
            </GraphContainer>
        )
    }

    return (
        <GraphContainer title="Consistency Radar" description="Consistency score across all goals">
            <ResponsiveContainer width="100%" height="100%">
                <RadarChart data={data}>
                    <PolarGrid stroke="#e4e4e7" />
                    <PolarAngleAxis dataKey="goal" fontSize={12} />
                    <PolarRadiusAxis angle={90} domain={[0, 100]} fontSize={10} />
                    <Radar name="Consistency %" dataKey="consistency" stroke="#0ea5e9" fill="#0ea5e9" fillOpacity={0.6} />
                    <Legend />
                </RadarChart>
            </ResponsiveContainer>
        </GraphContainer>
    )
}
import { memo } from 'react'
export default memo(ConsistencyRadar)
