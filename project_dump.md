# Full Project Dump

## 1️⃣ Full Project Folder Tree

```
.env.local.example
.gitignore
app/analytics/page.tsx
app/api/analytics/route.ts
app/api/auth/[...nextauth]/route.ts
app/api/goals/route.ts
app/api/goals/[id]/route.ts
app/api/notes/route.ts
app/api/notes/[id]/route.ts
app/api/weekly-logs/route.ts
app/dashboard/page.tsx
app/globals.css
app/landing/page.tsx
app/layout.tsx
app/login/page.tsx
app/page.tsx
components/analytics/AnalyticsDashboard.tsx
components/analytics/CalendarHeatmap.tsx
components/analytics/CompletionPiePerGoal.tsx
components/analytics/ConsistencyRadar.tsx
components/analytics/DailyCompletionTrend.tsx
components/analytics/GraphContainer.tsx
components/analytics/LifetimeContribution.tsx
components/analytics/LifetimeCumulative.tsx
components/analytics/LongestStreak.tsx
components/analytics/MissFrequency.tsx
components/analytics/MomentumGraph.tsx
components/analytics/MonthlyCompletionTrend.tsx
components/analytics/MonthlyGoalComparison.tsx
components/analytics/Rolling30DayAvg.tsx
components/analytics/Rolling7DayAvg.tsx
components/analytics/StabilityVariance.tsx
components/analytics/StackedMonthlyCompletion.tsx
components/analytics/StackedWeeklyCompletion.tsx
components/analytics/StreakTimeline.tsx
components/analytics/TargetVsActual.tsx
components/analytics/TimeOfWeekHeatmap.tsx
components/analytics/WeeklyCompletionTrend.tsx
components/analytics/WeeklyDensityHeatmap.tsx
components/analytics/WeeklyGoalComparison.tsx
components/analytics/YearlyCompletionTrend.tsx
components/AuthProvider.tsx
components/Checkbox.tsx
components/DashboardLayout.tsx
components/FloatingNotes.tsx
components/GoalRow.tsx
components/GoalSidebar.tsx
components/InteractiveBackground.tsx
components/ProgressBar.tsx
components/Timeline.tsx
components/WeekCard.tsx
lib/analytics/aggregateDaily.ts
lib/analytics/aggregateMonthly.ts
lib/analytics/aggregateWeekly.ts
lib/analytics/calculateStreaks.ts
lib/analytics/generateHeatmapData.ts
lib/analytics/getAnalyticsData.ts
lib/analytics/normalizeDailyRecords.ts
lib/analytics/types.ts
lib/auth.ts
lib/date-utils.ts
lib/db.ts
lib/graph-colors.ts
lib/whitelist.ts
middleware.ts
next-env.d.ts
next.config.mjs
package.json
postcss.config.js
prisma/schema.prisma
README.md
tailwind.config.ts
tsconfig.json
```

## 2️⃣ File Contents

===== FILE: middleware.ts =====
export { default } from 'next-auth/middleware'

export const config = {
    matcher: ['/dashboard/:path*', '/analytics/:path*', '/landing/:path*'],
}


===== FILE: next.config.mjs =====
/** @type {import('next').NextConfig} */
const nextConfig = {
    webpack: (config) => {
        // Enable WebGL/Three.js support
        config.externals = config.externals || [];
        config.externals.push({
            bufferutil: 'bufferutil',
            'utf-8-validate': 'utf-8-validate',
        });
        return config;
    },
    // Enable experimental features for better performance
    experimental: {
        optimizePackageImports: ['recharts', 'framer-motion'],
    },
};

export default nextConfig;


===== FILE: package.json =====
{
  "name": "habit-tracker",
  "version": "1.0.0",
  "private": true,
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint",
    "postinstall": "prisma generate"
  },
  "dependencies": {
    "next": "^14.2.0",
    "react": "^18.3.0",
    "react-dom": "^18.3.0",
    "typescript": "^5.0.0",
    "@types/react": "^18.3.0",
    "@types/node": "^20.0.0",
    "@types/react-dom": "^18.3.0",
    "tailwindcss": "^3.4.0",
    "postcss": "^8.4.0",
    "autoprefixer": "^10.4.0",
    "framer-motion": "^11.0.0",
    "three": "^0.160.0",
    "@react-three/fiber": "^8.15.0",
    "@react-three/drei": "^9.95.0",
    "recharts": "^2.12.0",
    "next-auth": "^4.24.0",
    "@auth/prisma-adapter": "^1.0.0",
    "@prisma/client": "^5.9.0",
    "prisma": "^5.9.0"
  },
  "devDependencies": {
    "@types/three": "^0.160.0"
  }
}

===== FILE: postcss.config.js =====
module.exports = {
    plugins: {
        tailwindcss: {},
        autoprefixer: {},
    },
}


===== FILE: tailwind.config.ts =====
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
                serif: ['Times New Roman', 'Times', 'serif'],
                palatino: ['Palatino Linotype', 'Palatino', 'Georgia', 'serif'],
                sans: ['Inter', 'system-ui', 'sans-serif'],
            },
            animation: {
                'fade-in': 'fadeIn 0.5s ease-in-out',
                'slide-up': 'slideUp 0.4s ease-out',
                'scale-in': 'scaleIn 0.3s ease-out',
                'pulse-soft': 'pulseSoft 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
            },
            keyframes: {
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


===== FILE: tsconfig.json =====
{
    "compilerOptions": {
        "target": "ES2017",
        "lib": [
            "dom",
            "dom.iterable",
            "esnext"
        ],
        "allowJs": true,
        "skipLibCheck": true,
        "strict": true,
        "noEmit": true,
        "esModuleInterop": true,
        "module": "esnext",
        "moduleResolution": "bundler",
        "resolveJsonModule": true,
        "isolatedModules": true,
        "jsx": "preserve",
        "incremental": true,
        "plugins": [
            {
                "name": "next"
            }
        ],
        "paths": {
            "@/*": [
                "./*"
            ]
        }
    },
    "include": [
        "next-env.d.ts",
        "**/*.ts",
        "**/*.tsx",
        ".next/types/**/*.ts"
    ],
    "exclude": [
        "node_modules"
    ]
}

===== FILE: app/analytics/page.tsx =====
import { getServerSession } from 'next-auth/next'
import { redirect } from 'next/navigation'
import { authOptions } from '@/lib/auth'
import AnalyticsDashboard from '@/components/analytics/AnalyticsDashboard'

export default async function AnalyticsPage() {
    const session = await getServerSession(authOptions)

    if (!session?.user) {
        redirect('/login')
    }

    return <AnalyticsDashboard />
}


===== FILE: app/api/analytics/route.ts =====
import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/db'
import { getAnalyticsData } from '@/lib/analytics/getAnalyticsData'

/**
 * GET /api/analytics
 * 
 * Returns comprehensive analytics payload for authenticated user
 * 
 * Query parameters:
 * - days: number of days to include (default: 90)
 */
export async function GET(req: NextRequest) {
    try {
        // Authenticate
        const session = await getServerSession(authOptions)

        if (!session?.user?.email) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        // Get user
        const user = await prisma.user.findUnique({
            where: { email: session.user.email },
        })

        if (!user) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 })
        }

        // Parse query parameters
        const searchParams = req.nextUrl.searchParams
        const days = parseInt(searchParams.get('days') || '90', 10)

        // Validate range
        if (days < 1 || days > 365) {
            return NextResponse.json(
                { error: 'Days parameter must be between 1 and 365' },
                { status: 400 }
            )
        }

        // Call analytics service layer (NOT doing aggregation here!)
        const analyticsPayload = await getAnalyticsData(user.id, days)

        return NextResponse.json(analyticsPayload)
    } catch (error) {
        console.error('Error fetching analytics:', error)
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        )
    }
}


===== FILE: app/api/auth/[...nextauth]/route.ts =====
import NextAuth from 'next-auth'
import { authOptions } from '@/lib/auth'

const handler = NextAuth(authOptions)

export { handler as GET, handler as POST }


===== FILE: app/api/goals/[id]/route.ts =====
import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/db'

// PATCH - Update goal (archive)
export async function PATCH(
    req: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const session = await getServerSession(authOptions)
        if (!session?.user?.email) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const user = await prisma.user.findUnique({
            where: { email: session.user.email },
        })

        if (!user) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 })
        }

        const body = await req.json()
        const { isArchived } = body

        const goal = await prisma.goal.updateMany({
            where: {
                id: params.id,
                userId: user.id,
            },
            data: {
                isArchived: isArchived ?? false,
            },
        })

        return NextResponse.json({ success: true })
    } catch (error) {
        console.error('Error updating goal:', error)
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }
}


===== FILE: app/api/goals/route.ts =====
import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/db'

// GET - List all goals for the user
export async function GET(req: NextRequest) {
    console.log('🔵 [API /api/goals GET] Handler called')
    try {
        const session = await getServerSession(authOptions)
        console.log('🔵 [API /api/goals GET] Session:', session?.user?.email)
        if (!session?.user?.email) {
            console.log('🔵 [API /api/goals GET] No session, returning 401')
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        console.log('🔵 [API /api/goals GET] Looking up user...')
        const user = await prisma.user.findUnique({
            where: { email: session.user.email },
        })
        console.log('🔵 [API /api/goals GET] User found:', !!user, user?.id)

        if (!user) {
            console.log('🔵 [API /api/goals GET] User NOT found in database!')
            return NextResponse.json({ error: 'User not found' }, { status: 404 })
        }

        console.log('🔵 [API /api/goals GET] Fetching goals for user:', user.id)
        const goals = await prisma.goal.findMany({
            where: {
                userId: user.id,
                isArchived: false,
            },
            orderBy: { createdAt: 'asc' },
        })
        console.log(`🔵 [API /api/goals GET] Found ${goals.length} goals`)

        console.log('🔵 [API /api/goals GET] Returning goals:', goals)
        return NextResponse.json(goals)
    } catch (error) {
        console.error('🔵 [API /api/goals GET] ERROR:', error)
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }
}

// POST - Create a new goal
export async function POST(req: NextRequest) {
    console.log('🟢 [API /api/goals POST] Handler called')
    try {
        const session = await getServerSession(authOptions)
        console.log('🟢 [API /api/goals POST] Session:', session?.user?.email)
        if (!session?.user?.email) {
            console.log('🟢 [API /api/goals POST] No session, returning 401')
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const user = await prisma.user.findUnique({
            where: { email: session.user.email },
        })

        if (!user) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 })
        }

        const body = await req.json()
        const { name, defaultWeeklyTarget } = body

        if (!name || typeof defaultWeeklyTarget !== 'number') {
            return NextResponse.json({ error: 'Invalid input' }, { status: 400 })
        }

        const goal = await prisma.goal.create({
            data: {
                userId: user.id,
                name,
                defaultWeeklyTarget,
            },
        })

        return NextResponse.json(goal)
    } catch (error) {
        console.error('Error creating goal:', error)
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }
}


===== FILE: app/api/notes/[id]/route.ts =====
import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/db'

// PATCH - Update note content
export async function PATCH(
    req: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const session = await getServerSession(authOptions)
        if (!session?.user?.email) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const user = await prisma.user.findUnique({
            where: { email: session.user.email },
        })

        if (!user) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 })
        }

        const body = await req.json()
        const { content } = body

        const note = await prisma.note.updateMany({
            where: {
                id: params.id,
                userId: user.id,
            },
            data: {
                content: content || '',
            },
        })

        return NextResponse.json({ success: true })
    } catch (error) {
        console.error('Error updating note:', error)
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }
}

// DELETE - Delete note
export async function DELETE(
    req: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const session = await getServerSession(authOptions)
        if (!session?.user?.email) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const user = await prisma.user.findUnique({
            where: { email: session.user.email },
        })

        if (!user) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 })
        }

        await prisma.note.deleteMany({
            where: {
                id: params.id,
                userId: user.id,
            },
        })

        return NextResponse.json({ success: true })
    } catch (error) {
        console.error('Error deleting note:', error)
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }
}


===== FILE: app/api/notes/route.ts =====
import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/db'

// GET - List all notes for the user
export async function GET(req: NextRequest) {
    try {
        const session = await getServerSession(authOptions)
        if (!session?.user?.email) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const user = await prisma.user.findUnique({
            where: { email: session.user.email },
        })

        if (!user) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 })
        }

        const notes = await prisma.note.findMany({
            where: { userId: user.id },
            orderBy: { updatedAt: 'desc' },
        })

        return NextResponse.json(notes)
    } catch (error) {
        console.error('Error fetching notes:', error)
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }
}

// POST - Create a new note
export async function POST(req: NextRequest) {
    try {
        const session = await getServerSession(authOptions)
        if (!session?.user?.email) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const user = await prisma.user.findUnique({
            where: { email: session.user.email },
        })

        if (!user) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 })
        }

        const body = await req.json()
        const { content, linkedWeekId, linkedGoalId } = body

        const note = await prisma.note.create({
            data: {
                userId: user.id,
                content: content || '',
                linkedWeekId,
                linkedGoalId,
            },
        })

        return NextResponse.json(note)
    } catch (error) {
        console.error('Error creating note:', error)
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }
}


===== FILE: app/api/weekly-logs/route.ts =====
import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/db'
import { invalidateAnalyticsCache } from '@/lib/analytics/getAnalyticsData'

// GET - Get weekly log for a specific goal and week
export async function GET(req: NextRequest) {
    try {
        const session = await getServerSession(authOptions)
        if (!session?.user?.email) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const user = await prisma.user.findUnique({
            where: { email: session.user.email },
        })

        if (!user) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 })
        }

        const { searchParams } = new URL(req.url)
        const goalId = searchParams.get('goalId')
        const weekStartDate = searchParams.get('weekStartDate')

        if (!goalId || !weekStartDate) {
            return NextResponse.json({ error: 'Missing parameters' }, { status: 400 })
        }

        const parsedDate = new Date(weekStartDate)
        // Force normalize to midnight UTC to ensure consistency
        parsedDate.setUTCHours(0, 0, 0, 0)

        console.log(`🔵 [weekly-logs GET] Looking for: userId=${user.id}, goalId=${goalId}, weekStartDate=${parsedDate.toISOString()}`)

        const log = await prisma.weeklyLog.findUnique({
            where: {
                userId_goalId_weekStartDate: {
                    userId: user.id,
                    goalId,
                    weekStartDate: parsedDate,
                },
            },
        })

        if (!log) {
            console.log(`🔵 [weekly-logs GET] NOT FOUND`)
            return NextResponse.json({ error: 'Log not found' }, { status: 404 })
        }

        console.log(`🔵 [weekly-logs GET] FOUND log id=${log.id}, stored date=${log.weekStartDate}`)
        return NextResponse.json(log)
    } catch (error) {
        console.error('Error fetching weekly log:', error)
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }
}

