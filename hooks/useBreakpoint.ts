'use client'

import { useDevice } from '@/components/providers/DeviceProvider'

export type { Breakpoint } from '@/components/providers/DeviceProvider'

export function useBreakpoint() {
    const { breakpoint, isMobile, isTablet, isDesktop, width } = useDevice()

    return {
        breakpoint,
        isMobile,
        isTablet,
        isDesktop,
        width
    }
}
