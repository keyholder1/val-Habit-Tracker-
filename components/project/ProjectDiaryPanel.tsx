'use client'

import React, { useEffect, useState, useCallback } from 'react'
import ProjectEntryForm from './ProjectEntryForm'
import ProjectEntryCard from './ProjectEntryCard'

interface ProjectDiaryPanelProps {
    isOpen: boolean
    onClose: () => void
}

export default function ProjectDiaryPanel({ isOpen, onClose }: ProjectDiaryPanelProps) {
    const [mode, setMode] = useState<'list' | 'new' | 'detail'>('list')
    const [projects, setProjects] = useState<any[]>([])
    const [loading, setLoading] = useState(false)
    const [selectedProject, setSelectedProject] = useState<any | null>(null)
    const [page, setPage] = useState(1)
    const [hasMore, setHasMore] = useState(true)

    const loadProjects = useCallback(async (pageNum: number, reset = false) => {
        setLoading(true)
        try {
            const params = new URLSearchParams({
                page: pageNum.toString(),
                limit: '20'
            })
            const res = await fetch(`/api/projects?${params.toString()}`)
            if (res.ok) {
                const data = await res.json()
                const newProjects = data.data
                setProjects(prev => reset ? newProjects : [...prev, ...newProjects])
                setHasMore(newProjects.length === 20)
                setPage(pageNum)
            }
        } catch (error) {
            console.error('Failed to load projects', error)
        } finally {
            setLoading(false)
        }
    }, [])

    useEffect(() => {
        if (isOpen && mode === 'list') {
            loadProjects(1, true)
        }
    }, [isOpen, mode, loadProjects])

    const handleProjectCreated = () => {
        setMode('list')
        loadProjects(1, true)
    }

    const handleProjectSelect = async (projectId: string) => {
        setLoading(true)
        try {
            // Fetch full details including code blocks
            const res = await fetch(`/api/projects/${projectId}`)
            if (res.ok) {
                const project = await res.json()
                setSelectedProject(project)
                setMode('detail')
            }
        } catch (error) {
            console.error('Failed to load project details', error)
        } finally {
            setLoading(false)
        }
    }

    const handleDeleteProject = async (projectId: string) => {
        if (!confirm('Are you sure you want to delete this project? This action cannot be undone.')) return

        setLoading(true)
        try {
            const res = await fetch(`/api/projects/${projectId}`, {
                method: 'DELETE'
            })
            if (res.ok) {
                setProjects(prev => prev.filter(p => p.id !== projectId))
            } else {
                const data = await res.json()
                alert(data.error || 'Failed to delete project')
            }
        } catch (error) {
            console.error('Failed to delete project', error)
            alert('An unexpected error occurred')
        } finally {
            setLoading(false)
        }
    }

    if (!isOpen) return null

    return (
        <div className="fixed inset-0 z-50 flex justify-end">
            <div
                className="absolute inset-0 bg-black/20 backdrop-blur-sm transition-opacity"
                onClick={onClose}
            />

            <div className="relative w-full max-w-2xl bg-white h-full shadow-2xl flex flex-col animate-slide-in-right overflow-hidden">
                {/* Header */}
                <div className="p-4 border-b border-neutral-100 flex items-center justify-between bg-white z-10">
                    <div className="flex items-center gap-3">
                        {mode !== 'list' && (
                            <button
                                onClick={() => setMode('list')}
                                className="p-1 hover:bg-neutral-100 rounded-full text-neutral-500"
                            >
                                ←
                            </button>
                        )}
                        <h2 className="text-xl font-bold text-neutral-800">
                            {mode === 'list' && 'Project Diary'}
                            {mode === 'new' && 'New Project Entry'}
                            {mode === 'detail' && (selectedProject?.projectName || 'Project Details')}
                        </h2>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-neutral-100 rounded-full text-neutral-500">✕</button>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto bg-neutral-50">
                    {mode === 'list' && (
                        <div className="p-4 space-y-4">
                            <button
                                onClick={() => setMode('new')}
                                className="w-full py-3 bg-white border border-dashed border-neutral-300 rounded-xl text-neutral-500 hover:text-primary-600 hover:border-primary-300 hover:bg-primary-50/50 transition-all font-medium flex items-center justify-center gap-2"
                            >
                                <span>+</span> New Project Entry
                            </button>

                            {projects.map(project => (
                                <ProjectEntryCard
                                    key={project.id}
                                    project={project}
                                    onClick={() => handleProjectSelect(project.id)}
                                    onDelete={() => handleDeleteProject(project.id)}
                                />
                            ))}
                            {loading && <div className="text-center py-4 text-neutral-400">Loading...</div>}
                        </div>
                    )}

                    {mode === 'new' && (
                        <div className="p-4">
                            <ProjectEntryForm onSuccess={handleProjectCreated} onCancel={() => setMode('list')} />
                        </div>
                    )}

                    {mode === 'detail' && selectedProject && (
                        <div className="p-4">
                            <ProjectEntryForm
                                initialData={selectedProject}
                                readOnly={true} // Or allow edit? User implementation plan didn't specify edit, but implied "View". 
                            // Actually, CodeVault needs to be here.
                            // We'll render a DetailView component or reuse Form with read-only + CodeVault.
                            />
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
