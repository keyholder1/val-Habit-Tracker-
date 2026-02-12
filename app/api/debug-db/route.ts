
import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export const dynamic = 'force-dynamic'

export async function GET() {
    try {
        console.log("Attempting DB connection...")
        // Try a simple query
        const count = await prisma.user.count()

        return NextResponse.json({
            status: 'success',
            message: 'Connected to Database!',
            userCount: count,
            env_db_url_masked: process.env.DATABASE_URL ? process.env.DATABASE_URL.replace(/:[^:@]*@/, ':****@') : 'MISSING'
        })
    } catch (error: any) {
        console.error("DB Connection Error:", error)
        return NextResponse.json({
            status: 'error',
            message: 'Database Connection Failed',
            error_code: error.code,
            error_message: error.message,
            env_db_url_masked: process.env.DATABASE_URL ? process.env.DATABASE_URL.replace(/:[^:@]*@/, ':****@') : 'MISSING'
        }, { status: 500 })
    }
}
