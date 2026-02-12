// Month Themes Configuration
// Defines a unique "Water Color" mood for each month (0-11)

export interface MonthTheme {
    monthName: string
    primaryColor: string   // Text / Accent
    secondaryColor: string // Light backgrounds
    waterGradient: string  // The water fill gradient
    waterColor: string     // Solid fallback
    borderColor: string    // Border for active days
}

export const MONTH_THEMES: Record<number, MonthTheme> = {
    0: { // January - Indigo/Cold
        monthName: 'January',
        primaryColor: '#4F46E5', // Indigo 600
        secondaryColor: '#E0E7FF', // Indigo 100
        waterGradient: 'linear-gradient(to top, #4F46E5, #818CF8)',
        waterColor: 'rgba(79, 70, 229, 0.2)',
        borderColor: '#C7D2FE',
    },
    1: { // February - Lavender/Pink
        monthName: 'February',
        primaryColor: '#D946EF', // Fuchsia 600
        secondaryColor: '#FAE8FF', // Fuchsia 100
        waterGradient: 'linear-gradient(to top, #D946EF, #F0ABFC)',
        waterColor: 'rgba(217, 70, 239, 0.2)',
        borderColor: '#E9D5FF',
    },
    2: { // March - Aqua/Teal
        monthName: 'March',
        primaryColor: '#06B6D4', // Cyan 600
        secondaryColor: '#CFFAFE', // Cyan 100
        waterGradient: 'linear-gradient(to top, #06B6D4, #67E8F9)',
        waterColor: 'rgba(6, 182, 212, 0.2)',
        borderColor: '#A5F3FC',
    },
    3: { // April - Mint
        monthName: 'April',
        primaryColor: '#10B981', // Emerald 600
        secondaryColor: '#D1FAE5', // Emerald 100
        waterGradient: 'linear-gradient(to top, #10B981, #6EE7B7)',
        waterColor: 'rgba(16, 185, 129, 0.2)',
        borderColor: '#A7F3D0',
    },
    4: { // May - Teal/Green
        monthName: 'May',
        primaryColor: '#14B8A6', // Teal 600
        secondaryColor: '#CCFBF1', // Teal 100
        waterGradient: 'linear-gradient(to top, #14B8A6, #5EEAD4)',
        waterColor: 'rgba(20, 184, 166, 0.2)',
        borderColor: '#99F6E4',
    },
    5: { // June - Indigo/Blue (Summer start)
        monthName: 'June',
        primaryColor: '#3B82F6', // Blue 600
        secondaryColor: '#DBEAFE', // Blue 100
        waterGradient: 'linear-gradient(to top, #3B82F6, #93C5FD)',
        waterColor: 'rgba(59, 130, 246, 0.2)',
        borderColor: '#BFDBFE',
    },
    6: { // July - Ocean Blue
        monthName: 'July',
        primaryColor: '#0EA5E9', // Sky 600
        secondaryColor: '#E0F2FE', // Sky 100
        waterGradient: 'linear-gradient(to top, #0EA5E9, #7DD3FC)',
        waterColor: 'rgba(14, 165, 233, 0.2)',
        borderColor: '#BAE6FD',
    },
    7: { // August - Sky Blue
        monthName: 'August',
        primaryColor: '#0284C7', // Sky 700
        secondaryColor: '#E0F2FE',
        waterGradient: 'linear-gradient(to top, #0284C7, #38BDF8)',
        waterColor: 'rgba(2, 132, 199, 0.2)',
        borderColor: '#BAE6FD',
    },
    8: { // September - Forest/Deep Teal
        monthName: 'September',
        primaryColor: '#0F766E', // Teal 700
        secondaryColor: '#CCFBF1',
        waterGradient: 'linear-gradient(to top, #0F766E, #2DD4BF)',
        waterColor: 'rgba(15, 118, 110, 0.2)',
        borderColor: '#99F6E4',
    },
    9: { // October - Plum/Purple
        monthName: 'October',
        primaryColor: '#9333EA', // Purple 600
        secondaryColor: '#F3E8FF', // Purple 100
        waterGradient: 'linear-gradient(to top, #9333EA, #C084FC)',
        waterColor: 'rgba(147, 51, 234, 0.2)',
        borderColor: '#D8B4FE',
    },
    10: { // November - Warm Violet
        monthName: 'November',
        primaryColor: '#7C3AED', // Violet 600
        secondaryColor: '#EDE9FE', // Violet 100
        waterGradient: 'linear-gradient(to top, #7C3AED, #A78BFA)',
        waterColor: 'rgba(124, 58, 237, 0.2)',
        borderColor: '#DDD6FE',
    },
    11: { // December - Frost Blue
        monthName: 'December',
        primaryColor: '#2563EB', // Blue 600
        secondaryColor: '#DBEAFE',
        waterGradient: 'linear-gradient(to top, #2563EB, #60A5FA)',
        waterColor: 'rgba(37, 99, 235, 0.2)',
        borderColor: '#BFDBFE',
    }
}

export function getTheme(monthIndex: number): MonthTheme {
    return MONTH_THEMES[monthIndex] || MONTH_THEMES[0]
}
