import { prisma } from '../lib/db'
import { getAnalyticsData } from '../lib/analytics/getAnalyticsData'
import * as dotenv from 'dotenv'

dotenv.config({ path: '.env.local' })

async function debugAnalytics() {
    const user = await prisma.user.findFirst({
        where: { email: 'arnav.nishant.deshpande@gmail.com' }
    })

    if (!user) {
        console.error('User not found')
        return
    }

    console.log(`Checking analytics for user: ${user.email} (${user.id})`)

    // Test current trailing 365 view
    const data = await getAnalyticsData(user.id, 365, true)

    console.log('--- Summary ---')
    console.log('Daily records count:', data.calendarHeatmap.length)
    console.log('Lifetime Pie count:', data.lifetimeContributionPie.length)
    console.log('Target vs Actual count:', data.targetVsActual.length)

    if (data.targetVsActual.length > 0) {
        console.log('First T vs A point:', data.targetVsActual[0])
        console.log('Last T vs A point:', data.targetVsActual[data.targetVsActual.length - 1])
    } else {
        console.warn('Target vs Actual is EMPTY!')
    }

    if (data.lifetimeContributionPie.length > 0) {
        console.log('Lifetime Pie sample:', data.lifetimeContributionPie[0])
    } else {
        console.warn('Lifetime Contribution Pie is EMPTY!')
    }
}

debugAnalytics().catch(console.error).finally(() => prisma.$disconnect())
