'use client'

import { motion } from 'framer-motion'
import { useBreakpoint } from '@/hooks/useBreakpoint'

interface CheckboxProps {
    checked: boolean
    onChange: () => void
    disabled?: boolean
}

export default function Checkbox({ checked, onChange, disabled }: CheckboxProps) {
    const { isMobile } = useBreakpoint()
    const size = isMobile ? 'w-7 h-7' : 'w-6 h-6'

    return (
        <motion.button
            onClick={disabled ? undefined : onChange}
            whileHover={disabled ? {} : { scale: 1.08 }}
            whileTap={disabled ? {} : { scale: 0.95 }}
            disabled={disabled}
            role="checkbox"
            aria-checked={checked}
            aria-label="Toggle habit completion"
            className={`
                relative ${size} rounded border-[1.5px] sm:border-2 transition-all focus:outline-none 
                ${disabled ? 'opacity-30 cursor-not-allowed bg-neutral-100 border-neutral-200' : 'focus:ring-2 focus:ring-primary-300 focus:ring-offset-1'}
            `}
            style={{
                backgroundColor: checked ? (disabled ? '#A0AEC0' : '#6B7FB5') : (disabled ? '#F7FAFC' : 'white'),
                borderColor: checked ? (disabled ? '#A0AEC0' : '#6B7FB5') : (disabled ? '#E2E8F0' : '#D6D3D1'),
            }}
        >
            {checked && (
                <motion.svg
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0, opacity: 0 }}
                    transition={{
                        type: 'spring',
                        stiffness: 500,
                        damping: 25
                    }}
                    className="absolute inset-0 w-full h-full"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="white"
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                >
                    <polyline points="20 6 9 17 4 12" />
                </motion.svg>
            )}
        </motion.button>
    )
}
