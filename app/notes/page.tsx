export const dynamic = 'force-dynamic'

import { getServerSession } from 'next-auth/next'
import { redirect } from 'next/navigation'
import { authOptions } from '@/lib/auth'
import NotesDashboard from '@/components/notes/NotesDashboard'

export default async function NotesPage() {
    const session = await getServerSession(authOptions)

    if (!session?.user) {
        redirect('/login')
    }

    return <NotesDashboard />
}
