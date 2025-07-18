/**
 * Testes de Performance e Carga
 * Testes para verificar performance e comportamento sob carga
 */

const { TestUtils } = require('./api-tests');

const BASE_URL = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

class PerformanceTester {
  constructor() {
    this.results = { total: 0, passed: 0, failed: 0, errors: [] };
    this.performanceData = [];
  }

  async runTest(testName, testFunction) {
    this.results.total++;
    TestUtils.info(`Executando: ${testName}`);
    
    try {
      await testFunction();
      this.results.passed++;
      TestUtils.success(`${testName} - PASSOU`);
    } catch (error) {
      this.results.failed++;
      this.results.errors.push({ test: testName, error: error.message });
      TestUtils.error(`${testName} - FALHOU: ${error.message}`);
    }
  }

  async measureResponseTime(endpoint, options = {}) {
    const startTime = Date.now();
    const response = await TestUtils.makeRequest(endpoint, options);
    const endTime = Date.now();
    const responseTime = endTime - startTime;

    return {
      responseTime,
      status: response.status,
      success: response.status >= 200 && response.status < 300
    };
  }

  async testResponseTimes() {
    TestUtils.section('TESTES DE TEMPO DE RESPOSTA');

    const endpoints = [
      { path: '/api/health', name: 'Health Check' },
      { path: '/api/example', name: 'Example API', headers: TestUtils.createAuthHeaders('demo_token') },
      { path: '/api/dashboard/subscription', name: 'Dashboard Subscription', headers: TestUtils.createAuthHeaders('demo_token') },
      { path: '/api/translation-cache', name: 'Translation Cache', headers: TestUtils.createAuthHeaders('demo_token') }
    ];

    for (const endpoint of endpoints) {
      await this.runTest(`Tempo de resposta - ${endpoint.name}`, async () => {
        const measurements = [];
        const iterations = 5;

        for (let i = 0; i < iterations; i++) {
          const result = await this.measureResponseTime(endpoint.path, {
            headers: endpoint.headers || {}
          });
          measurements.push(result.responseTime);
          
          if (!result.success && result.status !== 401) {
            throw new Error(`Falha na requisição: status ${result.status}`);
          }
          
          // Pequena pausa entre requisições
          await TestUtils.sleep(100);
        }

        const avgTime = measurements.reduce((a, b) => a + b, 0) / measurements.length;
        const maxTime = Math.max(...measurements);
        const minTime = Math.min(...measurements);

        this.performanceData.push({
          endpoint: endpoint.name,
          avgTime,
          maxTime,
          minTime,
          measurements
        });

        TestUtils.info(`  Tempo médio: ${avgTime.toFixed(2)}ms`);
        TestUtils.info(`  Tempo mín/máx: ${minTime}ms / ${maxTime}ms`);

        // Falha se o tempo médio for muito alto (> 5 segundos)
        if (avgTime > 5000) {
          throw new Error(`Tempo de resposta muito alto: ${avgTime.toFixed(2)}ms`);
        }
      });
    }
  }

