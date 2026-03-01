/**
 * Lightweight per-IP rate limiter for write endpoints.
 * Simple sliding-window counter: 100 requests per minute per IP.
 * Standalone from the auth-aware rateLimit.ts — acts as secondary defense.
 */

import { NextRequest, NextResponse } from 'next/server'

// ── Config ──────────────────────────────────────────────────────────
const WRITE_LIMIT = 100       // max write requests per window per IP
const WINDOW_MS = 60_000      // 1 minute
const CLEANUP_INTERVAL = 120_000

// ── Storage ─────────────────────────────────────────────────────────
const ipStore = new Map<string, number[]>()

// Periodic cleanup to prevent memory leaks
let cleanupTimer: ReturnType<typeof setInterval> | null = null

function ensureCleanup() {
    if (cleanupTimer) return
    cleanupTimer = setInterval(() => {
        const now = Date.now()
        for (const [key, timestamps] of ipStore) {
            const recent = timestamps.filter(t => t > now - WINDOW_MS)
            if (recent.length === 0) {
                ipStore.delete(key)
            } else {
                ipStore.set(key, recent)
            }
        }
    }, CLEANUP_INTERVAL)
    if (cleanupTimer && typeof cleanupTimer === 'object' && 'unref' in cleanupTimer) {
        cleanupTimer.unref()
    }
}

// ── Core check ──────────────────────────────────────────────────────

function resolveIp(req: NextRequest): string {
    return (
        req.headers.get('x-forwarded-for')?.split(',')[0].trim() ||
        req.headers.get('x-real-ip') ||
        'unknown'
    )
}

interface GuardResult {
    allowed: boolean
    retryAfterSeconds: number
}

function checkWriteLimit(ip: string): GuardResult {
    ensureCleanup()
    const now = Date.now()
    const windowStart = now - WINDOW_MS

    let timestamps = ipStore.get(ip)
    if (!timestamps) {
        timestamps = []
        ipStore.set(ip, timestamps)
    }

    // Prune old entries
    while (timestamps.length > 0 && timestamps[0] < windowStart) {
        timestamps.shift()
    }

    if (timestamps.length >= WRITE_LIMIT) {
        const oldest = timestamps[0]
        const retryAfterMs = oldest + WINDOW_MS - now
        return {
            allowed: false,
            retryAfterSeconds: Math.ceil(Math.max(retryAfterMs, 1000) / 1000),
        }
    }

    timestamps.push(now)
    return { allowed: true, retryAfterSeconds: 0 }
}

// ── Public API ──────────────────────────────────────────────────────

/**
 * Call at the top of any write (POST/PUT/PATCH/DELETE) handler.
 * Returns a 429 NextResponse if the IP has exceeded the write limit,
 * or null if the request is allowed.
 */
export function guardWriteEndpoint(req: NextRequest): NextResponse | null {
    const ip = resolveIp(req)
    const result = checkWriteLimit(ip)

    if (!result.allowed) {
        return NextResponse.json(
            { error: 'Too many write requests. Please slow down.' },
            {
                status: 429,
                headers: {
                    'Retry-After': String(result.retryAfterSeconds),
                },
            },
        )
    }

    return null // allowed
}
