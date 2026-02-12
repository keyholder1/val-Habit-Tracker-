
import { PrismaClient } from '@prisma/client'
import * as dotenv from 'dotenv'

dotenv.config({ path: '.env.local' })

const prisma = new PrismaClient()

async function main() {
    const email = 'arnav.nishant.deshpande@gmail.com'
    console.log(`🔍 Inspecting data for: ${email}`)

    const user = await prisma.user.findUnique({
        where: { email },
        include: {
            goals: true
        }
    })

    if (!user) {
        console.error('❌ User not found')
        return
    }

    console.log(`✅ User ID: ${user.id}`)
    console.log(`📊 Total Goals: ${user.goals.length}`)

    // Check for soft-deleted goals
    const deletedGoals = user.goals.filter(g => g.deletedAt)
    console.log(`🗑️ Deleted Goals: ${deletedGoals.length}`)

    // Check for active goals
    const activeGoals = user.goals.filter(g => !g.deletedAt)
    console.log(`🟢 Active Goals: ${activeGoals.length}`)

    if (activeGoals.length > 0) {
        console.log('--- Sample Active Goal ---')
        console.log(activeGoals[0])
    } else if (deletedGoals.length > 0) {
        console.log('--- Sample Deleted Goal ---')
        console.log(deletedGoals[0])
    }
}

main()
    .catch(console.error)
    .finally(() => prisma.$disconnect())