  async testConcurrentRequests() {
    TestUtils.section('TESTES DE REQUISIÇÕES CONCORRENTES');

    await this.runTest('Requisições concorrentes - 10 simultâneas', async () => {
      const concurrentRequests = 10;
      const promises = [];

      const startTime = Date.now();

      for (let i = 0; i < concurrentRequests; i++) {
        promises.push(
          TestUtils.makeRequest('/api/example', {
            headers: TestUtils.createAuthHeaders('demo_token')
          })
        );
      }

      const responses = await Promise.all(promises);
      const endTime = Date.now();
      const totalTime = endTime - startTime;

      const successfulResponses = responses.filter(r => r.status === 200);
      const failedResponses = responses.filter(r => r.status !== 200);

      TestUtils.info(`  Tempo total: ${totalTime}ms`);
      TestUtils.info(`  Sucessos: ${successfulResponses.length}/${concurrentRequests}`);
      TestUtils.info(`  Falhas: ${failedResponses.length}/${concurrentRequests}`);

      // Pelo menos 80% das requisições devem ser bem-sucedidas
      const successRate = (successfulResponses.length / concurrentRequests) * 100;
      if (successRate < 80) {
        throw new Error(`Taxa de sucesso muito baixa: ${successRate.toFixed(1)}%`);
      }
    });

    await this.runTest('Requisições concorrentes - 25 simultâneas', async () => {
      const concurrentRequests = 25;
      const promises = [];

      for (let i = 0; i < concurrentRequests; i++) {
        promises.push(
          TestUtils.makeRequest('/api/health')
        );
      }

      const responses = await Promise.all(promises);
      const successfulResponses = responses.filter(r => r.status === 200);

      const successRate = (successfulResponses.length / concurrentRequests) * 100;
      TestUtils.info(`  Taxa de sucesso: ${successRate.toFixed(1)}%`);

      if (successRate < 90) {
        throw new Error(`Taxa de sucesso muito baixa para health check: ${successRate.toFixed(1)}%`);
      }
    });
  }

  async testMemoryUsage() {
    TestUtils.section('TESTES DE USO DE MEMÓRIA');

    await this.runTest('Múltiplas requisições sequenciais', async () => {
      const iterations = 50;
      const responseTimes = [];

      for (let i = 0; i < iterations; i++) {
        const startTime = Date.now();
        const response = await TestUtils.makeRequest('/api/example', {
          headers: TestUtils.createAuthHeaders('demo_token')
        });
        const endTime = Date.now();

        if (response.status !== 200) {
          throw new Error(`Falha na requisição ${i + 1}: status ${response.status}`);
        }

        responseTimes.push(endTime - startTime);

        // Pequena pausa para simular uso real
        await TestUtils.sleep(50);
      }

      // Verifica se há degradação significativa de performance
      const firstQuarter = responseTimes.slice(0, Math.floor(iterations / 4));
      const lastQuarter = responseTimes.slice(-Math.floor(iterations / 4));

      const avgFirst = firstQuarter.reduce((a, b) => a + b, 0) / firstQuarter.length;
      const avgLast = lastQuarter.reduce((a, b) => a + b, 0) / lastQuarter.length;

      TestUtils.info(`  Tempo médio inicial: ${avgFirst.toFixed(2)}ms`);
      TestUtils.info(`  Tempo médio final: ${avgLast.toFixed(2)}ms`);

      // Falha se houver degradação > 100%
      const degradation = ((avgLast - avgFirst) / avgFirst) * 100;
      if (degradation > 100) {
        throw new Error(`Degradação de performance detectada: ${degradation.toFixed(1)}%`);
      }
    });
  }

  async testLargePayloads() {
    TestUtils.section('TESTES COM PAYLOADS GRANDES');

    await this.runTest('POST com payload grande', async () => {
      // Cria um payload de ~10KB
      const largeText = 'A'.repeat(10000);
      
      const startTime = Date.now();
      const response = await TestUtils.makeRequest('/api/example', {
        method: 'POST',
        headers: TestUtils.createAuthHeaders('demo_token'),
        body: JSON.stringify({
          message: largeText,
          timestamp: new Date().toISOString(),
          metadata: {
            size: largeText.length,
            test: 'large_payload'
          }
        })
      });
      const endTime = Date.now();

      if (response.status !== 200) {
        throw new Error(`Status esperado 200, recebido ${response.status}`);
      }

      const responseTime = endTime - startTime;
      TestUtils.info(`  Tempo de resposta: ${responseTime}ms`);

      // Falha se demorar mais de 10 segundos
      if (responseTime > 10000) {
        throw new Error(`Tempo de resposta muito alto para payload grande: ${responseTime}ms`);
      }
    });

    await this.runTest('Tradução com texto grande', async () => {
      const largeText = 'Hello world. '.repeat(500); // ~6KB de texto
      
      const response = await TestUtils.makeRequest('/api/translate', {
        method: 'POST',
        headers: {
          ...TestUtils.createAuthHeaders('demo_token'),
          'lang': 'pt'
        },
        body: JSON.stringify({
          text: largeText,
          target_language: 'pt'
        })
      });

      // Aceita tanto sucesso quanto erro de configuração
      if (response.status !== 200 && response.status !== 500 && response.status !== 400) {
        throw new Error(`Status inesperado: ${response.status}`);
      }

      TestUtils.info(`  Status: ${response.status} (OK para teste de payload)`);
    });
  }

