import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/db'

export const dynamic = 'force-dynamic'

// GET - List all notes for the user
export async function GET(req: NextRequest) {
    try {
        const session = await getServerSession(authOptions)
        if (!session?.user?.id) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const notes = await prisma.notesEntry.findMany({
            where: {
                userId: session.user.id,
            },
            orderBy: { updatedAt: 'desc' },
        })

        return NextResponse.json(notes)
    } catch (error) {
        console.error('🔵 [API /api/notes GET] ERROR:', error)
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }
}

// POST - Create a new note
export async function POST(req: NextRequest) {
    try {
        const session = await getServerSession(authOptions)
        if (!session?.user?.id) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const body = await req.json()
        const { title, content } = body

        if (!title || !content) {
            return NextResponse.json({ error: 'Title and content are required' }, { status: 400 })
        }

        const note = await prisma.notesEntry.create({
            data: {
                userId: session.user.id,
                title,
                content,
            },
        })

        return NextResponse.json(note)
    } catch (error) {
        console.error('🔵 [API /api/notes POST] ERROR:', error)
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }
}
