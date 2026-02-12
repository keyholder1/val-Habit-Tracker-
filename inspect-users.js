
const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function main() {
    console.log('🔄 Fetching users...')
    try {
        const users = await prisma.user.findMany()
        console.log('✅ Users found:', JSON.stringify(users, null, 2))
    } catch (e) {
        console.error('❌ Failed to fetch users:', e)
    } finally {
        await prisma.$disconnect()
    }
}

main()
