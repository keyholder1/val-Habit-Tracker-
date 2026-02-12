'use client'

import { useEffect, useState } from 'react'
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { useAnalytics } from '@/hooks/useAnalytics'
import GraphContainer from './GraphContainer'

import { useRouter } from 'next/navigation'

export function StabilityVariance() {
    const router = useRouter()
    const { data: analytics, isLoading } = useAnalytics()
    const [data, setData] = useState<any[]>([])

    useEffect(() => {
        if (analytics?.dailyTrend) {
            const dailyTrend = analytics.dailyTrend || []
            // Calculate 7-day rolling variance
            const varianceData = dailyTrend.map((point: any, i: number) => {
                const windowStart = Math.max(0, i - 6)
                const window = dailyTrend.slice(windowStart, i + 1)
                const mean = window.reduce((s: number, p: any) => s + p.completion, 0) / window.length
                const variance = Math.round(Math.sqrt(window.reduce((s: number, p: any) => s + Math.pow(p.completion - mean, 2), 0) / window.length))
                return { date: point.date, variance }
            })
            setData(varianceData)
        }
    }, [analytics])

    if (isLoading) {
        return (
            <GraphContainer title="Stability & Variance" description="Daily variation in completion (lower = more consistent)">
                <div className="flex items-center justify-center h-full">
                    <div className="animate-pulse text-neutral-400">Loading...</div>
                </div>
            </GraphContainer>
        )
    }

    if (data.length === 0) {
        return (
            <GraphContainer title="Stability & Variance" description="Daily variation in completion (lower = more consistent)">
                <div className="flex items-center justify-center h-full">
                    <div className="text-neutral-400 text-sm">No data available</div>
                </div>
            </GraphContainer>
        )
    }

    return (
        <GraphContainer title="Stability & Variance" description="Daily variation in completion (lower = more consistent)">
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
                    <XAxis dataKey="date" fontSize={12} stroke="#71717a"
                        tickFormatter={(val) => new Date(val).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                    />
                    <YAxis fontSize={12} stroke="#71717a" label={{ value: 'Variance', angle: -90, position: 'insideLeft' }} />
                    <Tooltip labelFormatter={(val) => new Date(val).toLocaleDateString()} />
                    <Area type="monotone" dataKey="variance" stroke="#d946ef" fill="url(#varianceGradient)" strokeWidth={2} activeDot={{ r: 5 }} />
                    <defs>
                        <linearGradient id="varianceGradient" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#d946ef" stopOpacity={0.8} />
                            <stop offset="95%" stopColor="#d946ef" stopOpacity={0.1} />
                        </linearGradient>
                    </defs>
                </AreaChart>
            </ResponsiveContainer>
        </GraphContainer>
    )
}
import { memo } from 'react'
export default memo(StabilityVariance)
