'use client'

import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react'

export type Breakpoint = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl'

const breakpoints = {
    sm: 640,
    md: 768,
    lg: 1024,
    xl: 1280,
    '2xl': 1536,
}

interface DeviceState {
    breakpoint: Breakpoint;
    isMobile: boolean;
    isTablet: boolean;
    isDesktop: boolean;
    isTouch: boolean;
    isHydrated: boolean;
    width: number;
}

const DeviceContext = createContext<DeviceState | undefined>(undefined)

export function DeviceProvider({ children }: { children: React.ReactNode }) {
    const [isHydrated, setIsHydrated] = useState(false)
    const [state, setState] = useState<Omit<DeviceState, 'isHydrated'>>({
        breakpoint: 'xs',
        isMobile: true,
        isTablet: false,
        isDesktop: false,
        isTouch: false,
        width: 0,
    })

    const stateRef = useRef(state)

    const updateState = useCallback(() => {
        if (typeof window === 'undefined') return

        const width = window.innerWidth
        let breakpoint: Breakpoint = 'xs'

        if (width >= breakpoints['2xl']) breakpoint = '2xl'
        else if (width >= breakpoints.xl) breakpoint = 'xl'
        else if (width >= breakpoints.lg) breakpoint = 'lg'
        else if (width >= breakpoints.md) breakpoint = 'md'
        else if (width >= breakpoints.sm) breakpoint = 'sm'

        const hasTouchPoints = navigator.maxTouchPoints > 0
        const isCoarsePointer = window.matchMedia('(pointer: coarse)').matches
        const isTouch = hasTouchPoints || isCoarsePointer

        const newState = {
            breakpoint,
            isMobile: breakpoint === 'xs' || breakpoint === 'sm',
            isTablet: breakpoint === 'md',
            isDesktop: breakpoint === 'lg' || breakpoint === 'xl' || breakpoint === '2xl',
            isTouch,
            width,
        }

        // Only update state if values actually changed to prevent unnecessary re-renders
        if (
            stateRef.current.breakpoint !== newState.breakpoint ||
            stateRef.current.isTouch !== newState.isTouch ||
            Math.abs(stateRef.current.width - newState.width) > 50 // Threshold to avoid micro-updates
        ) {
            stateRef.current = newState
            setState(newState)
        }
    }, [])

    useEffect(() => {
        setIsHydrated(true)
        updateState()

        let timeoutId: NodeJS.Timeout
        const debouncedResize = () => {
            clearTimeout(timeoutId)
            timeoutId = setTimeout(updateState, 150)
        }

        window.addEventListener('resize', debouncedResize)
        return () => window.removeEventListener('resize', debouncedResize)
    }, [updateState])

    const value = {
        ...state,
        isHydrated,
    }

    return (
        <DeviceContext.Provider value={value}>
            {children}
        </DeviceContext.Provider>
    )
}

export function useDevice() {
    const context = useContext(DeviceContext)
    if (context === undefined) {
        throw new Error('useDevice must be used within a DeviceProvider')
    }
    return context
}
