'use client'

import { useEffect, useState } from 'react'
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { useAnalytics } from '@/hooks/useAnalytics'
import GraphContainer from './GraphContainer'

export function YearlyCompletionTrend({ year }: { year?: number }) {
    const { data: analytics, isLoading } = useAnalytics(year)
    const [data, setData] = useState<any[]>([])

    useEffect(() => {
        if (analytics?.monthlyTrend) {
            // Use monthly trend data to show yearly view
            setData(analytics.monthlyTrend || [])
        }
    }, [analytics])

    if (isLoading) {
        return (
            <GraphContainer title="Yearly Completion Trend" description="Year-over-year completion pattern">
                <div className="flex items-center justify-center h-full">
                    <div className="animate-pulse text-neutral-400">Loading...</div>
                </div>
            </GraphContainer>
        )
    }

    if (data.length === 0) return null

    return (
        <GraphContainer title="Yearly Completion Trend" description="Year-over-year completion pattern">
            <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={data}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e4e4e7" />
                    <XAxis dataKey="month" fontSize={12} stroke="#71717a" />
                    <YAxis fontSize={12} stroke="#71717a" unit="%" />
                    <Tooltip />
                    <Area type="monotone" dataKey="completion" stroke="#d946ef" fill="url(#colorGradient)" strokeWidth={2} />
                    <defs>
                        <linearGradient id="colorGradient" x1="0" y1="0" x2="0" y2="1">
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
export default memo(YearlyCompletionTrend)
