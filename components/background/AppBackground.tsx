'use client'

import React, { useState, useEffect } from 'react'
import LiquidEther from './LiquidEther'
import { ErrorBoundary } from '../ErrorBoundary'

export default function AppBackground() {
    const [isLoading, setIsLoading] = useState(true)
    const [hasTimedOut, setHasTimedOut] = useState(false)

    useEffect(() => {
        const timer = setTimeout(() => {
            if (isLoading) {
                console.warn('⚠️ LiquidEther background timed out loading.')
                setHasTimedOut(true)
                setIsLoading(false)
            }
        }, 5000)
        return () => clearTimeout(timer)
    }, [isLoading])

    const fallback = <div className="fixed inset-0 z-0 bg-gradient-to-br from-[#fdfbf7] to-[#f5f5f4]" />

    if (hasTimedOut) return fallback

    return (
        <>
            <div className={`fixed inset-0 z-0 transition-opacity duration-1000 ${isLoading ? 'opacity-0' : 'opacity-100'}`}>
                <LiquidEther onLoad={() => setIsLoading(false)} />
            </div>
            {isLoading && (
                <div className="fixed inset-0 z-0 bg-gradient-to-br from-[#fdfbf7] to-[#f5f5f4] transition-opacity duration-500" />
            )}
        </>
    )
}
