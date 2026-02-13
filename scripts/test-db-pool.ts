
import { PrismaClient } from '@prisma/client'

// Using Port 6543 (Transaction Pooler) + pgbouncer=true
const CONNECTION_STRING = "postgresql://postgres:SSX!2YrneU3%3FiJj@db.rpbjuuycavtpwfvoydvk.supabase.co:6543/postgres?pgbouncer=true"

const prisma = new PrismaClient({
    datasources: {
        db: {
            url: CONNECTION_STRING
        }
    }
})

async function main() {
    console.log("Testing Connection Pool (Port 6543)...")
    try {
        await prisma.$connect()
        console.log("✅ Successfully connected to Supabase Pooler!")

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
