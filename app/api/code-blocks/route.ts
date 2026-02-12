import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/db'
import { EVENTS, logEvent } from '@/lib/events'
import { assertProjectAccess } from '@/lib/whitelist'

export async function POST(req: NextRequest) {
    try {
        const session = await getServerSession(authOptions)
        assertProjectAccess(session)

        const body = await req.json()
        const { projectId, title, codeContent, language, notes } = body

        if (!projectId || !title || !codeContent) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
        }

        const result = await prisma.$transaction(async (tx) => {
            const block = await tx.projectCodeBlock.create({
                data: {
                    userId: session!.user!.id,
                    projectId,
                    title,
                    codeContent,
                    language: language || 'text',
                    notes: notes || '',
                }
            })

            await logEvent(tx, {
                userId: session!.user!.id,
                eventType: EVENTS.CODE_BLOCK_CREATED,
                entityType: 'ProjectCodeBlock',
                entityId: block.id,
                payload: { title, projectId },
            })

            return block
        })

        return NextResponse.json(result)
    } catch (error: any) {
        if (error.message.includes('Unauthorized')) {
            return NextResponse.json({ error: error.message }, { status: 403 })
        }
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
    }
}
