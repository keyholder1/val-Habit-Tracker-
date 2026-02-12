'use client'

import { useState } from 'react'
import Link from 'next/link'
import { signOut } from 'next-auth/react'
import LazyGraph from './LazyGraph'

import DailyCompletionTrend from './DailyCompletionTrend'
import WeeklyCompletionTrend from './WeeklyCompletionTrend'
import MonthlyCompletionTrend from './MonthlyCompletionTrend'
import YearlyCompletionTrend from './YearlyCompletionTrend'
import Rolling7DayAvg from './Rolling7DayAvg'
import Rolling30DayAvg from './Rolling30DayAvg'
import WeeklyGoalComparison from './WeeklyGoalComparison'
import MonthlyGoalComparison from './MonthlyGoalComparison'
import StackedWeeklyCompletion from './StackedWeeklyCompletion'
import StackedMonthlyCompletion from './StackedMonthlyCompletion'
import StreakTimeline from './StreakTimeline'
import LongestStreak from './LongestStreak'
import MissFrequency from './MissFrequency'
import ConsistencyRadar from './ConsistencyRadar'
import CompletionPiePerGoal from './CompletionPiePerGoal'
import LifetimeContribution from './LifetimeContribution'
import TargetVsActual from './TargetVsActual'
import CalendarHeatmap from './CalendarHeatmap'
import WeeklyDensityHeatmap from './WeeklyDensityHeatmap'

type Section = 'trends' | 'comparison' | 'consistency' | 'distribution' | 'heatmaps' | 'insights'

export default function AnalyticsDashboard() {
    const [activeSection, setActiveSection] = useState<Section>('distribution')
    const [selectedYear, setSelectedYear] = useState<number>(new Date().getFullYear())

    const sections = [
        { id: 'trends' as Section, name: 'Trends', count: 6 },
        { id: 'comparison' as Section, name: 'Comparisons', count: 4 },
        { id: 'consistency' as Section, name: 'Consistency', count: 4 },
        { id: 'distribution' as Section, name: 'Distribution', count: 3 },
        { id: 'heatmaps' as Section, name: 'Heatmaps', count: 2 },
    ]

    const years = [new Date().getFullYear() - 1, new Date().getFullYear()]

    const yearSelector = (
        <div className="flex bg-black/40 p-1 rounded-xl border border-white/5 shadow-2xl backdrop-blur-md">
            {years.map(year => (
                <button
                    key={year}
                    onClick={() => setSelectedYear(year)}
                    className={`px-4 py-1.5 rounded-lg text-xs font-black tracking-widest transition-all duration-500 ${selectedYear === year
                        ? 'bg-white text-black shadow-white-glow'
                        : 'text-neutral-600 hover:text-neutral-400 hover:bg-white/5'
                        }`}
                >
                    {year}
                </button>
            ))}
        </div>
    )

    return (
        <div className="min-h-screen relative bg-[#050505] text-neutral-200">
            {/* Nav Header */}
            <header className="border-b border-white/5 sticky top-0 z-40 bg-black/20 backdrop-blur-xl ring-1 ring-white/5">
                <div className="max-w-7xl mx-auto px-8 py-5 flex items-center justify-between">
                    <div className="flex items-center gap-4 group cursor-pointer">
                        <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-indigo-500/20 shadow-2xl ring-2 ring-white/10 group-hover:scale-110 transition-transform duration-500">
                            <span className="text-white text-xl font-black">A</span>
                        </div>
                        <h1 className="text-2xl font-black bg-gradient-to-r from-white via-white to-neutral-500 bg-clip-text text-transparent tracking-tighter">
                            ANALYTICS ENGINE
                        </h1>
                    </div>

                    <nav className="flex items-center gap-4">
                        {yearSelector}
                        <div className="h-4 w-[1px] bg-white/10 mx-2" />
                        <Link
                            href="/dashboard"
                            className="px-5 py-2 rounded-xl bg-white/5 hover:bg-white text-neutral-400 hover:text-black text-xs font-black uppercase tracking-widest transition-all duration-500 border border-white/5"
                        >
                            Back
                        </Link>
                    </nav>
                </div>
            </header>

            <main className="max-w-7xl mx-auto px-8 py-12 relative z-10">
                {/* Tabs */}
                <div className="flex items-center gap-3 mb-16 overflow-x-auto pb-4 no-scrollbar">
                    {sections.map((section) => (
                        <button
                            key={section.id}
                            onClick={() => setActiveSection(section.id)}
                            className={`px-6 py-3.5 rounded-2xl text-[10px] font-black uppercase tracking-[0.25em] transition-all duration-500 border ${activeSection === section.id
                                ? 'bg-white text-black border-white shadow-[0_0_50px_rgba(255,255,255,0.3)] scale-105'
                                : 'bg-neutral-900/40 text-neutral-600 border-white/5 hover:border-white/20 hover:text-neutral-300'
                                }`}
                        >
                            <span className="flex items-center gap-3">
                                {section.name}
                                <span className={`px-2 py-0.5 rounded-full text-[9px] ${activeSection === section.id ? 'bg-black text-white' : 'bg-neutral-800 text-neutral-500'}`}>
                                    {section.count}
                                </span>
                            </span>
                        </button>
                    ))}
                </div>

                {/* Section Content */}
                <div key={activeSection} className="animate-in fade-in slide-in-from-bottom-12 duration-1000 fill-mode-both">
                    {activeSection === 'trends' && (
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                            <DailyCompletionTrend year={selectedYear} />
                            <WeeklyCompletionTrend year={selectedYear} />
                            <MonthlyCompletionTrend year={selectedYear} />
                            <YearlyCompletionTrend year={selectedYear} />
                            <Rolling7DayAvg year={selectedYear} />
                            <Rolling30DayAvg year={selectedYear} />
                        </div>
                    )}

                    {activeSection === 'comparison' && (
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                            <WeeklyGoalComparison year={selectedYear} />
                            <MonthlyGoalComparison year={selectedYear} />
                            <StackedWeeklyCompletion year={selectedYear} />
                            <StackedMonthlyCompletion year={selectedYear} />
                        </div>
                    )}

                    {activeSection === 'consistency' && (
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                            <StreakTimeline year={selectedYear} />
                            <LongestStreak year={selectedYear} />
                            <MissFrequency year={selectedYear} />
                            <ConsistencyRadar year={selectedYear} />
                        </div>
                    )}

                    {activeSection === 'distribution' && (
                        <div className="flex flex-col gap-10">
                            <CompletionPiePerGoal year={selectedYear} />
                            <LifetimeContribution year={selectedYear} />
                            <TargetVsActual year={selectedYear} />
                        </div>
                    )}

                    {activeSection === 'heatmaps' && (
                        <div className="flex flex-col gap-10">
                            <CalendarHeatmap year={selectedYear} />
                            <WeeklyDensityHeatmap year={selectedYear} />
                        </div>
                    )}
                </div>
            </main>

            <style jsx global>{`
                .shadow-white-glow {
                    box-shadow: 0 0 15px rgba(255, 255, 255, 0.4);
                }
                .custom-scrollbar::-webkit-scrollbar {
                    height: 4px;
                }
                .custom-scrollbar::-webkit-scrollbar-track {
                    background: rgba(255, 255, 255, 0.02);
                }
                .custom-scrollbar::-webkit-scrollbar-thumb {
                    background: rgba(255, 255, 255, 0.1);
                    border-radius: 10px;
                }
            `}</style>
        </div>
    )
}
