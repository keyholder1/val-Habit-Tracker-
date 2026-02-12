'use client'

import React from 'react'
import DotGrid from './DotGrid'

export default function LoginDotGridBackground() {
    return (
        <div className="fixed inset-0 z-0 pointer-events-none bg-[#0a0a0a]">
            <DotGrid
                dotSize={5}
                gap={15}
                baseColor="#271E37"
                activeColor="#5227FF"
                proximity={120}
                shockRadius={250}
                shockStrength={5}
                resistance={750}
                returnDuration={1.5}
            />
        </div>
    )
}
