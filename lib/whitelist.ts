export const ALLOWED_EMAILS = [
    'nandini.zunder@gmail.com',
    'arnav.nishant.deshpande@gmail.com'
] as const

export type AllowedEmail = typeof ALLOWED_EMAILS[number]

export const MIGRAINE_USER_EMAIL = 'nandini.zunder@gmail.com'
export const PROJECT_USER_EMAIL = 'arnav.nishant.deshpande@gmail.com'

// Check if email is whitelisted
export function isEmailAllowed(email: string | null | undefined): boolean {
    if (!email) return false
    const lowerEmail = email.toLowerCase()
    return ALLOWED_EMAILS.some(e => e.toLowerCase() === lowerEmail)
}

export function isMigraineUser(email?: string | null): boolean {
    if (!email) return false
    return email.toLowerCase() === MIGRAINE_USER_EMAIL.toLowerCase()
}

export function isProjectUser(email?: string | null): boolean {
    if (!email) return false
    return email.toLowerCase() === PROJECT_USER_EMAIL.toLowerCase()
}

export function assertMigraineAccess(session: any | null) {
    if (!session?.user?.email || !isMigraineUser(session.user.email)) {
        throw new Error('Unauthorized: Migraine features are restricted.')
    }
}

export function assertProjectAccess(session: any | null) {
    if (!session?.user?.email || !isProjectUser(session.user.email)) {
        throw new Error('Unauthorized: Project Diary features are restricted.')
    }
}

// Special user check for custom landing page
export const SPECIAL_USER_EMAIL = 'nandini.zunder@gmail.com'

export function isSpecialUser(email: string | null | undefined): boolean {
    return email === SPECIAL_USER_EMAIL
}
