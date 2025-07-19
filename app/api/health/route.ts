import { NextResponse } from "next/server"
import connectDB from "@/lib/mongodb"
import { metricsCollector } from "@/lib/metrics"

interface HealthCheck {
  status: 'healthy' | 'degraded' | 'unhealthy';
  timestamp: string;
  service: string;
  version: string;
  uptime: number;
  checks: {
    database: {
      status: 'up' | 'down';
      responseTime?: number;
      error?: string;
    };
    memory: {
      used: number;
      total: number;
      percentage: number;
    };
    metrics?: {
      totalRequests: number;
      errorRate: number;
      averageResponseTime: number;
    };
  };
}

export async function GET() {
  const startTime = Date.now();
  
  try {
    const healthCheck: HealthCheck = {
      status: 'healthy',
      timestamp: new Date().toISOString(),
      service: "TTTimes Finance API",
      version: "1.0.0",
      uptime: process.uptime(),
      checks: {
        database: { status: 'down' },
        memory: {
          used: 0,
          total: 0,
          percentage: 0
        }
      }
    };

    // Verificação do banco de dados
    try {
      const dbStart = Date.now();
      await connectDB();
      const dbResponseTime = Date.now() - dbStart;
      
      healthCheck.checks.database = {
        status: 'up',
        responseTime: dbResponseTime
      };
    } catch (dbError) {
      healthCheck.status = 'degraded';
      healthCheck.checks.database = {
        status: 'down',
        error: dbError instanceof Error ? dbError.message : 'Database connection failed'
      };
    }

    // Verificação de memória
    const memUsage = process.memoryUsage();
    healthCheck.checks.memory = {
      used: Math.round(memUsage.heapUsed / 1024 / 1024), // MB
      total: Math.round(memUsage.heapTotal / 1024 / 1024), // MB
      percentage: Math.round((memUsage.heapUsed / memUsage.heapTotal) * 100)
    };

    // Verificação de métricas (se disponível)
    try {
      const overallStats = metricsCollector.getOverallStats();
      if (overallStats) {
        healthCheck.checks.metrics = {
          totalRequests: overallStats.totalRequests,
          errorRate: Math.round(overallStats.errorRate * 100) / 100,
          averageResponseTime: Math.round(overallStats.averageResponseTime * 100) / 100
        };

        // Marca como degradado se taxa de erro for muito alta
        if (overallStats.errorRate > 10) {
          healthCheck.status = 'degraded';
        }
      }
    } catch (metricsError) {
      // Métricas são opcionais, não afeta o status geral
    }

    // Determina o status HTTP baseado no status da saúde
    const httpStatus = healthCheck.status === 'healthy' ? 200 : 
                      healthCheck.status === 'degraded' ? 200 : 503;

    return NextResponse.json(healthCheck, { status: httpStatus });

  } catch (error) {
    const errorResponse: HealthCheck = {
      status: 'unhealthy',
      timestamp: new Date().toISOString(),
      service: "TTTimes Finance API",
      version: "1.0.0",
      uptime: process.uptime(),
      checks: {
        database: { 
          status: 'down',
          error: error instanceof Error ? error.message : 'Unknown error'
        },
        memory: {
          used: 0,
          total: 0,
          percentage: 0
        }
      }
    };

    return NextResponse.json(errorResponse, { status: 503 });
  }
}