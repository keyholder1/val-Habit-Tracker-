/**
 * Higher-order wrapper that adds rate limiting to any Next.js API handler.
 *
 * Usage:
 *   const POST_handler = async (req: NextRequest) => { ... }
 *   export const POST = withRateLimit(POST_handler)
 */

import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { checkRateLimit } from '@/lib/rateLimit'
import { isEmailAllowed } from '@/lib/whitelist'
import { resolveIp } from '@/lib/resolveIp'

type RouteHandler = (req: NextRequest, context?: Record<string, unknown>) => Promise<NextResponse | Response>

/**
 * Wrap a route handler with rate limiting.
 * Checks session for email, falls back to IP.
 */
export function withRateLimit(handler: RouteHandler): RouteHandler {
    return async (req: NextRequest, context?: Record<string, unknown>) => {
        // 1. Resolve identity
        let key: string
        let isAuthenticated = false
        let isWhitelisted = false

        try {
            const session = await getServerSession(authOptions)
            const email = session?.user?.email

            if (email) {
                key = `email:${email.toLowerCase()}`
                isAuthenticated = true
                isWhitelisted = isEmailAllowed(email)
            } else {
                key = `ip:${resolveIp(req)}`
            }
        } catch {
            // If session resolution fails, fall back to IP-based limiting
            key = `ip:${resolveIp(req)}`
        }

        // 2. Check rate limit
        const result = checkRateLimit(key, isAuthenticated, isWhitelisted)

        if (!result.allowed) {
            return NextResponse.json(
                { error: 'Too many requests' },
                {
                    status: 429,
                    headers: {
                        'Retry-After': String(result.retryAfter),
                        'X-RateLimit-Limit': String(result.limit),
                        'X-RateLimit-Remaining': '0',
                        'X-RateLimit-Reset': String(result.reset),
                    },
                },
            )
        }

        // 3. Call original handler
        const response = await handler(req, context)

        // 4. Append rate-limit headers to successful responses
        if (response instanceof NextResponse) {
            response.headers.set('X-RateLimit-Limit', String(result.limit))
            response.headers.set('X-RateLimit-Remaining', String(result.remaining))
            response.headers.set('X-RateLimit-Reset', String(result.reset))
        }

        return response
    }
}
