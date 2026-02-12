import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'

export type MigraineEntry = {
    id: string
    userId: string
    date: string
    severity: number
    foodBefore: string | null
    foodAfterDay1: string | null
    foodAfterDay2: string | null
    foodAfterDay3: string | null
    createdAt: string
}

export function useMigraine() {
    const queryClient = useQueryClient()
    const queryKey = ['migraine']

    const { data: entries, isLoading, error } = useQuery({
        queryKey,
        queryFn: async () => {
            const res = await fetch('/api/migraine')
            if (!res.ok) throw new Error('Failed to fetch migraine entries')
            return res.json() as Promise<MigraineEntry[]>
        },
    })

    const addEntry = useMutation({
        mutationFn: async (entry: Partial<MigraineEntry>) => {
            const res = await fetch('/api/migraine', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(entry),
            })
            if (!res.ok) throw new Error('Failed to save migraine entry')
            return res.json()
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey })
            queryClient.invalidateQueries({ queryKey: ['analytics'] })
        },
    })

    return {
        entries,
        isLoading,
        error,
        addEntry,
    }
}
