'use client'

import { ReactNode } from 'react'
import SpotlightCard from '../SpotlightCard'

interface GraphContainerProps {
    title: string
    description?: string
    children: ReactNode
    fullWidth?: boolean
    tall?: boolean
    headerAction?: ReactNode
}

export default function GraphContainer({ title, description, children, fullWidth, tall, headerAction }: GraphContainerProps) {
    const heightClass = tall
        ? 'h-[550px]'
        : fullWidth
            ? 'h-[450px]'
            : 'h-[350px]'

    return (
        <div className={`w-full overflow-hidden ${fullWidth ? 'col-span-full' : ''}`}>
            <SpotlightCard className="h-full overflow-hidden" spotlightColor="rgba(0, 229, 255, 0.2)">
                <div className="mb-4 flex items-start justify-between">
                    <div className="min-w-0 flex-1 pr-2">
                        <h3 className="text-lg sm:text-xl font-bold text-neutral-200 mb-0.5 sm:mb-1 truncate">{title}</h3>
                        {description && (
                            <p className="text-[10px] sm:text-sm text-neutral-400 truncate">{description}</p>
                        )}
                    </div>
                    {headerAction && (
                        <div className="flex items-center gap-2 shrink-0">
                            {headerAction}
                        </div>
                    )}
                </div>

                <div className={`${heightClass} overflow-hidden w-full relative`}>
                    {children}
                </div>
            </SpotlightCard>
        </div>
    )
}
