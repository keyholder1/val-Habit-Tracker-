import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/db'
import { withRateLimit } from '@/lib/withRateLimit'

export const dynamic = 'force-dynamic'

// PATCH - Update a note
export const PATCH = withRateLimit(async function PATCH(
    req: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const session = await getServerSession(authOptions)
        if (!session?.user?.id) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const body = await req.json()
        const { title, content } = body

        // Verify ownership
        const existingNote = await prisma.notesEntry.findUnique({
            where: { id: params.id },
        })

        if (!existingNote || existingNote.userId !== session.user.id) {
            return NextResponse.json({ error: 'Note not found' }, { status: 404 })
        }

        const updatedNote = await prisma.notesEntry.update({
            where: { id: params.id },
            data: {
                title: title ?? undefined,
                content: content ?? undefined,
            },
        })

        return NextResponse.json(updatedNote)
    } catch (error) {
        console.error('🔵 [API /api/notes/[id] PATCH] ERROR:', error)
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }
})

// DELETE - Delete a note
export const DELETE = withRateLimit(async function DELETE(
    req: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const session = await getServerSession(authOptions)
        if (!session?.user?.id) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        // Verify ownership
        const existingNote = await prisma.notesEntry.findUnique({
            where: { id: params.id },
        })

        if (!existingNote || existingNote.userId !== session.user.id) {
            return NextResponse.json({ error: 'Note not found' }, { status: 404 })
        }

        await prisma.notesEntry.delete({
            where: { id: params.id },
        })

        return NextResponse.json({ success: true })
    } catch (error) {
        console.error('🔵 [API /api/notes/[id] DELETE] ERROR:', error)
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }
})
