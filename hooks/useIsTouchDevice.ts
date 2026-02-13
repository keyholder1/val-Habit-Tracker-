'use client'

import { useDevice } from '@/components/providers/DeviceProvider'

export function useIsTouchDevice() {
    const { isTouch } = useDevice()
    return isTouch
}
