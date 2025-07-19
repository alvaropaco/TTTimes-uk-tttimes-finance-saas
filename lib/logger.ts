type LogLevel = "debug" | "info" | "warn" | "error"

interface LogContext {
  userId?: string
  requestId?: string
  apiKey?: string
  endpoint?: string
  responseTime?: number
  statusCode?: number
  cacheHit?: boolean
  dbOperation?: string
  [key: string]: any
}

interface LogEntry {
  timestamp: string
  level: LogLevel
  message: string
  context?: LogContext
  error?: {
    name: string
    message: string
    stack?: string
  }
}

class Logger {
  private isDevelopment = process.env.NODE_ENV === "development"
  private logs: LogEntry[] = []
  private readonly maxLogs = 1000

  private formatMessage(level: LogLevel, message: string, context?: LogContext): string {
    const timestamp = new Date().toISOString()
    
    if (this.isDevelopment) {
      // Formato mais legível para desenvolvimento
      const contextStr = context ? ` | ${JSON.stringify(context)}` : ""
      return `[${timestamp}] [${level.toUpperCase()}] ${message}${contextStr}`
    } else {
      // JSON estruturado para produção
      const entry: LogEntry = {
        timestamp,
        level,
        message,
        context
      }
      return JSON.stringify(entry)
    }
  }

  private storeLog(level: LogLevel, message: string, context?: LogContext, error?: Error): void {
    const entry: LogEntry = {
      timestamp: new Date().toISOString(),
      level,
      message,
      context,
      error: error ? {
        name: error.name,
        message: error.message,
        stack: error.stack
      } : undefined
    }

    this.logs.push(entry)
    
    // Mantém apenas os últimos logs para evitar vazamento de memória
    if (this.logs.length > this.maxLogs) {
      this.logs = this.logs.slice(-this.maxLogs)
    }
  }

  debug(message: string, context?: LogContext): void {
    this.storeLog("debug", message, context)
    if (this.isDevelopment) {
      console.debug(this.formatMessage("debug", message, context))
    }
  }

  info(message: string, context?: LogContext): void {
    this.storeLog("info", message, context)
    console.info(this.formatMessage("info", message, context))
  }

  warn(message: string, context?: LogContext): void {
    this.storeLog("warn", message, context)
    console.warn(this.formatMessage("warn", message, context))
  }

  error(message: string, error?: Error, context?: LogContext): void {
    this.storeLog("error", message, context, error)
    const errorContext = error ? { ...context, error: error.message, stack: error.stack } : context
    console.error(this.formatMessage("error", message, errorContext))
  }

  // API-specific logging methods
  apiRequest(method: string, endpoint: string, context?: LogContext): void {
    this.info(`API Request: ${method} ${endpoint}`, context)
  }

  apiResponse(method: string, endpoint: string, statusCode: number, duration: number, context?: LogContext): void {
    const level = statusCode >= 400 ? "error" : "info"
    const message = `API Response: ${method} ${endpoint} - ${statusCode} (${duration}ms)`
    
    if (level === "error") {
      this.error(message, undefined, { ...context, statusCode, responseTime: duration })
    } else {
      this.info(message, { ...context, statusCode, responseTime: duration })
    }
  }

  authEvent(event: string, context?: LogContext): void {
    this.info(`Auth Event: ${event}`, context)
  }

  securityEvent(event: string, context?: LogContext): void {
    this.warn(`Security Event: ${event}`, context)
  }

  cacheEvent(operation: 'hit' | 'miss' | 'set' | 'delete', key: string, context?: LogContext): void {
    this.debug(`Cache ${operation}: ${key}`, { ...context, cacheOperation: operation, cacheKey: key })
  }

  dbEvent(operation: string, collection?: string, duration?: number, context?: LogContext): void {
    this.debug(`DB ${operation}${collection ? ` on ${collection}` : ''}${duration ? ` (${duration}ms)` : ''}`, {
      ...context,
      dbOperation: operation,
      collection,
      duration
    })
  }

  // Obtém logs recentes para debugging
  getRecentLogs(level?: LogLevel, limit = 100): LogEntry[] {
    let filteredLogs = this.logs
    
    if (level) {
      filteredLogs = this.logs.filter(log => log.level === level)
    }
    
    return filteredLogs.slice(-limit)
  }

  // Obtém estatísticas dos logs
  getLogStats(): { total: number; byLevel: Record<LogLevel, number>; errors: LogEntry[] } {
    const byLevel = this.logs.reduce((acc, log) => {
      acc[log.level] = (acc[log.level] || 0) + 1
      return acc
    }, {} as Record<LogLevel, number>)

    const errors = this.logs.filter(log => log.level === "error").slice(-10)

    return {
      total: this.logs.length,
      byLevel,
      errors
    }
  }

  // Limpa logs antigos
  clearLogs(): void {
    this.logs = []
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
    logError: (error: Error, context?: LogContext) => {
      const duration = Date.now() - startTime
      logger.error(
        `Request failed: ${req.method} ${new URL(req.url).pathname}`,
        error,
        { ...context, requestId, responseTime: duration }
      )
    }
  }
}

// Middleware para logging automático
export const loggingMiddleware = (endpoint: string, method: string) => {
  return (handler: Function) => {
    return async (request: Request, ...args: any[]) => {
      const requestLogger = createRequestLogger(request)
      
      try {
        requestLogger.log(`Incoming request`, {
          method,
          endpoint,
          userAgent: request.headers.get('user-agent'),
          ip: request.headers.get('x-forwarded-for') || 'unknown'
        })

        const result = await handler(request, ...args)
        const statusCode = result?.status || 200
        
        requestLogger.logResponse(statusCode)
        return result
      } catch (error) {
        requestLogger.logError(error instanceof Error ? error : new Error(String(error)))
        throw error
      }
    }
  }
}
