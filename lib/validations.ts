import { z } from 'zod'

export const idSchema = z.string().cuid()

export const goalSchema = z.object({
    name: z.string().min(1).max(100),
    weeklyTarget: z.number().int().min(1).max(7),
    symbol: z.string().max(10).optional().nullable(),
    activeFrom: z.string().datetime().or(z.date()).optional(),
})

export const weeklyLogSchema = z.object({
    goalId: z.string().cuid(),
    weekStartDate: z.string().datetime().or(z.date()),
    weeklyTarget: z.number().int().min(1).max(7),
    checkboxStates: z.array(z.boolean()).length(7),
    requestId: z.string().optional(),
    expectedUpdatedAt: z.string().datetime().optional().nullable(),
})

export const migraineEntrySchema = z.object({
    date: z.string().datetime().or(z.date()),
    severity: z.number().int().min(0).max(10),
    foodBefore: z.string().max(1000).optional().nullable(),
    foodAfterDay1: z.string().max(1000).optional().nullable(),
    foodAfterDay2: z.string().max(1000).optional().nullable(),
    foodAfterDay3: z.string().max(1000).optional().nullable(),
})

export const projectEntrySchema = z.object({
    projectName: z.string().min(1).max(200),
    projectDescription: z.string().min(1),
    projectType: z.string().max(50).optional(),
    techStack: z.string().max(500).optional(),
    targetAudience: z.string().max(500).optional(),
    uniqueSellingPoint: z.string().max(500).optional(),
    status: z.string().max(50).optional(),
})
