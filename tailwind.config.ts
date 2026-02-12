import type { Config } from 'tailwindcss'

const config: Config = {
    content: [
        './pages/**/*.{js,ts,jsx,tsx,mdx}',
        './components/**/*.{js,ts,jsx,tsx,mdx}',
        './app/**/*.{js,ts,jsx,tsx,mdx}',
    ],
    theme: {
        extend: {
            colors: {
                primary: {
                    50: '#F5F7FB',
                    100: '#E8ECF6',
                    200: '#D4DCEC',
                    300: '#B5C2DD',
                    400: '#8B9CC9',
                    500: '#6B7FB5',
                    600: '#5A6BA0',
                    700: '#4A5682',
                    800: '#3D476B',
                    900: '#2E3650',
                },
                secondary: {
                    50: '#F2F9F8',
                    100: '#E0F2F0',
                    200: '#C7E6E3',
                    300: '#A0D3CE',
                    400: '#73BCB5',
                    500: '#5AA49D',
                    600: '#498781',
                    700: '#3C6D68',
                    800: '#325854',
                    900: '#284542',
                },
                accent: {
                    50: '#F8F6FB',
                    100: '#EFEAF6',
                    200: '#DFD5ED',
                    300: '#C8B7DD',
                    400: '#A890C5',
                    500: '#9077B0',
                    600: '#7A6095',
                    700: '#644F7A',
                    800: '#524062',
                    900: '#3F314B',
                },
                neutral: {
                    50: '#FAFAF9',
                    100: '#F5F5F4',
                    200: '#E7E5E4',
                    300: '#D6D3D1',
                    400: '#A8A29E',
                    500: '#78716C',
                    600: '#57534E',
                    700: '#44403C',
                    800: '#2E2E2E',
                    900: '#1C1917',
                },
                success: {
                    50: '#F3F8F5',
                    100: '#E3F1E8',
                    200: '#C8E3D2',
                    300: '#A0CDB0',
                    400: '#73B08A',
                    500: '#5A9970',
                    600: '#4A7D5C',
                    700: '#3D654B',
                    800: '#33513D',
                    900: '#283D30',
                },
                warning: {
                    50: '#FBF6F4',
                    100: '#F6EBE6',
                    200: '#EDD7CE',
                    300: '#DFBAAC',
                    400: '#CC9781',
                    500: '#B87B63',
                    600: '#9D6352',
                    700: '#805143',
                    800: '#684237',
                    900: '#4F332B',
                },
            },
            fontFamily: {
                serif: ['"Times New Roman"', 'Times', 'serif'],
                palatino: ['"Palatino Linotype"', '"Book Antiqua"', 'Palatino', 'serif'],
                sans: ['Inter', 'system-ui', 'sans-serif'], // Keep Inter as fallback or specific use if needed, but body will be Palatino
            },
            animation: {
                'fade-in': 'fadeIn 0.5s ease-in-out',
                'slide-up': 'slideUp 0.4s ease-out',
                'scale-in': 'scaleIn 0.3s ease-out',
                'pulse-soft': 'pulseSoft 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
                'star-movement': 'starMovement 6s linear infinite alternate',
            },
            keyframes: {
                starMovement: {
                    '0%': { transform: 'rotate(0deg)', opacity: '0.1' },
                    '50%': { opacity: '1' },
                    '100%': { transform: 'rotate(360deg)', opacity: '0.1' },
                },
                fadeIn: {
                    '0%': { opacity: '0' },
                    '100%': { opacity: '1' },
                },
                slideUp: {
                    '0%': { transform: 'translateY(20px)', opacity: '0' },
                    '100%': { transform: 'translateY(0)', opacity: '1' },
                },
                scaleIn: {
                    '0%': { transform: 'scale(0.95)', opacity: '0' },
                    '100%': { transform: 'scale(1)', opacity: '1' },
                },
                pulseSoft: {
                    '0%, 100%': { opacity: '1' },
                    '50%': { opacity: '0.8' },
                },
            },
            backdropBlur: {
                xs: '2px',
            },
            boxShadow: {
                'soft': '0 2px 8px rgba(0, 0, 0, 0.04), 0 1px 3px rgba(0, 0, 0, 0.06)',
                'soft-lg': '0 4px 16px rgba(0, 0, 0, 0.06), 0 2px 6px rgba(0, 0, 0, 0.08)',
                'soft-xl': '0 8px 24px rgba(0, 0, 0, 0.08), 0 4px 12px rgba(0, 0, 0, 0.1)',
            },
        },
    },
    plugins: [],
}

export default config
