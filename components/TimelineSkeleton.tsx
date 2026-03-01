'use client'

/**
 * CSS-only skeleton loader for dashboard loading states.
 * Shows soft shimmer placeholders for timeline, month view,
 * goal sidebar, and analytics entries.
 */

export function TimelineSkeleton() {
    return (
        <div className="space-y-4" role="status" aria-label="Loading content">
            {/* Week dashboard skeleton rows */}
            {[...Array(5)].map((_, i) => (
                <div key={i} className="flex items-center gap-3 p-3 rounded-xl bg-white/50">
                    <div className="skeleton-shimmer w-10 h-10 rounded-lg shrink-0" />
                    <div className="flex-1 space-y-2">
                        <div className="skeleton-shimmer h-4 rounded w-3/4" />
                        <div className="skeleton-shimmer h-3 rounded w-1/2" />
                    </div>
                    <div className="flex gap-1.5">
                        {[...Array(7)].map((_, j) => (
                            <div key={j} className="skeleton-shimmer w-6 h-6 rounded" />
                        ))}
                    </div>
                </div>
            ))}
            <span className="sr-only">Loading...</span>
        </div>
    )
}

export function GoalSidebarSkeleton() {
    return (
        <div className="space-y-3" role="status" aria-label="Loading goals">
            {[...Array(3)].map((_, i) => (
                <div key={i} className="flex items-center gap-3 p-3 rounded-xl bg-white/50">
                    <div className="skeleton-shimmer w-8 h-8 rounded-lg shrink-0" />
                    <div className="flex-1 space-y-1.5">
                        <div className="skeleton-shimmer h-4 rounded w-2/3" />
                        <div className="skeleton-shimmer h-3 rounded w-1/3" />
                    </div>
                </div>
            ))}
            <span className="sr-only">Loading goals...</span>
        </div>
    )
}

export function MonthViewSkeleton() {
    return (
        <div className="space-y-3" role="status" aria-label="Loading month view">
            {/* Month header */}
            <div className="flex items-center justify-between mb-4">
                <div className="skeleton-shimmer h-6 w-32 rounded" />
                <div className="flex gap-2">
                    <div className="skeleton-shimmer w-8 h-8 rounded-lg" />
                    <div className="skeleton-shimmer w-8 h-8 rounded-lg" />
                </div>
            </div>
            {/* Calendar grid */}
            <div className="grid grid-cols-7 gap-1">
                {[...Array(35)].map((_, i) => (
                    <div key={i} className="skeleton-shimmer h-16 rounded-lg" />
                ))}
            </div>
            <span className="sr-only">Loading month view...</span>
        </div>
    )
}

export function AnalyticsSkeleton() {
    return (
        <div className="space-y-4" role="status" aria-label="Loading analytics">
            <div className="skeleton-shimmer h-8 w-48 rounded mb-4" />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[...Array(4)].map((_, i) => (
                    <div key={i} className="p-4 rounded-xl bg-white/50 space-y-3">
                        <div className="skeleton-shimmer h-4 w-24 rounded" />
                        <div className="skeleton-shimmer h-32 rounded-lg" />
                    </div>
                ))}
            </div>
            <span className="sr-only">Loading analytics...</span>
        </div>
    )
}
