'use client'

import { useEffect, useState } from 'react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts'
import { useAnalytics } from '@/hooks/useAnalytics'
import GraphContainer from './GraphContainer'

import { useRouter } from 'next/navigation'

export function MomentumGraph() {
    const router = useRouter()
    const { data: analytics, isLoading } = useAnalytics()
    const [data, setData] = useState<any[]>([])

    useEffect(() => {
        if (analytics?.dailyTrend) {
            const dailyTrend = analytics.dailyTrend
            // Calculate momentum as 7-day change in completion rate
            const momentumData = dailyTrend.map((point: any, i: number) => {
                const prevIndex = Math.max(0, i - 7)
                const momentum = point.completion - dailyTrend[prevIndex].completion
                return { date: point.date, momentum }
            })
            setData(momentumData)
        }
    }, [analytics])

    if (isLoading) {
        return (
            <GraphContainer title="Momentum Graph" description="7-day acceleration of completion rate (positive = improving)">
                <div className="flex items-center justify-center h-full">
                    <div className="animate-pulse text-neutral-400">Loading...</div>
                </div>
            </GraphContainer>
        )
    }

    if (data.length === 0) {
        return (
            <GraphContainer title="Momentum Graph" description="7-day acceleration of completion rate (positive = improving)">
                <div className="flex items-center justify-center h-full">
                    <div className="text-neutral-400 text-sm">No data available</div>
                </div>
            </GraphContainer>
        )
    }

    return (
        <GraphContainer title="Momentum Graph" description="7-day acceleration of completion rate (positive = improving)">
            <ResponsiveContainer width="100%" height="100%">
                <LineChart data={data} onClick={(e) => {
                    if (e && e.activePayload && e.activePayload[0]) {
                        const point = e.activePayload[0].payload
                        if (point && point.date) {
                            router.push(`/dashboard?date=${point.date}`)
                        }
                    }
                }} style={{ cursor: 'pointer' }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e4e4e7" />
                    <XAxis dataKey="date" fontSize={12} stroke="#71717a" />
                    <YAxis fontSize={12} stroke="#71717a" />
                    <Tooltip />
                    <ReferenceLine y={0} stroke="#71717a" strokeDasharray="3 3" />
                    <Line type="monotone" dataKey="momentum" stroke="#0ea5e9" strokeWidth={2} dot={{ fill: '#0ea5e9', r: 3 }} activeDot={{ r: 5 }} />
                </LineChart>
            </ResponsiveContainer>
        </GraphContainer>
    )
}
import { memo } from 'react'
export default memo(MomentumGraph)
