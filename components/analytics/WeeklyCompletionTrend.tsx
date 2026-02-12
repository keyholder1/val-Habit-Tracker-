'use client'

import { useEffect, useState } from 'react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { useAnalytics } from '@/hooks/useAnalytics'
import GraphContainer from './GraphContainer'

interface WeeklyTrendPoint {
    week: string
    completion: number
}

import { useRouter } from 'next/navigation'

const WeeklyCompletionTrend = ({ year }: { year?: number }) => {
    const router = useRouter()
    const { data: analytics, isLoading } = useAnalytics(year)
    const [data, setData] = useState<WeeklyTrendPoint[]>([])

    useEffect(() => {
        if (analytics?.weeklyTrend) {
            setData(analytics.weeklyTrend)
        }
    }, [analytics])

    if (isLoading || data.length === 0) return null

    return (
        <GraphContainer
            title="Weekly Completion Trend"
            description="Average completion rate per week (last 12 weeks)"
        >
            <ResponsiveContainer width="100%" height="100%">
                <LineChart data={data} onClick={(e) => {
                    if (e && e.activePayload && e.activePayload[0]) {
                        const point = e.activePayload[0].payload as WeeklyTrendPoint
                        if (point && point.week) {
                            // point.week is ISO string
                            router.push(`/dashboard?weekStart=${point.week}`)
                        }
                    }
                }} style={{ cursor: 'pointer' }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e4e4e7" />
                    <XAxis dataKey="week" fontSize={12} stroke="#71717a"
                        tickFormatter={(val) => new Date(val).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                    />
                    <YAxis fontSize={12} stroke="#71717a" unit="%" />
                    <Tooltip labelFormatter={(val) => `Week of ${new Date(val).toLocaleDateString()}`} />
                    <Line
                        type="monotone"
                        dataKey="completion"
                        stroke="#a855f7"
                        strokeWidth={2}
                        dot={{ fill: '#a855f7', r: 4 }}
                        activeDot={{ r: 6, stroke: '#fff', strokeWidth: 2 }}
                    />
                </LineChart>
            </ResponsiveContainer>
        </GraphContainer>
    )
}

import { memo } from 'react'
export default memo(WeeklyCompletionTrend)
