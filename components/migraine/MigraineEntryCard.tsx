import React from 'react'

interface MigraineEntry {
    id: string
    date: string
    severity: number
    foodBefore: string | null
    foodAfterDay1: string | null
    foodAfterDay2: string | null
    foodAfterDay3: string | null
}

interface MigraineEntryCardProps {
    entry: MigraineEntry
    onClick: () => void
    onDelete?: (e: React.MouseEvent) => void
}

export default function MigraineEntryCard({ entry, onClick, onDelete }: MigraineEntryCardProps) {
    const dateObj = new Date(entry.date)
    const dateStr = dateObj.toLocaleDateString(undefined, {
        weekday: 'short',
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    })

    const severityColor =
        entry.severity > 7 ? 'bg-red-500' :
            entry.severity > 4 ? 'bg-orange-500' :
                entry.severity > 0 ? 'bg-green-500' : 'bg-neutral-300'

    return (
        <div
            onClick={onClick}
            className="group bg-white rounded-xl p-4 border border-neutral-100 shadow-sm hover:shadow-md transition-all cursor-pointer relative overflow-hidden"
        >
            <div className={`absolute left-0 top-0 bottom-0 w-1.5 ${severityColor}`} />

            <div className="flex justify-between items-start mb-2 pl-2">
                <div className="flex-1">
                    <h4 className="font-semibold text-neutral-800 text-sm">{dateStr}</h4>
                    <span className="text-xs text-neutral-500">Severity: </span>
                    <span className={`text-xs font-bold ${entry.severity > 7 ? 'text-red-600' :
                        entry.severity > 4 ? 'text-orange-600' : 'text-green-600'
                        }`}>
                        {entry.severity}/10
                    </span>
                </div>
                {onDelete && (
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            onDelete(e);
                        }}
                        className="p-1.5 opacity-0 group-hover:opacity-100 hover:bg-red-50 text-neutral-400 hover:text-red-500 rounded-lg transition-all"
                        title="Delete Entry"
                    >
                        🗑️
                    </button>
                )}
            </div>

            {entry.foodBefore && (
                <div className="pl-2 mt-2">
                    <p className="text-xs text-neutral-500 uppercase tracking-wider font-medium mb-1">Triggers / Before</p>
                    <p className="text-sm text-neutral-700 line-clamp-2 bg-neutral-50 p-2 rounded border border-neutral-100">
                        {entry.foodBefore}
                    </p>
                </div>
            )}

            {(entry.foodAfterDay1 || entry.foodAfterDay2 || entry.foodAfterDay3) && (
                <div className="pl-2 mt-2">
                    <p className="text-xs text-neutral-500 uppercase tracking-wider font-medium mb-1">Post-Migraine</p>
                    <div className="flex gap-1 overflow-x-auto pb-1">
                        {entry.foodAfterDay1 && <span className="text-xs bg-blue-50 text-blue-700 px-2 py-1 rounded whitespace-nowrap border border-blue-100">D1: {entry.foodAfterDay1}</span>}
                        {entry.foodAfterDay2 && <span className="text-xs bg-blue-50 text-blue-700 px-2 py-1 rounded whitespace-nowrap border border-blue-100">D2: {entry.foodAfterDay2}</span>}
                        {entry.foodAfterDay3 && <span className="text-xs bg-blue-50 text-blue-700 px-2 py-1 rounded whitespace-nowrap border border-blue-100">D3: {entry.foodAfterDay3}</span>}
                    </div>
                </div>
            )}
        </div>
    )
}
