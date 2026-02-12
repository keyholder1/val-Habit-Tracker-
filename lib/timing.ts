/**
 * Wraps a promise with timing logic.
 * Logs a warning if execution takes longer than threshold (default 300ms).
 */
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
            console.warn(`⚠️ [Slow Query] ${label} took ${duration.toFixed(2)}ms (Threshold: ${thresholdMs}ms)`)
        } else {
            // Optional: Log all timings in debug mode? 
            // console.log(`⏱️ [Timing] ${label} took ${duration.toFixed(2)}ms`)
        }

        return result
    } catch (error) {
        const duration = performance.now() - start
        console.error(`❌ [Error] ${label} failed after ${duration.toFixed(2)}ms`)
        throw error
    }
}
