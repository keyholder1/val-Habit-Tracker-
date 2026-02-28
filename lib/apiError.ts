/**
 * Centralized API error formatter.
 *
 * - Development: returns the actual error message for debugging.
 * - Production:  returns a generic message; logs the stack server-side.
 */

import { logger } from '@/lib/logger'

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
