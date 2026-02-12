'use client'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { useState } from 'react'

export default function QueryProvider({ children }: { children: React.ReactNode }) {
    const [queryClient] = useState(() => new QueryClient({
        defaultOptions: {
            queries: {
                // Data is fresh for 5 minutes
                staleTime: 5 * 60 * 1000,
                // Cache data for 10 minutes (gcTime in TanStack Query v5)
                gcTime: 10 * 60 * 1000,
                // Retry failed requests once
                retry: 1,
                // Disable automatic refetch on window focus
                refetchOnWindowFocus: false,
                // Refetch on reconnect
                refetchOnReconnect: true,
            },
            mutations: {
                retry: 1,
                retryDelay: 1000,
            },
        },
    }))

    return (
        <QueryClientProvider client={queryClient}>
            {children}
            <ReactQueryDevtools initialIsOpen={false} />
        </QueryClientProvider>
    )
}
