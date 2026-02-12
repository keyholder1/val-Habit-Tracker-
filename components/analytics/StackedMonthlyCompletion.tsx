'use client'

import { useEffect, useState } from 'react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts'
import { useAnalytics } from '@/hooks/useAnalytics'
import GraphContainer from './GraphContainer'

export function StackedMonthlyCompletion({ year }: { year?: number }) {
    const { data: analytics, isLoading } = useAnalytics(year)
    const [data, setData] = useState<any[]>([])
    const [goalNames, setGoalNames] = useState<string[]>([])

    useEffect(() => {
        if (analytics?.monthlyTrend && analytics?.goalCompletionPie) {
            const monthlyTrend = analytics.monthlyTrend || []
            const goals = (analytics.goalCompletionPie || []).map((g: any) => g.name)
            setGoalNames(goals)
            const transformed = monthlyTrend.map((m: any) => {
                const entry: any = { month: m.month }
                goals.forEach((g: string) => { entry[g] = m.completion > 0 ? Math.round(m.completion / goals.length) : 0 })
                return entry
            })
            setData(transformed)
        }
    }, [analytics])

    const COLORS = ['#0ea5e9', '#a855f7', '#d946ef', '#10b981', '#f59e0b']

    if (isLoading) {
        return (
            <GraphContainer title="Stacked Monthly Completion" description="Goal contributions to monthly totals">
                <div className="flex items-center justify-center h-full">
                    <div className="animate-pulse text-neutral-400">Loading...</div>
                </div>
            </GraphContainer>
        )
    }

    if (data.length === 0) {
        return (
            <GraphContainer title="Stacked Monthly Completion" description="Goal contributions to monthly totals">
                <div className="flex items-center justify-center h-full">
                    <div className="text-neutral-400 text-sm">No data available</div>
                </div>
            </GraphContainer>
        )
    }

    return (
        <GraphContainer title="Stacked Monthly Completion" description="Goal contributions to monthly totals">
            <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e4e4e7" />
                    <XAxis dataKey="month" fontSize={12} stroke="#71717a" />
                    <YAxis fontSize={12} stroke="#71717a" />
                    <Tooltip />
                    <Legend />
                    {goalNames.map((name, i) => (
                        <Bar key={name} dataKey={name} stackId="a" fill={COLORS[i % COLORS.length]} />
                    ))}
                </BarChart>
            </ResponsiveContainer>
        </GraphContainer>
    )
}
import { memo } from 'react'
export default memo(StackedMonthlyCompletion)
