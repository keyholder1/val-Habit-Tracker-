import { NextRequest, NextResponse } from 'next/server'

/** Shared type for Next.js API route handlers wrapped by middleware (rate limit, timeout, etc.) */
export type RouteHandler = (req: NextRequest, context?: Record<string, unknown>) => Promise<NextResponse | Response>
