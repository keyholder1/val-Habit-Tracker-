'use client'

import { useEffect, useState } from 'react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { useAnalytics } from '@/hooks/useAnalytics'
import GraphContainer from './GraphContainer'

interface DailyTrendPoint {
    date: string
    completion: number
}

import { useRouter } from 'next/navigation'

const DailyCompletionTrend = ({ year }: { year?: number }) => {
    const router = useRouter()
    const { data: analytics, isLoading } = useAnalytics(year)
    const [data, setData] = useState<DailyTrendPoint[]>([])

    useEffect(() => {
        if (analytics?.dailyTrend) {
            setData(analytics.dailyTrend)
        }
    }, [analytics])

    if (isLoading) {
        return (
            <GraphContainer title="Daily Completion Trend" description="Last 30 days">
                <div className="flex items-center justify-center h-full">
                    <div className="animate-pulse text-neutral-400">Loading...</div>
                </div>
            </GraphContainer>
        )
    }

    if (data.length === 0) {
        return (
            <GraphContainer title="Daily Completion Trend" description="Last 30 days">
                <div className="flex items-center justify-center h-full">
                    <div className="text-neutral-400 text-sm">No data yet. Start tracking your habits!</div>
                </div>
            </GraphContainer>
        )
    }

    return (
        <GraphContainer
            title="Daily Completion Trend"
            description="Your completion rate over the last 30 days"
        >
            <ResponsiveContainer width="100%" height="100%">
                <LineChart data={data} onClick={(e) => {
                    if (e && e.activePayload && e.activePayload[0]) {
                        const point = e.activePayload[0].payload as DailyTrendPoint
                        if (point && point.date) {
                            router.push(`/dashboard?date=${point.date}`)
                        }
                    }
                }} style={{ cursor: 'pointer' }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e4e4e7" />
                    <XAxis
                        dataKey="date"
                        fontSize={10}
                        stroke="#71717a"
                        minTickGap={20}
                        interval="preserveStartEnd"
                        tickFormatter={(val) => new Date(val).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                    />
                    <YAxis
                        fontSize={10}
                        stroke="#71717a"
                        unit="%"
                        width={30}
                    />
                    <Tooltip
                        labelFormatter={(val) => new Date(val).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
                        contentStyle={{
                            backgroundColor: 'rgba(255, 255, 255, 0.9)',
                            border: 'none',
                            borderRadius: '8px',
                            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                        }}
                    />
                    <Line
                        type="monotone"
                        dataKey="completion"
                        stroke="#0ea5e9"
                        strokeWidth={2}
                        dot={{ fill: '#0ea5e9', r: 4 }}
                        activeDot={{ r: 6, stroke: '#fff', strokeWidth: 2 }}
                    />
                </LineChart>
            </ResponsiveContainer>
        </GraphContainer>
    )
}

import { memo } from 'react'
export default memo(DailyCompletionTrend)
