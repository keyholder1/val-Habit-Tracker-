/**
 * Wraps a promise with timing logic.
 * Logs a warning if execution takes longer than threshold (default 300ms).
 */
import { logger } from '@/lib/logger'
export async function withTiming<T>(
    label: string,
    fn: () => Promise<T>,
    thresholdMs: number = 300
): Promise<T> {
    const start = performance.now()
    try {
        const result = await fn()
        const duration = performance.now() - start

        if (duration > thresholdMs) {
            logger.logWarn(`[Slow Query] ${label} took ${duration.toFixed(2)}ms (Threshold: ${thresholdMs}ms)`)
        } else {
            // Optional: Log all timings in debug mode? 
            // console.log(`⏱️ [Timing] ${label} took ${duration.toFixed(2)}ms`)
        }

        return result
    } catch (error) {
        const duration = performance.now() - start
        logger.logError(`${label} failed after ${duration.toFixed(2)}ms`, error)
        throw error
    }
}
