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

        console.log('🔵 [API /api/notes GET] Session:', session?.user?.id, session?.user?.email)
        const notes = await prisma.notesEntry.findMany({
            where: {
                userId: session.user.id,
            },
            orderBy: { updatedAt: 'desc' },
        })

        return NextResponse.json(notes)
    } catch (error: any) {
        console.error('🔵 [API /api/notes GET] ERROR:', error.message, error)
        return NextResponse.json({ error: 'Internal server error', details: error.message }, { status: 500 })
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

        console.log('🔵 [API /api/notes POST] Session:', session?.user?.id)
        console.log('🔵 [API /api/notes POST] Body:', body)

        const note = await prisma.notesEntry.create({
            data: {
                userId: session.user.id,
                title,
                content,
            },
        })

        console.log('🔵 [API /api/notes POST] Created note:', note.id)
        return NextResponse.json(note)
    } catch (error: any) {
        console.error('🔵 [API /api/notes POST] ERROR:', error.message, error)
        return NextResponse.json({ error: 'Internal server error', details: error.message }, { status: 500 })
    }
}
