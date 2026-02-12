'use client'

import { motion } from 'framer-motion'

interface ProgressBarProps {
    progress: number // 0-100
    className?: string
}

export default function ProgressBar({ progress, className = '' }: ProgressBarProps) {
    // Color gradient based on progress - using calm,  gentle colors
    const getColor = (progress: number) => {
        if (progress >= 100) return 'from-success-400 to-success-600'
        if (progress >= 75) return 'from-primary-400 to-primary-500'
        if (progress >= 50) return 'from-secondary-400 to-secondary-500'
        return 'from-neutral-200 to-neutral-300'
    }

    return (
        <div className={`flex-1 h-2 bg-neutral-100 rounded-full overflow-hidden ${className || ''}`}>
            <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${Math.min(progress, 100)}%` }}
                transition={{
                    type: 'spring',
                    stiffness: 100,
                    damping: 15,
                }}
                className={`h-full bg-gradient-to-r ${getColor(progress)} rounded-full`}
            />
        </div>
    )
}
