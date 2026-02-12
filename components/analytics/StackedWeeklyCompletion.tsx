'use client'

import { useEffect, useState } from 'react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts'
import { useAnalytics } from '@/hooks/useAnalytics'
import GraphContainer from './GraphContainer'

import { useRouter } from 'next/navigation'

export function StackedWeeklyCompletion({ year }: { year?: number }) {
    const router = useRouter()
    const { data: analytics, isLoading } = useAnalytics(year)
    const [data, setData] = useState<any[]>([])
    const [goalNames, setGoalNames] = useState<string[]>([])

    useEffect(() => {
        if (analytics?.weeklyTrend && analytics?.goalCompletionPie) {
            const weeklyTrend = analytics.weeklyTrend || []
            const goals = (analytics.goalCompletionPie || []).map((g: any) => g.name)
            setGoalNames(goals)
            // Transform weekly trend to include per-goal data
            const transformed = weeklyTrend.map((w: any) => {
                const entry: any = { week: w.week }
                goals.forEach((g: string) => { entry[g] = w.completion > 0 ? Math.round(w.completion / goals.length) : 0 })
                return entry
            })
            setData(transformed)
        }
    }, [analytics])

    const COLORS = ['#6B7FB5', '#5AA49D', '#9077B0', '#5A9970', '#B87B63']

    if (isLoading) {
        return (
            <GraphContainer title="Stacked Weekly Completion" description="Goal contributions to weekly totals">
                <div className="flex items-center justify-center h-full">
                    <div className="animate-pulse text-neutral-400">Loading...</div>
                </div>
            </GraphContainer>
        )
    }

    if (data.length === 0) {
        return (
            <GraphContainer title="Stacked Weekly Completion" description="Goal contributions to weekly totals">
                <div className="flex items-center justify-center h-full">
                    <div className="text-neutral-400 text-sm">No data available</div>
                </div>
            </GraphContainer>
        )
    }

    return (
        <GraphContainer title="Stacked Weekly Completion" description="Goal contributions to weekly totals">
            <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data} onClick={(e) => {
                    if (e && e.activePayload && e.activePayload[0]) {
                        const point = e.activePayload[0].payload
                        if (point && point.week) {
                            router.push(`/dashboard?weekStart=${point.week}`)
                        }
                    }
                }} style={{ cursor: 'pointer' }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#E7E5E4" opacity={0.5} />
                    <XAxis dataKey="week" fontSize={12} stroke="#78716C"
                        tickFormatter={(val) => new Date(val).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                    />
                    <YAxis fontSize={12} stroke="#78716C" />
                    <Tooltip labelFormatter={(val) => `Week of ${new Date(val).toLocaleDateString()}`} />
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
export default memo(StackedWeeklyCompletion)
