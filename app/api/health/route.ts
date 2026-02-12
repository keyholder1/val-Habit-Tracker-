import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { logger } from '@/lib/logger'

export async function GET() {
    try {
        // Simple raw query to check DB connectivity
        await prisma.$queryRaw`SELECT 1`

        return NextResponse.json({
            status: "ok",
            database: "connected",
            timestamp: Date.now(),
            uptime: process.uptime()
        }, { status: 200 })
    } catch (error) {
        logger.logError('Health Check Failed', error)
        return NextResponse.json({
            status: "degraded",
            database: "disconnected",
            error: error instanceof Error ? error.message : 'Unknown error',
            timestamp: Date.now(),
            uptime: process.uptime()
        }, { status: 503 })
    }
}
