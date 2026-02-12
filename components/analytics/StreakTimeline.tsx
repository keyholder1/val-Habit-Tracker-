'use client'

import { useEffect, useState } from 'react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { useAnalytics } from '@/hooks/useAnalytics'
import GraphContainer from './GraphContainer'

export function StreakTimeline({ year }: { year?: number }) {
    const { data: analytics, isLoading, error } = useAnalytics(year)
    const [data, setData] = useState<any[]>([])

    useEffect(() => {
        if (analytics) {
            const streaks = (analytics.streakTimeline || []).map((s: any) => ({
                goal: s.goalName,
                current: s.currentStreak,
                longest: s.longestStreak,
            }))
            setData(streaks)
        }
    }, [analytics])


    if (isLoading) {
        return (
            <GraphContainer title="Streak Timeline" description="Current and longest streaks per goal">
                <div className="flex items-center justify-center h-full">
                    <div className="animate-pulse text-neutral-400">Loading...</div>
                </div>
            </GraphContainer>
        )
    }

    if (error) {
        return (
            <GraphContainer title="Streak Timeline" description="Status: Error">
                <div className="flex flex-col items-center justify-center h-full text-red-500 p-4 text-center">
                    <svg className="w-8 h-8 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <p className="font-medium">Failed to load timeline</p>
                    <p className="text-xs opacity-75 mt-1">{error instanceof Error ? error.message : 'Unknown error'}</p>
                    <button
                        onClick={() => window.location.reload()}
                        className="mt-4 px-3 py-1 bg-red-100 text-red-700 rounded-lg text-xs hover:bg-red-200 transition-colors"
                    >
                        Reload Page
                    </button>
                </div>
            </GraphContainer>
        )
    }

    if (data.length === 0) {
        return (
            <GraphContainer title="Streak Timeline" description="Current and longest streaks per goal">
                <div className="flex items-center justify-center h-full">
                    <div className="text-neutral-400 text-sm">No data available</div>
                </div>
            </GraphContainer>
        )
    }

    return (
        <GraphContainer title="Streak Timeline" description="Current and longest streaks per goal">
            <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e4e4e7" />
                    <XAxis dataKey="goal" fontSize={12} stroke="#71717a" />
                    <YAxis fontSize={12} stroke="#71717a" label={{ value: 'Days', angle: -90, position: 'insideLeft' }} />
                    <Tooltip />
                    <Bar dataKey="current" fill="#0ea5e9" name="Current Streak" radius={[8, 8, 0, 0]} />
                    <Bar dataKey="longest" fill="#10b981" name="Longest Streak" radius={[8, 8, 0, 0]} />
                </BarChart>
            </ResponsiveContainer>
        </GraphContainer>
    )
}
import { memo } from 'react'
export default memo(StreakTimeline)
