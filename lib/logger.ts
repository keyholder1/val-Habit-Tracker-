type LogLevel = 'info' | 'warn' | 'error'

interface LogEntry {
    timestamp: string
    level: LogLevel
    message: string
    context?: unknown
    error?: unknown
}

function formatLog(level: LogLevel, message: string, context?: unknown, error?: unknown): string {
    const entry: LogEntry = {
        timestamp: new Date().toISOString(),
        level,
        message,
        context,
        error: error instanceof Error ? {
            name: error.name,
            message: error.message,
            stack: error.stack
        } : error
    }

    return JSON.stringify(entry)
}

export const logger = {
    logInfo: (message: string, context?: unknown) => {
        console.log(formatLog('info', message, context))
    },
    logWarn: (message: string, context?: unknown) => {
        console.warn(formatLog('warn', message, context))
    },
    logError: (message: string, error?: unknown, context?: unknown) => {
        console.error(formatLog('error', message, context, error))
    }
}
