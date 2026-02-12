import React from 'react'

interface ProjectEntryCardProps {
    project: any
    onClick: () => void
    onDelete?: (e: React.MouseEvent) => void
}

export default function ProjectEntryCard({ project, onClick, onDelete }: ProjectEntryCardProps) {
    return (
        <div
            onClick={onClick}
            className="bg-white p-4 rounded-xl border border-neutral-200 shadow-sm hover:shadow-md transition-all cursor-pointer group relative"
        >
            <div className="flex justify-between items-start mb-2">
                <div className="flex-1">
                    <h3 className="font-semibold text-neutral-800 group-hover:text-primary-600 transition-colors">
                        {project.projectName}
                    </h3>
                </div>
                <div className="flex items-center gap-2">
                    {onDelete && (
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                onDelete(e);
                            }}
                            className="p-1.5 opacity-0 group-hover:opacity-100 hover:bg-red-50 text-neutral-400 hover:text-red-500 rounded-lg transition-all"
                            title="Delete Project"
                        >
                            🗑️
                        </button>
                    )}
                    <span className="text-xs px-2 py-1 bg-neutral-100 rounded-full text-neutral-600">
                        {project.projectType}
                    </span>
                </div>
            </div>

            <p className="text-sm text-neutral-600 mb-3 line-clamp-2">
                {project.projectDescription}
            </p>

            <div className="flex flex-wrap gap-2">
                {project.techStack.split(',').slice(0, 3).map((tech: string, i: number) => (
                    <span key={i} className="text-xs px-1.5 py-0.5 bg-primary-50 text-primary-700 rounded border border-primary-100">
                        {tech.trim()}
                    </span>
                ))}
            </div>

            <div className="mt-3 text-xs text-neutral-400">
                {new Date(project.createdAt).toLocaleDateString()}
            </div>
        </div>
    )
}
