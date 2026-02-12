
const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function main() {
    console.log('🚨 STARTING GLOBAL DATA WIPE 🚨')

    // Delete all WeeklyLogs first just to be explicit, though cascade should handle it
    console.log('Deleting all WeeklyLogs...')
    const { count: logCount } = await prisma.weeklyLog.deleteMany({})
    console.log(`Deleted ${logCount} WeeklyLogs.`)

    // Delete all Goals
    console.log('Deleting all Goals...')
    const { count: goalCount } = await prisma.goal.deleteMany({})
    console.log(`Deleted ${goalCount} Goals.`)

    console.log('✅ GLOBAL DATA WIPE COMPLETE')
}

main()
    .catch(e => {
        console.error(e)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })
