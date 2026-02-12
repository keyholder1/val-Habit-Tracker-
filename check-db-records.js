
const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function main() {
    console.log('Checking database records...')

    const users = await prisma.user.findMany({
        include: {
            goals: {
                include: {
                    weeklyLogs: true
                }
            }
        }
    })

    console.log(`Found ${users.length} users.`)

    for (const user of users) {
        console.log(`\nUser: ${user.email} (${user.id})`)
        console.log(`Type: ${user.role || 'USER'}`)
        const goalCount = user.goals.length
        let totalLogs = 0
        user.goals.forEach(g => totalLogs += g.weeklyLogs.length)

        console.log(`- Goals: ${goalCount}`)
        console.log(`- Weekly Logs (Data Points): ${totalLogs}`)

        if (goalCount > 0) {
            console.log('  Active Goals:')
            user.goals.forEach(g => console.log(`  - ${g.name} (${g.weeklyLogs.length} logs)`))
        }
    }
}

main()
    .catch(e => {
        console.error(e)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })
