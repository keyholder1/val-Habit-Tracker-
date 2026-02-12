'use client'

import { useEffect, useState } from 'react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { useAnalytics } from '@/hooks/useAnalytics'
import GraphContainer from './GraphContainer'

export function WeeklyGoalComparison({ year }: { year?: number }) {
    const { data: analytics, isLoading } = useAnalytics(year)
    const [data, setData] = useState<any[]>([])

    useEffect(() => {
        if (analytics?.goalCompletionPie) {
            // Use goal completion pie data for comparison
            const goals = (analytics.goalCompletionPie || []).map((g: any) => ({
                goal: g.name,
                completion: g.value,
            }))
            setData(goals)
        }
    }, [analytics])

    if (isLoading) {
        return (
            <GraphContainer title="Weekly Goal Comparison" description="Completion rate per goal">
                <div className="flex items-center justify-center h-full">
                    <div className="animate-pulse text-neutral-400">Loading...</div>
                </div>
            </GraphContainer>
        )
    }

    if (data.length === 0) {
        return (
            <GraphContainer title="Weekly Goal Comparison" description="Completion rate per goal">
                <div className="flex items-center justify-center h-full">
                    <div className="text-neutral-400 text-sm">No data available</div>
                </div>
            </GraphContainer>
        )
    }

    return (
        <GraphContainer title="Weekly Goal Comparison" description="Completion rate per goal">
            <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" stroke="#e4e4e7" />
                    <XAxis type="number" fontSize={12} stroke="#71717a" unit="%" />
                    <YAxis type="category" dataKey="goal" fontSize={12} stroke="#71717a" width={100} />
                    <Tooltip />
                    <Bar dataKey="completion" fill="#0ea5e9" radius={[0, 8, 8, 0]} />
                </BarChart>
            </ResponsiveContainer>
        </GraphContainer>
    )
}
import { memo } from 'react'
export default memo(WeeklyGoalComparison)
