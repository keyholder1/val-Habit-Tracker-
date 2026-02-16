
import { PrismaClient } from '@prisma/client'
import { startOfWeek, subWeeks } from 'date-fns'
import * as dotenv from 'dotenv'

dotenv.config({ path: '.env.local' })

const prisma = new PrismaClient()

const WEEKS_TO_SEED = 12 // 3 months

async function main() {
    console.log('🌱 Starting seed...')

    // 1. Find Users
    // We explicitly look for our known test accounts
    const users = await prisma.user.findMany({
        where: {
            email: {
                in: ['arnav.nishant.deshpande@gmail.com', 'nandini.zunder@gmail.com']
            }
        }
    })

    if (users.length === 0) {
        console.warn('⚠️ No test users found. Creating a default user...')
        const newUser = await prisma.user.create({
            data: {
                email: 'arnav.nishant.deshpande@gmail.com',
                name: 'Arnav',
                image: 'https://ui-avatars.com/api/?name=Arnav'
            }
        })
        users.push(newUser)
    }

    // 2. Iterate over users
    for (const user of users) {
        console.log(`\n👤 Seeding for: ${user.name} (${user.email})`)

        // Define user-specific goals if needed, or generic ones
        const goalsData = [
            { name: 'Weekly Gym', symbol: '💪', target: 4 },
            { name: 'Read Pages', symbol: '📚', target: 5 },
            { name: 'Meditation', symbol: '🧘', target: 7 },
        ]

        const createdGoals = []
        for (const g of goalsData) {
            let goal = await prisma.goal.findFirst({
                where: { userId: user.id, name: g.name }
            })

            if (!goal) {
                goal = await prisma.goal.create({
                    data: {
                        userId: user.id,
                        name: g.name,
                        symbol: g.symbol,
                        weeklyTarget: g.target,
                        startDate: subWeeks(new Date(), WEEKS_TO_SEED + 1) // Ensure startDate covers history
                    }
                })
                console.log(`   ✅ Created Goal: ${g.name}`)
            } else {
                console.log(`   ℹ️ Goal exists: ${g.name}`)
                // Optionally update startDate if it is too recent, so historical logs show up
                // But we won't modify existing goals too aggressively
            }
            createdGoals.push(goal)
        }

        // 3. Generate History
        console.log(`   Generating history...`)

        const today = new Date()
        const currentWeekStart = startOfWeek(today, { weekStartsOn: 1 })
        currentWeekStart.setUTCHours(0, 0, 0, 0)

        for (let i = 0; i < WEEKS_TO_SEED; i++) {
            const weekStart = subWeeks(currentWeekStart, i)

            for (const goal of createdGoals) {
                // Check if log already exists
                const existing = await prisma.weeklyLog.findUnique({
                    where: {
                        userId_goalId_weekStartDate: {
                            userId: user.id,
                            goalId: goal.id,
                            weekStartDate: weekStart
                        }
                    }
                })

                if (!existing) {
                    const successRate = goal.symbol === '🧘' ? 0.8 : goal.symbol === '📚' ? 0.6 : 0.4
                    const checkboxStates = Array(7).fill(false).map(() => Math.random() < successRate)

                    await prisma.weeklyLog.create({
                        data: {
                            userId: user.id,
                            goalId: goal.id,
                            weekStartDate: weekStart,
                            weeklyTarget: goal.weeklyTarget,
                            checkboxStates: checkboxStates,
                        }
                    })
                }
            }
            process.stdout.write('.')
        }
    }

    console.log('\n✅ Seeding complete!')
}

main()
    .catch((e) => {
        console.error(e)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })
