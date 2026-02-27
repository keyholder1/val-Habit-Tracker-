/**
 * Higher-order wrapper that adds a timeout guard to any Next.js API handler.
 *
 * Usage:
 *   export const POST = withRateLimit(withTimeout(handler))
 */

import { NextRequest, NextResponse } from 'next/server'

type RouteHandler = (req: NextRequest, context?: any) => Promise<NextResponse | Response>

const TIMEOUT_MS = 8_000

/**
 * Wrap a route handler with a timeout.
 * If the handler does not resolve within TIMEOUT_MS, a 504 response is returned.
 */
export function withTimeout(handler: RouteHandler): RouteHandler {
    return async (req: NextRequest, context?: any) => {
        const controller = new AbortController()

        const timeout = new Promise<NextResponse>((resolve) => {
            const id = setTimeout(() => {
                controller.abort()
                resolve(
                    NextResponse.json(
                        { error: 'Request timeout' },
                        { status: 504 },
                    ),
                )
            }, TIMEOUT_MS)

            // Prevent the timer from keeping the process alive
            if (typeof id === 'object' && 'unref' in id) {
                (id as NodeJS.Timeout).unref()
            }
        })

        const work = handler(req, context)

        return Promise.race([work, timeout])
    }
}
