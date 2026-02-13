'use client'

import React, { memo, useState } from 'react'
import Link from 'next/link'
import dynamic from 'next/dynamic'
import LazyGraph from './LazyGraph'
import { useBreakpoint } from '@/hooks/useBreakpoint'

const DailyCompletionTrend = dynamic(() => import('./DailyCompletionTrend'), { ssr: false })
const WeeklyCompletionTrend = dynamic(() => import('./WeeklyCompletionTrend'), { ssr: false })
const MonthlyCompletionTrend = dynamic(() => import('./MonthlyCompletionTrend'), { ssr: false })
const YearlyCompletionTrend = dynamic(() => import('./YearlyCompletionTrend'), { ssr: false })
const Rolling7DayAvg = dynamic(() => import('./Rolling7DayAvg'), { ssr: false })
const Rolling30DayAvg = dynamic(() => import('./Rolling30DayAvg'), { ssr: false })
const WeeklyGoalComparison = dynamic(() => import('./WeeklyGoalComparison'), { ssr: false })
const MonthlyGoalComparison = dynamic(() => import('./MonthlyGoalComparison'), { ssr: false })
const StackedWeeklyCompletion = dynamic(() => import('./StackedWeeklyCompletion'), { ssr: false })
const StackedMonthlyCompletion = dynamic(() => import('./StackedMonthlyCompletion'), { ssr: false })
const StreakTimeline = dynamic(() => import('./StreakTimeline'), { ssr: false })
const LongestStreak = dynamic(() => import('./LongestStreak'), { ssr: false })
const MissFrequency = dynamic(() => import('./MissFrequency'), { ssr: false })
const ConsistencyRadar = dynamic(() => import('./ConsistencyRadar'), { ssr: false })
const CompletionPiePerGoal = dynamic(() => import('./CompletionPiePerGoal'), { ssr: false })
const LifetimeContribution = dynamic(() => import('./LifetimeContribution'), { ssr: false })
const TargetVsActual = dynamic(() => import('./TargetVsActual'), { ssr: false })
const CalendarHeatmap = dynamic(() => import('./CalendarHeatmap'), { ssr: false })
const WeeklyDensityHeatmap = dynamic(() => import('./WeeklyDensityHeatmap'), { ssr: false })

type Section = 'trends' | 'comparison' | 'consistency' | 'distribution' | 'heatmaps' | 'insights'

interface SectionNavProps {
    activeSection: Section;
    setActiveSection: (section: Section) => void;
    sections: { id: Section; name: string; count: number }[];
}

const SectionNav = memo(({ activeSection, setActiveSection, sections }: SectionNavProps) => (
    <div className="flex justify-center mb-8 sm:mb-16">
        <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-4 max-w-4xl w-full px-2">
            {sections.map((section) => (
                <button
                    key={section.id}
                    onClick={() => setActiveSection(section.id)}
                    className={`px-3 sm:px-6 py-2 sm:py-3.5 rounded-xl sm:rounded-2xl text-[9px] sm:text-[10px] font-black uppercase tracking-[0.15em] sm:tracking-[0.25em] transition-all duration-500 border whitespace-nowrap flex-shrink-0 ${activeSection === section.id
                        ? 'bg-white text-black border-white shadow-[0_0_40px_rgba(255,255,255,0.25)] scale-105'
                        : 'bg-neutral-900/40 text-neutral-600 border-white/5 hover:border-white/20 hover:text-neutral-300'
                        }`}
                >
                    <span className="flex items-center gap-1.5 sm:gap-3">
                        {section.name}
                        <span className={`px-1.5 py-0.5 rounded-full text-[7px] sm:text-[9px] ${activeSection === section.id ? 'bg-black text-white' : 'bg-neutral-800 text-neutral-500'}`}>
                            {section.count}
                        </span>
                    </span>
                </button>
            ))}
        </div>
    </div>
))

SectionNav.displayName = 'SectionNav'

