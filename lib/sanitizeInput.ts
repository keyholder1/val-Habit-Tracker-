/**
 * Input sanitization utilities.
 *
 * Applied BEFORE Zod validation to strip dangerous characters
 * while preserving emoji and normal Unicode text.
 */

/**
 * Core sanitizer: trim whitespace, strip control characters, enforce max length.
 * Preserves emojis and all printable Unicode.
 */
export function sanitizeText(input: unknown, maxLength: number): string {
    if (typeof input !== 'string') return ''

    return input
        // Strip ASCII control characters (U+0000–U+001F, U+007F) except common whitespace
        // eslint-disable-next-line no-control-regex
        .replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, '')
        .trim()
        .slice(0, maxLength)
}

// ── Domain-specific sanitizers ──────────────────────────────────────

/** Goal name — max 100 chars */
export function sanitizeGoalName(input: unknown): string {
    return sanitizeText(input, 100)
}

/** Note title — max 200 chars */
export function sanitizeNoteTitle(input: unknown): string {
    return sanitizeText(input, 200)
}

/** Project title — max 200 chars */
export function sanitizeProjectTitle(input: unknown): string {
    return sanitizeText(input, 200)
}

/** Long-form text (notes content, project description, diary text) — max 5000 chars */
export function sanitizeLongText(input: unknown): string {
    return sanitizeText(input, 5000)
}
