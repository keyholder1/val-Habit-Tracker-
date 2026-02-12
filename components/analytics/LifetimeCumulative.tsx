'use client'

import { useEffect, useState } from 'react'
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts'
import { useAnalytics } from '@/hooks/useAnalytics'
import GraphContainer from './GraphContainer'

import { useRouter } from 'next/navigation'

export function LifetimeCumulative() {
    const router = useRouter()
    const { data: analytics, isLoading } = useAnalytics()
    const [data, setData] = useState<any[]>([])
    const [goalNames, setGoalNames] = useState<string[]>([])

    useEffect(() => {
        if (analytics?.dailyTrend && analytics?.goalCompletionPie) {
            const dailyTrend = analytics.dailyTrend || []
            const goals = (analytics.goalCompletionPie || []).map((g: any) => g.name)
            setGoalNames(goals)

            // Build cumulative data
            const cumulative: any[] = []
            const totals: Record<string, number> = {}
            goals.forEach((g: string) => { totals[g] = 0 })

            dailyTrend.forEach((point: any, i: number) => {
                const entry: any = { day: i + 1, date: point.date }
                goals.forEach((g: string) => {
                    totals[g] += point.completion > 0 ? 1 : 0
                    entry[g] = totals[g]
                })
                cumulative.push(entry)
            })

            setData(cumulative)
        }
    }, [analytics])

    const COLORS = ['#0ea5e9', '#a855f7', '#d946ef', '#10b981', '#f59e0b']

    if (isLoading) {
        return (
            <GraphContainer title="Lifetime Cumulative Progress" description="Total habit completions accumulated over time" fullWidth>
                <div className="flex items-center justify-center h-full">
                    <div className="animate-pulse text-neutral-400">Loading...</div>
                </div>
            </GraphContainer>
        )
    }

    if (data.length === 0) {
        return (
            <GraphContainer title="Lifetime Cumulative Progress" description="Total habit completions accumulated over time" fullWidth>
                <div className="flex items-center justify-center h-full">
                    <div className="text-neutral-400 text-sm">No data available</div>
                </div>
            </GraphContainer>
        )
    }

    return (
        <GraphContainer title="Lifetime Cumulative Progress" description="Total habit completions accumulated over time" fullWidth>
            <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={data} onClick={(e) => {
                    if (e && e.activePayload && e.activePayload[0]) {
                        const point = e.activePayload[0].payload
                        if (point && point.date) {
                            router.push(`/dashboard?date=${point.date}`)
                        }
                    }
                }} style={{ cursor: 'pointer' }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e4e4e7" />
                    <XAxis dataKey="day" fontSize={12} stroke="#71717a" label={{ value: 'Days', position: 'insideBottom', offset: -5 }} />
                    <YAxis fontSize={12} stroke="#71717a" label={{ value: 'Total Completions', angle: -90, position: 'insideLeft' }} />
                    <Tooltip labelFormatter={(label, payload) => {
                        if (payload && payload[0] && payload[0].payload && payload[0].payload.date) {
                            return `${new Date(payload[0].payload.date).toLocaleDateString()} (Day ${label})`
                        }
                        return `Day ${label}`
                    }} />
                    <Legend />
                    {goalNames.map((name, i) => (
                        <Area key={name} type="monotone" dataKey={name} stackId="1" stroke={COLORS[i % COLORS.length]} fill={COLORS[i % COLORS.length]} fillOpacity={0.6} />
                    ))}
                </AreaChart>
            </ResponsiveContainer>
        </GraphContainer>
    )
}
import { memo } from 'react'
export default memo(LifetimeCumulative)
