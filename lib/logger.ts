type LogLevel = 'info' | 'warn' | 'error'

interface LogEntry {
    timestamp: string
    level: LogLevel
    message: string
    context?: any
    error?: any
}

function formatLog(level: LogLevel, message: string, context?: any, error?: any): string {
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
    logInfo: (message: string, context?: any) => {
        console.log(formatLog('info', message, context))
    },
    logWarn: (message: string, context?: any) => {
        console.warn(formatLog('warn', message, context))
    },
    logError: (message: string, error?: any, context?: any) => {
        console.error(formatLog('error', message, context, error))
    }
}
