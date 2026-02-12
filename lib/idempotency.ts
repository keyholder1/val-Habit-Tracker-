import { Prisma } from '@prisma/client'
import { prisma } from '@/lib/db'

/**
 * Checks if a request has already been processed by looking up the requestId in EventLog payload.
 * If found, returns the entityId of the previously created/updated entity.
 */
export async function checkIdempotency(requestId: string | undefined | null, userId: string): Promise<string | null> {
    if (!requestId) return null

    // Look for an event with this requestId in the payload
    // Note: This relies on the convention that requestId is stored in the payload
    // We use path lookup in JSON if supported, or standard contains
    const existing = await prisma.eventLog.findFirst({
        where: {
            userId,
            payload: {
                path: ['requestId'],
                equals: requestId
            }
        },
        select: {
            entityId: true
        }
    })

    return existing?.entityId || null
}
