'use client'

import { useRef, useState, useEffect, ReactNode } from 'react'

interface LazyGraphProps {
    children: ReactNode
    /** Height of the placeholder skeleton before the component is visible */
    placeholderHeight?: number
    /** Extra margin around the root for earlier triggering */
    rootMargin?: string
}

/**
 * Wraps a chart component and only renders it when it enters the viewport.
 * Uses IntersectionObserver to detect visibility.
 * Once visible, the component stays rendered (no un-mounting on scroll-away).
 */
export default function LazyGraph({
    children,
    placeholderHeight = 400,
    rootMargin = '200px',
}: LazyGraphProps) {
    const ref = useRef<HTMLDivElement>(null)
    const [isVisible, setIsVisible] = useState(false)

    useEffect(() => {
        const el = ref.current
        if (!el) return

        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsVisible(true)
                    observer.disconnect() // Only need to trigger once
                }
            },
            { rootMargin }
        )

        observer.observe(el)
        return () => observer.disconnect()
    }, [rootMargin])

    if (!isVisible) {
        return (
            <div
                ref={ref}
                style={{ minHeight: placeholderHeight }}
                className="rounded-2xl bg-neutral-100 animate-pulse flex items-center justify-center"
            >
                <span className="text-neutral-400 text-sm">Loading chart...</span>
            </div>
        )
    }

    return <>{children}</>
}
