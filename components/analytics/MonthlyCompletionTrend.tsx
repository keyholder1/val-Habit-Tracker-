'use client'

import { useEffect, useState } from 'react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { useAnalytics } from '@/hooks/useAnalytics'
import GraphContainer from './GraphContainer'

import { useRouter } from 'next/navigation'

const MonthlyCompletionTrend = ({ year }: { year?: number }) => {
    const router = useRouter()
    const { data: analytics, isLoading } = useAnalytics(year)
    const [data, setData] = useState<any[]>([])

    useEffect(() => {
        if (analytics?.monthlyTrend) {
            setData(analytics.monthlyTrend || [])
        }
    }, [analytics])

    if (isLoading) return <GraphContainer title="Monthly Completion Trend" description="Average completion rate by month"><div className="flex items-center justify-center h-full"><div className="animate-pulse text-neutral-400">Loading...</div></div></GraphContainer>
    if (data.length === 0) return <GraphContainer title="Monthly Completion Trend" description="Average completion rate by month"><div className="flex items-center justify-center h-full"><div className="text-neutral-400 text-sm">No data yet</div></div></GraphContainer>

    return (
        <GraphContainer title="Monthly Completion Trend" description="Average completion rate by month">
            <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data} onClick={(e) => {
                    if (e && e.activePayload && e.activePayload[0]) {
                        const point = e.activePayload[0].payload
                        if (point && point.month) {
                            // point.month is "YYYY-MM"
                            // Navigate to the 1st of that month
                            router.push(`/dashboard?date=${point.month}-01`)
                        }
                    }
                }} style={{ cursor: 'pointer' }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e4e4e7" />
                    <XAxis dataKey="month" fontSize={12} stroke="#71717a"
                        tickFormatter={(val) => {
                            const [y, m] = val.split('-')
                            return new Date(parseInt(y), parseInt(m) - 1).toLocaleDateString('en-US', { month: 'short' })
                        }}
                    />
                    <YAxis fontSize={12} stroke="#71717a" unit="%" />
                    <Tooltip cursor={{ fill: 'rgba(0,0,0,0.05)' }} labelFormatter={(val) => {
                        const [y, m] = val.split('-')
                        return new Date(parseInt(y), parseInt(m) - 1).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
                    }} />
                    <Bar dataKey="completion" fill="#0ea5e9" radius={[8, 8, 0, 0]} />
                </BarChart>
            </ResponsiveContainer>
        </GraphContainer>
    )
}

import { memo } from 'react'
export default memo(MonthlyCompletionTrend)
