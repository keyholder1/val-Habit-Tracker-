export default function MigraineIndicator({ severity }: { severity: number }) {
    if (!severity || severity === 0) return null

    const colorClass =
        severity >= 8 ? 'bg-red-500' :
            severity >= 5 ? 'bg-orange-500' :
                'bg-green-500' // green-500 for severity 1-4 might be confusing? maybe use blue or yellow? user said "1=mild". 
    // Let's use: 1-3 green/yellow, 4-7 orange, 8-10 red.
    // Actually: 1-3 Teal, 4-6 Yellow/Orange, 7-10 Red.

    const bgColor =
        severity >= 7 ? 'bg-rose-500' :
            severity >= 4 ? 'bg-amber-400' :
                'bg-emerald-400'

    return (
        <div className={`w-2 h-2 rounded-full ${bgColor} shadow-sm ring-1 ring-white`} title={`Severity: ${severity}`} />
    )
}
