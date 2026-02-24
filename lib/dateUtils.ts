/**
 * Returns the Monday 00:00:00.000 (local time) of the week containing the given date.
 * Week starts on Monday.
 */
export function getWeekStart(date: Date): Date {
    const d = new Date(date)
    const day = d.getDay() // Sun=0, Mon=1 ... Sat=6
    const diff = day === 0 ? 6 : day - 1
    d.setDate(d.getDate() - diff)
    d.setHours(0, 0, 0, 0)
    return d
}
