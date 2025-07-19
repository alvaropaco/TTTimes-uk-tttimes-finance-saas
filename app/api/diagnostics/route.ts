import { NextResponse } from "next/server"
import { logger } from "@/lib/logger"
import { cache, exchangeRateCache } from "@/lib/cache"
import { metricsCollector } from "@/lib/metrics"

// Force dynamic rendering
export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    // Coleta informações de diagnóstico
    const diagnostics = {
      timestamp: new Date().toISOString(),
      service: "TTTimes Finance API",
      version: "1.0.0",
      uptime: process.uptime(),
      
      // Estatísticas de logs
      logs: logger.getLogStats(),
      
      // Estatísticas de cache
      cache: {
        main: cache.getStats(),
        exchangeRates: exchangeRateCache.getStats()
      },
      
      // Métricas de API
      metrics: metricsCollector.getOverallStats(),
      
      // Informações do sistema
      system: {
        nodeVersion: process.version,
        platform: process.platform,
        memory: {
          used: Math.round(process.memoryUsage().heapUsed / 1024 / 1024), // MB
          total: Math.round(process.memoryUsage().heapTotal / 1024 / 1024), // MB
          external: Math.round(process.memoryUsage().external / 1024 / 1024), // MB
          rss: Math.round(process.memoryUsage().rss / 1024 / 1024) // MB
        },
        cpu: {
          usage: process.cpuUsage()
        }
      },
      
      // Logs recentes de erro
      recentErrors: logger.getRecentLogs("error", 10),
      
      // Top endpoints por métricas
      topEndpoints: metricsCollector.getOverallStats()?.topEndpoints || []
    }

    return NextResponse.json(diagnostics)
  } catch (error) {
    logger.error("Failed to generate diagnostics", error instanceof Error ? error : new Error(String(error)))
    
    return NextResponse.json(
      { 
        error: "Failed to generate diagnostics",
        timestamp: new Date().toISOString()
      }, 
      { status: 500 }
    )
  }
}