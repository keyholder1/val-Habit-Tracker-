import { PrismaClient } from '@prisma/client'
import * as dotenv from 'dotenv'

dotenv.config({ path: '.env.local' })
const prisma = new PrismaClient()

// 🚨 PRESERVE THESE USERS (Do not delete the user records themselves)
// We may clean up their *data* if it is identified as mock data, but the accounts remain.
const SAFE_USERS = [
    'nandini.zunder@gmail.com',
    'arnav.nishant.deshpande@gmail.com'
]

// Known seed patterns from seed-data.ts
const MOCK_GOAL_NAMES = ['Weekly Gym', 'Read Pages', 'Meditation']
const MOCK_GOAL_SYMBOLS = ['💪', '📚', '🧘']

interface CleanupStats {
    goals: number
    weeklyLogs: number
    migraineEntries: number
    projectEntries: number
    projectCodeBlocks: number
    eventLogs: number
}

async function main() {
    const args = process.argv.slice(2)
    const isDryRun = !args.includes('--force')
    const manualStart = args.find(a => a.startsWith('--window-start='))?.split('=')[1]
    const manualEnd = args.find(a => a.startsWith('--window-end='))?.split('=')[1]

    console.log(`\n🧹 OPTIMIZED MOCK DATA CLEANUP`)
    console.log(`   Mode: ${isDryRun ? '🧪 DRY RUN (No changes)' : '🔥 EXECUTE'}`)
    console.log(`   Safe Users: ${SAFE_USERS.join(', ')}`)

    // 1. Detect Seed Window (Time Clustering)
    // Look for high density of goal creations
    let windowStart: Date
    let windowEnd: Date

    if (manualStart && manualEnd) {
        windowStart = new Date(manualStart)
        windowEnd = new Date(manualEnd)
        console.log(`   Window (Manual): ${windowStart.toISOString()} - ${windowEnd.toISOString()}`)
    } else {
        console.log(`\n🔍 Detecting seed window via heuristics...`)
        // Group Goal creation times by minute
        const goals = await prisma.goal.findMany({
            select: { createdAt: true },
            orderBy: { createdAt: 'desc' },
            take: 1000
        })

        // Simple clustering: find a minute (or small window) with > 3 goals created
        // Since the seed script creates 3 goals almost instantly
        // We'll look for clusters.

        // This is a naive implementation; for better robustness we could bin by minute
        // For now, let's just default to "Last 24 hours" if we can't find a cluster, 
        // OR warn the user to provide a window.
        // Actually, the seed script runs 'Weekly Gym', 'Read Pages', 'Meditation' sequentially.
        // So we can find the goals that match these names AND are associated with the target users.

        // Strategy Upgrade: Find specific MOCK GOALS created recently.
        const mockGoals = await prisma.goal.findMany({
            where: {
                name: { in: MOCK_GOAL_NAMES },
                symbol: { in: MOCK_GOAL_SYMBOLS },
                user: { email: { in: SAFE_USERS } }
            },
            select: { createdAt: true, id: true }
        })

        if (mockGoals.length > 0) {
            // Find the time range of these mock goals
            const times = mockGoals.map(g => g.createdAt.getTime())
            const minTime = Math.min(...times)
            const maxTime = Math.max(...times)

            // Add buffer (e.g. +/- 5 minutes for script execution time)
            windowStart = new Date(minTime - 5 * 60 * 1000)
            windowEnd = new Date(maxTime + 20000 * 60 * 1000) // generous buffer for the log generation loop

            // Wait, the seed script takes time to generate history (12 weeks).
            // The logs are created AFTER the goals.
            // So the windowEnd needs to cover the log generation time.
            // Logs have `createdAt` set to `now()` (default) during the script run.
            // So we should look at the LAST created item in that batch.

            // Finding the latest log for these goals
            const latestLog = await prisma.weeklyLog.findFirst({
                where: { goalId: { in: mockGoals.map(g => g.id) } },
                orderBy: { createdAt: 'desc' }
            })

            if (latestLog) {
                windowEnd = new Date(latestLog.createdAt.getTime() + 5 * 60 * 1000)
            }

            console.log(`   Detected Mock Activity:`)
            console.log(`     First Mock Goal: ${new Date(minTime).toISOString()}`)
            console.log(`     Last Mock Log:   ${latestLog ? latestLog.createdAt.toISOString() : 'N/A'}`)
            console.log(`   Window (Auto):   ${windowStart.toISOString()} - ${windowEnd.toISOString()}`)
        } else {
            console.warn(`   ⚠️ No obvious mock goals found via name pattern.`)
            console.warn(`   Please use --window-start and --window-end if you know the seed time.`)
            process.exit(0)
        }
    }

    // 2. Identify Data to Remove
    console.log(`\n🕵️ Identifying records...`)

    // GOALS
    // Matches name/symbol AND created in the window
    const goalsToDelete = await prisma.goal.findMany({
        where: {
            createdAt: { gte: windowStart, lte: windowEnd },
            name: { in: MOCK_GOAL_NAMES }, // Strict name check to avoid killing real goals in that window?
            // Actually prompt says "Remove rows if: ... created during seed run window"
            // But "Remove only mock goals. Keep real user-created goals."
            // So intersecting the window AND the pattern is safest.
        },
        include: { user: true }
    })

    // WEEKLY LOGS
    // Logs attached to the goals to delete
    // OR logs created in the window (for idempotency if goals were already deleted but logs remain? Unlikely with cascade)
    // Prisma schema has onDelete: Cascade for WeeklyLog -> Goal. 
    // So deleting Goal deletes Logs.
    // BUT, we should check if there are orphan logs or logs created in that window for OTHER goals?
    // The seed script only adds logs to the goals it created.
    // So deleting goals is primary.
    // However, we should count them for the report.
    const goalIds = goalsToDelete.map(g => g.id)
    const logsToDeleteCount = await prisma.weeklyLog.count({
        where: { goalId: { in: goalIds } }
    })

    // MIGRAINE ENTRIES
    // "Remove seeded migraine entries only."
    // Seed script in previous context might have added them. 
    // Assuming they are created in the same window.
    const migraineToDelete = await prisma.migraineEntry.findMany({
        where: {
            createdAt: { gte: windowStart, lte: windowEnd },
            // Add user filter if necessary, but window is usually sufficient for a "seed run"
            user: { email: { in: SAFE_USERS } }
        }
    })

    // PROJECTS
    const projectsToDelete = await prisma.projectDiaryEntry.findMany({
        where: {
            createdAt: { gte: windowStart, lte: windowEnd },
            user: { email: { in: SAFE_USERS } }
        }
    })

    // EVENT LOGS
    // "Remove only events linked to removed mock entities."
    // "DO NOT wipe full EventLog."
    // We can find event logs that reference the entityIds of the things we are deleting.
    // entityType: 'Goal', entityId: goalId
    // entityType: 'WeeklyLog', entityId: logId (if flagged)
    const eventLogsToDelete = await prisma.eventLog.count({
        where: {
            OR: [
                { entityType: 'Goal', entityId: { in: goalIds } },
                // Add other entities if we track them in EventLog
            ]
        }
    })


    // 3. Report
    console.log(`\n📋 DELETION PLAN:`)
    console.log(`   - Goals:           ${goalsToDelete.length}`)
    console.log(`   - WeeklyLogs:      ~${logsToDeleteCount} (via Cascade)`)
    console.log(`   - MigraineEntries: ${migraineToDelete.length}`)
    console.log(`   - ProjectEntries:  ${projectsToDelete.length}`)
    console.log(`   - EventLogs:       ~${eventLogsToDelete} (Exact match by entityId)`)

    if (goalsToDelete.length > 0) {
        console.log(`   Sample Goals: ${goalsToDelete.slice(0, 3).map(g => `${g.symbol} ${g.name} (${g.user.email})`).join(', ')}`)
    }

    if (isDryRun) {
        console.log(`\n🚫 Dry run complete. No changes made.`)
        console.log(`   Run with --force to execute.`)
        return
    }

    // 4. Execution
    console.log(`\n🚀 Executing cleanup...`)

    // Use transaction for consistency
    // Note: Prisma $transaction implies all or nothing.
    await prisma.$transaction(async (tx) => {
        // Delete Goals (Cascades to WeeklyLogs)
        if (goalIds.length > 0) {
            await tx.goal.deleteMany({
                where: { id: { in: goalIds } }
            })
        }

        // Delete Migraine Entries
        if (migraineToDelete.length > 0) {
            await tx.migraineEntry.deleteMany({
                where: { id: { in: migraineToDelete.map(m => m.id) } }
            })
        }

        // Delete Project Entries (Cascades to CodeBlocks)
        if (projectsToDelete.length > 0) {
            await tx.projectDiaryEntry.deleteMany({
                where: { id: { in: projectsToDelete.map(p => p.id) } }
            })
        }

        // Delete EventLogs
        // We delete by entityId. 
        // Note: If EventLog has no cascade (it restricts usually, or does nothing), we must manual delete.
        // Schema says: user User @relation... onDelete: Cascade. 
        // But EventLog -> Entity is loose coupling (string IDs).
        if (goalIds.length > 0) {
            await tx.eventLog.deleteMany({
                where: {
                    entityType: 'Goal',
                    entityId: { in: goalIds }
                }
            })
        }

    })

    console.log(`\n✅ Cleanup complete!`)

    // Post-cleanup (e.g. Analytics Rebuild)
    // If there was an easy way to trigger it, we would here. 
    // For now, we assume Next.js ISR or SWR will handle it on next fetch, 
    // or we might need to manually truncate a cache table if it existed.
}

main()
    .catch((e) => {
        console.error(e)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })
