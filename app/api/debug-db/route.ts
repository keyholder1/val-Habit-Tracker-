
import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export const dynamic = 'force-dynamic'

export async function GET() {
    console.log("Debug DB: Starting Check...")

    // safe inspection of env var
    const dbUrl = process.env.DATABASE_URL || ""
    let diagnosis = "Valid Format"
    let passwordCharCount = 0
    let firstChar = ""
    let lastChar = ""
    let hasBrackets = false
    let hasSpaces = false

    try {
        // Parse the URL to inspect segments safely
        // Format: postgresql://user:password@host:port/db
        const matches = dbUrl.match(/:\/\/([^:]+):([^@]+)@/)
        if (matches && matches[2]) {
            const password = matches[2]
            passwordCharCount = password.length
            firstChar = password.charAt(0)
            lastChar = password.charAt(password.length - 1)

            if (firstChar === '[' || lastChar === ']') {
                hasBrackets = true
                diagnosis = "CRITICAL: Password has brackets [] around it. remove them!"
            }
            if (password.includes(' ')) {
                hasSpaces = true
                diagnosis = "CRITICAL: Password contains spaces. remove them!"
            }
            if (password.includes('SSX') && password.includes('%3F')) {
                // looks correct
            } else {
                // checking if they pasted the RAW password instead of encoded
                if (password.includes('?')) {
                    diagnosis = "WARNING: Password has unencoded '?' character. It should be '%3F'"
                }
            }
        } else {
            diagnosis = "CRITICAL: DATABASE_URL is missing or malformed."
        }
    } catch (e) {
        diagnosis = "Error parsing URL string"
    }

    try {
        console.log("Attempting actual connection...")
        const count = await prisma.user.count()
        return NextResponse.json({
            status: 'success',
            message: 'Connected!',
            userCount: count,
            config_check: {
                diagnosis,
                first_char_of_pass: firstChar,
                last_char_of_pass: lastChar,
                length: passwordCharCount,
                has_brackets: hasBrackets
            }
        })
    } catch (error: any) {
        console.error("DB Connection Error:", error)
        return NextResponse.json({
            status: 'error',
            message: 'Database Connection Failed',
            error_details: error.message,
            config_check: {
                diagnosis,
                first_char_of_pass: firstChar, // Should be 'S'
                last_char_of_pass: lastChar,   // Should be 'j'
                length: passwordCharCount,     // Should be around ~15-20
                has_brackets: hasBrackets,
                has_spaces: hasSpaces
            }
        }, { status: 500 })
    }
}
