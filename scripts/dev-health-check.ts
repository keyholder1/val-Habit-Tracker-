import { PrismaClient } from '@prisma/client'
import net from 'net'
import fs from 'fs'
import path from 'path'

const RED = '\x1b[31m'
const GREEN = '\x1b[32m'
const YELLOW = '\x1b[33m'
const RESET = '\x1b[0m'

const REQUIRED_ENV = [
    'DATABASE_URL',
    'NEXTAUTH_SECRET',
    'NEXTAUTH_URL',
    'GOOGLE_CLIENT_ID',
    'GOOGLE_CLIENT_SECRET'
]

async function checkPort(port: number): Promise<boolean> {
    return new Promise((resolve) => {
        const server = net.createServer()
        server.once('error', (err: any) => {
            if (err.code === 'EADDRINUSE') {
                resolve(false) // Port in use
            } else {
                resolve(true) // Other error, assume free-ish or handle elsewhere
            }
        })
        server.once('listening', () => {
            server.close()
            resolve(true) // Port free
        })
        server.listen(port)
    })
}

async function main() {
    console.log(`${YELLOW}🚑 Starting Development Health Check...${RESET}\n`)
    let hasError = false

    // 1. Env Check
    console.log('1️⃣  Checking Environment Variables...')
    const missingEnv = REQUIRED_ENV.filter(key => !process.env[key])
    if (missingEnv.length > 0) {
        console.error(`${RED}❌ Missing required environment variables: ${missingEnv.join(', ')}${RESET}`)
        hasError = true
    } else {
        console.log(`${GREEN}✅ All required environment variables present.${RESET}`)
    }

    // 2. Port Check (Default Next.js port)
    console.log('\n2️⃣  Checking Port 3000...')
    const portFree = await checkPort(3000)
    if (!portFree) {
        console.warn(`${YELLOW}⚠️  Port 3000 is in use. Next.js will likely fallback to 3001. This is usually fine but check for rogue processes.${RESET}`)
    } else {
        console.log(`${GREEN}✅ Port 3000 is free.${RESET}`)
    }

    // 3. Database Check
    console.log('\n3️⃣  Checking Database Connection (Prisma)...')
    try {
        const prisma = new PrismaClient()
        await prisma.$connect()
        console.log(`${GREEN}✅ Database connection successful.${RESET}`)
        // Optional: Check if we can query strictly
        await prisma.user.count()
        console.log(`${GREEN}✅ Database query successful.${RESET}`)
        await prisma.$disconnect()
    } catch (error: any) {
        console.error(`${RED}❌ Database connection failed:${RESET}`, error.message)
        hasError = true
    }

    // 4. Prisma Client Generation Check
    console.log('\n4️⃣  Checking Prisma Client...')
    const prismaClientPath = path.join(process.cwd(), 'node_modules', '.prisma', 'client', 'index.js')
    if (!fs.existsSync(prismaClientPath)) {
        console.error(`${RED}❌ Prisma Client not found. Run 'npx prisma generate'.${RESET}`)
        hasError = true
    } else {
        console.log(`${GREEN}✅ Prisma Client exists.${RESET}`)
    }

    console.log('\n-----------------------------------')
    if (hasError) {
        console.error(`${RED}🛑 Health check FAILED. Fix issues above before starting dev server.${RESET}`)
        process.exit(1)
    } else {
        console.log(`${GREEN}🚀 System Healthy. Ready to start dev server.${RESET}`)
        process.exit(0)
    }
}

main().catch(console.error)