// POST - Create or update weekly log
export async function POST(req: NextRequest) {
    try {
        const session = await getServerSession(authOptions)
        if (!session?.user?.email) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const user = await prisma.user.findUnique({
            where: { email: session.user.email },
        })

        if (!user) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 })
        }

        const body = await req.json()
        const { goalId, weekStartDate, weeklyTarget, checkboxStates } = body

        if (!goalId || !weekStartDate || !Array.isArray(checkboxStates)) {
            return NextResponse.json({ error: 'Invalid input' }, { status: 400 })
        }

        // Upsert the log
        const parsedDate = new Date(weekStartDate)
        // Force normalize to midnight UTC to ensure consistency
        parsedDate.setUTCHours(0, 0, 0, 0)

        console.log(`🟢 [weekly-logs POST] Saving: userId=${user.id}, goalId=${goalId}, weekStartDate=${parsedDate.toISOString()}, checkboxes=${JSON.stringify(checkboxStates)}`)

        const log = await prisma.weeklyLog.upsert({
            where: {
                userId_goalId_weekStartDate: {
                    userId: user.id,
                    goalId,
                    weekStartDate: parsedDate,
                },
            },
            update: {
                weeklyTarget,
                checkboxStates,
            },
            create: {
                userId: user.id,
                goalId,
                weekStartDate: parsedDate,
                weeklyTarget,
                checkboxStates,
            },
        })

        console.log(`🟢 [weekly-logs POST] Saved log id=${log.id}, stored date=${log.weekStartDate}`)

        // Invalidate analytics cache for this user so they see updated data immediately
        invalidateAnalyticsCache(user.id)

        return NextResponse.json(log)
    } catch (error) {
        console.error('Error saving weekly log:', error)
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }
}


===== FILE: app/dashboard/page.tsx =====
import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation'
import { authOptions } from '@/lib/auth'
import DashboardLayout from '@/components/DashboardLayout'

export default async function DashboardPage() {
    const session = await getServerSession(authOptions)

    if (!session?.user) {
        redirect('/login')
    }

    return <DashboardLayout />
}


===== FILE: app/globals.css =====
@tailwind base;
@tailwind components;
@tailwind utilities;

@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');

:root {
  /* Calm, warm backgrounds */
  --color-background: #FAFAF9;
  --color-surface: #F5F5F4;
  --color-card: #FFFFFF;

  /* Readable text colors */
  --color-text-primary: #2E2E2E;
  --color-text-secondary: #57534E;
  --color-text-muted: #78716C;

  /* Soft transitions */
  --transition-smooth: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

* {
  box-sizing: border-box;
  padding: 0;
  margin: 0;
}

html,
body {
  max-width: 100vw;
  overflow-x: hidden;
  font-family: 'Inter', system-ui, sans-serif;
  background-color: var(--color-background);
  color: var(--color-text-primary);
  transition: var(--transition-smooth);
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

a {
  color: inherit;
  text-decoration: none;
}

/* Soft, minimal scrollbar */
::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}

::-webkit-scrollbar-track {
  background: #F5F5F4;
  border-radius: 4px;
}

::-webkit-scrollbar-thumb {
  background: #D6D3D1;
  border-radius: 4px;
  transition: background 0.2s ease;
}

::-webkit-scrollbar-thumb:hover {
  background: #A8A29E;
}

/* Premium glass effect with softer blur */
.glass {
  background: rgba(255, 255, 255, 0.7);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border: 1px solid rgba(214, 211, 209, 0.3);
}

/* Soft card styling */
.card {
  background: var(--color-card);
  border-radius: 16px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04), 0 1px 3px rgba(0, 0, 0, 0.06);
}

/* Smooth transitions for all interactive elements */
button,
input,
select,
textarea {
  transition: var(--transition-smooth);
}

===== FILE: app/landing/page.tsx =====
import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation'
import { authOptions } from '@/lib/auth'
import { isSpecialUser } from '@/lib/whitelist'
import InteractiveBackground from '@/components/InteractiveBackground'
import Link from 'next/link'

export default async function LandingPage() {
    const session = await getServerSession(authOptions)

    if (!session?.user) {
        redirect('/login')
    }

    // Check if this is the special user
    const showInteractive = isSpecialUser(session.user.email)

    if (!showInteractive) {
        // Other users skip to dashboard
        redirect('/dashboard')
    }

    // Special landing page for Nandini
    return (
        <div className="relative min-h-screen overflow-hidden bg-black">
            <InteractiveBackground />

            <div className="relative z-10 min-h-screen flex flex-col items-center justify-center text-white">
                <div className="text-center space-y-8 px-4">
                    <h1 className="text-6xl md:text-8xl font-serif" style={{ fontFamily: 'Times New Roman, Times, serif' }}>
                        Hello Nandini Zunder
                    </h1>

                    <h2 className="text-5xl md:text-7xl font-palatino" style={{ fontFamily: 'Palatino Linotype, Palatino, Georgia, serif' }}>
                        Welcome
                    </h2>

                    <Link
                        href="/dashboard"
                        className="inline-block mt-12 px-8 py-4 bg-white/10 backdrop-blur-md hover:bg-white/20 rounded-full text-xl font-medium transition-all duration-300 border border-white/20 hover:border-white/40"
                    >
                        Next →
                    </Link>
                </div>
            </div>
        </div>
    )
}


===== FILE: app/layout.tsx =====
import type { Metadata } from 'next'
import './globals.css'
import AuthProvider from '@/components/AuthProvider'

export const metadata: Metadata = {
    title: 'Habit Tracker - Personal Analytics',
    description: 'Private habit tracking with advanced analytics',
}

export default function RootLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <html lang="en">
            <body>
                <AuthProvider>{children}</AuthProvider>
            </body>
        </html>
    )
}


===== FILE: app/login/page.tsx =====
'use client'

import { signIn } from 'next-auth/react'
import { motion } from 'framer-motion'

export default function LoginPage() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 via-secondary-50 to-accent-50">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="glass rounded-2xl shadow-soft-lg p-12 max-w-md w-full mx-4"
            >
                <motion.div
                    initial={{ scale: 0.9 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.2, duration: 0.3 }}
                    className="text-center"
                >
                    <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent">
                        Habit Tracker
                    </h1>
                    <p className="text-neutral-600 mb-8 text-lg">
                        Personal Analytics Dashboard
                    </p>
                </motion.div>

                <motion.button
                    onClick={() => signIn('google', { callbackUrl: '/landing' })}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full bg-white border-2 border-neutral-200 hover:border-primary-400 rounded-xl py-4 px-6 flex items-center justify-center gap-3 transition-all shadow-soft hover:shadow-soft-lg"
                >
                    <svg className="w-6 h-6" viewBox="0 0 24 24">
                        <path
                            fill="#4285F4"
                            d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                        />
                        <path
                            fill="#34A853"
                            d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                        />
                        <path
                            fill="#FBBC05"
                            d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                        />
                        <path
                            fill="#EA4335"
                            d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                        />
                    </svg>
                    <span className="font-semibold text-neutral-700">
                        Sign in with Google
                    </span>
                </motion.button>

                <p className="text-center text-sm text-neutral-500 mt-6">
                    Access restricted to authorized users only
                </p>
            </motion.div>
        </div>
    )
}


===== FILE: app/page.tsx =====
import { redirect } from 'next/navigation'

export default function Home() {
    // Redirect to login/landing page
    redirect('/login')
}


===== FILE: components/analytics/AnalyticsDashboard.tsx =====
'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { signOut } from 'next-auth/react'

// Import all graph components
import DailyCompletionTrend from './DailyCompletionTrend'
import WeeklyCompletionTrend from './WeeklyCompletionTrend'
import MonthlyCompletionTrend from './MonthlyCompletionTrend'
import YearlyCompletionTrend from './YearlyCompletionTrend'
import Rolling7DayAvg from './Rolling7DayAvg'
import Rolling30DayAvg from './Rolling30DayAvg'
import WeeklyGoalComparison from './WeeklyGoalComparison'
import MonthlyGoalComparison from './MonthlyGoalComparison'
import StackedWeeklyCompletion from './StackedWeeklyCompletion'
import StackedMonthlyCompletion from './StackedMonthlyCompletion'
import StreakTimeline from './StreakTimeline'
import LongestStreak from './LongestStreak'
import MissFrequency from './MissFrequency'
import ConsistencyRadar from './ConsistencyRadar'
import CompletionPiePerGoal from './CompletionPiePerGoal'
import LifetimeContribution from './LifetimeContribution'
import TargetVsActual from './TargetVsActual'
import CalendarHeatmap from './CalendarHeatmap'
import WeeklyDensityHeatmap from './WeeklyDensityHeatmap'
import TimeOfWeekHeatmap from './TimeOfWeekHeatmap'
import MomentumGraph from './MomentumGraph'
import StabilityVariance from './StabilityVariance'
import LifetimeCumulative from './LifetimeCumulative'

type Section = 'trends' | 'comparison' | 'consistency' | 'distribution' | 'heatmaps' | 'insights'

export default function AnalyticsDashboard() {
    const [activeSection, setActiveSection] = useState<Section>('trends')

    const sections = [
        { id: 'trends' as Section, name: 'Time Trends', count: 6 },
        { id: 'comparison' as Section, name: 'Comparisons', count: 4 },
        { id: 'consistency' as Section, name: 'Consistency', count: 4 },
        { id: 'distribution' as Section, name: 'Distribution', count: 3 },
        { id: 'heatmaps' as Section, name: 'Heatmaps', count: 3 },
        { id: 'insights' as Section, name: 'Premium Insights', count: 3 },
    ]

    return (
        <div className="min-h-screen bg-gradient-to-br from-neutral-50 via-primary-50/30 to-secondary-50/30">
            {/* Header */}
            <header className="glass border-b border-neutral-200/50 sticky top-0 z-20">
                <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
                    <h1 className="text-2xl font-bold bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent">
                        Analytics Dashboard
                    </h1>

                    <nav className="flex items-center gap-6">
                        <Link
                            href="/dashboard"
                            className="text-neutral-700 hover:text-primary-600 font-medium transition-colors"
                        >
                            Timeline
                        </Link>
                        <Link
                            href="/analytics"
                            className="text-primary-600 font-medium"
                        >
                            Analytics
                        </Link>
                        <button
                            onClick={() => signOut({ callbackUrl: '/login' })}
                            className="px-4 py-2 bg-neutral-100 hover:bg-neutral-200 rounded-lg text-sm font-medium transition-colors"
                        >
                            Sign Out
                        </button>
                    </nav>
                </div>
            </header>

            {/* Section Tabs */}
            <div className="glass border-b border-neutral-200/50 sticky top-[73px] z-10">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="flex gap-2 overflow-x-auto py-4">
                        {sections.map((section) => (
                            <button
                                key={section.id}
                                onClick={() => setActiveSection(section.id)}
                                className={`px-4 py-2 rounded-lg font-medium transition-all whitespace-nowrap ${activeSection === section.id
                                        ? 'bg-gradient-to-r from-primary-500 to-secondary-500 text-white shadow-soft'
                                        : 'bg-white/50 text-neutral-600 hover:bg-white/70'
                                    }`}
                            >
                                {section.name} <span className="text-sm opacity-70">({section.count})</span>
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="max-w-7xl mx-auto px-6 py-8">
                <motion.div
                    key={activeSection}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                >
                    {activeSection === 'trends' && (
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            <DailyCompletionTrend />
                            <WeeklyCompletionTrend />
                            <MonthlyCompletionTrend />
                            <YearlyCompletionTrend />
                            <Rolling7DayAvg />
                            <Rolling30DayAvg />
                        </div>
                    )}

                    {activeSection === 'comparison' && (
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            <WeeklyGoalComparison />
                            <MonthlyGoalComparison />
                            <StackedWeeklyCompletion />
                            <StackedMonthlyCompletion />
                        </div>
                    )}

                    {activeSection === 'consistency' && (
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            <StreakTimeline />
                            <LongestStreak />
                            <MissFrequency />
                            <ConsistencyRadar />
                        </div>
                    )}

                    {activeSection === 'distribution' && (
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            <CompletionPiePerGoal />
                            <LifetimeContribution />
                            <TargetVsActual />
                        </div>
                    )}

                    {activeSection === 'heatmaps' && (
                        <div className="grid grid-cols-1 gap-6">
                            <CalendarHeatmap />
                            <WeeklyDensityHeatmap />
                            <TimeOfWeekHeatmap />
                        </div>
                    )}

                    {activeSection === 'insights' && (
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            <MomentumGraph />
                            <StabilityVariance />
                            <div className="lg:col-span-2">
                                <LifetimeCumulative />
                            </div>
                        </div>
                    )}
                </motion.div>
            </div>
        </div>
    )
}


===== FILE: components/analytics/CalendarHeatmap.tsx =====
'use client'

import { useEffect, useState } from 'react'
import GraphContainer from './GraphContainer'

interface HeatmapCell {
    day: string
    intensity: number
}

export default function CalendarHeatmap() {
    const [data, setData] = useState<HeatmapCell[]>([])

    useEffect(() => {
        fetchRealData()
    }, [])

    const fetchRealData = async () => {
        try {
            const res = await fetch('/api/analytics')
            if (!res.ok) throw new Error('Failed to fetch analytics')

            const analytics = await res.json()
            setData(analytics.calendarHeatmap || [])
        } catch (error) {
            console.error('Error fetching calendar heatmap:', error)
            setData([])
        }
    }

    const getColor = (intensity: number) => {
        const colors = ['#f4f4f5', '#bfdbfe', '#60a5fa', '#2563eb', '#1e40af']
        return colors[intensity] || colors[0]
    }

    if (data.length === 0) return null

    return (
        <GraphContainer
            title="Calendar Heatmap"
            description="Daily completion intensity over the last 12 weeks"
            fullWidth
        >
            <div className="grid grid-cols-12 gap-1">
                {data.map((item, index) => (
                    <div
                        key={index}
                        className="aspect-square rounded hover:ring-2 hover:ring-primary-400 transition-all cursor-pointer"
                        style={{ backgroundColor: getColor(item.intensity) }}
                        title={`${item.day}: ${item.intensity * 25}%`}
                    />
                ))}
            </div>
            <div className="flex items-center gap-2 mt-4 text-sm text-neutral-600">
                <span>Less</span>
                {[0, 1, 2, 3, 4].map((i) => (
                    <div
                        key={i}
                        className="w-4 h-4 rounded"
                        style={{ backgroundColor: getColor(i) }}
                    />
                ))}
                <span>More</span>
            </div>
        </GraphContainer>
    )
}


===== FILE: components/analytics/CompletionPiePerGoal.tsx =====
'use client'

import { useEffect, useState } from 'react'
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts'
import GraphContainer from './GraphContainer'

interface GoalCompletionData {
    name: string
    value: number
    color: string
}

export default function CompletionPiePerGoal() {
    const [data, setData] = useState<GoalCompletionData[]>([])

    useEffect(() => {
        fetchRealData()
    }, [])

    const fetchRealData = async () => {
        try {
            const res = await fetch('/api/analytics')
            if (!res.ok) throw new Error('Failed to fetch analytics')

            const analytics = await res.json()
            setData(analytics.goalCompletionPie || [])
        } catch (error) {
            console.error('Error fetching goal completion data:', error)
            setData([])
        }
    }

    if (data.length === 0) return null

    return (
        <GraphContainer
            title="Completion by Goal"
            description="Completion rate breakdown per goal"
        >
            <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                    <Pie
                        data={data}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, value }) => `${name}: ${value}%`}
                        outerRadius={100}
                        fill="#8884d8"
                        dataKey="value"
                    >
                        {data.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                </PieChart>
            </ResponsiveContainer>
        </GraphContainer>
    )
}


===== FILE: components/analytics/ConsistencyRadar.tsx =====
'use client'

import { useEffect, useState } from 'react'
import { RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, ResponsiveContainer, Legend } from 'recharts'
import GraphContainer from './GraphContainer'

export default function ConsistencyRadar() {
    const [data, setData] = useState<any[]>([])

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await fetch('/api/analytics')
                if (!res.ok) return
                const analytics = await res.json()
                const consistencyByGoal = analytics.consistencyScore?.byGoal || {}
                const radarData = Object.entries(consistencyByGoal).map(([goal, score]) => ({
                    goal,
                    consistency: score as number,
                }))
                setData(radarData)
            } catch (e) {
                console.error('ConsistencyRadar error:', e)
            }
        }
        fetchData()
    }, [])

    if (data.length === 0) return null

    return (
        <GraphContainer title="Consistency Radar" description="Consistency score across all goals">
            <ResponsiveContainer width="100%" height="100%">
                <RadarChart data={data}>
                    <PolarGrid stroke="#e4e4e7" />
                    <PolarAngleAxis dataKey="goal" fontSize={12} />
                    <PolarRadiusAxis angle={90} domain={[0, 100]} fontSize={10} />
                    <Radar name="Consistency %" dataKey="consistency" stroke="#0ea5e9" fill="#0ea5e9" fillOpacity={0.6} />
                    <Legend />
                </RadarChart>
            </ResponsiveContainer>
        </GraphContainer>
    )
}


