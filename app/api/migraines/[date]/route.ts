import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { assertMigraineAccess } from '@/lib/whitelist'

// ...

export async function GET(
    req: NextRequest,
    { params }: { params: { date: string } }
) {
    const session = await getServerSession(authOptions)
    if (!session || !session.user?.id) {
        return new NextResponse('Unauthorized', { status: 401 })
    }

    try {
        assertMigraineAccess(session)
    } catch (error) {
        console.error('Unauthorized migraine access attempt:', session.user.email)
        return new NextResponse('Forbidden', { status: 403 })
    }

    try {
        const { date } = params

        // --- Normalization ---
        const queryDate = new Date(date)
        if (isNaN(queryDate.getTime())) {
            return new NextResponse('Invalid date', { status: 400 })
        }

        // Match the "setHours(0,0,0,0)" rule
        queryDate.setHours(0, 0, 0, 0)

        // --- Query Safety ---
        const entry = await prisma.migraineEntry.findUnique({
            where: {
                userId_date: {
                    userId: session.user.id,
                    date: queryDate
                }
            }
        })

        return NextResponse.json(entry)

    } catch (error) {
        console.error('Failed to fetch single migraine entry:', error)
        return new NextResponse('Internal Server Error', { status: 500 })
    }
}
export async function DELETE(
    req: NextRequest,
    { params }: { params: { date: string } }
) {
    const session = await getServerSession(authOptions)
    if (!session || !session.user?.id) {
        return new NextResponse('Unauthorized', { status: 401 })
    }

    try {
        assertMigraineAccess(session)
    } catch (error) {
        console.error('Unauthorized migraine access attempt:', session.user.email)
        return new NextResponse('Forbidden', { status: 403 })
    }

    try {
        const { date } = params
        const queryDate = new Date(date)
        if (isNaN(queryDate.getTime())) {
            return new NextResponse('Invalid date', { status: 400 })
        }
        queryDate.setHours(0, 0, 0, 0)

        await prisma.migraineEntry.delete({
            where: {
                userId_date: {
                    userId: session.user.id,
                    date: queryDate
                }
            }
        })

        return new NextResponse(null, { status: 204 })
    } catch (error: any) {
        if (error.code === 'P2025') {
            return new NextResponse('Entry not found', { status: 404 })
        }
        console.error('Failed to delete migraine entry:', error)
        return new NextResponse('Internal Server Error', { status: 500 })
    }
}
