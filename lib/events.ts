import { Prisma } from '@prisma/client'

/**
 * Logs a system event within a transaction
 */

interface EventParams {
    userId: string
    eventType: string
    entityType: string
    entityId: string
    payload?: Prisma.InputJsonValue
    eventSource?: string
}

export async function logEvent(
    tx: Prisma.TransactionClient,
    params: EventParams
) {
    return tx.eventLog.create({
        data: {
            userId: params.userId,
            eventType: params.eventType,
            entityType: params.entityType,
            entityId: params.entityId,
            payload: params.payload ?? Prisma.JsonNull,
            eventSource: params.eventSource || 'API',
        },
    })
}

// Event Types Constants
export const EVENTS = {
    GOAL_CREATED: 'GOAL_CREATED',
    GOAL_ARCHIVED: 'GOAL_ARCHIVED',
    GOAL_DELETED: 'GOAL_DELETED',
    WEEKLY_LOG_UPDATED: 'WEEKLY_LOG_UPDATED',
    MIGRAINE_ENTRY_CREATED: 'MIGRAINE_ENTRY_CREATED',
    MIGRAINE_ENTRY_UPDATED: 'MIGRAINE_ENTRY_UPDATED',
    PROJECT_ENTRY_CREATED: 'PROJECT_ENTRY_CREATED',
    PROJECT_ENTRY_UPDATED: 'PROJECT_ENTRY_UPDATED',
    PROJECT_ENTRY_DELETED: 'PROJECT_ENTRY_DELETED',
    CODE_BLOCK_CREATED: 'CODE_BLOCK_CREATED',
    CODE_BLOCK_UPDATED: 'CODE_BLOCK_UPDATED',
    CODE_BLOCK_DELETED: 'CODE_BLOCK_DELETED',
}

/**
 * Fire-and-forget event logger using the global `prisma` client (not a transaction).
 * Failures are caught and logged — they never block the main request flow.
 */
import { prisma } from '@/lib/db'

export async function logEventSafe(
    params: EventParams
) {
    // Fire and forget - detached from main request flow
    // This satisfies "DO NOT rollback main transaction"
    prisma.eventLog.create({
        data: {
            userId: params.userId,
            eventType: params.eventType,
            entityType: params.entityType,
            entityId: params.entityId,
            payload: params.payload ?? Prisma.JsonNull,
            eventSource: params.eventSource || 'API',
        },
    }).catch(err => {
        console.error('❌ [EventLog] Failed to log event detach', err)
        // In a real app, queue to Redis/SQS here
    })
}