  async testErrorRecovery() {
    TestUtils.section('TESTES DE RECUPERAÇÃO DE ERROS');

    await this.runTest('Recuperação após erro 401', async () => {
      // Primeiro, faz uma requisição que deve falhar
      const failResponse = await TestUtils.makeRequest('/api/example', {
        headers: TestUtils.createAuthHeaders('invalid_token')
      });

      if (failResponse.status !== 401) {
        throw new Error(`Status esperado 401, recebido ${failResponse.status}`);
      }

      // Depois, faz uma requisição que deve funcionar
      const successResponse = await TestUtils.makeRequest('/api/example', {
        headers: TestUtils.createAuthHeaders('demo_token')
      });

      if (successResponse.status !== 200) {
        throw new Error(`Falha na recuperação: status ${successResponse.status}`);
      }
    });

    await this.runTest('Múltiplos erros seguidos de sucesso', async () => {
      // Faz várias requisições que devem falhar
      for (let i = 0; i < 5; i++) {
        await TestUtils.makeRequest('/api/example', {
          headers: TestUtils.createAuthHeaders('invalid_token')
        });
      }

      // Depois faz uma que deve funcionar
      const response = await TestUtils.makeRequest('/api/example', {
        headers: TestUtils.createAuthHeaders('demo_token')
      });

      if (response.status !== 200) {
        throw new Error(`Sistema não se recuperou após múltiplos erros: status ${response.status}`);
      }
    });
  }

  async runAllTests() {
    TestUtils.section('INICIANDO TESTES DE PERFORMANCE');
    
    const startTime = Date.now();

    await this.testResponseTimes();
    await this.testConcurrentRequests();
    await this.testMemoryUsage();
    await this.testLargePayloads();
    await this.testErrorRecovery();

    const endTime = Date.now();
    const duration = (endTime - startTime) / 1000;

    this.generateReport(duration);
  }

  generateReport(duration) {
    TestUtils.section('RELATÓRIO DE PERFORMANCE');
    
    const passRate = ((this.results.passed / this.results.total) * 100).toFixed(1);
    
    TestUtils.info(`Total de testes: ${this.results.total}`);
    TestUtils.success(`Testes aprovados: ${this.results.passed}`);
    TestUtils.error(`Testes falharam: ${this.results.failed}`);
    TestUtils.info(`Taxa de aprovação: ${passRate}%`);
    TestUtils.info(`Duração: ${duration}s`);

    if (this.performanceData.length > 0) {
      TestUtils.section('DADOS DE PERFORMANCE');
      this.performanceData.forEach(data => {
        TestUtils.info(`${data.endpoint}:`);
        TestUtils.info(`  Tempo médio: ${data.avgTime.toFixed(2)}ms`);
        TestUtils.info(`  Tempo mín/máx: ${data.minTime}ms / ${data.maxTime}ms`);
      });
    }

    if (this.results.errors.length > 0) {
      TestUtils.section('ERROS DETALHADOS');
      this.results.errors.forEach((error, index) => {
        TestUtils.error(`${index + 1}. ${error.test}: ${error.error}`);
      });
    }
  }
}

// Executar testes se o arquivo for executado diretamente
if (require.main === module) {
  const tester = new PerformanceTester();
  tester.runAllTests().catch(console.error);
}

module.exports = { PerformanceTester };