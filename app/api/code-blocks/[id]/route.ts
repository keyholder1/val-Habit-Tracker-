import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/db'
import { assertProjectAccess } from '@/lib/whitelist'
import { EVENTS, logEventSafe } from '@/lib/events'
import { checkIdempotency } from '@/lib/idempotency'
import { withTiming } from '@/lib/timing'

// 1MB limit in bytes
const MAX_CODE_SIZE = 1024 * 1024

// PATCH
export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
    return withTiming('code-blocks PATCH', async () => {
        try {
            const session = await getServerSession(authOptions)
            if (!session?.user?.id) return new NextResponse('Unauthorized', { status: 401 })

            // We need to verify access to the project this code block belongs to.
            // But the URL only has codeBlockId.
            // So we fetch the block first to get projectId.
            const existingBlock = await prisma.projectCodeBlock.findUnique({
                where: { id: params.id },
                select: { projectId: true, updatedAt: true, codeContent: true } // Added codeContent to check size
            })

            if (!existingBlock) return new NextResponse('Not Found', { status: 404 })

            try {
                assertProjectAccess(session)
            } catch {
                return new NextResponse('Forbidden', { status: 403 })
            }

            const body = await req.json()
            const { title, codeContent, language, notes, requestId, expectedUpdatedAt } = body

            // Safety check: code size if being updated
            if (codeContent && new TextEncoder().encode(codeContent).length > MAX_CODE_SIZE) {
                return NextResponse.json({ error: 'Code block exceeds 1MB limit' }, { status: 413 })
            }

            // 1. Idempotency
            if (requestId) { // Only check idempotency if requestId is provided
                const existingEntityId = await checkIdempotency(requestId, session.user.id)
                if (existingEntityId) {
                    const block = await prisma.projectCodeBlock.findUnique({ where: { id: existingEntityId } })
                    return NextResponse.json(block)
                }
            }


            // 2. Conflict Detection
            if (expectedUpdatedAt && existingBlock.updatedAt.getTime() > new Date(expectedUpdatedAt).getTime()) {
                return NextResponse.json({ error: 'Conflict' }, { status: 409 })
            }

            // 3. Update
            const updated = await prisma.projectCodeBlock.update({
                where: {
                    id: params.id,
                    userId: session.user.id
                },
                data: {
                    title,
                    codeContent,
                    language,
                    notes
                }
            })

            // 4. Safe Log
            logEventSafe({
                userId: session.user.id,
                eventType: EVENTS.CODE_BLOCK_UPDATED,
                entityType: 'ProjectCodeBlock',
                entityId: updated.id,
                payload: { title, requestId, method: 'PATCH' },
            })

            return NextResponse.json(updated)
        } catch (error: any) {
            if (error.code === 'P2025') {
                return NextResponse.json({ error: 'Code block not found' }, { status: 404 })
            }
            console.error('Error updating code block:', error)
            return new NextResponse('Internal Error', { status: 500 })
        }
    })
}

// DELETE
export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
    return withTiming('code-blocks DELETE', async () => {
        try {
            const session = await getServerSession(authOptions)
            if (!session?.user?.id) return new NextResponse('Unauthorized', { status: 401 })

            const existingBlock = await prisma.projectCodeBlock.findUnique({
                where: { id: params.id },
                select: { projectId: true }
            })

            if (!existingBlock) return new NextResponse('Not Found', { status: 404 })

            try {
                assertProjectAccess(session)
            } catch {
                return new NextResponse('Forbidden', { status: 403 })
            }

            // Soft delete
            await prisma.projectCodeBlock.update({
                where: {
                    id: params.id,
                    userId: session.user.id
                },
                data: {
                    isDeleted: true
                }
            })

            logEventSafe({
                userId: session.user.id,
                eventType: EVENTS.CODE_BLOCK_DELETED,
                entityType: 'ProjectCodeBlock',
                entityId: params.id,
                payload: { method: 'SOFT_DELETE' },
            })

            return new NextResponse(null, { status: 204 })
        } catch (error: any) {
            if (error.code === 'P2025') {
                return NextResponse.json({ error: 'Code block not found' }, { status: 404 })
            }
            console.error('Error deleting code block:', error)
            return new NextResponse('Internal Error', { status: 500 })
        }
    })
}
