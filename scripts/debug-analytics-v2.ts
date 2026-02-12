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

    console.log('\n--- DATA VOLUME ---')
    console.log('Heatmap cells:', data.calendarHeatmap.length)
    console.log('Goal Completion slices:', data.goalCompletionPie.length)
    console.log('Lifetime Contribution slices:', data.lifetimeContributionPie.length)
    console.log('Target vs Actual points:', data.targetVsActual.length)

    console.log('\n--- TARGET VS ACTUAL (Last 5 points) ---')
    if (data.targetVsActual.length > 0) {
        data.targetVsActual.slice(-5).forEach(p => {
            console.log(`[${p.dateIso}] Target: ${p.target}, Actual: ${p.actual}`)
        })
    } else {
        console.warn('Target vs Actual is EMPTY!')
    }

    console.log('\n--- LIFETIME CONTRIBUTION ---')
    if (data.lifetimeContributionPie.length > 0) {
        data.lifetimeContributionPie.forEach(p => {
            console.log(`- ${p.name}: ${p.value} Done`)
        })
    } else {
        console.warn('Lifetime Contribution is EMPTY!')
    }
}

debugAnalytics().catch(console.error).finally(() => prisma.$disconnect())
