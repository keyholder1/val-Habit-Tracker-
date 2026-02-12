import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/db'
import { assertProjectAccess } from '@/lib/whitelist'
import { EVENTS, logEventSafe } from '@/lib/events'
import { checkIdempotency } from '@/lib/idempotency'
import { withTiming } from '@/lib/timing'

// 1MB limit in bytes
// 1MB limit in bytes
const MAX_CODE_SIZE = 1024 * 1024

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
    return withTiming('code-blocks POST', async () => {
        try {
            const session = await getServerSession(authOptions)

            try {
                assertProjectAccess(session)
            } catch {
                return NextResponse.json({ error: 'Unauthorized: Project Diary features are restricted.' }, { status: 403 })
            }

            const body = await req.json()
            const { title, codeContent, language, notes, requestId } = body

            if (!title || !codeContent) {
                return NextResponse.json({ error: 'Title and content are required' }, { status: 400 })
            }

            // Safety check: code size
            if (new TextEncoder().encode(codeContent).length > MAX_CODE_SIZE) {
                return NextResponse.json({ error: 'Code block exceeds 1MB limit' }, { status: 413 })
            }

            // 1. Idempotency
            const existingEntityId = await checkIdempotency(requestId, session!.user!.id)
            if (existingEntityId) {
                const block = await prisma.projectCodeBlock.findUnique({ where: { id: existingEntityId } })
                return NextResponse.json(block)
            }

            // Verify project ownership first
            const project = await prisma.projectDiaryEntry.findUnique({
                where: {
                    id: params.id,
                    userId: session!.user!.id
                }
            })

            if (!project) {
                return NextResponse.json({ error: 'Project not found' }, { status: 404 })
            }

            // 2. Create Block
            const block = await prisma.projectCodeBlock.create({
                data: {
                    projectId: params.id,
                    userId: session!.user!.id,
                    title,
                    codeContent,
                    language: language || 'plaintext',
                    notes: notes || ''
                }
            })

            // 3. Safe Log
            logEventSafe({
                userId: session!.user!.id,
                eventType: EVENTS.CODE_BLOCK_CREATED,
                entityType: 'ProjectCodeBlock',
                entityId: block.id,
                payload: { title, projectId: params.id, requestId, method: 'POST' },
            })

            return NextResponse.json(block)
        } catch (error: any) {
            console.error('Create CodeBlock Error:', error)
            if (error.message.includes('Unauthorized')) {
                return NextResponse.json({ error: error.message }, { status: 403 })
            }
            return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
        }
    })
}

