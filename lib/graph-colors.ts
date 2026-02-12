// Analytics Graph Colors - Brain.fm inspired palette
// Harmonious, low-saturation colors for calm data visualization

export const graphColors = {
    // Primary palette for main data series
    primary: '#6B7FB5',      // Muted Indigo
    secondary: '#5AA49D',    // Soft Teal
    accent: '#9077B0',       // Soft Purple

    // Gentle feedback colors
    success: '#5A9970',      // Gentle Green
    warning: '#B87B63',      // Muted Coral

    // Multi-series harmonious palette (for stacked/comparative charts)
    series: [
        '#6B7FB5',  // Muted Indigo
        '#5AA49D',  // Soft Teal
        '#9077B0',  // Soft Purple
        '#5A9970',  // Gentle Green
        '#B87B63',  // Muted Coral
        '#8B9CC9',  // Light Indigo
        '#73BCB5',  // Light Teal
    ],

    // Neutral tones for axes, grids, labels
    gridLine: '#E7E5E4',
    axisLabel: '#78716C',
    tooltipBg: '#FFFFFF',
    tooltipBorder: '#D6D3D1',
}

export const graphStyles = {
    // Soft, minimal grid
    cartesianGrid: {
        strokeDasharray: '3 3',
        stroke: graphColors.gridLine,
        opacity: 0.5,
    },

    // Readable axis styling
    axis: {
        fontSize: 12,
        stroke: graphColors.axisLabel,
        fontFamily: 'Inter, system-ui, sans-serif',
    },

    // Soft tooltip styling
    tooltip: {
        contentStyle: {
            backgroundColor: graphColors.tooltipBg,
            border: `1px solid ${graphColors.tooltipBorder}`,
            borderRadius: '8px',
            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)',
        },
        labelStyle: {
            color: '#2E2E2E',
            fontWeight: 500,
        },
    },
}
