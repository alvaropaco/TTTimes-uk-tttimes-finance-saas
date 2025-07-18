type LogLevel = "debug" | "info" | "warn" | "error"

interface LogContext {
  userId?: string
  requestId?: string
  apiKey?: string
  endpoint?: string
  [key: string]: any
}

class Logger {
  private isDevelopment = process.env.NODE_ENV === "development"

  private formatMessage(level: LogLevel, message: string, context?: LogContext): string {
    const timestamp = new Date().toISOString()
    const contextStr = context ? ` | Context: ${JSON.stringify(context)}` : ""
    return `[${timestamp}] [${level.toUpperCase()}] ${message}${contextStr}`
  }

  debug(message: string, context?: LogContext): void {
    if (this.isDevelopment) {
      console.debug(this.formatMessage("debug", message, context))
    }
  }

  info(message: string, context?: LogContext): void {
    console.info(this.formatMessage("info", message, context))
  }

  warn(message: string, context?: LogContext): void {
    console.warn(this.formatMessage("warn", message, context))
  }

  error(message: string, error?: Error, context?: LogContext): void {
    const errorContext = error ? { ...context, error: error.message, stack: error.stack } : context
    console.error(this.formatMessage("error", message, errorContext))
  }

  // API-specific logging methods
  apiRequest(method: string, endpoint: string, context?: LogContext): void {
    this.info(`API Request: ${method} ${endpoint}`, context)
  }

  apiResponse(method: string, endpoint: string, statusCode: number, duration: number, context?: LogContext): void {
    this.info(`API Response: ${method} ${endpoint} - ${statusCode} (${duration}ms)`, context)
  }

  authEvent(event: string, context?: LogContext): void {
    this.info(`Auth Event: ${event}`, context)
  }

  securityEvent(event: string, context?: LogContext): void {
    this.warn(`Security Event: ${event}`, context)
  }
}

export const logger = new Logger()

// Request logging middleware helper
export function createRequestLogger(req: Request) {
  const requestId = crypto.randomUUID()
  const startTime = Date.now()

  return {
    requestId,
    log: (message: string, context?: LogContext) => {
      logger.info(message, { ...context, requestId })
    },
    logResponse: (statusCode: number, context?: LogContext) => {
      const duration = Date.now() - startTime
      logger.apiResponse(
        req.method,
        new URL(req.url).pathname,
        statusCode,
        duration,
        { ...context, requestId }
      )
    },
  }
}