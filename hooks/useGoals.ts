import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'

export type Goal = {
    id: string
    userId: string
    name: string
    symbol: string
    weeklyTarget: number
    isArchived: boolean
    archivedFromWeek: string | null
    deletedAt: string | null
    activeFrom: string
    createdAt: string
}

export function useGoals() {
    const queryClient = useQueryClient()
    const queryKey = ['goals']

    const { data: goals, isLoading, error } = useQuery({
        queryKey,
        queryFn: async () => {
            const res = await fetch('/api/goals', { cache: 'no-store' })
            if (!res.ok) throw new Error('Failed to fetch goals')
            return res.json() as Promise<Goal[]>
        },
        retry: 2,
        staleTime: 1000 * 30, // 30 seconds
    })

    const createGoal = useMutation({
        mutationFn: async (newGoal: { name: string; symbol?: string; weeklyTarget: number; activeFrom?: string }) => {
            const res = await fetch('/api/goals', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newGoal),
            })
            if (!res.ok) throw new Error('Failed to create goal')
            return res.json()
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey })
            queryClient.invalidateQueries({ queryKey: ['analytics'] })
        },
    })

    const updateGoal = useMutation({
        mutationFn: async ({ id, data }: { id: string; data: Partial<Goal> }) => {
            const res = await fetch(`/api/goals/${id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
            })
            if (!res.ok) throw new Error('Failed to update goal')
            return res.json()
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey })
            queryClient.invalidateQueries({ queryKey: ['weeklyLogs'] })
            queryClient.invalidateQueries({ queryKey: ['analytics'] })
            queryClient.invalidateQueries({ queryKey: ['monthView'] })
        },
    })

    const archiveGoal = useMutation({
        mutationFn: async ({ id, isArchived, archivedFromWeek }: { id: string; isArchived: boolean; archivedFromWeek?: string }) => {
            const res = await fetch(`/api/goals/${id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ isArchived, archivedFromWeek }),
            })
            if (!res.ok) throw new Error('Failed to archive goal')
            return res.json()
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey })
            queryClient.invalidateQueries({ queryKey: ['weeklyLogs'] })
            queryClient.invalidateQueries({ queryKey: ['analytics'] })
            queryClient.invalidateQueries({ queryKey: ['monthView'] })
        },
    })

    const deleteGoal = useMutation({
        mutationFn: async (id: string) => {
            // Using PATCH to soft-delete by setting deletedAt
            // This preserves history if needed, or we can use DELETE for hard delete.
            // Prompt implies "Goal gone everywhere", but "Past logs preserved if required".
            // Soft delete is safer.
            const res = await fetch(`/api/goals/${id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ deletedAt: new Date().toISOString() }),
            })
            if (!res.ok) throw new Error('Failed to delete goal')
            return res.json()
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey })
            queryClient.invalidateQueries({ queryKey: ['weeklyLogs'] })
            queryClient.invalidateQueries({ queryKey: ['analytics'] })
            queryClient.invalidateQueries({ queryKey: ['monthView'] })
        },
    })

    return {
        goals,
        isLoading,
        error,
        createGoal,
        updateGoal,
        archiveGoal,
        deleteGoal,
    }
}
