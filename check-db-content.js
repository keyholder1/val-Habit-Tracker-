
const path = require('path')
require('dotenv').config({ path: path.resolve(__dirname, '.env.local') })
const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function main() {
    console.log('🔍 Checking database for completion data...')

    // Check if we can connect
    try {
        await prisma.$connect()
        console.log('✅ Connected to DB')
    } catch (e) {
        console.error('❌ Connection failed', e)
        return
    }

    const userCount = await prisma.user.count()
    console.log(`Users: ${userCount}`)

    if (userCount === 0) {
        console.log('⚠️ No users found. You need to log in via the app first.')
        return
    }

    // Get the first user to check their data
    const user = await prisma.user.findFirst()
    console.log(`Checking data for user: ${user.email}`)

    const goalCount = await prisma.goal.count({ where: { userId: user.id } })
    console.log(`Goals: ${goalCount}`)

    const logCount = await prisma.weeklyLog.count({ where: { userId: user.id } })
    console.log(`Weekly Logs: ${logCount}`)

    const logs = await prisma.weeklyLog.findMany({
        where: { userId: user.id },
        include: { goal: true }
    })

    logs.forEach(log => {
        console.log(`Goal: ${log.goal.name}`)
        console.log(`Week Start (DB): ${log.weekStartDate}`)

        // Simulate route.ts logic (Local Node Environment = IST)
        const weekStart = new Date(log.weekStartDate)
        const dayIndex = 0 // Test first day
        const logDay = new Date(weekStart)
        logDay.setDate(logDay.getDate() + dayIndex)
        logDay.setHours(0, 0, 0, 0)
        const d = logDay.toISOString().split('T')[0]

        console.log(`Simulated Key (Local): ${d}`)

        // Simulate Vercel Logic (UTC Environment) -> We can't easily change Node TZ here but we can infer
        // If weekStart is 05:30 IST / 00:00 UTC
        // Local Node (IST): 00:00 UTC = 05:30 IST. setHours(0) -> 00:00 IST = 18:30 UTC Prev Day. Key = Prev Day.
        // Vercel (UTC): 00:00 UTC. setHours(0) -> 00:00 UTC. Key = Current Day.

        // If weekStart is 00:00 IST / 18:30 UTC Prev Day
        // Local Node (IST): 00:00 IST. setHours(0) -> 00:00 IST. Key = Current Day.
        // Vercel (UTC): 18:30 UTC Prev Day. setHours(0) -> 00:00 UTC Prev Day. Key = Prev Day.
    })

}

main()
    .catch(e => console.error(e))
    .finally(async () => await prisma.$disconnect())
