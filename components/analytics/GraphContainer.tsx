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
        <div className={`${fullWidth ? 'col-span-full' : ''}`}>
            <SpotlightCard className="h-full" spotlightColor="rgba(0, 229, 255, 0.2)">
                <div className="mb-4 flex items-start justify-between">
                    <div>
                        <h3 className="text-xl font-bold text-neutral-200 mb-1">{title}</h3>
                        {description && (
                            <p className="text-sm text-neutral-400">{description}</p>
                        )}
                    </div>
                    {headerAction && (
                        <div className="flex items-center gap-2">
                            {headerAction}
                        </div>
                    )}
                </div>

                <div className={heightClass}>
                    {children}
                </div>
            </SpotlightCard>
        </div>
    )
}
