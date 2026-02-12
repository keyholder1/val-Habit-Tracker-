'use client'

import { useEffect, useState } from 'react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts'
import { useAnalytics } from '@/hooks/useAnalytics'
import GraphContainer from './GraphContainer'

export function Rolling30DayAvg({ year }: { year?: number }) {
    const { data: analytics, isLoading } = useAnalytics(year)
    const [data, setData] = useState<any[]>([])

    useEffect(() => {
        if (analytics?.dailyTrend) {
            const dailyTrend = analytics.dailyTrend || []
            // Calculate rolling 30-day average (use all available data)
            const withRolling = dailyTrend.map((point: any, i: number) => {
                const windowStart = Math.max(0, i - 29)
                const window = dailyTrend.slice(windowStart, i + 1)
                const avg = Math.round(window.reduce((sum: number, p: any) => sum + p.completion, 0) / window.length)
                return { date: point.date, actual: point.completion, rolling: avg }
            })
            setData(withRolling)
        }
    }, [analytics])

    if (isLoading) {
        return (
            <GraphContainer title="Rolling 30-Day Average" description="Long-term completion trend (last 30 days)">
                <div className="flex items-center justify-center h-full">
                    <div className="animate-pulse text-neutral-400">Loading...</div>
                </div>
            </GraphContainer>
        )
    }

    if (data.length === 0) return null

    return (
        <GraphContainer title="Rolling 30-Day Average" description="Long-term completion trend (last 30 days)">
            <ResponsiveContainer width="100%" height="100%">
                <LineChart data={data}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e4e4e7" />
                    <XAxis dataKey="date" fontSize={12} stroke="#71717a" />
                    <YAxis fontSize={12} stroke="#71717a" unit="%" />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="actual" stroke="#e4e4e7" strokeWidth={1} dot={false} name="Daily" />
                    <Line type="monotone" dataKey="rolling" stroke="#9333ea" strokeWidth={3} dot={false} name="30-Day Avg" />
                </LineChart>
            </ResponsiveContainer>
        </GraphContainer>
    )
}
import { memo } from 'react'
export default memo(Rolling30DayAvg)