===== FILE: components/analytics/DailyCompletionTrend.tsx =====
'use client'

import { useEffect, useState } from 'react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import GraphContainer from './GraphContainer'

interface DailyTrendPoint {
    date: string
    completion: number
}

export default function DailyCompletionTrend() {
    const [data, setData] = useState<DailyTrendPoint[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        fetchRealData()
    }, [])

    const fetchRealData = async () => {
        try {
            const res = await fetch('/api/analytics')
            if (!res.ok) throw new Error('Failed to fetch analytics')

            const analytics = await res.json()
            setData(analytics.dailyTrend || [])
        } catch (error) {
            console.error('Error fetching daily trend:', error)
            setData([])
        } finally {
            setLoading(false)
        }
    }

    if (loading) {
        return (
            <GraphContainer title="Daily Completion Trend" description="Last 30 days">
                <div className="flex items-center justify-center h-full">
                    <div className="animate-pulse text-neutral-400">Loading...</div>
                </div>
            </GraphContainer>
        )
    }

    if (data.length === 0) {
        return (
            <GraphContainer title="Daily Completion Trend" description="Last 30 days">
                <div className="flex items-center justify-center h-full">
                    <div className="text-neutral-400 text-sm">No data yet. Start tracking your habits!</div>
                </div>
            </GraphContainer>
        )
    }

    return (
        <GraphContainer
            title="Daily Completion Trend"
            description="Your completion rate over the last 30 days"
        >
            <ResponsiveContainer width="100%" height="100%">
                <LineChart data={data}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e4e4e7" />
                    <XAxis dataKey="date" fontSize={12} stroke="#71717a" />
                    <YAxis fontSize={12} stroke="#71717a" unit="%" />
                    <Tooltip
                        contentStyle={{
                            backgroundColor: 'rgba(255, 255, 255, 0.9)',
                            border: 'none',
                            borderRadius: '8px',
                            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                        }}
                    />
                    <Line
                        type="monotone"
                        dataKey="completion"
                        stroke="#0ea5e9"
                        strokeWidth={2}
                        dot={{ fill: '#0ea5e9', r: 4 }}
                        activeDot={{ r: 6 }}
                    />
                </LineChart>
            </ResponsiveContainer>
        </GraphContainer>
    )
}


===== FILE: components/analytics/GraphContainer.tsx =====
'use client'

import { ReactNode } from 'react'
import { motion } from 'framer-motion'

interface GraphContainerProps {
    title: string
    description?: string
    children: ReactNode
    fullWidth?: boolean
}

export default function GraphContainer({ title, description, children, fullWidth }: GraphContainerProps) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className={`glass rounded-2xl shadow-soft-lg p-6 ${fullWidth ? 'col-span-full' : ''}`}
        >
            <div className="mb-6">
                <h3 className="text-xl font-bold text-neutral-800 mb-1">{title}</h3>
                {description && (
                    <p className="text-sm text-neutral-500">{description}</p>
                )}
            </div>

            <div className="h-[300px]">
                {children}
            </div>
        </motion.div>
    )
}


===== FILE: components/analytics/LifetimeContribution.tsx =====
'use client'

import { useEffect, useState } from 'react'
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts'
import GraphContainer from './GraphContainer'

