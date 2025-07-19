/**
 * Sistema de cache inteligente com TTL e invalidação automática
 */

interface CacheEntry<T> {
  data: T;
  timestamp: number;
  ttl: number;
  hits: number;
}

interface CacheStats {
  totalEntries: number;
  totalHits: number;
  totalMisses: number;
  hitRate: number;
  memoryUsage: number;
}

class IntelligentCache {
  private cache = new Map<string, CacheEntry<any>>();
  private stats = {
    hits: 0,
    misses: 0
  };
  private readonly maxSize: number;
  private readonly defaultTTL: number;

  constructor(maxSize = 1000, defaultTTL = 5 * 60 * 1000) { // 5 minutos padrão
    this.maxSize = maxSize;
    this.defaultTTL = defaultTTL;
    
    // Limpeza automática a cada 5 minutos
    setInterval(() => this.cleanup(), 5 * 60 * 1000);
  }

  // Obtém um item do cache
  get<T>(key: string): T | null {
    const entry = this.cache.get(key);
    
    if (!entry) {
      this.stats.misses++;
      return null;
    }

    // Verifica se expirou
    if (Date.now() - entry.timestamp > entry.ttl) {
      this.cache.delete(key);
      this.stats.misses++;
      return null;
    }

    // Incrementa contador de hits
    entry.hits++;
    this.stats.hits++;
    
    return entry.data;
  }

  // Define um item no cache
  set<T>(key: string, data: T, ttl?: number): void {
    const actualTTL = ttl || this.defaultTTL;
    
    // Remove entradas antigas se necessário
    if (this.cache.size >= this.maxSize) {
      this.evictLeastUsed();
    }

    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      ttl: actualTTL,
      hits: 0
    });
  }

  // Remove um item do cache
  delete(key: string): boolean {
    return this.cache.delete(key);
  }

  // Limpa itens expirados
  private cleanup(): void {
    const now = Date.now();
    const keysToDelete: string[] = [];

    for (const [key, entry] of this.cache.entries()) {
      if (now - entry.timestamp > entry.ttl) {
        keysToDelete.push(key);
      }
    }

    keysToDelete.forEach(key => this.cache.delete(key));
  }

  // Remove o item menos usado quando o cache está cheio
  private evictLeastUsed(): void {
    let leastUsedKey = '';
    let leastHits = Infinity;

    for (const [key, entry] of this.cache.entries()) {
      if (entry.hits < leastHits) {
        leastHits = entry.hits;
        leastUsedKey = key;
      }
    }

    if (leastUsedKey) {
      this.cache.delete(leastUsedKey);
    }
  }

  // Obtém estatísticas do cache
  getStats(): CacheStats {
    const totalRequests = this.stats.hits + this.stats.misses;
    const hitRate = totalRequests > 0 ? (this.stats.hits / totalRequests) * 100 : 0;
    
    // Estima uso de memória (aproximado)
    const memoryUsage = JSON.stringify([...this.cache.entries()]).length;

    return {
      totalEntries: this.cache.size,
      totalHits: this.stats.hits,
      totalMisses: this.stats.misses,
      hitRate: Math.round(hitRate * 100) / 100,
      memoryUsage
    };
  }

  // Limpa todo o cache
  clear(): void {
    this.cache.clear();
    this.stats.hits = 0;
    this.stats.misses = 0;
  }

  // Obtém ou define com função de fallback
  async getOrSet<T>(
    key: string, 
    fallback: () => Promise<T>, 
    ttl?: number
  ): Promise<T> {
    const cached = this.get<T>(key);
    
    if (cached !== null) {
      return cached;
    }

    const data = await fallback();
    this.set(key, data, ttl);
    return data;
  }
}

// Instância global do cache
export const cache = new IntelligentCache();

// Cache específico para taxas de câmbio (TTL mais longo)
export const exchangeRateCache = new IntelligentCache(500, 15 * 60 * 1000); // 15 minutos

// Utilitários para chaves de cache
export const CacheKeys = {
  exchangeRate: (from: string, to: string) => `exchange_rate:${from}:${to}`,
  supportedCurrencies: () => 'supported_currencies',
  userProfile: (userId: string) => `user_profile:${userId}`,
  apiKeyValidation: (apiKey: string) => `api_key:${apiKey}`,
  conversionHistory: (userId: string, page: number) => `conversion_history:${userId}:${page}`
};

// Middleware para cache automático de respostas
export const cacheMiddleware = (
  cacheInstance: IntelligentCache = cache,
  keyGenerator: (...args: any[]) => string,
  ttl?: number
) => {
  return (handler: Function) => {
    return async (...args: any[]) => {
      const cacheKey = keyGenerator(...args);
      
      // Tenta obter do cache primeiro
      const cached = cacheInstance.get(cacheKey);
      if (cached !== null) {
        return cached;
      }

      // Executa a função e armazena no cache
      const result = await handler(...args);
      cacheInstance.set(cacheKey, result, ttl);
      
      return result;
    };
  };
};