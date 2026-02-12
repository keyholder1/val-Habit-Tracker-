import { Suspense } from 'react'
import { getServerSession } from 'next-auth/next'
import { redirect } from 'next/navigation'
import { authOptions } from '@/lib/auth'
import LoginContent from '@/components/LoginContent'

export default async function LoginPage() {
    const session = await getServerSession(authOptions)

    // Auto-redirect if session exists
    if (session) {
        if (session.user?.email === 'nandini.zunder@gmail.com') {
            redirect('/landing')
        }
        redirect('/dashboard')
    }

    return (
        <Suspense fallback={<div className="min-h-screen bg-neutral-50" />}>
            <LoginContent />
        </Suspense>
    )
}