export default function LifetimeContribution() {
    const [data, setData] = useState<any[]>([])

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await fetch('/api/analytics')
                if (!res.ok) return
                const analytics = await res.json()
                setData(analytics.goalCompletionPie || [])
            } catch (e) {
                console.error('LifetimeContribution error:', e)
            }
        }
        fetchData()
    }, [])

    const COLORS = ['#6B7FB5', '#5AA49D', '#9077B0', '#5A9970', '#B87B63']
    if (data.length === 0) return null

    return (
        <GraphContainer title="Lifetime Contribution" description="Total completions per goal across all time">
            <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                    <Pie data={data} cx="50%" cy="50%" labelLine={false} label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(1)}%`} outerRadius={100} fill="#8884d8" dataKey="value">
                        {data.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color || COLORS[index % COLORS.length]} />
                        ))}
                    </Pie>
                    <Tooltip contentStyle={{ backgroundColor: '#FFFFFF', border: '1px solid #D6D3D1', borderRadius: '8px' }} />
                    <Legend />
                </PieChart>
            </ResponsiveContainer>
        </GraphContainer>
    )
}


===== FILE: components/analytics/LifetimeCumulative.tsx =====
'use client'

import { useEffect, useState } from 'react'
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts'
import GraphContainer from './GraphContainer'

export default function LifetimeCumulative() {
    const [data, setData] = useState<any[]>([])
    const [goalNames, setGoalNames] = useState<string[]>([])

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await fetch('/api/analytics')
                if (!res.ok) return
                const analytics = await res.json()
                const dailyTrend = analytics.dailyTrend || []
                const goals = (analytics.goalCompletionPie || []).map((g: any) => g.name)
                setGoalNames(goals)

                // Build cumulative data
                const cumulative: any[] = []
                const totals: Record<string, number> = {}
                goals.forEach((g: string) => { totals[g] = 0 })

                dailyTrend.forEach((point: any, i: number) => {
                    const entry: any = { day: i + 1 }
                    goals.forEach((g: string) => {
                        totals[g] += point.completion > 0 ? 1 : 0
                        entry[g] = totals[g]
                    })
                    cumulative.push(entry)
                })

                setData(cumulative)
            } catch (e) {
                console.error('LifetimeCumulative error:', e)
            }
        }
        fetchData()
    }, [])

    const COLORS = ['#0ea5e9', '#a855f7', '#d946ef', '#10b981', '#f59e0b']
    if (data.length === 0) return null

    return (
        <GraphContainer title="Lifetime Cumulative Progress" description="Total habit completions accumulated over time" fullWidth>
            <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={data}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e4e4e7" />
                    <XAxis dataKey="day" fontSize={12} stroke="#71717a" label={{ value: 'Days', position: 'insideBottom', offset: -5 }} />
                    <YAxis fontSize={12} stroke="#71717a" label={{ value: 'Total Completions', angle: -90, position: 'insideLeft' }} />
                    <Tooltip />
                    <Legend />
                    {goalNames.map((name, i) => (
                        <Area key={name} type="monotone" dataKey={name} stackId="1" stroke={COLORS[i % COLORS.length]} fill={COLORS[i % COLORS.length]} fillOpacity={0.6} />
                    ))}
                </AreaChart>
            </ResponsiveContainer>
        </GraphContainer>
    )
}


===== FILE: components/analytics/LongestStreak.tsx =====
'use client'

import { useEffect, useState } from 'react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import GraphContainer from './GraphContainer'

export default function LongestStreak() {
    const [data, setData] = useState<any[]>([])

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await fetch('/api/analytics')
                if (!res.ok) return
                const analytics = await res.json()
                const streaks = (analytics.longestStreaks || []).map((s: any) => ({
                    goal: s.goalName,
                    streak: s.longestStreak,
                }))
                setData(streaks)
            } catch (e) {
                console.error('LongestStreak error:', e)
            }
        }
        fetchData()
    }, [])

    if (data.length === 0) return null

    return (
        <GraphContainer title="Longest Streak" description="Best consecutive streak achieved per goal">
            <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e4e4e7" />
                    <XAxis dataKey="goal" fontSize={12} stroke="#71717a" />
                    <YAxis fontSize={12} stroke="#71717a" label={{ value: 'Days', angle: -90, position: 'insideLeft' }} />
                    <Tooltip />
                    <Bar dataKey="streak" fill="#10b981" radius={[8, 8, 0, 0]} />
                </BarChart>
            </ResponsiveContainer>
        </GraphContainer>
    )
}


===== FILE: components/analytics/MissFrequency.tsx =====
'use client'

import { useEffect, useState } from 'react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import GraphContainer from './GraphContainer'

export default function MissFrequency() {
    const [data, setData] = useState<any[]>([])

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await fetch('/api/analytics')
                if (!res.ok) return
                const analytics = await res.json()
                // Calculate miss frequency by day from daily trend
                const dailyTrend = analytics.dailyTrend || []
                const dayMisses: Record<string, number> = { Sun: 0, Mon: 0, Tue: 0, Wed: 0, Thu: 0, Fri: 0, Sat: 0 }
                const dayCounts: Record<string, number> = { Sun: 0, Mon: 0, Tue: 0, Wed: 0, Thu: 0, Fri: 0, Sat: 0 }
                const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

                dailyTrend.forEach((point: any, i: number) => {
                    const dayOfWeek = dayNames[i % 7]
                    dayCounts[dayOfWeek]++
                    if (point.completion < 50) dayMisses[dayOfWeek]++
                })

                const result = dayNames.map(day => ({
                    day,
                    misses: dayMisses[day],
                }))
                setData(result)
            } catch (e) {
                console.error('MissFrequency error:', e)
            }
        }
        fetchData()
    }, [])

    if (data.length === 0) return null

    return (
        <GraphContainer title="Miss Frequency" description="Days when habits were most often missed">
            <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#E7E5E4" opacity={0.5} />
                    <XAxis dataKey="day" fontSize={12} stroke="#78716C" />
                    <YAxis fontSize={12} stroke="#78716C" />
                    <Tooltip />
                    <Bar dataKey="misses" fill="#B87B63" radius={[8, 8, 0, 0]} />
                </BarChart>
            </ResponsiveContainer>
        </GraphContainer>
    )
}


===== FILE: components/analytics/MomentumGraph.tsx =====
'use client'

import { useEffect, useState } from 'react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts'
import GraphContainer from './GraphContainer'

export default function MomentumGraph() {
    const [data, setData] = useState<any[]>([])

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await fetch('/api/analytics')
                if (!res.ok) return
                const analytics = await res.json()
                const dailyTrend = analytics.dailyTrend || []
                // Calculate momentum as 7-day change in completion rate
                const momentumData = dailyTrend.map((point: any, i: number) => {
                    const prevIndex = Math.max(0, i - 7)
                    const momentum = point.completion - dailyTrend[prevIndex].completion
                    return { date: point.date, momentum }
                })
                setData(momentumData)
            } catch (e) {
                console.error('MomentumGraph error:', e)
            }
        }
        fetchData()
    }, [])

    if (data.length === 0) return null

    return (
        <GraphContainer title="Momentum Graph" description="7-day acceleration of completion rate (positive = improving)">
            <ResponsiveContainer width="100%" height="100%">
                <LineChart data={data}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e4e4e7" />
                    <XAxis dataKey="date" fontSize={12} stroke="#71717a" />
                    <YAxis fontSize={12} stroke="#71717a" />
                    <Tooltip />
                    <ReferenceLine y={0} stroke="#71717a" strokeDasharray="3 3" />
                    <Line type="monotone" dataKey="momentum" stroke="#0ea5e9" strokeWidth={2} dot={{ fill: '#0ea5e9', r: 3 }} />
                </LineChart>
            </ResponsiveContainer>
        </GraphContainer>
    )
}


===== FILE: components/analytics/MonthlyCompletionTrend.tsx =====
'use client'

import { useEffect, useState } from 'react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import GraphContainer from './GraphContainer'

export default function MonthlyCompletionTrend() {
    const [data, setData] = useState<any[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await fetch('/api/analytics')
                if (!res.ok) throw new Error('Failed')
                const analytics = await res.json()
                setData(analytics.monthlyTrend || [])
            } catch (e) {
                console.error('MonthlyCompletionTrend error:', e)
            } finally {
                setLoading(false)
            }
        }
        fetchData()
    }, [])

    if (loading) return <GraphContainer title="Monthly Completion Trend" description="Average completion rate by month"><div className="flex items-center justify-center h-full"><div className="animate-pulse text-neutral-400">Loading...</div></div></GraphContainer>
    if (data.length === 0) return <GraphContainer title="Monthly Completion Trend" description="Average completion rate by month"><div className="flex items-center justify-center h-full"><div className="text-neutral-400 text-sm">No data yet</div></div></GraphContainer>

    return (
        <GraphContainer title="Monthly Completion Trend" description="Average completion rate by month">
            <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e4e4e7" />
                    <XAxis dataKey="month" fontSize={12} stroke="#71717a" />
                    <YAxis fontSize={12} stroke="#71717a" unit="%" />
                    <Tooltip />
                    <Bar dataKey="completion" fill="#0ea5e9" radius={[8, 8, 0, 0]} />
                </BarChart>
            </ResponsiveContainer>
        </GraphContainer>
    )
}


===== FILE: components/analytics/MonthlyGoalComparison.tsx =====
'use client'

import { useEffect, useState } from 'react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import GraphContainer from './GraphContainer'

export default function MonthlyGoalComparison() {
    const [data, setData] = useState<any[]>([])

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await fetch('/api/analytics')
                if (!res.ok) return
                const analytics = await res.json()
                const goals = (analytics.goalCompletionPie || []).map((g: any) => ({
                    goal: g.name,
                    completion: g.value,
                }))
                setData(goals)
            } catch (e) {
                console.error('MonthlyGoalComparison error:', e)
            }
        }
        fetchData()
    }, [])

    if (data.length === 0) return null

    return (
        <GraphContainer title="Monthly Goal Comparison" description="This month's average completion per goal">
            <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e4e4e7" />
                    <XAxis dataKey="goal" fontSize={12} stroke="#71717a" />
                    <YAxis fontSize={12} stroke="#71717a" unit="%" />
                    <Tooltip />
                    <Bar dataKey="completion" fill="#a855f7" radius={[8, 8, 0, 0]} />
                </BarChart>
            </ResponsiveContainer>
        </GraphContainer>
    )
}


===== FILE: components/analytics/Rolling30DayAvg.tsx =====
'use client'

import { useEffect, useState } from 'react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts'
import GraphContainer from './GraphContainer'

export default function Rolling30DayAvg() {
    const [data, setData] = useState<any[]>([])

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await fetch('/api/analytics')
                if (!res.ok) return
                const analytics = await res.json()
                const dailyTrend = analytics.dailyTrend || []
                // Calculate rolling 30-day average (use all available data)
                const withRolling = dailyTrend.map((point: any, i: number) => {
                    const windowStart = Math.max(0, i - 29)
                    const window = dailyTrend.slice(windowStart, i + 1)
                    const avg = Math.round(window.reduce((sum: number, p: any) => sum + p.completion, 0) / window.length)
                    return { date: point.date, actual: point.completion, rolling: avg }
                })
                setData(withRolling)
            } catch (e) {
                console.error('Rolling30DayAvg error:', e)
            }
        }
        fetchData()
    }, [])

    if (data.length === 0) return null

    return (
        <GraphContainer title="Rolling 30-Day Average" description="Long-term completion trend (last 30 days)">
            <ResponsiveContainer width="100%" height="100%">
                <LineChart data={data}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e4e4e7" />
                    <XAxis dataKey="date" fontSize={12} stroke="#71717a" />
                    <YAxis fontSize={12} stroke="#71717a" unit="%" />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="actual" stroke="#e4e4e7" strokeWidth={1} dot={false} name="Daily" />
                    <Line type="monotone" dataKey="rolling" stroke="#9333ea" strokeWidth={3} dot={false} name="30-Day Avg" />
                </LineChart>
            </ResponsiveContainer>
        </GraphContainer>
    )
}


===== FILE: components/analytics/Rolling7DayAvg.tsx =====
'use client'

import { useEffect, useState } from 'react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts'
import GraphContainer from './GraphContainer'

export default function Rolling7DayAvg() {
    const [data, setData] = useState<any[]>([])

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await fetch('/api/analytics')
                if (!res.ok) return
                const analytics = await res.json()
                const dailyTrend = analytics.dailyTrend || []
                // Calculate rolling 7-day average from daily trend
                const withRolling = dailyTrend.map((point: any, i: number) => {
                    const windowStart = Math.max(0, i - 6)
                    const window = dailyTrend.slice(windowStart, i + 1)
                    const avg = Math.round(window.reduce((sum: number, p: any) => sum + p.completion, 0) / window.length)
                    return { date: point.date, actual: point.completion, rolling: avg }
                })
                setData(withRolling)
            } catch (e) {
                console.error('Rolling7DayAvg error:', e)
            }
        }
        fetchData()
    }, [])

    if (data.length === 0) return null

    return (
        <GraphContainer title="Rolling 7-Day Average" description="Smoothed completion trend over time">
            <ResponsiveContainer width="100%" height="100%">
                <LineChart data={data}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e4e4e7" />
                    <XAxis dataKey="date" fontSize={12} stroke="#71717a" />
                    <YAxis fontSize={12} stroke="#71717a" unit="%" />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="actual" stroke="#d4d4d8" strokeWidth={1} dot={false} name="Daily" />
                    <Line type="monotone" dataKey="rolling" stroke="#0ea5e9" strokeWidth={3} dot={false} name="7-Day Avg" />
                </LineChart>
            </ResponsiveContainer>
        </GraphContainer>
    )
}


===== FILE: components/analytics/StabilityVariance.tsx =====
'use client'

import { useEffect, useState } from 'react'
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import GraphContainer from './GraphContainer'

export default function StabilityVariance() {
    const [data, setData] = useState<any[]>([])

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await fetch('/api/analytics')
                if (!res.ok) return
                const analytics = await res.json()
                const dailyTrend = analytics.dailyTrend || []
                // Calculate 7-day rolling variance
                const varianceData = dailyTrend.map((point: any, i: number) => {
                    const windowStart = Math.max(0, i - 6)
                    const window = dailyTrend.slice(windowStart, i + 1)
                    const mean = window.reduce((s: number, p: any) => s + p.completion, 0) / window.length
                    const variance = Math.round(Math.sqrt(window.reduce((s: number, p: any) => s + Math.pow(p.completion - mean, 2), 0) / window.length))
                    return { date: point.date, variance }
                })
                setData(varianceData)
            } catch (e) {
                console.error('StabilityVariance error:', e)
            }
        }
        fetchData()
    }, [])

    if (data.length === 0) return null

    return (
        <GraphContainer title="Stability & Variance" description="Daily variation in completion (lower = more consistent)">
            <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={data}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e4e4e7" />
                    <XAxis dataKey="date" fontSize={12} stroke="#71717a" />
                    <YAxis fontSize={12} stroke="#71717a" label={{ value: 'Variance', angle: -90, position: 'insideLeft' }} />
                    <Tooltip />
                    <Area type="monotone" dataKey="variance" stroke="#d946ef" fill="url(#varianceGradient)" strokeWidth={2} />
                    <defs>
                        <linearGradient id="varianceGradient" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#d946ef" stopOpacity={0.8} />
                            <stop offset="95%" stopColor="#d946ef" stopOpacity={0.1} />
                        </linearGradient>
                    </defs>
                </AreaChart>
            </ResponsiveContainer>
        </GraphContainer>
    )
}


===== FILE: components/analytics/StackedMonthlyCompletion.tsx =====
'use client'

import { useEffect, useState } from 'react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts'
import GraphContainer from './GraphContainer'

export default function StackedMonthlyCompletion() {
    const [data, setData] = useState<any[]>([])
    const [goalNames, setGoalNames] = useState<string[]>([])

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await fetch('/api/analytics')
                if (!res.ok) return
                const analytics = await res.json()
                const monthlyTrend = analytics.monthlyTrend || []
                const goals = (analytics.goalCompletionPie || []).map((g: any) => g.name)
                setGoalNames(goals)
                const transformed = monthlyTrend.map((m: any) => {
                    const entry: any = { month: m.month }
                    goals.forEach((g: string) => { entry[g] = m.completion > 0 ? Math.round(m.completion / goals.length) : 0 })
                    return entry
                })
                setData(transformed)
            } catch (e) {
                console.error('StackedMonthlyCompletion error:', e)
            }
        }
        fetchData()
    }, [])

    const COLORS = ['#0ea5e9', '#a855f7', '#d946ef', '#10b981', '#f59e0b']
    if (data.length === 0) return null

    return (
        <GraphContainer title="Stacked Monthly Completion" description="Goal contributions to monthly totals">
            <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e4e4e7" />
                    <XAxis dataKey="month" fontSize={12} stroke="#71717a" />
                    <YAxis fontSize={12} stroke="#71717a" />
                    <Tooltip />
                    <Legend />
                    {goalNames.map((name, i) => (
                        <Bar key={name} dataKey={name} stackId="a" fill={COLORS[i % COLORS.length]} />
                    ))}
                </BarChart>
            </ResponsiveContainer>
        </GraphContainer>
    )
}


===== FILE: components/analytics/StackedWeeklyCompletion.tsx =====
'use client'

import { useEffect, useState } from 'react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts'
import GraphContainer from './GraphContainer'

export default function StackedWeeklyCompletion() {
    const [data, setData] = useState<any[]>([])
    const [goalNames, setGoalNames] = useState<string[]>([])

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await fetch('/api/analytics')
                if (!res.ok) return
                const analytics = await res.json()
                const weeklyTrend = analytics.weeklyTrend || []
                const goals = (analytics.goalCompletionPie || []).map((g: any) => g.name)
                setGoalNames(goals)
                // Transform weekly trend to include per-goal data
                const transformed = weeklyTrend.map((w: any) => {
                    const entry: any = { week: w.week }
                    goals.forEach((g: string) => { entry[g] = w.completion > 0 ? Math.round(w.completion / goals.length) : 0 })
                    return entry
                })
                setData(transformed)
            } catch (e) {
                console.error('StackedWeeklyCompletion error:', e)
            }
        }
        fetchData()
    }, [])

    const COLORS = ['#6B7FB5', '#5AA49D', '#9077B0', '#5A9970', '#B87B63']
    if (data.length === 0) return null

    return (
        <GraphContainer title="Stacked Weekly Completion" description="Goal contributions to weekly totals">
            <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#E7E5E4" opacity={0.5} />
                    <XAxis dataKey="week" fontSize={12} stroke="#78716C" />
                    <YAxis fontSize={12} stroke="#78716C" />
                    <Tooltip />
                    <Legend />
                    {goalNames.map((name, i) => (
                        <Bar key={name} dataKey={name} stackId="a" fill={COLORS[i % COLORS.length]} />
                    ))}
                </BarChart>
            </ResponsiveContainer>
        </GraphContainer>
    )
}


===== FILE: components/analytics/StreakTimeline.tsx =====
'use client'

import { useEffect, useState } from 'react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import GraphContainer from './GraphContainer'

export default function StreakTimeline() {
    const [data, setData] = useState<any[]>([])

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await fetch('/api/analytics')
                if (!res.ok) return
                const analytics = await res.json()
                const streaks = (analytics.streakTimeline || []).map((s: any) => ({
                    goal: s.goalName,
                    current: s.currentStreak,
                    longest: s.longestStreak,
                }))
                setData(streaks)
            } catch (e) {
                console.error('StreakTimeline error:', e)
            }
        }
        fetchData()
    }, [])

    if (data.length === 0) return null

    return (
        <GraphContainer title="Streak Timeline" description="Current and longest streaks per goal">
            <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e4e4e7" />
                    <XAxis dataKey="goal" fontSize={12} stroke="#71717a" />
                    <YAxis fontSize={12} stroke="#71717a" label={{ value: 'Days', angle: -90, position: 'insideLeft' }} />
                    <Tooltip />
                    <Bar dataKey="current" fill="#0ea5e9" name="Current Streak" radius={[8, 8, 0, 0]} />
                    <Bar dataKey="longest" fill="#10b981" name="Longest Streak" radius={[8, 8, 0, 0]} />
                </BarChart>
            </ResponsiveContainer>
        </GraphContainer>
    )
}


===== FILE: components/analytics/TargetVsActual.tsx =====
'use client'

import { useEffect, useState } from 'react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts'
import GraphContainer from './GraphContainer'

interface TargetVsActualPoint {
    date: string
    target: number
    actual: number
}

export default function TargetVsActual() {
    const [data, setData] = useState<TargetVsActualPoint[]>([])

    useEffect(() => {
        fetchRealData()
    }, [])

    const fetchRealData = async () => {
        try {
            const res = await fetch('/api/analytics')
            if (!res.ok) throw new Error('Failed to fetch analytics')

            const analytics = await res.json()
            setData(analytics.targetVsActual || [])
        } catch (error) {
            console.error('Error fetching target vs actual data:', error)
            setData([])
        }
    }

    if (data.length === 0) return null

    return (
        <GraphContainer
            title="Target vs Actual"
            description="Daily targets compared to actual completions (last 30 days)"
        >
            <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e4e4e7" />
                    <XAxis dataKey="date" fontSize={12} stroke="#71717a" />
                    <YAxis fontSize={12} stroke="#71717a" />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="target" fill="#9ca3af" name="Target" />
                    <Bar dataKey="actual" fill="#0ea5e9" name="Actual" />
                </BarChart>
            </ResponsiveContainer>
        </GraphContainer>
    )
}


===== FILE: components/analytics/TimeOfWeekHeatmap.tsx =====
'use client'

import { useEffect, useState } from 'react'
import GraphContainer from './GraphContainer'

interface TimeOfWeekCell {
    day: string
    goalName: string
    completion: number
}

export default function TimeOfWeekHeatmap() {
    const [data, setData] = useState<TimeOfWeekCell[]>([])
    const [goals, setGoals] = useState<string[]>([])

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await fetch('/api/analytics')
                if (!res.ok) return
                const analytics = await res.json()
                const cells: TimeOfWeekCell[] = analytics.timeOfWeekHeatmap || []
                setData(cells)
                const uniqueGoals = [...new Set(cells.map((c) => c.goalName))]
                setGoals(uniqueGoals)
            } catch (e) {
                console.error('TimeOfWeekHeatmap error:', e)
            }
        }
        fetchData()
    }, [])

    const getColor = (value: number) => {
        if (value >= 90) return '#10b981'
        if (value >= 75) return '#3b82f6'
        if (value >= 50) return '#eab308'
        if (value >= 25) return '#f97316'
        return '#ef4444'
    }

    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
    if (data.length === 0) return null

    return (
        <GraphContainer title="Time of Week Heatmap" description="Which days you're most active for each goal" fullWidth>
            <div className="space-y-2">
                <div className="grid gap-1" style={{ gridTemplateColumns: `80px repeat(${days.length}, 1fr)` }}>
                    <div className="text-xs font-medium text-neutral-600"></div>
                    {days.map((day) => (<div key={day} className="text-xs font-medium text-neutral-600 text-center">{day}</div>))}
                </div>
                {goals.map((goal) => (
                    <div key={goal} className="grid gap-1" style={{ gridTemplateColumns: `80px repeat(${days.length}, 1fr)` }}>
                        <div className="text-xs font-medium text-neutral-700 flex items-center truncate">{goal}</div>
                        {days.map((day) => {
                            const cell = data.find((c) => c.goalName === goal && c.day === day)
                            const val = cell ? cell.completion : 0
                            return (
                                <div key={day} className="aspect-square rounded flex items-center justify-center cursor-pointer hover:ring-2 hover:ring-primary-400 transition-all" style={{ backgroundColor: getColor(val) }} title={`${goal} on ${day}: ${val}%`}>
                                    <span className="text-white text-xs font-medium">{val}</span>
                                </div>
                            )
                        })}
                    </div>
                ))}
            </div>
        </GraphContainer>
    )
}


===== FILE: components/analytics/WeeklyCompletionTrend.tsx =====
'use client'

import { useEffect, useState } from 'react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import GraphContainer from './GraphContainer'

interface WeeklyTrendPoint {
    week: string
    completion: number
}

export default function WeeklyCompletionTrend() {
    const [data, setData] = useState<WeeklyTrendPoint[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        fetchRealData()
    }, [])

    const fetchRealData = async () => {
        try {
            const res = await fetch('/api/analytics')
            if (!res.ok) throw new Error('Failed to fetch analytics')

            const analytics = await res.json()
            setData(analytics.weeklyTrend || [])
        } catch (error) {
            console.error('Error fetching weekly trend:', error)
            setData([])
        } finally {
            setLoading(false)
        }
    }

    if (loading || data.length === 0) return null

    return (
        <GraphContainer
            title="Weekly Completion Trend"
            description="Average completion rate per week (last 12 weeks)"
        >
            <ResponsiveContainer width="100%" height="100%">
                <LineChart data={data}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e4e4e7" />
                    <XAxis dataKey="week" fontSize={12} stroke="#71717a" />
                    <YAxis fontSize={12} stroke="#71717a" unit="%" />
                    <Tooltip />
                    <Line
                        type="monotone"
                        dataKey="completion"
                        stroke="#a855f7"
                        strokeWidth={2}
                        dot={{ fill: '#a855f7', r: 4 }}
                    />
                </LineChart>
            </ResponsiveContainer>
        </GraphContainer>
    )
}


===== FILE: components/analytics/WeeklyDensityHeatmap.tsx =====
'use client'

import { useEffect, useState } from 'react'
import GraphContainer from './GraphContainer'

interface TimeOfWeekCell {
    day: string
    goalName: string
    completion: number
}

export default function WeeklyDensityHeatmap() {
    const [data, setData] = useState<TimeOfWeekCell[]>([])
    const [goals, setGoals] = useState<string[]>([])

    useEffect(() => {
        fetchData()
    }, [])

    const fetchData = async () => {
        try {
            const res = await fetch('/api/analytics')
            if (!res.ok) return
            const analytics = await res.json()
            const cells: TimeOfWeekCell[] = analytics.timeOfWeekHeatmap || []
            setData(cells)
            const uniqueGoals = [...new Set(cells.map((c: TimeOfWeekCell) => c.goalName))]
            setGoals(uniqueGoals)
        } catch (err) {
            console.error('Error fetching heatmap:', err)
        }
    }

    const getColor = (value: number) => {
        if (value >= 90) return '#10b981'
        if (value >= 75) return '#3b82f6'
        if (value >= 50) return '#eab308'
        if (value >= 25) return '#f97316'
        return '#ef4444'
    }

    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

    if (data.length === 0) return null

    return (
        <GraphContainer title="Weekly Density Heatmap" description="Completion percentage per goal per day" fullWidth>
            <div className="space-y-2">
                <div className="grid gap-1" style={{ gridTemplateColumns: `80px repeat(${days.length}, 1fr)` }}>
                    <div className="text-xs font-medium text-neutral-600"></div>
                    {days.map((d) => (<div key={d} className="text-xs font-medium text-neutral-600 text-center">{d}</div>))}
                </div>
                {goals.map((goal) => (
                    <div key={goal} className="grid gap-1" style={{ gridTemplateColumns: `80px repeat(${days.length}, 1fr)` }}>
                        <div className="text-xs font-medium text-neutral-700 flex items-center truncate">{goal}</div>
                        {days.map((day) => {
                            const cell = data.find((c) => c.goalName === goal && c.day === day)
                            const val = cell ? cell.completion : 0
                            return (
                                <div key={day} className="aspect-square rounded flex items-center justify-center cursor-pointer hover:ring-2 hover:ring-primary-400 transition-all" style={{ backgroundColor: getColor(val) }} title={`${goal} - ${day}: ${val}%`}>
                                    <span className="text-white text-[10px]">{val}</span>
                                </div>
                            )
                        })}
                    </div>
                ))}
            </div>
        </GraphContainer>
    )
}


===== FILE: components/analytics/WeeklyGoalComparison.tsx =====
'use client'

import { useEffect, useState } from 'react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import GraphContainer from './GraphContainer'

export default function WeeklyGoalComparison() {
    const [data, setData] = useState<any[]>([])

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await fetch('/api/analytics')
                if (!res.ok) return
                const analytics = await res.json()
                // Use goal completion pie data for comparison
                const goals = (analytics.goalCompletionPie || []).map((g: any) => ({
                    goal: g.name,
                    completion: g.value,
                }))
                setData(goals)
            } catch (e) {
                console.error('WeeklyGoalComparison error:', e)
            }
        }
        fetchData()
    }, [])

    if (data.length === 0) return null

    return (
        <GraphContainer title="Weekly Goal Comparison" description="Completion rate per goal">
            <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" stroke="#e4e4e7" />
                    <XAxis type="number" fontSize={12} stroke="#71717a" unit="%" />
                    <YAxis type="category" dataKey="goal" fontSize={12} stroke="#71717a" width={100} />
                    <Tooltip />
                    <Bar dataKey="completion" fill="#0ea5e9" radius={[0, 8, 8, 0]} />
                </BarChart>
            </ResponsiveContainer>
        </GraphContainer>
    )
}


===== FILE: components/analytics/YearlyCompletionTrend.tsx =====
'use client'

import { useEffect, useState } from 'react'
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import GraphContainer from './GraphContainer'

export default function YearlyCompletionTrend() {
    const [data, setData] = useState<any[]>([])

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await fetch('/api/analytics')
                if (!res.ok) return
                const analytics = await res.json()
                // Use monthly trend data to show yearly view
                setData(analytics.monthlyTrend || [])
            } catch (e) {
                console.error('YearlyCompletionTrend error:', e)
            }
        }
        fetchData()
    }, [])

    if (data.length === 0) return null

    return (
        <GraphContainer title="Yearly Completion Trend" description="Year-over-year completion pattern">
            <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={data}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e4e4e7" />
                    <XAxis dataKey="month" fontSize={12} stroke="#71717a" />
                    <YAxis fontSize={12} stroke="#71717a" unit="%" />
                    <Tooltip />
                    <Area type="monotone" dataKey="completion" stroke="#d946ef" fill="url(#colorGradient)" strokeWidth={2} />
                    <defs>
                        <linearGradient id="colorGradient" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#d946ef" stopOpacity={0.8} />
                            <stop offset="95%" stopColor="#d946ef" stopOpacity={0.1} />
                        </linearGradient>
                    </defs>
                </AreaChart>
            </ResponsiveContainer>
        </GraphContainer>
    )
}


===== FILE: components/AuthProvider.tsx =====
'use client'

import { SessionProvider } from 'next-auth/react'

export default function AuthProvider({ children }: { children: React.ReactNode }) {
    return <SessionProvider>{children}</SessionProvider>
}


===== FILE: components/Checkbox.tsx =====
'use client'

import { motion } from 'framer-motion'

interface CheckboxProps {
    checked: boolean
    onChange: () => void
}

export default function Checkbox({ checked, onChange }: CheckboxProps) {
    return (
        <motion.button
            onClick={onChange}
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.95 }}
            className="relative w-6 h-6 rounded border-2 transition-all focus:outline-none focus:ring-2 focus:ring-primary-300 focus:ring-offset-1"
            style={{
                backgroundColor: checked ? '#6B7FB5' : 'white',
                borderColor: checked ? '#6B7FB5' : '#D6D3D1',
            }}
        >
            {checked && (
                <motion.svg
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0, opacity: 0 }}
                    transition={{
                        type: 'spring',
                        stiffness: 500,
                        damping: 25
                    }}
                    className="absolute inset-0 w-full h-full"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="white"
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                >
                    <polyline points="20 6 9 17 4 12" />
                </motion.svg>
            )}
        </motion.button>
    )
}


===== FILE: components/DashboardLayout.tsx =====
'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { signOut, useSession } from 'next-auth/react'
import Timeline from './Timeline'
import GoalSidebar from './GoalSidebar'
import FloatingNotes from './FloatingNotes'
import Link from 'next/link'

export default function DashboardLayout() {
    const { data: session } = useSession()
    const [showNotes, setShowNotes] = useState(false)
    const [refreshKey, setRefreshKey] = useState(0)

    const handleGoalAdded = () => {
        console.log('📊 [DashboardLayout] handleGoalAdded called!')
        setRefreshKey(prev => {
            const newKey = prev + 1
            console.log(`📊 [DashboardLayout] Refresh key: ${prev} → ${newKey}`)
            return newKey
        })
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-neutral-50 via-primary-50/30 to-secondary-50/30">
            {/* Header */}
            <header className="glass border-b border-neutral-200/50 sticky top-0 z-20">
                <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
                    <h1 className="text-2xl font-bold bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent">
                        Habit Tracker
                    </h1>

                    <nav className="flex items-center gap-6">
                        <Link
                            href="/dashboard"
                            className="text-neutral-700 hover:text-primary-600 font-medium transition-colors"
                        >
                            Timeline
                        </Link>
                        <Link
                            href="/analytics"
                            className="text-neutral-700 hover:text-primary-600 font-medium transition-colors"
                        >
                            Analytics
                        </Link>
                        <button
                            onClick={() => setShowNotes(true)}
                            className="text-neutral-700 hover:text-primary-600 font-medium transition-colors"
                        >
                            Notes
                        </button>
                        <button
                            onClick={() => signOut({ callbackUrl: '/login' })}
                            className="px-4 py-2 bg-neutral-100 hover:bg-neutral-200 rounded-lg text-sm font-medium transition-colors"
                        >
                            Sign Out
                        </button>
                    </nav>
                </div>
            </header>

            {/* Main Content */}
            <div className="max-w-7xl mx-auto px-6 py-8">
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                    {/* Sidebar */}
                    <div className="lg:col-span-1">
                        <GoalSidebar onGoalAdded={handleGoalAdded} />
                    </div>

                    {/* Timeline */}
                    <div className="lg:col-span-3">
                        <Timeline key={refreshKey} />
                    </div>
                </div>
            </div>

            {/* Floating Notes */}
            {showNotes && <FloatingNotes onClose={() => setShowNotes(false)} />}
        </div>
    )
}


===== FILE: components/FloatingNotes.tsx =====
'use client'

import { useState, useEffect } from 'react'
import { motion, Reorder } from 'framer-motion'

interface FloatingNotesProps {
    onClose: () => void
}

interface Note {
    id: string
    content: string
    createdAt: string
    updatedAt: string
}

export default function FloatingNotes({ onClose }: FloatingNotesProps) {
    const [notes, setNotes] = useState<Note[]>([])
    const [activeNote, setActiveNote] = useState<string>('')
    const [saveTimeout, setSaveTimeout] = useState<NodeJS.Timeout | null>(null)

    useEffect(() => {
        fetchNotes()
    }, [])

    const fetchNotes = async () => {
        try {
            const res = await fetch('/api/notes')
            const data = await res.json()
            setNotes(data)
            if (data.length > 0) {
                setActiveNote(data[0].content)
            }
        } catch (error) {
            console.error('Failed to fetch notes:', error)
        }
    }

    const handleContentChange = (content: string) => {
        setActiveNote(content)

        // Auto-save after 2 seconds of no typing
        if (saveTimeout) clearTimeout(saveTimeout)
        const timeout = setTimeout(() => {
            saveNote(content)
        }, 2000)
        setSaveTimeout(timeout)
    }

    const saveNote = async (content: string) => {
        try {
            if (notes.length > 0) {
                // Update existing note
                await fetch(`/api/notes/${notes[0].id}`, {
                    method: 'PATCH',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ content }),
                })
            } else {
                // Create new note
                const res = await fetch('/api/notes', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ content }),
                })
                const newNote = await res.json()
                setNotes([newNote])
            }
        } catch (error) {
            console.error('Failed to save note:', error)
        }
    }

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/20 backdrop-blur-sm"
            onClick={onClose}
        >
            <motion.div
                drag
                dragConstraints={{ top: -200, left: -400, right: 400, bottom: 200 }}
                dragElastic={0.1}
                initial={{ scale: 0.9, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                className="glass rounded-2xl shadow-soft-lg p-6 w-full max-w-2xl mx-4 cursor-move"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="flex items-center justify-between mb-4 cursor-auto">
                    <h3 className="text-xl font-bold text-neutral-800">Notes</h3>
                    <button
                        onClick={onClose}
                        className="text-neutral-400 hover:text-neutral-600 transition-colors"
                    >
                        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                <textarea
                    value={activeNote}
                    onChange={(e) => handleContentChange(e.target.value)}
                    placeholder="Start typing your notes... (auto-saves)"
                    className="w-full h-96 p-4 border border-neutral-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-400 resize-none cursor-auto font-sans text-neutral-700"
                    style={{ fontFamily: 'Inter, system-ui, sans-serif' }}
                />

                <p className="text-xs text-neutral-400 mt-2">
                    Drag to move • Auto-saves after 2 seconds
                </p>
            </motion.div>
        </motion.div>
    )
}


===== FILE: components/GoalRow.tsx =====
'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import Checkbox from './Checkbox'
import ProgressBar from './ProgressBar'

interface GoalRowProps {
    goalId: string
    goalName: string
    weekStartDate: string
    defaultTarget: number
}

interface WeeklyLog {
    id: string
    weeklyTarget: number
    checkboxStates: boolean[]
}

export default function GoalRow({ goalId, goalName, weekStartDate, defaultTarget }: GoalRowProps) {
    const [log, setLog] = useState<WeeklyLog | null>(null)
    const [target, setTarget] = useState(defaultTarget)
    const [checkboxes, setCheckboxes] = useState<boolean[]>(Array(7).fill(false))
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        fetchLog()
    }, [goalId, weekStartDate])

    const fetchLog = async () => {
        try {
            const res = await fetch(
                `/api/weekly-logs?goalId=${goalId}&weekStartDate=${weekStartDate}`
            )
            if (res.ok) {
                const data = await res.json()
                setLog(data)
                setTarget(data.weeklyTarget || defaultTarget)
                setCheckboxes(data.checkboxStates || Array(7).fill(false))
            } else {
                // No log exists yet, use defaults
                setTarget(defaultTarget)
                setCheckboxes(Array(7).fill(false))
            }
            setLoading(false)
        } catch (error) {
            console.error('Failed to fetch log:', error)
            setLoading(false)
        }
    }

    const handleCheckboxChange = async (index: number) => {
        const newCheckboxes = [...checkboxes]
        newCheckboxes[index] = !newCheckboxes[index]
        setCheckboxes(newCheckboxes)

        // Save to backend
        try {
            await fetch('/api/weekly-logs', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    goalId,
                    weekStartDate,
                    weeklyTarget: target,
                    checkboxStates: newCheckboxes,
                }),
            })
        } catch (error) {
            console.error('Failed to update log:', error)
        }
    }

    const handleTargetChange = async (newTarget: number) => {
        if (newTarget < 0 || newTarget > 7) return
        setTarget(newTarget)

        // Save to backend
        try {
            await fetch('/api/weekly-logs', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    goalId,
                    weekStartDate,
                    weeklyTarget: newTarget,
                    checkboxStates: checkboxes,
                }),
            })
        } catch (error) {
            console.error('Failed to update target:', error)
        }
    }

    const checkedCount = checkboxes.filter(Boolean).length
    const progress = target > 0 ? (checkedCount / target) * 100 : 0

    if (loading) {
        return (
            <div className="animate-pulse bg-neutral-100 rounded-lg h-20"></div>
        )
    }

    return (
        <motion.div
            className="bg-white/50 rounded-lg p-4 hover:bg-white/70 transition-colors"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
        >
            {/* Goal Name and Target */}
            <div className="grid grid-cols-8 gap-2 items-center mb-3">
                <div className="flex items-center gap-2">
                    <span className="font-medium text-neutral-700 text-sm truncate">
                        {goalName}
                    </span>
                    <div className="flex items-center gap-1 text-xs text-neutral-500">
                        <span>/</span>
                        <input
                            type="number"
                            min="0"
                            max="7"
                            value={target}
                            onChange={(e) => handleTargetChange(parseInt(e.target.value) || 0)}
                            className="w-10 px-1 py-0.5 border border-neutral-300 rounded text-center focus:outline-none focus:ring-2 focus:ring-primary-400"
                        />
                    </div>
                </div>

                {/* Checkboxes */}
                {checkboxes.map((checked, index) => (
                    <div key={index} className="flex justify-center">
                        <Checkbox
                            checked={checked}
                            onChange={() => handleCheckboxChange(index)}
                        />
                    </div>
                ))}
            </div>

            {/* Progress Bar */}
            <div className="flex items-center gap-3">
                <ProgressBar progress={Math.min(progress, 100)} />
                <span className="text-xs font-medium text-neutral-600 min-w-[60px]">
                    {checkedCount}/{target} ({Math.round(progress)}%)
                </span>
            </div>
        </motion.div>
    )
}


===== FILE: components/GoalSidebar.tsx =====
'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

interface Goal {
    id: string
    name: string
    defaultWeeklyTarget: number
    isArchived: boolean
}

interface GoalSidebarProps {
    onGoalAdded?: () => void
}

export default function GoalSidebar({ onGoalAdded }: GoalSidebarProps) {
    const [goals, setGoals] = useState<Goal[]>([])
    const [showAddForm, setShowAddForm] = useState(false)
    const [newGoalName, setNewGoalName] = useState('')
    const [newGoalTarget, setNewGoalTarget] = useState(7)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        fetchGoals()
    }, [])

    const fetchGoals = async () => {
        try {
            const res = await fetch('/api/goals')
            const data = await res.json()
            setGoals(data.filter((g: Goal) => !g.isArchived))
            setLoading(false)
        } catch (error) {
            console.error('Failed to fetch goals:', error)
            setLoading(false)
        }
    }

    const handleAddGoal = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!newGoalName.trim()) return

        console.log('🎯 [GoalSidebar] Starting to add goal:', newGoalName)

        try {
            console.log('🎯 [GoalSidebar] Sending POST request to /api/goals')
            const res = await fetch('/api/goals', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    name: newGoalName,
                    defaultWeeklyTarget: newGoalTarget,
                }),
            })

            if (!res.ok) {
                console.error('🎯 [GoalSidebar] API error:', res.status, res.statusText)
                return
            }

            const newGoal = await res.json()
            console.log('🎯 [GoalSidebar] Goal created successfully:', newGoal)

            setGoals([...goals, newGoal])
            setNewGoalName('')
            setNewGoalTarget(7)
            setShowAddForm(false)

            // Notify parent to refresh timeline
            console.log('🎯 [GoalSidebar] Calling onGoalAdded callback...')
            if (onGoalAdded) {
                onGoalAdded()
                console.log('🎯 [GoalSidebar] onGoalAdded callback executed')
            } else {
                console.warn('🎯 [GoalSidebar] WARNING: onGoalAdded is undefined!')
            }
        } catch (error) {
            console.error('Failed to add goal:', error)
        }
    }

    const handleArchiveGoal = async (goalId: string) => {
        try {
            await fetch(`/api/goals/${goalId}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ isArchived: true }),
            })
            setGoals(goals.filter((g) => g.id !== goalId))
        } catch (error) {
            console.error('Failed to archive goal:', error)
        }
    }

    return (
        <div className="glass rounded-2xl shadow-soft-lg p-6 sticky top-24">
            <h3 className="text-xl font-bold mb-4 text-neutral-800">Your Goals</h3>

            {loading ? (
                <div className="space-y-3">
                    {[1, 2, 3].map((i) => (
                        <div key={i} className="animate-pulse bg-neutral-100 rounded-lg h-12"></div>
                    ))}
                </div>
            ) : (
                <>
                    <div className="space-y-2 mb-4">
                        {goals.length === 0 ? (
                            <p className="text-sm text-neutral-500">No goals yet</p>
                        ) : (
                            goals.map((goal) => (
                                <motion.div
                                    key={goal.id}
                                    layout
                                    className="bg-white/50 rounded-lg p-3 hover:bg-white/70 transition-colors group"
                                >
                                    <div className="flex items-start justify-between">
                                        <div className="flex-1">
                                            <p className="font-medium text-neutral-700 text-sm">
                                                {goal.name}
                                            </p>
                                            <p className="text-xs text-neutral-500 mt-1">
                                                Target: {goal.defaultWeeklyTarget}/week
                                            </p>
                                        </div>
                                        <button
                                            onClick={() => handleArchiveGoal(goal.id)}
                                            className="opacity-0 group-hover:opacity-100 text-neutral-400 hover:text-red-500 transition-all text-xs"
                                        >
                                            Archive
                                        </button>
                                    </div>
                                </motion.div>
                            ))
                        )}
                    </div>

                    <AnimatePresence>
                        {showAddForm ? (
                            <motion.form
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                exit={{ opacity: 0, height: 0 }}
                                onSubmit={handleAddGoal}
                                className="space-y-3 mb-3"
                            >
                                <input
                                    type="text"
                                    value={newGoalName}
                                    onChange={(e) => setNewGoalName(e.target.value)}
                                    placeholder="Goal name"
                                    className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-400 text-sm"
                                    autoFocus
                                />
                                <div className="flex items-center gap-2">
                                    <label className="text-xs text-neutral-600">Target:</label>
                                    <input
                                        type="number"
                                        min="1"
                                        max="7"
                                        value={newGoalTarget}
                                        onChange={(e) => setNewGoalTarget(parseInt(e.target.value) || 7)}
                                        className="w-16 px-2 py-1 border border-neutral-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-primary-400"
                                    />
                                    <span className="text-xs text-neutral-500">/week</span>
                                </div>
                                <div className="flex gap-2">
                                    <button
                                        type="submit"
                                        className="flex-1 px-3 py-2 bg-primary-500 hover:bg-primary-600 text-white rounded-lg text-sm font-medium transition-colors"
                                    >
                                        Add
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setShowAddForm(false)}
                                        className="px-3 py-2 bg-neutral-100 hover:bg-neutral-200 text-neutral-700 rounded-lg text-sm font-medium transition-colors"
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </motion.form>
                        ) : (
                            <button
                                onClick={() => setShowAddForm(true)}
                                className="w-full px-4 py-3 bg-gradient-to-r from-primary-500 to-secondary-500 hover:from-primary-600 hover:to-secondary-600 text-white rounded-xl font-medium transition-all shadow-soft hover:shadow-soft-lg"
                            >
                                + Add Goal
                            </button>
                        )}
                    </AnimatePresence>
                </>
            )}
        </div>
    )
}


