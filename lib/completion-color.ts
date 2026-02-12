
// Color interpolation utility for data-driven UI
// Maps 0-100% completion to a Red -> Yellow -> Green gradient

interface ColorStop {
    percent: number
    color: [number, number, number] // RGB
}

// Define the gradient stops matching the user's "Corporate/Apple Health" spec
const STOPS: ColorStop[] = [
    { percent: 0, color: [185, 28, 28] },    // 0% - Deep Red (Red-700)
    { percent: 10, color: [239, 68, 68] },   // 10% - Red (Red-500)
    { percent: 20, color: [249, 115, 22] },  // 20% - Red Orange (Orange-500)
    { percent: 30, color: [245, 158, 11] },  // 30% - Orange (Amber-500)
    { percent: 40, color: [234, 179, 8] },   // 40% - Orange Yellow (Yellow-500)
    { percent: 50, color: [250, 204, 21] },  // 50% - Yellow (Yellow-400)
    { percent: 60, color: [163, 230, 53] },  // 60% - Yellow Green (Lime-400)
    { percent: 70, color: [132, 204, 22] },  // 70% - Light Green (Lime-500)
    { percent: 80, color: [74, 222, 128] },  // 80% - Fresh Green (Green-400)
    { percent: 90, color: [34, 197, 94] },   // 90% - Bright Soft Green (Green-500)
    { percent: 100, color: [22, 163, 74] },  // 100% - Light Success Green (Green-600)
]

// Helper to interpolate between two RGB colors
function interpolateColor(color1: [number, number, number], color2: [number, number, number], factor: number): [number, number, number] {
    const result: [number, number, number] = [
        Math.round(color1[0] + (color2[0] - color1[0]) * factor),
        Math.round(color1[1] + (color2[1] - color1[1]) * factor),
        Math.round(color1[2] + (color2[2] - color1[2]) * factor),
    ]
    return result
}

// Main function to get RGB string
export function getCompletionColorRGB(percent: number): string {
    // Clamp and safeguard against NaN
    const safePercent = Number.isFinite(percent) ? percent : 0
    const p = Math.max(0, Math.min(100, safePercent))

    // Find the stops we are between
    let lower = STOPS[0]
    let upper = STOPS[STOPS.length - 1]

    for (let i = 0; i < STOPS.length - 1; i++) {
        if (p >= STOPS[i].percent && p <= STOPS[i + 1].percent) {
            lower = STOPS[i]
            upper = STOPS[i + 1]
            break
        }
    }

    if (lower === upper) return `rgb(${lower.color.join(',')})`

    const range = upper.percent - lower.percent
    const progress = p - lower.percent
    const factor = range === 0 ? 0 : progress / range

    const rgb = interpolateColor(lower.color, upper.color, factor)
    return `rgb(${rgb.join(',')})`
}

// Get completion color for Water Fill (CSS Gradient)
export function getCompletionWaterGradient(percent: number): string {
    const mainColor = getCompletionColorRGB(percent)
    // Create a subtle gradient from the main color to a slightly more transparent/lighter version 
    // for a "liquid" look that still adheres to the data-driven color.
    return `linear-gradient(to top, ${mainColor} 0%, ${mainColor}cc 100%)`
}

// Get the full gradient text for the legend bar
export function getLinearGradientCSS(direction: string = 'to right'): string {
    const stopsString = STOPS.map(s => {
        return `rgb(${s.color.join(',')}) ${s.percent}%`
    }).join(', ')
    return `linear-gradient(${direction}, ${stopsString})`
}
