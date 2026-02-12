
import { PrismaClient } from '@prisma/client'
import * as dotenv from 'dotenv'

dotenv.config({ path: '.env.local' })

const prisma = new PrismaClient()

async function main() {
    console.log('👥 Listing all users...')
    const users = await prisma.user.findMany({
        include: {
            _count: {
                select: { goals: true, weeklyLogs: true }
            }
        }
    })

    if (users.length === 0) {
        console.log('[]')
    } else {
        console.log(JSON.stringify(users.map(u => ({
            id: u.id,
            email: u.email,
            name: u.name,
            goals: u._count.goals,
            logs: u._count.weeklyLogs
        })), null, 2))
    }
}

main()
    .catch(console.error)
    .finally(() => prisma.$disconnect())
