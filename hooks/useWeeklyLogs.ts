import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { startOfWeek, formatISO } from 'date-fns'

type WeeklyLog = {
    id: string
    userId: string
    goalId: string
    weekStartDate: string
    weeklyTarget: number
    checkboxStates: boolean[]
}

export function useWeeklyLog(goalId: string, weekStartDate: Date) {
    const queryClient = useQueryClient()
    const formattedDate = formatISO(startOfWeek(weekStartDate, { weekStartsOn: 1 }), { representation: 'date' }) // YYYY-MM-DD

    // Using a normalized date string for cache key to ensure consistency
    // The API expects ISO string but our cache key should be stable
    const dateKey = weekStartDate.toISOString()

    const queryKey = ['weeklyLog', goalId, dateKey]

    const { data: log, isLoading } = useQuery({
        queryKey,
        queryFn: async () => {
            const params = new URLSearchParams({
                goalId,
                weekStartDate: weekStartDate.toISOString(),
            })
            const res = await fetch(`/api/weekly-logs?${params}`)
            if (!res.ok) {
                if (res.status === 404) return null
                throw new Error('Failed to fetch log')
            }
            return res.json() as Promise<WeeklyLog>
        },
        staleTime: 5 * 60 * 1000, // 5 minutes
    })

    const toggleCheckbox = useMutation({
        mutationFn: async ({ dayIndex, currentState }: { dayIndex: number, currentState: boolean[] }) => {
            const newStates = [...currentState]
            newStates[dayIndex] = !newStates[dayIndex]

            const res = await fetch('/api/weekly-logs', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    goalId,
                    weekStartDate: weekStartDate.toISOString(),
                    weeklyTarget: log?.weeklyTarget || 7, // Default to 7 if not set
                    checkboxStates: newStates,
                }),
            })

            if (!res.ok) throw new Error('Failed to update log')
            return res.json()
        },
        // Optimistic Update
        onMutate: async ({ dayIndex, currentState }) => {
            await queryClient.cancelQueries({ queryKey })

            const previousLog = queryClient.getQueryData<WeeklyLog>(queryKey)

            if (previousLog) {
                const newStates = [...currentState]
                newStates[dayIndex] = !newStates[dayIndex]

                queryClient.setQueryData<WeeklyLog>(queryKey, {
                    ...previousLog,
                    checkboxStates: newStates,
                })
            }

            return { previousLog }
        },
        onError: (err, newTodo, context) => {
            if (context?.previousLog) {
                queryClient.setQueryData(queryKey, context.previousLog)
            }
        },
        onSettled: () => {
            queryClient.invalidateQueries({ queryKey })
            // Also invalidate analytics to refresh charts
            queryClient.invalidateQueries({ queryKey: ['analytics'] })
        },
    })

    const updateTarget = useMutation({
        mutationFn: async (newTarget: number) => {
            const res = await fetch('/api/weekly-logs', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    goalId,
                    weekStartDate: weekStartDate.toISOString(),
                    weeklyTarget: newTarget,
                    checkboxStates: log?.checkboxStates || Array(7).fill(false),
                }),
            })

            if (!res.ok) throw new Error('Failed to update target')
            return res.json()
        },
        onMutate: async (newTarget) => {
            await queryClient.cancelQueries({ queryKey })
            const previousLog = queryClient.getQueryData<WeeklyLog>(queryKey)

            if (previousLog) {
                queryClient.setQueryData<WeeklyLog>(queryKey, {
                    ...previousLog,
                    weeklyTarget: newTarget,
                })
            }

            return { previousLog }
        },
        onError: (err, newTarget, context) => {
            if (context?.previousLog) {
                queryClient.setQueryData(queryKey, context.previousLog)
            }
        },
        onSettled: () => {
            queryClient.invalidateQueries({ queryKey })
            queryClient.invalidateQueries({ queryKey: ['analytics'] })
        },
    })

    return {
        log,
        isLoading,
        toggleCheckbox,
        updateTarget,
    }
}

export function useBulkWeeklyLogs(weekStartDate: Date) {
    const formattedDate = formatISO(startOfWeek(weekStartDate, { weekStartsOn: 1 }), { representation: 'date' })

    return useQuery({
        queryKey: ['weeklyLogs', 'bulk', weekStartDate.toISOString()],
        queryFn: async () => {
            const params = new URLSearchParams({
                weekStartDate: weekStartDate.toISOString(),
            })
            const res = await fetch(`/api/weekly-logs?${params}`)
            if (!res.ok) throw new Error('Failed to fetch bulk logs')
            return res.json() as Promise<WeeklyLog[]>
        },
        staleTime: 5 * 60 * 1000,
    })
}

