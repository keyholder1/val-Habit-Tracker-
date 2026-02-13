'use client'

import { useState, useCallback, useMemo, useEffect } from 'react'
import { signOut, useSession } from 'next-auth/react'
import { useSearchParams, useRouter } from 'next/navigation'
import { useQueryClient } from '@tanstack/react-query'
import CalendarPicker, { getWeekStart } from './CalendarPicker'
import BigCalendar from './BigCalendar'
import WeekDashboard from './WeekDashboard'
import { GoalSidebar } from './GoalSidebar'
import MigraineModal from './migraine/MigraineModal'
import VirtualDiaryPanel from './migraine/VirtualDiaryPanel'
import Link from 'next/link'
import { isMigraineUser, isProjectUser } from '@/lib/whitelist'
import ProjectDiaryPanel from './project/ProjectDiaryPanel'
import { useGoals, Goal } from '@/hooks/useGoals'
import { useBreakpoint } from '@/hooks/useBreakpoint'
import { useIsTouchDevice } from '@/hooks/useIsTouchDevice'
import BottomNav from './navigation/BottomNav'
import { motion, AnimatePresence } from 'framer-motion'


type ViewMode = 'month' | 'week'

export default function DashboardLayout() {
    const queryClient = useQueryClient()
    const { data: session, status } = useSession()
    const showMigraineFeatures = isMigraineUser(session?.user?.email)
    const showProjectFeatures = isProjectUser(session?.user?.email)
    const searchParams = useSearchParams()
    const router = useRouter()

    const [viewMode, setViewMode] = useState<ViewMode>('week')
    const { goals: goalsData, isLoading: goalsLoading, error: goalsError } = useGoals()
    const { isMobile, breakpoint } = useBreakpoint()
    const isTouch = useIsTouchDevice()

    // Debug logging for goals data
    useEffect(() => {
        if (status === 'authenticated') {
            console.log('📊 [Dashboard] Session user:', session?.user?.email)
            console.log('📊 [Dashboard] Goals loading state:', goalsLoading)
            if (goalsData) {
                console.log('📊 [Dashboard] Goals fetched:', (goalsData as any).length)
            }
            if (goalsError) {
                console.error('📊 [Dashboard] Goals fetch error:', goalsError)
            }
        }
    }, [status, session, goalsLoading, goalsData, goalsError])

    // Derived state
    const goals = goalsData || []

    // State
    const [selectedDate, setSelectedDate] = useState(new Date())
    const [displayMonth, setDisplayMonth] = useState(new Date())
    const [isMigraineModalOpen, setIsMigraineModalOpen] = useState(false)
    const [isDiaryOpen, setIsDiaryOpen] = useState(false)
    const [isProjectPanelOpen, setIsProjectPanelOpen] = useState(false)
    const [isGoalSidebarOpen, setIsGoalSidebarOpen] = useState(false)

    // Data sync version for migraine history
    const [migraineDataVersion, setMigraineDataVersion] = useState(0)

    const handleMigraineSave = useCallback(() => {
        setMigraineDataVersion(v => v + 1)
        setIsMigraineModalOpen(false) // UX Fix: Close modal immediately
        console.log('✅ [Dashboard] Migraine entry saved. Closing modal & refreshing history.')
    }, [])

    const handleDateSelect = useCallback((date: Date) => {
        setSelectedDate(date)
    }, [])

    const handleHistoryDateSelect = useCallback((date: Date) => {
        setSelectedDate(date)
        setIsMigraineModalOpen(true)
    }, [])

    const selectedWeekStart = useMemo(() => getWeekStart(selectedDate), [selectedDate])
    const activeGoals = goals


    const goToPrevWeek = useCallback(() => {
        const prev = new Date(selectedDate)
        prev.setDate(prev.getDate() - 7)
        handleDateSelect(prev)
        setDisplayMonth(new Date(prev.getFullYear(), prev.getMonth(), 1))
    }, [selectedDate, handleDateSelect])

    const goToNextWeek = useCallback(() => {
        const next = new Date(selectedDate)
        next.setDate(next.getDate() + 7)
        handleDateSelect(next)
        setDisplayMonth(new Date(next.getFullYear(), next.getMonth(), 1))
    }, [selectedDate, handleDateSelect])

    const [mounted, setMounted] = useState(false)
    useEffect(() => {
        setMounted(true)
    }, [])

    if (!mounted) return null

    return (
        <div className="min-h-screen relative flex flex-col bg-transparent">
            {/* Header */}
            <header className="glass border-b border-neutral-200/50 sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
                    <div className="flex items-center gap-4 sm:gap-8">
                        {isMobile && (
                            <button
                                onClick={() => setIsGoalSidebarOpen(true)}
                                className="p-2 hover:bg-neutral-100 rounded-lg text-neutral-500"
                            >
                                ☰
                            </button>
                        )}
                        <h1 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent">
                            Habit Tracker
                        </h1>

                        <div className="hidden sm:flex items-center bg-neutral-100 rounded-lg p-1">
                            <button
                                onClick={() => setViewMode('month')}
                                className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all ${viewMode === 'month'
                                    ? 'bg-white text-primary-600 shadow-sm'
                                    : 'text-neutral-500 hover:text-neutral-900'
                                    }`}
                            >
                                Month View
                            </button>
                            <button
                                onClick={() => setViewMode('week')}
                                className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all ${viewMode === 'week'
                                    ? 'bg-white text-primary-600 shadow-sm'
                                    : 'text-neutral-500 hover:text-neutral-900'
                                    }`}
                            >
                                Week View
                            </button>
                        </div>
                    </div>

                    <nav className="flex items-center gap-6">
                        <button
                            onClick={() => queryClient.invalidateQueries()}
                            className="p-2 hover:bg-neutral-100 rounded-lg text-neutral-500 hover:text-primary-600 transition-colors"
                            title="Refresh Data"
                        >
                            <svg className={`w-5 h-5 ${goalsLoading ? 'animate-spin' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                            </svg>
                        </button>
                        <Link
                            href="/analytics"
                            className="text-neutral-700 hover:text-primary-600 font-medium transition-colors"
                        >
                            Analytics
                        </Link>
                        <button
                            onClick={() => signOut({ callbackUrl: '/login' })}
                            className="px-4 py-2 bg-neutral-100 hover:bg-neutral-200 rounded-lg text-sm font-medium transition-colors"
                        >
                            Sign Out
                        </button>
                    </nav>
                </div>
            </header>

            <main className="flex-1 max-w-[1600px] w-full mx-auto px-6 py-8 relative z-10">
                {viewMode === 'month' ? (
                    <div className="h-[calc(100vh-140px)]">
                        <BigCalendar
                            onDateSelect={handleDateSelect}
                            goals={goals}
                        />
                    </div>
                ) : (
                    <div className="flex flex-col lg:grid lg:grid-cols-12 gap-6 h-full">
                        {/* Sidebar: Hidden on mobile/tablet, shown on desktop (lg+) */}
                        <div className="hidden lg:block lg:col-span-3 space-y-6">
                            <CalendarPicker
                                selectedDate={selectedDate}
                                onDateSelect={handleDateSelect}
                                displayMonth={displayMonth}
                                onDisplayMonthChange={setDisplayMonth}
                            />
                            <GoalSidebar selectedDate={selectedDate} />
                        </div>

                        {/* Main Content: Full width on mobile/tablet, col-span-9 on desktop */}
                        {/* If we strictly follow the 6+3 logic, adjust accordingly. Currently it was col-span-6. */}
                        <div className="w-full lg:col-span-6">
                            <div className="flex items-center justify-between mb-4">
                                <button
                                    onClick={goToPrevWeek}
                                    className="flex items-center gap-1 px-3 py-2 rounded-lg bg-white/60 hover:bg-white/80 text-neutral-600 text-sm font-medium transition-all"
                                >
                                    ← <span className="hidden sm:inline">Prev Week</span>
                                </button>
                                <h2 className="text-base sm:text-lg font-semibold text-neutral-700 text-center">
                                    {selectedDate.toLocaleDateString('en-US', { weekday: isMobile ? 'short' : 'long', month: isMobile ? 'short' : 'long', day: 'numeric' })}
                                </h2>
                                <button
                                    onClick={goToNextWeek}
                                    className="flex items-center gap-1 px-3 py-2 rounded-lg bg-white/60 hover:bg-white/80 text-neutral-600 text-sm font-medium transition-all"
                                >
                                    <span className="hidden sm:inline">Next Week</span> →
                                </button>
                            </div>

                            {goalsLoading ? (
                                <div className="space-y-4">
                                    <div className="animate-pulse bg-neutral-100 rounded-lg h-32" />
                                </div>
                            ) : (
                                <WeekDashboard
                                    key={selectedWeekStart.toISOString()}
                                    weekStartDate={selectedWeekStart}
                                    goals={activeGoals}
                                    highlightDate={selectedDate}
                                    onDateSelect={handleDateSelect}
                                />
                            )}
                        </div>

                        {/* Extra space / Placeholder for Analytics summary on Desktop if col-span-3 remains empty */}
                        <div className="hidden lg:block lg:col-span-3 h-full">
                            {/* Analytics summary could go here later */}
                        </div>
                    </div>
                )}
            </main>

            <div className="fixed bottom-8 right-8 flex flex-col items-end gap-4 z-40">
                {showMigraineFeatures && (
                    <>
                        <button
                            onClick={() => setIsDiaryOpen(true)}
                            className="p-3 bg-white hover:bg-neutral-50 text-neutral-600 hover:text-primary-600 rounded-full shadow-lg hover:shadow-xl transition-all group relative border border-neutral-200"
                        >
                            <span className="text-xl">📅</span>
                        </button>

                        <button
                            onClick={() => setIsMigraineModalOpen(true)}
                            className="p-4 bg-primary-600 hover:bg-primary-700 text-white rounded-full shadow-lg hover:shadow-xl transition-all group relative"
                        >
                            <span className="text-2xl">🧠</span>
                        </button>
                    </>
                )}

                {showProjectFeatures && (
                    <>
                        <button
                            onClick={() => setIsProjectPanelOpen(true)}
                            className="p-3 bg-white hover:bg-neutral-50 text-neutral-600 hover:text-indigo-600 rounded-full shadow-lg hover:shadow-xl transition-all group relative border border-neutral-200"
                        >
                            <span className="text-xl">🔐</span>
                        </button>

                        <button
                            onClick={() => setIsProjectPanelOpen(true)}
                            className="p-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-full shadow-lg hover:shadow-xl transition-all group relative"
                        >
                            <span className="text-2xl">🚀</span>
                        </button>
                    </>
                )}
            </div>

            {showMigraineFeatures && isMigraineModalOpen && (
                <MigraineModal
                    isOpen={isMigraineModalOpen}
                    onClose={() => setIsMigraineModalOpen(false)}
                    date={selectedDate}
                    onEntrySaved={handleMigraineSave}
                />
            )}

            {showMigraineFeatures && isDiaryOpen && (
                <VirtualDiaryPanel
                    isOpen={isDiaryOpen}
                    onClose={() => setIsDiaryOpen(false)}
                    onDateSelect={handleHistoryDateSelect}
                    refreshTrigger={migraineDataVersion}
                />
            )}

            {/* Mobile Goal Sidebar Drawer */}
            <AnimatePresence>
                {isMobile && isGoalSidebarOpen && (
                    <div className="fixed inset-0 z-[70] lg:hidden">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsGoalSidebarOpen(false)}
                            className="absolute inset-0 bg-black/20 backdrop-blur-sm"
                        />
                        <motion.div
                            initial={{ x: '-100%' }}
                            animate={{ x: 0 }}
                            exit={{ x: '-100%' }}
                            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                            className="absolute inset-y-0 left-0 w-[85%] max-w-sm bg-white shadow-2xl p-6 overflow-y-auto"
                        >
                            <div className="flex justify-between items-center mb-6">
                                <h3 className="font-bold text-lg">Goals & Calendar</h3>
                                <button onClick={() => setIsGoalSidebarOpen(false)} className="p-2 hover:bg-neutral-100 rounded-full">✕</button>
                            </div>
                            <div className="space-y-6">
                                <CalendarPicker
                                    selectedDate={selectedDate}
                                    onDateSelect={(d) => {
                                        handleDateSelect(d)
                                        setIsGoalSidebarOpen(false)
                                    }}
                                    displayMonth={displayMonth}
                                    onDisplayMonthChange={setDisplayMonth}
                                />
                                <GoalSidebar selectedDate={selectedDate} />
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* Mobile Navigation */}
            {isMobile && (
                <BottomNav
                    activeView={viewMode}
                    onViewChange={setViewMode}
                    onDiaryToggle={() => setIsDiaryOpen(true)}
                />
            )}

            {showProjectFeatures && (
                <ProjectDiaryPanel
                    isOpen={isProjectPanelOpen}
                    onClose={() => setIsProjectPanelOpen(false)}
                />
            )}
        </div>
    )
}
