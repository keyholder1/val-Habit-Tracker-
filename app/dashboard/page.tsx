export const dynamic = 'force-dynamic'

import React from 'react'
import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation'
import { authOptions } from '@/lib/auth'
import DashboardLayout from '@/components/DashboardLayout'
import { ErrorBoundary } from '@/components/ErrorBoundary'

export default async function DashboardPage() {
    const session = await getServerSession(authOptions)

    if (!session?.user) {
        redirect('/login')
    }

    return (
        <ErrorBoundary>
            <React.Suspense fallback={<div className="p-4">Loading dashboard...</div>}>
                <DashboardLayout />
            </React.Suspense>
        </ErrorBoundary>
    )
}
