'use client'

import { useEffect, useState } from 'react'
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts'
import { useAnalytics } from '@/hooks/useAnalytics'
import GraphContainer from './GraphContainer'

interface GoalCompletionData {
    name: string
    value: number
    color: string
}

const RADIAN = Math.PI / 180;

const renderCustomLabel = ({ cx, cy, midAngle, outerRadius, name, value, fill }: any) => {
    const radius = outerRadius + 20;
    const x2 = cx + radius * Math.cos(-midAngle * RADIAN);
    const y2 = cy + radius * Math.sin(-midAngle * RADIAN);
    const x3 = x2 + (x2 > cx ? 25 : -25);

    return (
        <text
            x={x3 + (x3 > cx ? 8 : -8)}
            y={y2}
            fill={fill}
            textAnchor={x3 > cx ? 'start' : 'end'}
            dominantBaseline="central"
            className="text-[11px] font-bold uppercase tracking-tight"
        >
            {`${name}: ${value}%`}
        </text>
    );
};

const renderCustomLabelLine = (props: any) => {
    const { cx, cy, midAngle, outerRadius, fill } = props;
    const radius = outerRadius;
    const x1 = cx + radius * Math.cos(-midAngle * RADIAN);
    const y1 = cy + radius * Math.sin(-midAngle * RADIAN);
    const x2 = cx + (radius + 20) * Math.cos(-midAngle * RADIAN);
    const y2 = cy + (radius + 20) * Math.sin(-midAngle * RADIAN);
    const x3 = x2 + (x2 > cx ? 25 : -25);

    return (
        <g>
            {/* Fancy anchor dot on the pie surface */}
            <circle cx={x1} cy={y1} r={3} fill={fill} />
            <circle cx={x1} cy={y1} r={5} fill={fill} fillOpacity={0.2} />

            {/* Elegant elbow line */}
            <path
                d={`M${x1},${y1}L${x2},${y2}L${x3},${y2}`}
                stroke={fill}
                strokeWidth={2}
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </g>
    );
};

export function CompletionPiePerGoal({ year }: { year?: number }) {
    const { data: analytics, isLoading } = useAnalytics(year)
    const [data, setData] = useState<GoalCompletionData[]>([])

    useEffect(() => {
        if (analytics?.goalCompletionPie) {
            setData(analytics.goalCompletionPie)
        }
    }, [analytics])

    return (
        <GraphContainer
            title="Completion by Goal"
            description={`Success rate per goal for the year ${year || 'trailing 365 days'}`}
            fullWidth
            tall
        >
            {isLoading ? (
                <div className="flex items-center justify-center h-full">
                    <div className="animate-pulse text-neutral-400">Loading charts...</div>
                </div>
            ) : data.length === 0 ? (
                <div className="flex items-center justify-center h-full text-neutral-500 text-sm">
                    No completion data available for this period.
                </div>
            ) : (
                <div className="relative w-full h-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                            <Pie
                                data={data}
                                cx="40%"
                                cy="50%"
                                labelLine={renderCustomLabelLine}
                                label={renderCustomLabel}
                                outerRadius={160}
                                innerRadius={100}
                                stroke="rgba(0,0,0,0.5)"
                                strokeWidth={2}
                                dataKey="value"
                                paddingAngle={4}
                                minAngle={15}
                            >
                                {data.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={entry.color} />
                                ))}
                            </Pie>
                            <Tooltip
                                contentStyle={{
                                    backgroundColor: '#18181b',
                                    border: '1px solid rgba(255,255,255,0.1)',
                                    borderRadius: '12px',
                                    color: '#fff',
                                    boxShadow: '0 10px 25px -5px rgba(0,0,0,0.5)'
                                }}
                                formatter={(value) => [`${value}% Success Rate`, 'Performance']}
                            />
                            <Legend
                                layout="vertical"
                                align="right"
                                verticalAlign="middle"
                                iconType="circle"
                                formatter={(value) => <span className="text-neutral-400 font-medium ml-2 text-xs">{value}</span>}
                            />
                        </PieChart>
                    </ResponsiveContainer>
                </div>
            )}
        </GraphContainer>
    )
}
import { memo } from 'react'
export default memo(CompletionPiePerGoal)
