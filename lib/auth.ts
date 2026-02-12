import { NextAuthOptions } from 'next-auth'
import GoogleProvider from 'next-auth/providers/google'
import { isEmailAllowed } from './whitelist'

import { PrismaAdapter } from "@next-auth/prisma-adapter"
import { prisma } from "@/lib/db"

export const authOptions: NextAuthOptions = {
    adapter: PrismaAdapter(prisma),
    debug: true,
    logger: {
        error(code, metadata) {
            console.error('❌ [NextAuth Logger] ERROR:', code, metadata)
        },
        warn(code) {
            console.warn('⚠️ [NextAuth Logger] WARN:', code)
        },
        debug(code, metadata) {
            console.log('🐞 [NextAuth Logger] DEBUG:', code, metadata)
        }
    },
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID!,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
            authorization: {
                params: {
                    prompt: "consent",
                    access_type: "offline",
                    response_type: "code"
                }
            },
            allowDangerousEmailAccountLinking: true,
        }),
    ],
    callbacks: {
        async signIn({ user, account }) {
            // Enforce whitelist
            // if (!isEmailAllowed(user.email)) {
            //     console.log('Sign-in blocked for non-whitelisted email:', user.email)
            //     return false
            // }
            console.log('Sign-in allowed for:', user.email)
            return true
        },
        async jwt({ token, user }) {
            if (user) {
                token.id = user.id
                token.email = user.email
            }
            return token
        },
        async session({ session, token }) {
            if (token && session.user) {
                session.user.id = token.id as string
                session.user.email = token.email as string
            }
            return session
        },
    },
    events: {
        async signIn(message) { console.log('✅ [NextAuth Event] signIn:', JSON.stringify(message, null, 2)) },
        async createUser(message) { console.log('✅ [NextAuth Event] createUser:', JSON.stringify(message, null, 2)) },
        async linkAccount(message) { console.log('✅ [NextAuth Event] linkAccount:', JSON.stringify(message, null, 2)) },
        async session(message) { console.log('ℹ️ [NextAuth Event] session active') },
    },
    pages: {
        signIn: '/login',
        error: '/login',
    },
    session: {
        strategy: 'jwt',
        maxAge: 30 * 24 * 60 * 60, // 30 days
    },
}
