/**
 * Environment variable validation — runs once on server startup.
 * Throws a clear error if any required variable is missing.
 * Never logs secret values.
 */

const REQUIRED_ENV_VARS = [
    'DATABASE_URL',
    'NEXTAUTH_SECRET',
    'NEXTAUTH_URL',
    'GOOGLE_CLIENT_ID',
    'GOOGLE_CLIENT_SECRET',
] as const

export function validateEnv(): void {
    const missing: string[] = []

    for (const name of REQUIRED_ENV_VARS) {
        if (!process.env[name]) {
            missing.push(name)
        }
    }

    if (missing.length > 0) {
        throw new Error(
            `Missing ${missing.length === 1 ? 'environment variable' : 'environment variables'}: ${missing.join(', ')}`
        )
    }
}
