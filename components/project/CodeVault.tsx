'use client'

import React, { useState } from 'react'

interface CodeBlock {
    id: string
    title: string
    codeContent: string
    language: string
    notes?: string
}

interface CodeVaultProps {
    projectId: string
    initialBlocks?: CodeBlock[]
}

export default function CodeVault({ projectId, initialBlocks = [] }: CodeVaultProps) {
    const [blocks, setBlocks] = useState<CodeBlock[]>(initialBlocks)
    const [isAdding, setIsAdding] = useState(false)
    const [expandedBlockId, setExpandedBlockId] = useState<string | null>(null)
    const [loading, setLoading] = useState(false)

    // Form State
    const [newBlock, setNewBlock] = useState({
        title: '',
        language: 'TypeScript',
        codeContent: '',
        notes: ''
    })

    const handleAddBlock = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        try {
            const res = await fetch(`/api/projects/${projectId}/code-blocks`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newBlock)
            })
            if (res.ok) {
                const block = await res.json()
                setBlocks([...blocks, block])
                setIsAdding(false)
                setNewBlock({ title: '', language: 'TypeScript', codeContent: '', notes: '' })
            } else {
                const err = await res.json()
                alert(err.error || 'Failed to add code block')
            }
        } catch (error) {
            console.error('Failed to add code block', error)
        } finally {
            setLoading(false)
        }
    }

    const handleDeleteBlock = async (blockId: string) => {
        if (!confirm('Are you sure?')) return
        try {
            const res = await fetch(`/api/code-blocks/${blockId}`, { method: 'DELETE' })
            if (res.ok) {
                setBlocks(blocks.filter(b => b.id !== blockId))
            }
        } catch (error) {
            console.error('Failed to delete block', error)
        }
    }

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <h3 className="text-lg font-bold text-neutral-800 flex items-center gap-2">
                    <span className="text-xl">🔐</span> Code Vault
                </h3>
                <button
                    onClick={() => setIsAdding(!isAdding)}
                    className="px-3 py-1 bg-neutral-800 text-white text-sm rounded-lg hover:bg-neutral-900 transition-colors"
                >
                    {isAdding ? 'Cancel' : '+ Add Code'}
                </button>
            </div>

            {isAdding && (
                <form onSubmit={handleAddBlock} className="bg-neutral-50 p-4 rounded-xl border border-neutral-200 space-y-3 animate-fade-in">
                    <input
                        type="text"
                        placeholder="Title (e.g. Auth Middleware)"
                        value={newBlock.title}
                        onChange={e => setNewBlock({ ...newBlock, title: e.target.value })}
                        className="w-full px-3 py-2 border rounded-lg"
                        required
                    />
                    <select
                        value={newBlock.language}
                        onChange={e => setNewBlock({ ...newBlock, language: e.target.value })}
                        className="w-full px-3 py-2 border rounded-lg"
                    >
                        <option>TypeScript</option>
                        <option>JavaScript</option>
                        <option>Python</option>
                        <option>Java</option>
                        <option>C++</option>
                        <option>SQL</option>
                        <option>JSON</option>
                        <option>CSS</option>
                        <option>HTML</option>
                        <option>Other</option>
                    </select>
                    <textarea
                        placeholder="Paste code here..."
                        value={newBlock.codeContent}
                        onChange={e => setNewBlock({ ...newBlock, codeContent: e.target.value })}
                        rows={6}
                        className="w-full px-3 py-2 border rounded-lg font-mono text-xs"
                        required
                    />
                    <input
                        type="text"
                        placeholder="Notes (optional)"
                        value={newBlock.notes}
                        onChange={e => setNewBlock({ ...newBlock, notes: e.target.value })}
                        className="w-full px-3 py-2 border rounded-lg text-sm"
                    />
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full py-2 bg-neutral-800 text-white rounded-lg hover:bg-neutral-900 transition-colors"
                    >
                        {loading ? 'Adding...' : 'Save to Vault'}
                    </button>
                </form>
            )}

            <div className="space-y-2">
                {blocks.map(block => (
                    <div key={block.id} className="border border-neutral-200 rounded-lg overflow-hidden">
                        <div
                            onClick={() => setExpandedBlockId(expandedBlockId === block.id ? null : block.id)}
                            className="bg-white p-3 flex items-center justify-between cursor-pointer hover:bg-neutral-50"
                        >
                            <div className="flex items-center gap-2">
                                <span className="text-xs font-mono bg-neutral-100 px-1.5 py-0.5 rounded text-neutral-600">
                                    {block.language}
                                </span>
                                <span className="font-medium text-neutral-700">{block.title}</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="text-xs text-neutral-400">{expandedBlockId === block.id ? '▼' : '▶'}</span>
                            </div>
                        </div>

                        {expandedBlockId === block.id && (
                            <div className="bg-neutral-900 p-4 overflow-x-auto relative group">
                                <pre className="text-xs font-mono text-neutral-300">
                                    <code>{block.codeContent}</code>
                                </pre>
                                {block.notes && (
                                    <div className="mt-3 pt-3 border-t border-neutral-800 text-neutral-500 text-xs italic">
                                        Note: {block.notes}
                                    </div>
                                )}
                                <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity flex gap-2">
                                    <button
                                        onClick={() => navigator.clipboard.writeText(block.codeContent)}
                                        className="px-2 py-1 bg-neutral-700 text-white text-xs rounded hover:bg-neutral-600"
                                    >
                                        Copy
                                    </button>
                                    <button
                                        onClick={() => handleDeleteBlock(block.id)}
                                        className="px-2 py-1 bg-red-900/50 text-red-200 text-xs rounded hover:bg-red-900"
                                    >
                                        Delete
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                ))}

                {blocks.length === 0 && !isAdding && (
                    <div className="text-center py-6 text-neutral-400 text-sm bg-neutral-50/50 rounded-xl border border-dashed border-neutral-200">
                        Vault is empty
                    </div>
                )}
            </div>
        </div>
    )
}
