'use client'

import { useRef, useEffect, useState } from 'react'
import { motion, useInView, Variants } from 'framer-motion'

interface BlurTextProps {
    text: string
    className?: string
    variant?: Variants
    duration?: number
    delay?: number
    animateBy?: 'words' | 'letters'
    direction?: 'top' | 'bottom'
    onAnimationComplete?: () => void
    style?: React.CSSProperties
}

export default function BlurText({
    text,
    className = '',
    variant,
    duration = 1,
    delay = 0,
    animateBy = 'words',
    direction = 'top',
    onAnimationComplete,
    style,
}: BlurTextProps) {
    const ref = useRef(null)
    const isInView = useInView(ref, { once: true })

    const defaultVariants: Variants = {
        hidden: {
            filter: 'blur(10px)',
            opacity: 0,
            y: direction === 'top' ? 20 : -20
        },
        visible: {
            filter: 'blur(0px)',
            opacity: 1,
            y: 0
        },
    }

    const combinedVariants = variant || defaultVariants
    const words = text.split(' ')

    return (
        <div ref={ref} className={`flex flex-wrap ${className}`} style={style}>
            {words.map((word, i) => (
                <motion.span
                    key={i}
                    variants={combinedVariants}
                    initial="hidden"
                    animate={isInView ? 'visible' : 'hidden'}
                    transition={{
                        duration: duration,
                        delay: delay + i * 0.2,
                        ease: [0.25, 0.4, 0.25, 1],
                    }}
                    className="mr-2 inline-block"
                    onAnimationComplete={i === words.length - 1 ? onAnimationComplete : undefined}
                >
                    {word}
                </motion.span>
            ))}
        </div>
    )
}