===== FILE: components/InteractiveBackground.tsx =====
'use client'

import { useEffect, useRef } from 'react'
import * as THREE from 'three'

export default function InteractiveBackground() {
    const containerRef = useRef<HTMLDivElement>(null)
    const mouseRef = useRef({ x: 0, y: 0 })

    useEffect(() => {
        if (!containerRef.current) return

        // Scene setup
        const scene = new THREE.Scene()
        const camera = new THREE.PerspectiveCamera(
            75,
            window.innerWidth / window.innerHeight,
            0.1,
            1000
        )
        camera.position.z = 50

        const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true })
        renderer.setSize(window.innerWidth, window.innerHeight)
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
        containerRef.current.appendChild(renderer.domElement)

        // Create particles
        const particlesCount = 3000
        const positions = new Float32Array(particlesCount * 3)
        const velocities = new Float32Array(particlesCount * 3)
        const colors = new Float32Array(particlesCount * 3)

        for (let i = 0; i < particlesCount * 3; i += 3) {
            positions[i] = (Math.random() - 0.5) * 100
            positions[i + 1] = (Math.random() - 0.5) * 100
            positions[i + 2] = (Math.random() - 0.5) * 100

            velocities[i] = (Math.random() - 0.5) * 0.02
            velocities[i + 1] = (Math.random() - 0.5) * 0.02
            velocities[i + 2] = (Math.random() - 0.5) * 0.02

            // Gradient colors (purple to blue)
            const color = new THREE.Color()
            color.setHSL(0.6 + Math.random() * 0.2, 0.7, 0.6)
            colors[i] = color.r
            colors[i + 1] = color.g
            colors[i + 2] = color.b
        }

        const geometry = new THREE.BufferGeometry()
        geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
        geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3))

        const material = new THREE.PointsMaterial({
            size: 0.5,
            vertexColors: true,
            blending: THREE.AdditiveBlending,
            transparent: true,
            opacity: 0.8,
        })

        const particles = new THREE.Points(geometry, material)
        scene.add(particles)

        // Mouse movement handler
        const handleMouseMove = (event: MouseEvent) => {
            mouseRef.current.x = (event.clientX / window.innerWidth) * 2 - 1
            mouseRef.current.y = -(event.clientY / window.innerHeight) * 2 + 1
        }

        // Window resize handler
        const handleResize = () => {
            camera.aspect = window.innerWidth / window.innerHeight
            camera.updateProjectionMatrix()
            renderer.setSize(window.innerWidth, window.innerHeight)
        }

        window.addEventListener('mousemove', handleMouseMove)
        window.addEventListener('resize', handleResize)

        // Animation loop
        const animate = () => {
            requestAnimationFrame(animate)

            const positions = particles.geometry.attributes.position.array as Float32Array

            for (let i = 0; i < particlesCount * 3; i += 3) {
                // Apply velocities
                positions[i] += velocities[i]
                positions[i + 1] += velocities[i + 1]
                positions[i + 2] += velocities[i + 2]

                // Mouse interaction
                const dx = mouseRef.current.x * 30 - positions[i]
                const dy = mouseRef.current.y * 30 - positions[i + 1]
                const distance = Math.sqrt(dx * dx + dy * dy)

                if (distance < 15) {
                    const force = (15 - distance) / 15
                    positions[i] -= dx * force * 0.03
                    positions[i + 1] -= dy * force * 0.03
                }

                // Boundary wrapping
                if (positions[i] > 50) positions[i] = -50
                if (positions[i] < -50) positions[i] = 50
                if (positions[i + 1] > 50) positions[i + 1] = -50
                if (positions[i + 1] < -50) positions[i + 1] = 50
                if (positions[i + 2] > 50) positions[i + 2] = -50
                if (positions[i + 2] < -50) positions[i + 2] = 50
            }

            particles.geometry.attributes.position.needsUpdate = true
            particles.rotation.y += 0.0005

            renderer.render(scene, camera)
        }

        animate()

        // Cleanup
        return () => {
            window.removeEventListener('mousemove', handleMouseMove)
            window.removeEventListener('resize', handleResize)
            if (containerRef.current) {
                containerRef.current.removeChild(renderer.domElement)
            }
            geometry.dispose()
            material.dispose()
            renderer.dispose()
        }
    }, [])

    return (
        <div
            ref={containerRef}
            className="fixed inset-0 w-full h-full"
            style={{ zIndex: 0 }}
        />
    )
}


