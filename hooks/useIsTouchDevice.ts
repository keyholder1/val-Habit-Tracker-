'use client'

import { useState, useEffect } from 'react'

export function useIsTouchDevice() {
    const [isTouch, setIsTouch] = useState(false)

    useEffect(() => {
        const checkTouch = () => {
            const hasTouchPoints = navigator.maxTouchPoints > 0
            const isCoarsePointer = window.matchMedia('(pointer: coarse)').matches
            setIsTouch(hasTouchPoints || isCoarsePointer)
        }

        checkTouch()

        // Some devices might toggle (e.g. tablet mode), so we can re-check on resize
        window.addEventListener('resize', checkTouch)
        return () => window.removeEventListener('resize', checkTouch)
    }, [])

    return isTouch
}
