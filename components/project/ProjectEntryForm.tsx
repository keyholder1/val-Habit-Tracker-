'use client'

import React, { useState } from 'react'
import CodeVault from './CodeVault'
import AutoSaveIndicator from '@/components/ui/AutoSaveIndicator'

interface ProjectEntryFormProps {
    initialData?: any
    onSuccess?: () => void
    onCancel?: () => void
    readOnly?: boolean
}

export default function ProjectEntryForm({ initialData, onSuccess, onCancel, readOnly = false }: ProjectEntryFormProps) {
    const [formData, setFormData] = useState({
        projectName: initialData?.projectName || '',
        techStack: initialData?.techStack || '',
        projectType: initialData?.projectType || 'Web App',
        featuresImplemented: initialData?.featuresImplemented || '',
        projectDescription: initialData?.projectDescription || '',
        futureIdeas: initialData?.futureIdeas || ''
    })
    const [submitLoading, setSubmitLoading] = useState(false)

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setSubmitLoading(true)
        try {
            const res = await fetch('/api/projects', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            })
            if (res.ok) {
                onSuccess?.()
            }
        } catch (error) {
            console.error('Failed to save project', error)
        } finally {
            setSubmitLoading(false)
        }
    }

    return (
        <div className="space-y-6">
            <form onSubmit={handleSubmit} className="space-y-4 relative">
                {!readOnly && (
                    <AutoSaveIndicator
                        content={`${formData.projectDescription}${formData.featuresImplemented}${formData.futureIdeas}`}
                    />
                )}
                {/* Project Name */}
                <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-1">Project Name</label>
                    <input
                        type="text"
                        value={formData.projectName}
                        onChange={e => setFormData({ ...formData, projectName: e.target.value })}
                        disabled={readOnly}
                        className="w-full px-3 py-2 border border-neutral-200 rounded-lg focus:ring-2 focus:ring-primary-400 outline-none"
                        required
                    />
                </div>

                {/* Tech Stack */}
                <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-1">Tech Stack (comma separated)</label>
                    <input
                        type="text"
                        value={formData.techStack}
                        onChange={e => setFormData({ ...formData, techStack: e.target.value })}
                        disabled={readOnly}
                        className="w-full px-3 py-2 border border-neutral-200 rounded-lg focus:ring-2 focus:ring-primary-400 outline-none"
                        placeholder="React, Next.js, Prisma..."
                    />
                </div>

                {/* Project Type */}
                <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-1">Project Type</label>
                    <select
                        value={formData.projectType}
                        onChange={e => setFormData({ ...formData, projectType: e.target.value })}
                        disabled={readOnly}
                        className="w-full px-3 py-2 border border-neutral-200 rounded-lg focus:ring-2 focus:ring-primary-400 outline-none"
                    >
                        <option>Web App</option>
                        <option>Mobile App</option>
                        <option>Desktop App</option>
                        <option>Tool</option>
                        <option>Library</option>
                        <option>System</option>
                        <option>Other</option>
                    </select>
                </div>

                {/* Description */}
                <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-1">Project Description</label>
                    <textarea
                        value={formData.projectDescription}
                        onChange={e => setFormData({ ...formData, projectDescription: e.target.value })}
                        disabled={readOnly}
                        rows={4}
                        className="w-full px-3 py-2 border border-neutral-200 rounded-lg focus:ring-2 focus:ring-primary-400 outline-none resize-none"
                    />
                </div>

                {/* Features */}
                <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-1">Features Implemented</label>
                    <textarea
                        value={formData.featuresImplemented}
                        onChange={e => setFormData({ ...formData, featuresImplemented: e.target.value })}
                        disabled={readOnly}
                        rows={4}
                        className="w-full px-3 py-2 border border-neutral-200 rounded-lg focus:ring-2 focus:ring-primary-400 outline-none resize-none"
                    />
                </div>

                {/* Future Ideas */}
                <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-1">Future Ideas</label>
                    <textarea
                        value={formData.futureIdeas}
                        onChange={e => setFormData({ ...formData, futureIdeas: e.target.value })}
                        disabled={readOnly}
                        rows={4}
                        className="w-full px-3 py-2 border border-neutral-200 rounded-lg focus:ring-2 focus:ring-primary-400 outline-none resize-none"
                    />
                </div>

                {!readOnly && (
                    <div className="flex justify-end gap-3 pt-4">
                        <button
                            type="button"
                            onClick={onCancel}
                            className="px-4 py-2 text-neutral-600 hover:bg-neutral-100 rounded-lg transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={submitLoading}
                            className="px-6 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg shadow-md transition-all disabled:opacity-70"
                        >
                            {submitLoading ? 'Saving...' : 'Save Project'}
                        </button>
                    </div>
                )}
            </form>

            {/* Code Vault - Only show in read/detail mode if project exists */}
            {readOnly && initialData?.id && (
                <div className="pt-8 border-t border-neutral-200">
                    <CodeVault projectId={initialData.id} initialBlocks={initialData.codeBlocks} />
                </div>
            )}
        </div>
    )
}
