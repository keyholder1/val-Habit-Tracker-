'use client'

import { useDevice } from '@/components/providers/DeviceProvider'

const appVersion = process.env.NEXT_PUBLIC_APP_VERSION || '1.0.0'
const appEnv = process.env.NODE_ENV

export default function AppBuildInfo() {
    const { isDesktop, isHydrated } = useDevice()

    if (!isHydrated || !isDesktop) return null

    return (
        <span
            className="fixed bottom-2 right-3 text-xs text-neutral-400 opacity-60 pointer-events-none select-none z-10"
            aria-hidden="true"
        >
            Habit Tracker v{appVersion} {appEnv}
        </span>
    )
}
