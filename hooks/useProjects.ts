import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'

export type ProjectEntry = {
    id: string
    userId: string
    projectName: string
    techStack: string
    projectType: string
    featuresImplemented: string
    projectDescription: string
    futureIdeas: string
    createdAt: string
    codeBlocks?: CodeBlock[]
}

export type CodeBlock = {
    id: string
    title: string
    codeContent: string
    language: string
    notes: string
    createdAt: string
}

export function useProjects() {
    const queryClient = useQueryClient()
    const queryKey = ['projects']

    const { data: projects, isLoading, error } = useQuery({
        queryKey,
        queryFn: async () => {
            const res = await fetch('/api/projects')
            if (!res.ok) throw new Error('Failed to fetch projects')
            return res.json() as Promise<{ data: ProjectEntry[], pagination: any }>
        },
    })

    const addProject = useMutation({
        mutationFn: async (project: Partial<ProjectEntry>) => {
            const res = await fetch('/api/projects', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(project),
            })
            if (!res.ok) throw new Error('Failed to save project')
            return res.json()
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey })
            queryClient.invalidateQueries({ queryKey: ['analytics'] })
        },
    })

    const addCodeBlock = useMutation({
        mutationFn: async (block: { projectId: string; title: string; codeContent: string; language?: string; notes?: string }) => {
            const res = await fetch('/api/code-blocks', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(block),
            })
            if (!res.ok) throw new Error('Failed to save code block')
            return res.json()
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey })
            queryClient.invalidateQueries({ queryKey: ['analytics'] })
        },
    })


    return {
        projects: projects?.data,
        pagination: projects?.pagination,
        isLoading,
        error,
        addProject,
        addCodeBlock,
    }
}
