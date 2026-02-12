import type { Metadata } from 'next'
import './globals.css'
import AuthProvider from '@/components/AuthProvider'
import BackgroundController from '@/components/background/BackgroundController'

export const metadata: Metadata = {
    title: 'Habit Tracker - Personal Analytics',
    description: 'Private habit tracking with advanced analytics',
}

import QueryProvider from '@/components/providers/QueryProvider'

// ...

export default function RootLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <html lang="en">
            <body>
                <QueryProvider>
                    <AuthProvider>
                        <BackgroundController />
                        <div className="relative z-10">
                            {children}
                        </div>
                    </AuthProvider>
                </QueryProvider>
            </body>
        </html>
    )
}
