'use client'

import { useEffect, useRef } from 'react'

/**
 * Lightweight hook that tracks whether a component is still mounted.
 *
 * Usage:
 *   const { isMountedRef } = useSafeUnmount()
 *   // In async callbacks:
 *   if (!isMountedRef.current) return
 */
export function useSafeUnmount() {
    const isMountedRef = useRef(true)

    useEffect(() => {
        isMountedRef.current = true
        return () => {
            isMountedRef.current = false
        }
    }, [])

    return { isMountedRef }
}
