'use client'

import { useEffect, useState } from 'react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { useAnalytics } from '@/hooks/useAnalytics'
import GraphContainer from './GraphContainer'

export function MonthlyGoalComparison({ year }: { year?: number }) {
    const { data: analytics } = useAnalytics(year)
    const [data, setData] = useState<any[]>([])

    useEffect(() => {
        if (analytics?.goalCompletionPie) {
            const goals = (analytics.goalCompletionPie || []).map((g: any) => ({
                goal: g.name,
                completion: g.value,
            }))
            setData(goals)
        }
    }, [analytics])

    if (data.length === 0) {
        return (
            <GraphContainer title="Monthly Goal Comparison" description="This month's average completion per goal">
                <div className="flex items-center justify-center h-full">
                    <div className="text-neutral-400 text-sm">No data available</div>
                </div>
            </GraphContainer>
        )
    }

    return (
        <GraphContainer title="Monthly Goal Comparison" description="This month's average completion per goal">
            <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e4e4e7" />
                    <XAxis dataKey="goal" fontSize={12} stroke="#71717a" />
                    <YAxis fontSize={12} stroke="#71717a" unit="%" />
                    <Tooltip />
                    <Bar dataKey="completion" fill="#a855f7" radius={[8, 8, 0, 0]} />
                </BarChart>
            </ResponsiveContainer>
        </GraphContainer>
    )
}
import { memo } from 'react'
export default memo(MonthlyGoalComparison)
