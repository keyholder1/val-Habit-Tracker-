/**
 * In-memory sliding-window rate limiter.
 * Zero database writes — pure Map-based.
 */

import { isEmailAllowed } from './whitelist'

// ── Config ──────────────────────────────────────────────────────────
const AUTHENTICATED_LIMIT = 120   // requests per window
const UNAUTHENTICATED_LIMIT = 30  // requests per window
const WHITELISTED_LIMIT = 600     // effectively unlimited for normal use
const WINDOW_MS = 60_000          // 1 minute
const CLEANUP_INTERVAL_MS = 60_000 // sweep stale entries every 60s
const STALE_THRESHOLD_MS = 5 * 60_000 // remove keys idle > 5 min

// ── Storage ─────────────────────────────────────────────────────────
// key → array of timestamps (epoch ms) within the sliding window
const store = new Map<string, number[]>()

// ── Periodic cleanup ────────────────────────────────────────────────
let cleanupTimer: ReturnType<typeof setInterval> | null = null

function ensureCleanup() {
    if (cleanupTimer) return
    cleanupTimer = setInterval(() => {
        const now = Date.now()
        for (const [key, timestamps] of store) {
            // Remove if all timestamps are older than the stale threshold
            if (timestamps.length === 0 || timestamps[timestamps.length - 1] < now - STALE_THRESHOLD_MS) {
                store.delete(key)
            }
        }
    }, CLEANUP_INTERVAL_MS)
    // Allow Node to exit even if the timer is still running
    if (cleanupTimer && typeof cleanupTimer === 'object' && 'unref' in cleanupTimer) {
        cleanupTimer.unref()
    }
}

// ── Public API ──────────────────────────────────────────────────────

export interface RateLimitResult {
    allowed: boolean
    retryAfter: number   // seconds until the client can retry (0 if allowed)
    remaining: number    // requests remaining in current window
    limit: number        // the applicable limit
    reset: number        // epoch seconds when the window resets
}

export function checkRateLimit(
    key: string,
    isAuthenticated: boolean,
    isWhitelisted: boolean,
): RateLimitResult {
    ensureCleanup()

    const now = Date.now()
    const windowStart = now - WINDOW_MS

    // Get or create the timestamp array
    let timestamps = store.get(key)
    if (!timestamps) {
        timestamps = []
        store.set(key, timestamps)
    }

    // Prune timestamps outside the current window
    while (timestamps.length > 0 && timestamps[0] < windowStart) {
        timestamps.shift()
    }

    // Determine limit
    const limit = isWhitelisted
        ? WHITELISTED_LIMIT
        : isAuthenticated
            ? AUTHENTICATED_LIMIT
            : UNAUTHENTICATED_LIMIT

    const reset = Math.ceil((now + WINDOW_MS) / 1000) // epoch seconds

    if (timestamps.length >= limit) {
        // Oldest timestamp in the window determines when a slot opens
        const oldestInWindow = timestamps[0]
        const retryAfterMs = oldestInWindow + WINDOW_MS - now
        return {
            allowed: false,
            retryAfter: Math.ceil(Math.max(retryAfterMs, 0) / 1000),
            remaining: 0,
            limit,
            reset,
        }
    }

    // Record this request
    timestamps.push(now)

    return {
        allowed: true,
        retryAfter: 0,
        remaining: limit - timestamps.length,
        limit,
        reset,
    }
}
