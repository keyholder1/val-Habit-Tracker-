import type { Metadata } from 'next'
import './globals.css'
import AuthProvider from '@/components/AuthProvider'
import BackgroundController from '@/components/background/BackgroundController'
import { validateEnv } from '@/lib/envCheck'

// Validate required environment variables on server startup
validateEnv()


export const metadata: Metadata = {
    title: 'Habit Tracker - Personal Analytics',
    description: 'Private habit tracking with advanced analytics',
}

import QueryProvider from '@/components/providers/QueryProvider'
import { DeviceProvider } from '@/components/providers/DeviceProvider'

// ...

export default function RootLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <html lang="en">
            <head>
                <link rel="preconnect" href="https://fonts.googleapis.com" />
                <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
                <link rel="dns-prefetch" href="https://val-habit-tracker.vercel.app" />
            </head>
            <body>
                <QueryProvider>
                    <AuthProvider>
                        <DeviceProvider>
                            <BackgroundController />
                            <div className="relative z-10">
                                {children}
                            </div>
                        </DeviceProvider>
                    </AuthProvider>
                </QueryProvider>
            </body>
        </html>
    )
}
