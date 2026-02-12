'use client'

import React, { useMemo } from 'react'
import { getLinearGradientCSS } from '@/lib/completion-color'

export default function CompletionLegend() {
    const gradient = useMemo(() => getLinearGradientCSS('to right'), [])

    return (
        <div className="flex flex-col gap-1 select-none">
            {/* Gradient Bar */}
            <div
                className="w-32 h-2 rounded-full shadow-inner border border-black/5"
                style={{ background: gradient }}
            />

            {/* Labels */}
            <div className="flex justify-between w-full text-[10px] font-medium text-neutral-400 leading-none">
                <span>Low</span>
                <span>Med</span>
                <span>High</span>
            </div>
        </div>
    )
}
