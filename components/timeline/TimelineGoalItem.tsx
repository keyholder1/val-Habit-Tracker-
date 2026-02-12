'use client'

import React from 'react'
import { Goal } from '@/hooks/useGoals'

interface TimelineGoalItemProps {
    goal: Goal
}

export default function TimelineGoalItem({ goal }: TimelineGoalItemProps) {
    return (
        <div className="flex flex-col">
            <span className="font-medium text-neutral-800">{goal.name}</span>
            <span className="text-sm font-medium text-neutral-600">
                Target: <span className="text-primary-600 font-bold">{goal.weeklyTarget ?? 1}</span> / week
            </span>
        </div>
    )
}
