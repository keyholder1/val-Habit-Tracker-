/**
 * Centralized API error formatter.
 *
 * - Development: returns the actual error message for debugging.
 * - Production:  returns a generic message; logs the stack server-side.
 */

import { logger } from '@/lib/logger'

/** Check if an unknown error is a Prisma "record not found" (P2025). */
export function isPrismaNotFound(error: unknown): boolean {
    return (
        typeof error === 'object' &&
        error !== null &&
        'code' in error &&
        (error as { code: unknown }).code === 'P2025'
    )
}

/** Safely extract an error message string from an unknown error. */
export function getErrorMessage(error: unknown): string {
    if (error instanceof Error) return error.message
    if (typeof error === 'string') return error
    return 'Unknown error'
}

export function formatApiError(error: unknown): { message: string; status: number } {
    const isDev = process.env.NODE_ENV === 'development'

    if (isDev) {
        const msg =
            error instanceof Error
                ? error.message
                : typeof error === 'string'
                    ? error
                    : 'Unknown error'
        return { message: msg, status: 500 }
    }

    // Production: log details server-side, return generic message to client
    logger.logError('API Error', error)
    return { message: 'Something went wrong', status: 500 }
}
