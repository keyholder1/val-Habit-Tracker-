'use client'

import React, { memo } from 'react'
import { usePathname } from 'next/navigation'
import dynamic from 'next/dynamic'

// Dynamic imports to split code and avoid loading heavy WebGL on wrong pages
const LoginDotGridBackground = dynamic(() => import('./LoginDotGridBackground'), {
    ssr: false,
})

const AppBackground = dynamic(() => import('./AppBackground'), {
    ssr: false,
})

// Memoized controller to prevent re-renders on unrelated state changes
const BackgroundController = memo(() => {
    const pathname = usePathname()

    const isLoginRoute = pathname === '/login' || pathname?.startsWith('/auth') || pathname === '/landing'

    if (isLoginRoute) {
        return <LoginDotGridBackground />
    }

    return <AppBackground />
})

BackgroundController.displayName = 'BackgroundController'

export default BackgroundController
