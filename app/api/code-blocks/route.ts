import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/db'
import { EVENTS, logEvent } from '@/lib/events'
import { assertProjectAccess } from '@/lib/whitelist'
import { withRateLimit } from '@/lib/withRateLimit'
import { withTimeout } from '@/lib/withTimeout'
import { sanitizeNoteTitle, sanitizeLongText } from '@/lib/sanitizeInput'
import { formatApiError } from '@/lib/apiError'

export const POST = withRateLimit(withTimeout(async function POST(req: NextRequest) {
    try {
        const session = await getServerSession(authOptions)
        assertProjectAccess(session)

        const body = await req.json()
        // Sanitize inputs before validation
        const { projectId, codeContent, language } = body
        const title = sanitizeNoteTitle(body.title)
        const notes = sanitizeLongText(body.notes || '')

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
        const apiErr = formatApiError(error)
        return NextResponse.json({ error: apiErr.message }, { status: apiErr.status })
    }
}))
