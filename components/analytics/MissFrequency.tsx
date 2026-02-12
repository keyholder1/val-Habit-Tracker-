'use client'

import { useEffect, useState } from 'react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { useAnalytics } from '@/hooks/useAnalytics'
import GraphContainer from './GraphContainer'

export function MissFrequency({ year }: { year?: number }) {
    const { data: analytics, isLoading } = useAnalytics(year)
    const [data, setData] = useState<any[]>([])

    useEffect(() => {
        if (analytics?.dailyTrend) {
            // Calculate miss frequency by day from daily trend
            const dailyTrend = analytics.dailyTrend || []
            const dayMisses: Record<string, number> = { Sun: 0, Mon: 0, Tue: 0, Wed: 0, Thu: 0, Fri: 0, Sat: 0 }
            const dayCounts: Record<string, number> = { Sun: 0, Mon: 0, Tue: 0, Wed: 0, Thu: 0, Fri: 0, Sat: 0 }
            const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

            dailyTrend.forEach((point: any, i: number) => {
                const dayOfWeek = dayNames[i % 7]
                dayCounts[dayOfWeek]++
                if (point.completion < 50) dayMisses[dayOfWeek]++
            })

            const result = dayNames.map(day => ({
                day,
                misses: dayMisses[day],
            }))
            setData(result)
        }
    }, [])

    if (isLoading) {
        return (
            <GraphContainer title="Miss Frequency" description="Days when habits were most often missed">
                <div className="flex items-center justify-center h-full">
                    <div className="animate-pulse text-neutral-400">Loading...</div>
                </div>
            </GraphContainer>
        )
    }

    if (data.length === 0) {
        return (
            <GraphContainer title="Miss Frequency" description="Days when habits were most often missed">
                <div className="flex items-center justify-center h-full">
                    <div className="text-neutral-400 text-sm">No data available</div>
                </div>
            </GraphContainer>
        )
    }

    return (
        <GraphContainer title="Miss Frequency" description="Days when habits were most often missed">
            <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#E7E5E4" opacity={0.5} />
                    <XAxis dataKey="day" fontSize={12} stroke="#78716C" />
                    <YAxis fontSize={12} stroke="#78716C" />
                    <Tooltip />
                    <Bar dataKey="misses" fill="#B87B63" radius={[8, 8, 0, 0]} />
                </BarChart>
            </ResponsiveContainer>
        </GraphContainer>
    )
}
import { memo } from 'react'
export default memo(MissFrequency)
