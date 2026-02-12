'use client'

import { useEffect, useState } from 'react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { useAnalytics } from '@/hooks/useAnalytics'
import GraphContainer from './GraphContainer'

export function LongestStreak({ year }: { year?: number }) {
    const { data: analytics, isLoading } = useAnalytics(year)
    const [data, setData] = useState<any[]>([])

    useEffect(() => {
        if (analytics?.longestStreaks) {
            const streaks = (analytics.longestStreaks || []).map((s: any) => ({
                goal: s.goalName,
                streak: s.longestStreak,
            }))
            setData(streaks)
        }
    }, [analytics])

    if (isLoading) {
        return (
            <GraphContainer title="Longest Streak" description="Best consecutive streak achieved per goal">
                <div className="flex items-center justify-center h-full">
                    <div className="animate-pulse text-neutral-400">Loading...</div>
                </div>
            </GraphContainer>
        )
    }

    if (data.length === 0) {
        return (
            <GraphContainer title="Longest Streak" description="Best consecutive streak achieved per goal">
                <div className="flex items-center justify-center h-full">
                    <div className="text-neutral-400 text-sm">No data available</div>
                </div>
            </GraphContainer>
        )
    }

    return (
        <GraphContainer title="Longest Streak" description="Best consecutive streak achieved per goal">
            <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e4e4e7" />
                    <XAxis dataKey="goal" fontSize={12} stroke="#71717a" />
                    <YAxis fontSize={12} stroke="#71717a" label={{ value: 'Days', angle: -90, position: 'insideLeft' }} />
                    <Tooltip />
                    <Bar dataKey="streak" fill="#10b981" radius={[8, 8, 0, 0]} />
                </BarChart>
            </ResponsiveContainer>
        </GraphContainer>
    )
}
import { memo } from 'react'
export default memo(LongestStreak)
