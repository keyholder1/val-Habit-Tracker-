
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

    // 4. FULL AGGREGATION SIMULATION
    console.log('\n🔄 Simulating Full API Aggregation...')

    // Fetch all needed data
    const allGoals = await prisma.goal.findMany({
        where: { userId: user.id, deletedAt: null }
    })

    const logs = await prisma.weeklyLog.findMany({
        where: { userId: user.id },
        include: { goal: true }
    })

    // Target Date: Today (Local)
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const todayIso = today.toISOString().split('T')[0]

    console.log(`Checking for Date: ${todayIso} (Local: ${today.toString()})`)

    // Calculate Total Goals for Today
    let activeCount = 0
    const dayTime = today.getTime()

    for (const goal of allGoals) {
        console.log(`\nGoal Analysis: ${goal.name}`)
        console.log(`  activeFrom: ${goal.activeFrom}`)
        console.log(`  archivedFromWeek: ${goal.archivedFromWeek}`)

        if (goal.activeFrom) {
            // MATCH THE SERVER LOGIC EXACTLY (Standard Date, not UTC Date yet in route.ts, but let's test safely)
            // Actually, let's try the FIX directly: Use UTC methods for Active/Archived too
            const activeDate = new Date(goal.activeFrom)
            activeDate.setUTCHours(0, 0, 0, 0)
            const active = activeDate.getTime()

            console.log(`  active (UTC ms): ${active} vs Today: ${dayTime}`)
            if (dayTime < active) {
                console.log('  -> SKIPPED (Not active yet)')
                continue
            }
        }
        if (goal.archivedFromWeek) {
            const archivedDate = new Date(goal.archivedFromWeek)
            archivedDate.setUTCHours(0, 0, 0, 0)
            const archived = archivedDate.getTime()

            console.log(`  archived (UTC ms): ${archived} vs Today: ${dayTime}`)
            if (dayTime >= archived) {
                console.log('  -> SKIPPED (Archived)')
                continue
            }
        }
        activeCount++
        console.log('  -> COUNTED')
    }
    console.log(`Total Active Goals: ${activeCount}`)

    // Calculate Completed Goals using UTC Logic (The Fix)
    let completedCount = 0
    logs.forEach(log => {
        if (log.goal.deletedAt) return

        const weekStart = new Date(log.weekStartDate)
        const checkboxStates = log.checkboxStates // as boolean[]

        checkboxStates.forEach((isChecked, dayIndex) => {
            if (isChecked) {
                const logDay = new Date(weekStart)

                // --- THE FIX LOGIC ---
                logDay.setUTCDate(logDay.getUTCDate() + dayIndex)
                logDay.setUTCHours(0, 0, 0, 0)
                // ---------------------

                const d = logDay.toISOString().split('T')[0]

                if (d === todayIso) {
                    console.log(`  -> Match Found! Goal: ${log.goal.name}`)
                    completedCount++
                }
            }
        })
    })

    console.log(`Completed Goals: ${completedCount}`)
    const percent = activeCount > 0 ? (completedCount / activeCount) * 100 : 0
    console.log(`Completion Rate: ${percent}%`)

    if (percent === 0) {
        console.log('❌ Logic Result: 0% (No Water)')
    } else {
        console.log('✅ Logic Result: >0% (Should have Water)')
    }


}

main()
    .catch(e => console.error(e))
    .finally(async () => await prisma.$disconnect())
