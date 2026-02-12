
import { PrismaClient } from '@prisma/client'
import * as dotenv from 'dotenv'

dotenv.config({ path: '.env.local' })

const prisma = new PrismaClient()

async function main() {
    const goals = await prisma.goal.findMany({
        include: { user: true }
    })
    console.log('GOALS IN DB:')
    goals.forEach(g => {
        console.log(`- ID: ${g.id}, Name: ${g.name}, User: ${g.user.email}, DeletedAt: ${g.deletedAt}`)
    })

    const logs = await prisma.weeklyLog.findMany({
        take: 5
    })
    console.log('\nSAMPLE WEEKLY LOGS:', logs.length)

    await prisma.$disconnect()
}

main()
