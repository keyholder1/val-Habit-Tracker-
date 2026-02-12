'use client'

import { useEffect, useState } from 'react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts'
import { useAnalytics } from '@/hooks/useAnalytics'
import GraphContainer from './GraphContainer'
import { useRouter } from 'next/navigation'

interface TargetVsActualPoint {
    date: string
    dateIso: string
    target: number
    actual: number
}

export function TargetVsActual({ year }: { year?: number }) {
    const router = useRouter()
    const { data: analytics, isLoading } = useAnalytics(year)
    const [data, setData] = useState<TargetVsActualPoint[]>([])

    useEffect(() => {
        if (analytics?.targetVsActual) {
            setData(analytics.targetVsActual)
        }
    }, [analytics])

    return (
        <GraphContainer
            title="Target vs Actual"
            description={`Daily targets compared to actual completions for the year ${year || 'current'}`}
            fullWidth
            tall
        >
            {isLoading ? (
                <div className="flex items-center justify-center h-full">
                    <div className="animate-pulse text-neutral-400 text-sm">Loading comparison stats...</div>
                </div>
            ) : data.length === 0 ? (
                <div className="flex items-center justify-center h-full text-neutral-500 text-sm flex-col gap-2">
                    <div className="text-4xl opacity-10 mb-2">📊</div>
                    <div>No data available for the selected period.</div>
                </div>
            ) : (
                <div className="w-full h-full pb-6">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={data} barGap={6} onClick={(e) => {
                            if (e && e.activePayload && e.activePayload[0]) {
                                const point = e.activePayload[0].payload as TargetVsActualPoint
                                if (point && point.dateIso) {
                                    router.push(`/dashboard?date=${point.dateIso}`)
                                }
                            }
                        }} style={{ cursor: 'pointer' }}>
                            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                            <XAxis
                                dataKey="date"
                                fontSize={10}
                                stroke="#52525b"
                                axisLine={false}
                                tickLine={false}
                                dy={10}
                            />
                            <YAxis
                                fontSize={10}
                                stroke="#52525b"
                                axisLine={false}
                                tickLine={false}
                                width={30}
                            />
                            <Tooltip
                                contentStyle={{
                                    backgroundColor: '#0a0a0a',
                                    border: '1px solid rgba(255,255,255,0.1)',
                                    borderRadius: '16px',
                                    color: '#fff',
                                    boxShadow: '0 20px 50px -10px rgba(0,0,0,0.8)',
                                    backdropFilter: 'blur(10px)'
                                }}
                                cursor={{ fill: 'rgba(255,255,255,0.03)' }}
                            />
                            <Legend verticalAlign="top" align="right" height={40} iconType="circle" />
                            <Bar
                                dataKey="target"
                                fill="#27272a"
                                name="Planned Target"
                                radius={[6, 6, 0, 0]}
                                barSize={20}
                            />
                            <Bar
                                dataKey="actual"
                                fill="#3b82f6"
                                name="Actual Done"
                                radius={[6, 6, 0, 0]}
                                barSize={20}
                                fillOpacity={0.9}
                            />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            )}
        </GraphContainer>
    )
}
import { memo } from 'react'
export default memo(TargetVsActual)
