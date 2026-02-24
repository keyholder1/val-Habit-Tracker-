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
    startDate: string
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
        mutationFn: async (newGoal: { name: string; symbol?: string; weeklyTarget: number; startDate?: string }) => {
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
            queryClient.invalidateQueries({ queryKey: ['weeklyLogs'] })
            queryClient.invalidateQueries({ queryKey: ['analytics'] })
            queryClient.invalidateQueries({ queryKey: ['monthView'] })
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

    const deleteGoalPermanently = useMutation({
        mutationFn: async (id: string) => {
            const res = await fetch(`/api/goals/${id}`, {
                method: 'DELETE',
            })
            if (!res.ok) {
                const errorData = await res.json().catch(() => ({ error: 'Unknown error' }))
                throw new Error(errorData.error || 'Failed to delete goal permanently')
            }
            return res.json()
        },
        // Optimistic update: remove goal from cache immediately
        onMutate: async (id: string) => {
            // Cancel any outgoing refetches
            await queryClient.cancelQueries({ queryKey })

            // Snapshot current goals
            const previousGoals = queryClient.getQueryData<Goal[]>(queryKey)

            // Optimistically remove the goal
            queryClient.setQueryData<Goal[]>(queryKey, (old) =>
                old ? old.filter(g => g.id !== id) : []
            )

            return { previousGoals }
        },
        onError: (_err, _id, context) => {
            // Rollback on failure
            if (context?.previousGoals) {
                queryClient.setQueryData(queryKey, context.previousGoals)
            }
        },
        onSettled: () => {
            // Always refetch after error or success
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
        deleteGoalPermanently,
    }
}