===== FILE: components/ProgressBar.tsx =====
'use client'

import { motion } from 'framer-motion'

interface ProgressBarProps {
    progress: number // 0-100
}

export default function ProgressBar({ progress }: ProgressBarProps) {
    // Color gradient based on progress - using calm,  gentle colors
    const getColor = (progress: number) => {
        if (progress >= 100) return 'from-success-400 to-success-600'
        if (progress >= 75) return 'from-primary-400 to-primary-500'
        if (progress >= 50) return 'from-secondary-400 to-secondary-500'
        return 'from-neutral-200 to-neutral-300'
    }

    return (
        <div className="flex-1 h-2 bg-neutral-100 rounded-full overflow-hidden">
            <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${Math.min(progress, 100)}%` }}
                transition={{
                    type: 'spring',
                    stiffness: 100,
                    damping: 15,
                }}
                className={`h-full bg-gradient-to-r ${getColor(progress)} rounded-full`}
            />
        </div>
    )
}


===== FILE: components/Timeline.tsx =====
'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import WeekCard from './WeekCard'

interface Goal {
    id: string
    name: string
    defaultWeeklyTarget: number
}

interface WeekData {
    weekStartDate: string
    goals: Goal[]
}

export default function Timeline() {
    const [weeks, setWeeks] = useState<WeekData[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        console.log('📅 [Timeline] Component mounted/remounted!')
        fetchWeeks()
    }, [])

    const fetchWeeks = async () => {
        try {
            console.log('📅 [Timeline] Fetching goals from API...')
            // Fetch goals and generate weeks
            const goalsRes = await fetch('/api/goals')
            console.log('📅 [Timeline] API response status:', goalsRes.status)

            const goalsData = await goalsRes.json()
            console.log('📅 [Timeline] Raw API data:', goalsData)

            // Ensure goals is an array
            const goals = Array.isArray(goalsData) ? goalsData : []

            console.log(`📅 [Timeline] Fetched ${goals.length} goals:`, goals)

            // Generate last 12 weeks
            const weeksData: WeekData[] = []
            const today = new Date()

            for (let i = 0; i < 12; i++) {
                const weekStart = new Date(today)
                weekStart.setDate(today.getDate() - (i * 7))
                weekStart.setDate(weekStart.getDate() - weekStart.getDay()) // Set to Sunday
                // Normalize to midnight UTC so the date is consistent across reloads
                weekStart.setUTCHours(0, 0, 0, 0)

                weeksData.push({
                    weekStartDate: weekStart.toISOString(),
                    goals: goals,
                })
            }

            setWeeks(weeksData)
            setLoading(false)
        } catch (error) {
            console.error('Failed to fetch weeks:', error)
            setWeeks([])
            setLoading(false)
        }
    }

    if (loading) {
        return (
            <div className="flex items-center justify-center py-20">
                <div className="animate-pulse-soft text-neutral-400 text-lg">
                    Loading timeline...
                </div>
            </div>
        )
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-3xl font-bold text-neutral-800">Your Timeline</h2>
                <p className="text-sm text-neutral-500">
                    Continuous tracking • No resets
                </p>
            </div>

            <div className="space-y-8">
                {weeks.map((week, index) => (
                    <motion.div
                        key={week.weekStartDate}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                    >
                        <WeekCard weekStartDate={week.weekStartDate} goals={week.goals} />
                    </motion.div>
                ))}
            </div>

            <div className="text-center py-8 text-neutral-400 text-sm">
                Scroll for history
            </div>
        </div>
    )
}


===== FILE: components/WeekCard.tsx =====
'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import GoalRow from './GoalRow'

interface Goal {
    id: string
    name: string
    defaultWeeklyTarget: number
}

interface WeekCardProps {
    weekStartDate: string
    goals: Goal[]
}

export default function WeekCard({ weekStartDate, goals }: WeekCardProps) {
    const weekStart = new Date(weekStartDate)
    const weekEnd = new Date(weekStart)
    weekEnd.setDate(weekStart.getDate() + 6)

    const formatDate = (date: Date) => {
        return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
    }

    return (
        <motion.div
            className="glass rounded-2xl shadow-soft p-6 border border-neutral-200"
            whileHover={{ boxShadow: '0 4px 16px rgba(0, 0, 0, 0.08), 0 2px 6px rgba(0, 0, 0, 0.1)' }}
        >
            {/* Week Header */}
            <div className="mb-6 pb-4 border-b border-neutral-200">
                <h3 className="text-xl font-semibold text-neutral-800">
                    {formatDate(weekStart)} - {formatDate(weekEnd)}
                </h3>
                <p className="text-sm text-neutral-500 mt-1">
                    Week of {weekStart.toLocaleDateString('en-US', { month: 'long' })}
                </p>
            </div>

            {/* Day Labels */}
            <div className="grid grid-cols-8 gap-2 mb-4 px-4">
                <div className="text-xs font-medium text-neutral-500"></div>
                {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day) => (
                    <div
                        key={day}
                        className="text-xs font-medium text-neutral-500 text-center"
                    >
                        {day}
                    </div>
                ))}
            </div>

            {/* Goals */}
            <div className="space-y-4">
                {goals.length === 0 ? (
                    <div className="text-center py-8 text-neutral-400">
                        No goals yet. Add goals from the sidebar.
                    </div>
                ) : (
                    goals.map((goal) => (
                        <GoalRow
                            key={goal.id}
                            goalId={goal.id}
                            goalName={goal.name}
                            weekStartDate={weekStartDate}
                            defaultTarget={goal.defaultWeeklyTarget}
                        />
                    ))
                )}
            </div>
        </motion.div>
    )
}


===== FILE: lib/analytics/aggregateDaily.ts =====
import { DailyRecord, DailyTrendPoint } from './types'

/**
 * Aggregates daily records into daily completion trend
 * Returns percentage completion for each day
 */
export function aggregateDaily(dailyRecords: DailyRecord[], days: number = 30): DailyTrendPoint[] {
    if (dailyRecords.length === 0) return []

    const cutoffDate = new Date()
    cutoffDate.setDate(cutoffDate.getDate() - days)

    // Filter to last N days
    const recentRecords = dailyRecords.filter(r => r.date >= cutoffDate)

    // Group by date
    const byDate = new Map<string, { completed: number; total: number }>()

    for (const record of recentRecords) {
        const dateKey = record.date.toISOString().split('T')[0]

        if (!byDate.has(dateKey)) {
            byDate.set(dateKey, { completed: 0, total: 0 })
        }

        const stats = byDate.get(dateKey)!
        stats.total++
        if (record.completed) stats.completed++
    }

    // Convert to array and calculate percentages
    const result: DailyTrendPoint[] = []

    for (let i = 0; i < days; i++) {
        const date = new Date()
        date.setDate(date.getDate() - (days - 1 - i))
        const dateKey = date.toISOString().split('T')[0]

        const stats = byDate.get(dateKey)
        const completion = stats ? Math.round((stats.completed / stats.total) * 100) : 0

        result.push({
            date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
            completion,
        })
    }

    return result
}


===== FILE: lib/analytics/aggregateMonthly.ts =====
import { DailyRecord, MonthlyTrendPoint } from './types'

/**
 * Aggregates daily records into monthly completion trend
 * Returns percentage completion for each month
 */
export function aggregateMonthly(dailyRecords: DailyRecord[], months: number = 6): MonthlyTrendPoint[] {
    if (dailyRecords.length === 0) return []

    const result: MonthlyTrendPoint[] = []
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

    for (let monthOffset = months - 1; monthOffset >= 0; monthOffset--) {
        const targetDate = new Date()
        targetDate.setMonth(targetDate.getMonth() - monthOffset)

        const year = targetDate.getFullYear()
        const month = targetDate.getMonth()

        // Filter records in this month
        const monthRecords = dailyRecords.filter(r => {
            const recordDate = new Date(r.date)
            return recordDate.getFullYear() === year && recordDate.getMonth() === month
        })

        const completed = monthRecords.filter(r => r.completed).length
        const total = monthRecords.length
        const completion = total > 0 ? Math.round((completed / total) * 100) : 0

        result.push({
            month: monthNames[month],
            completion,
        })
    }

    return result
}


===== FILE: lib/analytics/aggregateWeekly.ts =====
import { DailyRecord, WeeklyTrendPoint } from './types'

/**
 * Aggregates daily records into weekly completion trend
 * Returns percentage completion for each week
 */
export function aggregateWeekly(dailyRecords: DailyRecord[], weeks: number = 12): WeeklyTrendPoint[] {
    if (dailyRecords.length === 0) return []

    const result: WeeklyTrendPoint[] = []

    for (let weekIndex = 0; weekIndex < weeks; weekIndex++) {
        const weekEnd = new Date()
        weekEnd.setDate(weekEnd.getDate() - (weekIndex * 7))

        const weekStart = new Date(weekEnd)
        weekStart.setDate(weekStart.getDate() - 6)

        // Filter records in this week
        const weekRecords = dailyRecords.filter(
            r => r.date >= weekStart && r.date <= weekEnd
        )

        const completed = weekRecords.filter(r => r.completed).length
        const total = weekRecords.length
        const completion = total > 0 ? Math.round((completed / total) * 100) : 0

        result.unshift({
            week: `W${weeks - weekIndex}`,
            completion,
        })
    }

    return result
}


===== FILE: lib/analytics/calculateStreaks.ts =====
import { DailyRecord, StreakData } from './types'

/**
 * Calculates current and longest streaks for each goal
 */
export function calculateStreaks(dailyRecords: DailyRecord[]): StreakData[] {
    if (dailyRecords.length === 0) return []

    // Group by goal
    const byGoal = new Map<string, DailyRecord[]>()

    for (const record of dailyRecords) {
        if (!byGoal.has(record.goalId)) {
            byGoal.set(record.goalId, [])
        }
        byGoal.get(record.goalId)!.push(record)
    }

    const streaks: StreakData[] = []

    for (const [goalId, records] of byGoal.entries()) {
        // Sort by date
        const sorted = records.sort((a, b) => a.date.getTime() - b.date.getTime())

        let currentStreak = 0
        let longestStreak = 0
        let tempStreak = 0
        let streakStartDate: Date | null = null

        for (let i = sorted.length - 1; i >= 0; i--) {
            const record = sorted[i]

            if (record.completed) {
                tempStreak++

                // Track current streak (from today backwards)
                if (i === sorted.length - 1 || currentStreak > 0) {
                    currentStreak++
                    if (currentStreak === 1) {
                        streakStartDate = record.date
                    }
                }

                longestStreak = Math.max(longestStreak, tempStreak)
            } else {
                tempStreak = 0
            }
        }

        streaks.push({
            goalName: records[0].goalName,
            currentStreak,
            longestStreak,
            startDate: streakStartDate ? streakStartDate.toISOString() : null,
        })
    }

    return streaks.sort((a, b) => b.longestStreak - a.longestStreak)
}


===== FILE: lib/analytics/generateHeatmapData.ts =====
import { DailyRecord, HeatmapCell, TimeOfWeekCell } from './types'

/**
 * Generates calendar heatmap data (last 84 days)
 */
export function generateCalendarHeatmap(dailyRecords: DailyRecord[]): HeatmapCell[] {
    const result: HeatmapCell[] = []
    const days = 84

    const byDate = new Map<string, { completed: number; total: number }>()

    for (const record of dailyRecords) {
        const dateKey = record.date.toISOString().split('T')[0]

        if (!byDate.has(dateKey)) {
            byDate.set(dateKey, { completed: 0, total: 0 })
        }

        const stats = byDate.get(dateKey)!
        stats.total++
        if (record.completed) stats.completed++
    }

    for (let i = 0; i < days; i++) {
        const date = new Date()
        date.setDate(date.getDate() - (days - 1 - i))
        const dateKey = date.toISOString().split('T')[0]

        const stats = byDate.get(dateKey)
        const completion = stats ? (stats.completed / stats.total) : 0

        // Intensity 0-4 scale
        const intensity = stats ? Math.min(4, Math.floor(completion * 5)) : 0

        result.push({
            day: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
            intensity,
        })
    }

    return result
}

/**
 * Generates time-of-week heatmap (which days are most active per goal)
 */
export function generateTimeOfWeekHeatmap(dailyRecords: DailyRecord[]): TimeOfWeekCell[] {
    if (dailyRecords.length === 0) return []

    const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
    const byGoalAndDay = new Map<string, Map<number, { completed: number; total: number }>>()

    for (const record of dailyRecords) {
        const dayOfWeek = record.date.getDay()

        if (!byGoalAndDay.has(record.goalName)) {
            byGoalAndDay.set(record.goalName, new Map())
        }

        const goalMap = byGoalAndDay.get(record.goalName)!

        if (!goalMap.has(dayOfWeek)) {
            goalMap.set(dayOfWeek, { completed: 0, total: 0 })
        }

        const stats = goalMap.get(dayOfWeek)!
        stats.total++
        if (record.completed) stats.completed++
    }

    const result: TimeOfWeekCell[] = []

    for (const [goalName, dayMap] of byGoalAndDay.entries()) {
        for (let day = 0; day < 7; day++) {
            const stats = dayMap.get(day)
            const completion = stats ? Math.round((stats.completed / stats.total) * 100) : 0

            result.push({
                day: dayNames[day],
                goalName,
                completion,
            })
        }
    }

    return result
}


===== FILE: lib/analytics/getAnalyticsData.ts =====
import { prisma } from '@/lib/db'
import { normalizeDailyRecords } from './normalizeDailyRecords'
import { aggregateDaily } from './aggregateDaily'
import { aggregateWeekly } from './aggregateWeekly'
import { aggregateMonthly } from './aggregateMonthly'
import { calculateStreaks } from './calculateStreaks'
import { generateCalendarHeatmap, generateTimeOfWeekHeatmap } from './generateHeatmapData'
import type { AnalyticsPayload, GoalCompletionData, TargetVsActualPoint, ConsistencyScore, LifetimeStats } from './types'

// In-memory cache with 60-second TTL
interface CacheEntry {
    data: AnalyticsPayload
    timestamp: number
}

const cache = new Map<string, CacheEntry>()
const CACHE_TTL = 60 * 1000 // 60 seconds

export function invalidateAnalyticsCache(userId: string) {
    // Clear all cache entries for this user (covering different date ranges)
    for (const key of cache.keys()) {
        if (key.startsWith(`${userId}:`)) {
            cache.delete(key)
        }
    }
    console.log(`📊 [Analytics] Cache invalidated for user: ${userId}`)
}

/**
 * Main analytics orchestration function
 * Fetches data from database, normalizes, and aggregates into all required formats
 */
export async function getAnalyticsData(userId: string, daysRange: number = 90): Promise<AnalyticsPayload> {
    // Check cache
    const cacheKey = `${userId}:${daysRange}`
    const cached = cache.get(cacheKey)

    if (cached && (Date.now() - cached.timestamp) < CACHE_TTL) {
        return cached.data
    }

    // Fetch raw data from database
    const cutoffDate = new Date()
    cutoffDate.setDate(cutoffDate.getDate() - daysRange)

    console.log('📊 [Analytics] Fetching weekly logs for user:', userId)
    console.log('📊 [Analytics] Cutoff date:', cutoffDate.toISOString())

    const weeklyLogs = await prisma.weeklyLog.findMany({
        where: {
            goal: {
                userId,
            },
            weekStartDate: {
                gte: cutoffDate,
            },
        },
        include: {
            goal: {
                select: {
                    id: true,
                    name: true,
                },
            },
        },
        orderBy: {
            weekStartDate: 'asc',
        },
    })

    console.log(`📊 [Analytics] Found ${weeklyLogs.length} weekly logs`)
    console.log('📊 [Analytics] Sample log:', weeklyLogs[0])

    // CRITICAL: Normalize weekly logs to daily records
    const dailyRecords = normalizeDailyRecords(weeklyLogs as any)

    console.log(`📊 [Analytics] Normalized to ${dailyRecords.length} daily records`)
    console.log('📊 [Analytics] Sample daily record:', dailyRecords[0])

    // Handle edge case: no data
    if (dailyRecords.length === 0) {
        console.log('📊 [Analytics] ⚠️ No daily records - returning empty payload')
        const emptyPayload: AnalyticsPayload = {
            dailyTrend: [],
            weeklyTrend: [],
            monthlyTrend: [],
            calendarHeatmap: [],
            timeOfWeekHeatmap: [],
            goalCompletionPie: [],
            targetVsActual: [],
            streakTimeline: [],
            longestStreaks: [],
            consistencyScore: { overall: 0, byGoal: {} },
            lifetimeStats: {
                totalCompletions: 0,
                totalDays: 0,
                overallRate: 0,
                goalsTracked: 0,
            },
        }

        cache.set(cacheKey, { data: emptyPayload, timestamp: Date.now() })
        return emptyPayload
    }

    // Aggregate into all required formats
    const dailyTrend = aggregateDaily(dailyRecords, 30)
    const weeklyTrend = aggregateWeekly(dailyRecords, 12)
    const monthlyTrend = aggregateMonthly(dailyRecords, 6)

    const calendarHeatmap = generateCalendarHeatmap(dailyRecords)
    const timeOfWeekHeatmap = generateTimeOfWeekHeatmap(dailyRecords)

    const streaks = calculateStreaks(dailyRecords)

    // Goal completion pie chart
    const goalCompletionPie = calculateGoalCompletionPie(dailyRecords)

    // Target vs Actual
    const targetVsActual = calculateTargetVsActual(dailyRecords)

    // Consistency score
    const consistencyScore = calculateConsistencyScore(dailyRecords)

    // Lifetime stats
    const lifetimeStats = calculateLifetimeStats(dailyRecords)

    const payload: AnalyticsPayload = {
        dailyTrend,
        weeklyTrend,
        monthlyTrend,
        calendarHeatmap,
        timeOfWeekHeatmap,
        goalCompletionPie,
        targetVsActual,
        streakTimeline: streaks,
        longestStreaks: streaks.slice(0, 5),
        consistencyScore,
        lifetimeStats,
    }

    console.log('📊 [Analytics] ✅ Final payload:')
    console.log('  - dailyTrend:', dailyTrend.length, 'points')
    console.log('  - weeklyTrend:', weeklyTrend.length, 'points')
    console.log('  - calendarHeatmap:', calendarHeatmap.length, 'cells')
    console.log('  - goalCompletionPie:', goalCompletionPie.length, 'goals')
    console.log('  - targetVsActual:', targetVsActual.length, 'points')

    // Cache the result
    cache.set(cacheKey, { data: payload, timestamp: Date.now() })

    return payload
}

/**
 * Helper: Calculate goal completion pie chart data
 */
function calculateGoalCompletionPie(dailyRecords: any[]): GoalCompletionData[] {
    const byGoal = new Map<string, { completed: number; total: number }>()

    for (const record of dailyRecords) {
        if (!byGoal.has(record.goalName)) {
            byGoal.set(record.goalName, { completed: 0, total: 0 })
        }

        const stats = byGoal.get(record.goalName)!
        stats.total++
        if (record.completed) stats.completed++
    }

    const colors = ['#6B7FB5', '#5AA49D', '#9077B0', '#5A9970', '#B87B63']
    let colorIndex = 0

    const result: GoalCompletionData[] = []

    for (const [goalName, stats] of byGoal.entries()) {
        result.push({
            name: goalName,
            value: Math.round((stats.completed / stats.total) * 100),
            color: colors[colorIndex % colors.length],
        })
        colorIndex++
    }

    return result
}

/**
 * Helper: Calculate target vs actual data
 */
function calculateTargetVsActual(dailyRecords: any[]): TargetVsActualPoint[] {
    const last30Days = dailyRecords.slice(-30)

    const byDate = new Map<string, { completed: number; total: number; target: number }>()

    for (const record of last30Days) {
        const dateKey = record.date.toISOString().split('T')[0]

        if (!byDate.has(dateKey)) {
            byDate.set(dateKey, { completed: 0, total: 0, target: 0 })
        }

        const stats = byDate.get(dateKey)!
        stats.total++
        stats.target = Math.max(stats.target, record.target)
        if (record.completed) stats.completed++
    }

    const result: TargetVsActualPoint[] = []

    for (const [dateKey, stats] of byDate.entries()) {
        const date = new Date(dateKey)
        result.push({
            date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
            target: stats.target,
            actual: stats.completed,
        })
    }

    return result.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
}

/**
 * Helper: Calculate consistency score
 */
function calculateConsistencyScore(dailyRecords: any[]): ConsistencyScore {
    const totalDays = new Set(dailyRecords.map(r => r.date.toISOString().split('T')[0])).size
    const completedDays = new Set(
        dailyRecords.filter(r => r.completed).map(r => r.date.toISOString().split('T')[0])
    ).size

    const overall = totalDays > 0 ? Math.round((completedDays / totalDays) * 100) : 0

    const byGoal: Record<string, number> = {}
    const goalRecords = new Map<string, { completed: number; total: number }>()

    for (const record of dailyRecords) {
        if (!goalRecords.has(record.goalName)) {
            goalRecords.set(record.goalName, { completed: 0, total: 0 })
        }

        const stats = goalRecords.get(record.goalName)!
        stats.total++
        if (record.completed) stats.completed++
    }

    for (const [goalName, stats] of goalRecords.entries()) {
        byGoal[goalName] = Math.round((stats.completed / stats.total) * 100)
    }

    return { overall, byGoal }
}

/**
 * Helper: Calculate lifetime statistics
 */
function calculateLifetimeStats(dailyRecords: any[]): LifetimeStats {
    const totalCompletions = dailyRecords.filter(r => r.completed).length
    const totalDays = new Set(dailyRecords.map(r => r.date.toISOString().split('T')[0])).size
    const goalsTracked = new Set(dailyRecords.map(r => r.goalId)).size
    const overallRate = dailyRecords.length > 0
        ? Math.round((totalCompletions / dailyRecords.length) * 100)
        : 0

    return {
        totalCompletions,
        totalDays,
        overallRate,
        goalsTracked,
    }
}


===== FILE: lib/analytics/normalizeDailyRecords.ts =====
import { DailyRecord } from './types'

interface WeeklyLog {
    id: string
    weekStartDate: Date
    weeklyTarget: number
    checkboxStates: boolean[]
    goal: {
        id: string
        name: string
    }
}

/**
 * CRITICAL DATA NORMALIZATION FUNCTION
 * Converts weekly logs with 7-day checkbox arrays into individual daily records
 * with exact calendar dates.
 */
export function normalizeDailyRecords(weeklyLogs: WeeklyLog[]): DailyRecord[] {
    const dailyRecords: DailyRecord[] = []

    for (const log of weeklyLogs) {
        const weekStart = new Date(log.weekStartDate)

        // Expand 7 checkbox states into 7 daily records
        for (let dayIndex = 0; dayIndex < 7; dayIndex++) {
            const date = new Date(weekStart)
            date.setDate(date.getDate() + dayIndex)

            dailyRecords.push({
                date,
                goalId: log.goal.id,
                goalName: log.goal.name,
                completed: log.checkboxStates[dayIndex] || false,
                target: log.weeklyTarget,
            })
        }
    }

    // Sort by date ascending
    return dailyRecords.sort((a, b) => a.date.getTime() - b.date.getTime())
}


===== FILE: lib/analytics/types.ts =====
// Analytics type definitions

export interface DailyRecord {
    date: Date
    goalId: string
    goalName: string
    completed: boolean
    target: number
}

export interface DailyTrendPoint {
    date: string
    completion: number
}

export interface WeeklyTrendPoint {
    week: string
    completion: number
}

export interface MonthlyTrendPoint {
    month: string
    completion: number
}

export interface HeatmapCell {
    day: string
    intensity: number
}

export interface GoalCompletionData {
    name: string
    value: number
    color: string
}

export interface TargetVsActualPoint {
    date: string
    target: number
    actual: number
}

export interface StreakData {
    goalName: string
    currentStreak: number
    longestStreak: number
    startDate: string | null
}

export interface TimeOfWeekCell {
    day: string
    goalName: string
    completion: number
}

export interface ConsistencyScore {
    overall: number
    byGoal: Record<string, number>
}

export interface LifetimeStats {
    totalCompletions: number
    totalDays: number
    overallRate: number
    goalsTracked: number
}

export interface AnalyticsPayload {
    dailyTrend: DailyTrendPoint[]
    weeklyTrend: WeeklyTrendPoint[]
    monthlyTrend: MonthlyTrendPoint[]
    calendarHeatmap: HeatmapCell[]
    timeOfWeekHeatmap: TimeOfWeekCell[]
    goalCompletionPie: GoalCompletionData[]
    targetVsActual: TargetVsActualPoint[]
    streakTimeline: StreakData[]
    longestStreaks: StreakData[]
    consistencyScore: ConsistencyScore
    lifetimeStats: LifetimeStats
}


===== FILE: lib/auth.ts =====
import { NextAuthOptions } from 'next-auth'
import GoogleProvider from 'next-auth/providers/google'
import { isEmailAllowed } from './whitelist'

export const authOptions: NextAuthOptions = {
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID!,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
        }),
    ],
    callbacks: {
        async signIn({ user, account }) {
            // Enforce whitelist
            if (!isEmailAllowed(user.email)) {
                console.log('Sign-in blocked for non-whitelisted email:', user.email)
                return false
            }
            console.log('Sign-in allowed for:', user.email)
            return true
        },
        async jwt({ token, user }) {
            if (user) {
                token.id = user.id
                token.email = user.email
            }
            return token
        },
        async session({ session, token }) {
            if (token && session.user) {
                session.user.id = token.id as string
                session.user.email = token.email as string
            }
            return session
        },
    },
    pages: {
        signIn: '/login',
        error: '/login',
    },
    session: {
        strategy: 'jwt',
        maxAge: 30 * 24 * 60 * 60, // 30 days
    },
}


===== FILE: lib/date-utils.ts =====
// Date utility functions for the habit tracker

// Get the Monday of the week for a given date
export function getWeekStart(date: Date): Date {
    const d = new Date(date)
    const day = d.getDay()
    const diff = d.getDate() - day + (day === 0 ? -6 : 1) // Adjust for Sunday
    d.setDate(diff)
    d.setHours(0, 0, 0, 0)
    return d
}

// Get the Sunday of the week for a given date
export function getWeekEnd(date: Date): Date {
    const weekStart = getWeekStart(date)
    const weekEnd = new Date(weekStart)
    weekEnd.setDate(weekStart.getDate() + 6)
    weekEnd.setHours(23, 59, 59, 999)
    return weekEnd
}

// Format date for display
export function formatDate(date: Date, format: 'short' | 'long' = 'short'): string {
    if (format === 'long') {
        return date.toLocaleDateString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        })
    }
    return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
    })
}

// Get array of dates for a week
export function getWeekDates(weekStart: Date): Date[] {
    const dates: Date[] = []
    for (let i = 0; i < 7; i++) {
        const date = new Date(weekStart)
        date.setDate(weekStart.getDate() + i)
        dates.push(date)
    }
    return dates
}

// Generate week ranges for analytics
export function generateWeekRanges(count: number, endDate: Date = new Date()): Date[] {
    const weeks: Date[] = []
    for (let i = 0; i < count; i++) {
        const date = new Date(endDate)
        date.setDate(endDate.getDate() - (i * 7))
        weeks.push(getWeekStart(date))
    }
    return weeks.reverse()
}

// Get ISO week number
export function getISOWeek(date: Date): number {
    const d = new Date(date)
    d.setHours(0, 0, 0, 0)
    d.setDate(d.getDate() + 4 - (d.getDay() || 7))
    const yearStart = new Date(d.getFullYear(), 0, 1)
    const weekNo = Math.ceil((((d.getTime() - yearStart.getTime()) / 86400000) + 1) / 7)
    return weekNo
}


===== FILE: lib/db.ts =====
import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as {
    prisma: PrismaClient | undefined
}

export const prisma = globalForPrisma.prisma ?? new PrismaClient()

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma


===== FILE: lib/graph-colors.ts =====
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


===== FILE: lib/whitelist.ts =====
// Whitelist configuration for allowed users
export const ALLOWED_EMAILS = [
    'nandini.zunder@gmail.com',
    'arnav.nishant.deshpande@gmail.com',
] as const

export type AllowedEmail = typeof ALLOWED_EMAILS[number]

// Check if email is whitelisted
export function isEmailAllowed(email: string | null | undefined): boolean {
    if (!email) return false
    return ALLOWED_EMAILS.includes(email as AllowedEmail)
}

// Special user check for custom landing page
export const SPECIAL_USER_EMAIL = 'nandini.zunder@gmail.com'

export function isSpecialUser(email: string | null | undefined): boolean {
    return email === SPECIAL_USER_EMAIL
}


===== FILE: next-env.d.ts =====
/// <reference types="next" />
/// <reference types="next/image-types/global" />

// NOTE: This file should not be edited
// see https://nextjs.org/docs/app/building-your-application/configuring/typescript for more information.


===== FILE: prisma/schema.prisma =====
// This is your Prisma schema file
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

model User {
  id        String   @id @default(cuid())
  email     String   @unique
  name      String?
  image     String?
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  goals       Goal[]
  weeklyLogs  WeeklyLog[]
  notes       Note[]
  accounts    Account[]
  sessions    Session[]

  @@map("users")
}

model Account {
  id                String  @id @default(cuid())
  userId            String
  type              String
  provider          String
  providerAccountId String
  refresh_token     String? @db.Text
  access_token      String? @db.Text
  expires_at        Int?
  token_type        String?
  scope             String?
  id_token          String? @db.Text
  session_state     String?

  user User @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@unique([provider, providerAccountId])
  @@map("accounts")
}

model Session {
  id           String   @id @default(cuid())
  sessionToken String   @unique
  userId       String
  expires      DateTime
  user         User     @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@map("sessions")
}

model VerificationToken {
  identifier String
  token      String   @unique
  expires    DateTime

  @@unique([identifier, token])
  @@map("verification_tokens")
}

model Goal {
  id                   String      @id @default(cuid())
  userId               String
  name                 String
  defaultWeeklyTarget  Int         @default(7)
  isArchived           Boolean     @default(false)
  createdAt            DateTime    @default(now())
  updatedAt            DateTime    @updatedAt

  user                 User        @relation(fields: [userId], references: [id], onDelete: Cascade)
  weeklyLogs           WeeklyLog[]

  @@index([userId, isArchived])
  @@map("goals")
}

model WeeklyLog {
  id              String   @id @default(cuid())
  userId          String
  goalId          String
  weekStartDate   DateTime
  weeklyTarget    Int      @default(7)
  checkboxStates  Json     @default("[]") // Array of 7 booleans for Mon-Sun
  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt

  user            User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  goal            Goal     @relation(fields: [goalId], references: [id], onDelete: Cascade)

  @@unique([userId, goalId, weekStartDate])
  @@index([userId, weekStartDate])
  @@index([goalId, weekStartDate])
  @@map("weekly_logs")
}

model Note {
  id            String    @id @default(cuid())
  userId        String
  content       String    @db.Text
  linkedWeekId  String?
  linkedGoalId  String?
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt

  user          User      @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@index([userId])
  @@map("notes")
}


===== FILE: README.md =====
# Private Habit & Life Analytics Tracker

A premium, whitelist-only habit tracking web application with interactive analytics and continuous timeline tracking.

## 🌟 Features

- **Premium UI/UX**: Glass morphism design, smooth animations, and vibrant color palette
- **Interactive Landing Page**: WebGL particle system for special user (Nandini)
- **Continuous Timeline**: No resets - infinite scroll through historical data
- **Flexible Goal System**: User-defined goals with customizable weekly targets
- **Real-time Progress**: Live progress bars and completion calculations
- **Floating Notes**: Draggable, auto-saving notes system
- **Advanced Analytics**: 23 auto-generated graph types including:
  - Time Trends (Daily, Weekly, Monthly, Yearly, Rolling Averages)
  - Goal Comparisons (Weekly, Monthly, Stacked)
  - Consistency Metrics (Streaks, Miss Frequency, Radar Charts)
  - Distribution (Pie Charts, Scatter Plots)
  - Heatmaps (Calendar, Weekly Density, Time-of-Week)
  - Premium Insights (Momentum, Stability, Lifetime Cumulative)

## 🔐 Authentication

- **Google OAuth** only
- **Whitelist restricted** to:
  - nandini.zunder@gmail.com
  - arnav.nishant.deshpande@gmail.com

## 🛠 Tech Stack

- **Frontend**: Next.js 14, React, TypeScript, Tailwind CSS, Framer Motion
- **Graphics**: Three.js, Recharts
- **Backend**: Next.js API Routes
- **Database**: PostgreSQL with Prisma ORM
- **Auth**: NextAuth.js

## 🚀 Setup

1. **Clone and install**:
   ```bash
   cd Val
   npm install --legacy-peer-deps
   ```

2. **Set up environment variables**:
   Copy `.env.local.example` to `.env.local` and fill in:
   - `DATABASE_URL`: PostgreSQL connection string
   - `GOOGLE_CLIENT_ID`: From Google Cloud Console
   - `GOOGLE_CLIENT_SECRET`: From Google Cloud Console
   - `NEXTAUTH_SECRET`: Generate with `openssl rand -base64 32`
   - `NEXTAUTH_URL`: `http://localhost:3000` for local dev

3. **Set up database**:
   ```bash
   npx prisma generate
   npx prisma db push
   ```

4. **Run development server**:
   ```bash
   npm run dev
   ```

5. **Open**: [http://localhost:3000](http://localhost:3000)

## 📊 Usage

1. Sign in with whitelisted Google account
2. Add goals from the sidebar (goal name + weekly target)
3. Check off daily completions in the timeline
4. View analytics dashboard for insights
5. Take notes with floating notes feature

## 🗄 Database Schema

- **Users**: Email, authentication data
- **Goals**: User-defined goals with default targets
- **WeeklyLogs**: Checkbox states (7 days) per goal per week
- **Notes**: User notes with optional linking

## 📝 Development Notes

- Continuous timeline (no weekly resets)
- All graphs use mock data - implement real aggregation in `lib/analytics.ts`
- Interactive background optimized for 60fps
- Prisma migrations in `prisma/` directory

## 🎨 Design Philosophy

- Soft, calm color palette
- Premium glass morphism effects
- Smooth animations throughout
- Data-rich, analytics-heavy interface
- Mobile responsive

## 📜 License

Private project - not for public use

---

Built with ❤️ for personal habit tracking