export default function AnalyticsDashboard() {
    const [activeSection, setActiveSection] = useState<Section>('trends')
    const [selectedYear, setSelectedYear] = useState<number>(new Date().getFullYear())
    const { isMobile } = useBreakpoint()

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
                    className={`px-3 sm:px-4 py-1.5 rounded-lg text-[10px] sm:text-xs font-black tracking-widest transition-all duration-500 ${selectedYear === year
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
        <div className="min-h-screen relative bg-[#050505] text-neutral-200 overflow-x-hidden">
            {/* Nav Header */}
            <header className="border-b border-white/5 sticky top-0 z-40 bg-black/20 backdrop-blur-xl ring-1 ring-white/5">
                <div className="max-w-7xl mx-auto px-4 sm:px-8 py-4 sm:py-5 flex items-center justify-between">
                    <div className="flex items-center gap-2 sm:gap-4 group cursor-pointer">
                        <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl sm:rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-indigo-500/20 shadow-2xl ring-2 ring-white/10 group-hover:scale-110 transition-transform duration-500">
                            <span className="text-white text-lg sm:text-xl font-black">A</span>
                        </div>
                        <h1 className="text-lg sm:text-2xl font-black bg-gradient-to-r from-white via-white to-neutral-500 bg-clip-text text-transparent tracking-tighter">
                            {isMobile ? 'ANALYTICS' : 'ANALYTICS ENGINE'}
                        </h1>
                    </div>

                    <nav className="flex items-center gap-2 sm:gap-4">
                        {yearSelector}
                        <div className="hidden sm:block h-4 w-[1px] bg-white/10 mx-2" />
                        <Link
                            href="/dashboard"
                            className="px-3 sm:px-5 py-2 rounded-xl bg-white/5 hover:bg-white text-neutral-400 hover:text-black text-[10px] sm:text-xs font-black uppercase tracking-widest transition-all duration-500 border border-white/5"
                        >
                            {isMobile ? '←' : 'Back'}
                        </Link>
                    </nav>
                </div>
            </header>

            <main className="max-w-7xl mx-auto px-4 sm:px-8 py-8 sm:py-12 relative z-10">
                {/* Tabs */}
                <SectionNav
                    activeSection={activeSection}
                    setActiveSection={setActiveSection}
                    sections={sections}
                />

                {/* Section Content */}
                <div key={activeSection} className="animate-in fade-in slide-in-from-bottom-12 duration-1000 fill-mode-both overflow-x-hidden">
                    {activeSection === 'trends' && (
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-10 w-full">
                            <LazyGraph><DailyCompletionTrend year={selectedYear} /></LazyGraph>
                            <LazyGraph><WeeklyCompletionTrend year={selectedYear} /></LazyGraph>
                            <LazyGraph><MonthlyCompletionTrend year={selectedYear} /></LazyGraph>
                            <LazyGraph><YearlyCompletionTrend year={selectedYear} /></LazyGraph>
                            <LazyGraph><Rolling7DayAvg year={selectedYear} /></LazyGraph>
                            <LazyGraph><Rolling30DayAvg year={selectedYear} /></LazyGraph>
                        </div>
                    )}

                    {activeSection === 'comparison' && (
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-10 w-full">
                            <LazyGraph><WeeklyGoalComparison year={selectedYear} /></LazyGraph>
                            <LazyGraph><MonthlyGoalComparison year={selectedYear} /></LazyGraph>
                            <LazyGraph><StackedWeeklyCompletion year={selectedYear} /></LazyGraph>
                            <LazyGraph><StackedMonthlyCompletion year={selectedYear} /></LazyGraph>
                        </div>
                    )}

                    {activeSection === 'consistency' && (
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-10 w-full">
                            <LazyGraph><StreakTimeline year={selectedYear} /></LazyGraph>
                            <LazyGraph><LongestStreak year={selectedYear} /></LazyGraph>
                            <LazyGraph><MissFrequency year={selectedYear} /></LazyGraph>
                            <LazyGraph><ConsistencyRadar year={selectedYear} /></LazyGraph>
                        </div>
                    )}

                    {activeSection === 'distribution' && (
                        <div className="flex flex-col gap-6 sm:gap-10 w-full">
                            <LazyGraph><CompletionPiePerGoal year={selectedYear} /></LazyGraph>
                            <LazyGraph><LifetimeContribution year={selectedYear} /></LazyGraph>
                            <LazyGraph><TargetVsActual year={selectedYear} /></LazyGraph>
                        </div>
                    )}

                    {activeSection === 'heatmaps' && (
                        <div className="flex flex-col gap-6 sm:gap-10 w-full">
                            <LazyGraph><CalendarHeatmap year={selectedYear} /></LazyGraph>
                            <LazyGraph><WeeklyDensityHeatmap year={selectedYear} /></LazyGraph>
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
