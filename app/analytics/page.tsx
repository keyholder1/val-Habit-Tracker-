export const dynamic = 'force-dynamic'

import { getServerSession } from 'next-auth/next'
import { redirect } from 'next/navigation'
import { authOptions } from '@/lib/auth'
import AnalyticsDashboard from '@/components/analytics/AnalyticsDashboard'

export default async function AnalyticsPage() {
    const session = await getServerSession(authOptions)

    if (!session?.user) {
        redirect('/login')
    }

    return <AnalyticsDashboard />
}
