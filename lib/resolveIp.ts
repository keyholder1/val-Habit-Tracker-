/**
 * Extract the client IP address from a Next.js request.
 * Checks x-forwarded-for (first entry) and x-real-ip headers,
 * falling back to 'unknown'.
 */

import { NextRequest } from 'next/server'

export function resolveIp(req: NextRequest): string {
    return (
        req.headers.get('x-forwarded-for')?.split(',')[0].trim() ||
        req.headers.get('x-real-ip') ||
        'unknown'
    )
}
