/**
 * Sistema de monitoramento e métricas para APIs
 */

interface ApiMetrics {
  endpoint: string;
  method: string;
  statusCode: number;
  responseTime: number;
  timestamp: Date;
  userId?: string;
  error?: string;
}

class MetricsCollector {
  private metrics: ApiMetrics[] = [];
  private readonly maxMetrics = 1000; // Limite para evitar vazamento de memória

  // Registra uma métrica
  record(metric: ApiMetrics) {
    this.metrics.push(metric);
    
    // Remove métricas antigas se exceder o limite
    if (this.metrics.length > this.maxMetrics) {
      this.metrics = this.metrics.slice(-this.maxMetrics);
    }
  }

  // Obtém estatísticas por endpoint
  getEndpointStats(endpoint: string) {
    const endpointMetrics = this.metrics.filter(m => m.endpoint === endpoint);
    
    if (endpointMetrics.length === 0) {
      return null;
    }

    const responseTimes = endpointMetrics.map(m => m.responseTime);
    const statusCodes = endpointMetrics.reduce((acc, m) => {
      acc[m.statusCode] = (acc[m.statusCode] || 0) + 1;
      return acc;
    }, {} as Record<number, number>);

    return {
      totalRequests: endpointMetrics.length,
      averageResponseTime: responseTimes.reduce((a, b) => a + b, 0) / responseTimes.length,
      minResponseTime: Math.min(...responseTimes),
      maxResponseTime: Math.max(...responseTimes),
      statusCodeDistribution: statusCodes,
      errorRate: (endpointMetrics.filter(m => m.statusCode >= 400).length / endpointMetrics.length) * 100
    };
  }

  // Obtém métricas gerais
  getOverallStats() {
    if (this.metrics.length === 0) {
      return null;
    }

    const last24h = this.metrics.filter(
      m => Date.now() - m.timestamp.getTime() < 24 * 60 * 60 * 1000
    );

    return {
      totalRequests: this.metrics.length,
      requestsLast24h: last24h.length,
      averageResponseTime: this.metrics.reduce((sum, m) => sum + m.responseTime, 0) / this.metrics.length,
      errorRate: (this.metrics.filter(m => m.statusCode >= 400).length / this.metrics.length) * 100,
      topEndpoints: this.getTopEndpoints(),
      recentErrors: this.getRecentErrors()
    };
  }

  private getTopEndpoints() {
    const endpointCounts = this.metrics.reduce((acc, m) => {
      acc[m.endpoint] = (acc[m.endpoint] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return Object.entries(endpointCounts)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 10)
      .map(([endpoint, count]) => ({ endpoint, count }));
  }

  private getRecentErrors() {
    return this.metrics
      .filter(m => m.statusCode >= 400)
      .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
      .slice(0, 10)
      .map(m => ({
        endpoint: m.endpoint,
        statusCode: m.statusCode,
        error: m.error,
        timestamp: m.timestamp
      }));
  }
}

// Instância global do coletor de métricas
export const metricsCollector = new MetricsCollector();

// Middleware para coletar métricas automaticamente
export const metricsMiddleware = (endpoint: string, method: string) => {
  return (handler: Function) => {
    return async (...args: any[]) => {
      const startTime = Date.now();
      let statusCode = 200;
      let error: string | undefined;

      try {
        const result = await handler(...args);
        return result;
      } catch (err) {
        statusCode = 500;
        error = err instanceof Error ? err.message : 'Unknown error';
        throw err;
      } finally {
        const responseTime = Date.now() - startTime;
        
        metricsCollector.record({
          endpoint,
          method,
          statusCode,
          responseTime,
          timestamp: new Date(),
          error
        });
      }
    };
  };
};