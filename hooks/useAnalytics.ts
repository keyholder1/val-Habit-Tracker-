
import { useQuery } from '@tanstack/react-query'
import { AnalyticsPayload } from '@/lib/analytics/types'

async function fetchAnalytics(year?: number): Promise<AnalyticsPayload> {
    const url = year ? `/api/analytics?year=${year}` : '/api/analytics'
    const res = await fetch(url)
    if (!res.ok) {
        throw new Error('Failed to fetch analytics')
    }
    return res.json()
}

export function useAnalytics(year?: number) {
    return useQuery({
        queryKey: ['analytics', year],
        queryFn: () => fetchAnalytics(year),
        staleTime: 60 * 1000, // 1 minute
        gcTime: 5 * 60 * 1000, // 5 minutes
        refetchOnWindowFocus: false,
    })
}
