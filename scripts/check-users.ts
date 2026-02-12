
import { PrismaClient } from '@prisma/client'
import * as dotenv from 'dotenv'
import * as fs from 'fs'

dotenv.config({ path: '.env.local' })

const prisma = new PrismaClient()

async function main() {
    console.log('Connecting to database...')
    await prisma.$connect()

    const users = await prisma.user.findMany()
    let output = 'USERS IN DB:\n'
    users.forEach(u => {
        output += (`- ID: ${u.id}, Email: ${u.email}\n`)
    })

    fs.writeFileSync('scripts/results.txt', output)
    console.log('Results written to scripts/results.txt')
    await prisma.$disconnect()
}

main().catch(e => {
    console.error(e)
    process.exit(1)
})
