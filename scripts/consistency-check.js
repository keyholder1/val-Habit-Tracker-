const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function runConsistencyCheck() {
    console.log('🔍 Starting Consistency Check...')
    console.log('================================')

    try {
        // 1. Check for Orphaned WeeklyLogs (Logs without valid Goals)
        console.log('\n1️⃣  Checking for Orphaned WeeklyLogs...')
        const orphanedLogs = await prisma.weeklyLog.findMany({
            where: {
                goal: null
            },
            select: { id: true }
        })

        if (orphanedLogs.length > 0) {
            console.error(`❌ Found ${orphanedLogs.length} orphaned weekly logs! IDs: ${orphanedLogs.map(l => l.id).join(', ')}`)
        } else {
            console.log('✅ No orphaned weekly logs found.')
        }

        // 2. Check EventLog Coverage (Recent writes should have events)
        console.log('\n2️⃣  Checking EventLog Coverage (Last 24h)...')
        const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000)

        // Count recent entities
        const recentGoals = await prisma.goal.count({ where: { createdAt: { gt: yesterday } } })
        const recentLogs = await prisma.weeklyLog.count({ where: { updatedAt: { gt: yesterday } } })

        // Count recent events
        const recentGoalEvents = await prisma.eventLog.count({
            where: {
                createdAt: { gt: yesterday },
                entityType: 'Goal'
            }
        })
        const recentLogEvents = await prisma.eventLog.count({
            where: {
                createdAt: { gt: yesterday },
                entityType: 'WeeklyLog'
            }
        })

        console.log(`   Recent Goals Created: ${recentGoals}`)
        console.log(`   Recent Goal Events:   ${recentGoalEvents}`)
        console.log(`   Recent Logs Updated:  ${recentLogs}`)
        console.log(`   Recent Log Events:    ${recentLogEvents}`)

        if (recentGoalEvents < recentGoals) {
            console.warn('⚠️  Potential missing Goal creation events!')
        }

        // Note: Logs updated vs events might not match 1:1 if multiple updates happen, but gives a rough idea.

        console.log('\n✅ Consistency Check Complete.')

    } catch (error) {
        console.error('❌ Check failed:', error)
    } finally {
        await prisma.$disconnect()
    }
}

runConsistencyCheck()
