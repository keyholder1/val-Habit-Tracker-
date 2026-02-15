import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'

export type Note = {
    id: string
    userId: string
    title: string
    content: string
    createdAt: string
    updatedAt: string
}

export function useNotes() {
    const queryClient = useQueryClient()
    const queryKey = ['notes']

    const { data: notes, isLoading, error } = useQuery({
        queryKey,
        queryFn: async () => {
            const res = await fetch('/api/notes', { cache: 'no-store' })
            if (!res.ok) throw new Error('Failed to fetch notes')
            return res.json() as Promise<Note[]>
        },
        retry: 2,
    })

    const createNote = useMutation({
        mutationFn: async (newNote: { title: string; content: string }) => {
            const res = await fetch('/api/notes', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newNote),
            })
            if (!res.ok) throw new Error('Failed to create note')
            return res.json()
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey })
        },
    })

    const updateNote = useMutation({
        mutationFn: async ({ id, data }: { id: string; data: Partial<Note> }) => {
            const res = await fetch(`/api/notes/${id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
            })
            if (!res.ok) throw new Error('Failed to update note')
            return res.json()
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey })
        },
    })

    const deleteNote = useMutation({
        mutationFn: async (id: string) => {
            const res = await fetch(`/api/notes/${id}`, {
                method: 'DELETE',
            })
            if (!res.ok) throw new Error('Failed to delete note')
            return res.json()
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey })
        },
    })

    return {
        notes,
        isLoading,
        error,
        createNote,
        updateNote,
        deleteNote,
    }
}
