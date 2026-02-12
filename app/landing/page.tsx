import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation'
import { authOptions } from '@/lib/auth'
import { isSpecialUser } from '@/lib/whitelist'
import AuroraLanding from './AuroraLanding'

export default async function LandingPage() {
    const session = await getServerSession(authOptions)

    // Unauthenticated users see the landing page
    if (!session?.user) {
        return <AuroraLanding />
    }

    // Check if this is the special user
    const showInteractive = isSpecialUser(session.user.email)

    if (!showInteractive) {
        // Other users skip to dashboard
        redirect('/dashboard')
    }

    // Special landing page for Nandini
    return <AuroraLanding />
}
