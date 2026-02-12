
const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function main() {
    console.log('🔄 Testing database connection...')
    try {
        await prisma.$connect()
        console.log('✅ Database connected successfully!')

        console.log('🔄 Attempting to count users...')
        const userCount = await prisma.user.count()
        console.log(`✅ User count: ${userCount}`)

        console.log('🔄 Test finished successfully.')
    } catch (e) {
        console.error('❌ Database connection failed:', e)
    } finally {
        await prisma.$disconnect()
    }
}

main()
