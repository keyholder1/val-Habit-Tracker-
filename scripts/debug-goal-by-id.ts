
import { PrismaClient } from '@prisma/client'
import * as dotenv from 'dotenv'

dotenv.config({ path: '.env.local' })

const prisma = new PrismaClient()

const goalId = 'cmlkp2rzg002f1138hfjq4bsv'

async function main() {
    console.log(`Checking goal with ID: ${goalId}`)

    const goal = await prisma.goal.findUnique({
        where: { id: goalId },
        include: { user: true }
    })

    if (!goal) {
        console.log('❌ Goal not found in database.')

        // List all goals to see if there's a close match or if IDs look different
        console.log('\nListing all goals (first 10):')
        const allGoals = await prisma.goal.findMany({ take: 10 })
        allGoals.forEach(g => console.log(`- ${g.id} (${g.name})`))
    } else {
        console.log('✅ Goal found:')
        console.log(JSON.stringify(goal, null, 2))
    }

    await prisma.$disconnect()
}

main()
