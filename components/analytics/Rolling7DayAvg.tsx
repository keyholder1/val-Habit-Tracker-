'use client'

import { useEffect, useState } from 'react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts'
import { useAnalytics } from '@/hooks/useAnalytics'
import GraphContainer from './GraphContainer'

export function Rolling7DayAvg({ year }: { year?: number }) {
    const { data: analytics, isLoading } = useAnalytics(year)
    const [data, setData] = useState<any[]>([])

    useEffect(() => {
        if (analytics?.dailyTrend) {
            const dailyTrend = analytics.dailyTrend || []
            // Calculate rolling 7-day average from daily trend
            const withRolling = dailyTrend.map((point: any, i: number) => {
                const windowStart = Math.max(0, i - 6)
                const window = dailyTrend.slice(windowStart, i + 1)
                const avg = Math.round(window.reduce((sum: number, p: any) => sum + p.completion, 0) / window.length)
                return { date: point.date, actual: point.completion, rolling: avg }
            })
            setData(withRolling)
        }
    }, [analytics])

    if (isLoading) {
        return (
            <GraphContainer title="Rolling 7-Day Average" description="Smoothed completion trend over time">
                <div className="flex items-center justify-center h-full">
                    <div className="animate-pulse text-neutral-400">Loading...</div>
                </div>
            </GraphContainer>
        )
    }

    if (data.length === 0) return null

    return (
        <GraphContainer title="Rolling 7-Day Average" description="Smoothed completion trend over time">
            <ResponsiveContainer width="100%" height="100%">
                <LineChart data={data}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e4e4e7" />
                    <XAxis dataKey="date" fontSize={12} stroke="#71717a" />
                    <YAxis fontSize={12} stroke="#71717a" unit="%" />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="actual" stroke="#d4d4d8" strokeWidth={1} dot={false} name="Daily" />
                    <Line type="monotone" dataKey="rolling" stroke="#0ea5e9" strokeWidth={3} dot={false} name="7-Day Avg" />
                </LineChart>
            </ResponsiveContainer>
        </GraphContainer>
    )
}
import { memo } from 'react'
export default memo(Rolling7DayAvg)
