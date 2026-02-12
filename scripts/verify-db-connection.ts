
import { PrismaClient } from '@prisma/client'

// The CORRECTED URL (no brackets)
const CONNECTION_STRING = "postgresql://postgres:SSX!2YrneU3%3FiJj@db.rpbjuuycavtpwfvoydvk.supabase.co:5432/postgres"

const prisma = new PrismaClient({
    datasources: {
        db: {
            url: CONNECTION_STRING
        }
    }
})

async function main() {
    console.log("Testing connection with FIXED credentials...")
    try {
        await prisma.$connect()
        console.log("✅ Successfully connected to Supabase!")

        const userCount = await prisma.user.count()
        console.log(`✅ Can query database. Found ${userCount} users.`)

    } catch (e) {
        console.error("❌ Connection failed:")
        console.error(e)
    } finally {
        await prisma.$disconnect()
    }
}

main()
