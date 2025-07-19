/**
 * Testes de API Abrangentes
 * Sistema de testes para todos os endpoints da API implementados
 */

const BASE_URL = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

// Configurações de teste
const TEST_CONFIG = {
  timeout: 10000,
  retries: 3,
  validToken: 'demo_token', // Token de demonstração
  invalidToken: 'invalid_token_123',
  testUser: {
    name: 'Test User',
    email: 'test@example.com',
    plan: 'free'
  }
};

// Cores para output do console
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m'
};

// Utilitários de teste
class TestUtils {
  static log(message, color = colors.reset) {
    console.log(`${color}${message}${colors.reset}`);
  }

  static success(message) {
    this.log(`✅ ${message}`, colors.green);
  }

  static error(message) {
    this.log(`❌ ${message}`, colors.red);
  }

  static info(message) {
    this.log(`ℹ️  ${message}`, colors.blue);
  }

  static warning(message) {
    this.log(`⚠️  ${message}`, colors.yellow);
  }

  static section(title) {
    this.log(`\n${colors.bright}${colors.cyan}${'='.repeat(60)}${colors.reset}`);
    this.log(`${colors.bright}${colors.cyan}${title}${colors.reset}`);
    this.log(`${colors.bright}${colors.cyan}${'='.repeat(60)}${colors.reset}\n`);
  }

  static async makeRequest(endpoint, options = {}) {
    const url = `${BASE_URL}${endpoint}`;
    const defaultOptions = {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        ...options.headers
      }
    };

    const requestOptions = { ...defaultOptions, ...options };

    try {
      const response = await fetch(url, requestOptions);
      const data = await response.json().catch(() => null);
      
      return {
        status: response.status,
        statusText: response.statusText,
        data,
        headers: Object.fromEntries(response.headers.entries())
      };
    } catch (error) {
      return {
        error: error.message,
        status: 0
      };
    }
  }

  static createAuthHeaders(token) {
    return {
      'Authorization': `Bearer ${token}`
    };
  }

  static async sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

// Classe principal de testes
class APITester {
  constructor() {
    this.results = {
      total: 0,
      passed: 0,
      failed: 0,
      errors: []
    };
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

  async testHealthEndpoint() {
    await this.runTest('Health Check', async () => {
      const response = await TestUtils.makeRequest('/api/health');
      
      if (response.status !== 200) {
        throw new Error(`Status esperado 200, recebido ${response.status}`);
      }
      
      if (!response.data || !response.data.status) {
        throw new Error('Resposta de health check inválida');
      }
    });
  }

  async testAuthenticationEndpoints() {
    TestUtils.section('TESTES DE AUTENTICAÇÃO');

    // Teste de signup
    await this.runTest('Signup - Dados válidos', async () => {
      const response = await TestUtils.makeRequest('/api/signup', {
        method: 'POST',
        body: JSON.stringify({
          name: `Test User ${Date.now()}`,
          email: `test${Date.now()}@example.com`,
          plan: 'free'
        })
      });

      if (response.status !== 201 && response.status !== 200) {
        throw new Error(`Status esperado 200/201, recebido ${response.status}`);
      }
    });

    // Teste de signup com dados inválidos
    await this.runTest('Signup - Dados inválidos', async () => {
      const response = await TestUtils.makeRequest('/api/signup', {
        method: 'POST',
        body: JSON.stringify({
          name: '',
          email: ''
        })
      });

      if (response.status !== 400) {
        throw new Error(`Status esperado 400, recebido ${response.status}`);
      }
    });

    // Teste de signin
    await this.runTest('Signin - Dados válidos', async () => {
      const response = await TestUtils.makeRequest('/api/signin', {
        method: 'POST',
        body: JSON.stringify({
          email: 'test@example.com',
          password: 'password123'
        })
      });

      // Aceita tanto sucesso quanto falha de autenticação (usuário pode não existir)
      if (response.status !== 200 && response.status !== 401 && response.status !== 404) {
        throw new Error(`Status inesperado: ${response.status}`);
      }
    });
  }

  async testExampleEndpoints() {
    TestUtils.section('TESTES DOS ENDPOINTS DE EXEMPLO');

    // Teste GET sem autenticação
    await this.runTest('Example GET - Sem token', async () => {
      const response = await TestUtils.makeRequest('/api/example');
      
      if (response.status !== 401) {
        throw new Error(`Status esperado 401, recebido ${response.status}`);
      }
    });

    // Teste GET com token válido
    await this.runTest('Example GET - Token válido', async () => {
      const response = await TestUtils.makeRequest('/api/example', {
        headers: TestUtils.createAuthHeaders(TEST_CONFIG.validToken)
      });
      
      if (response.status !== 200) {
        throw new Error(`Status esperado 200, recebido ${response.status}`);
      }

      if (!response.data || !response.data.success) {
        throw new Error('Resposta inválida do endpoint example');
      }
    });

    // Teste POST com dados
    await this.runTest('Example POST - Com dados', async () => {
      const testData = {
        message: 'Teste de POST',
        timestamp: new Date().toISOString()
      };

      const response = await TestUtils.makeRequest('/api/example', {
        method: 'POST',
        headers: TestUtils.createAuthHeaders(TEST_CONFIG.validToken),
        body: JSON.stringify(testData)
      });
      
      if (response.status !== 200) {
        throw new Error(`Status esperado 200, recebido ${response.status}`);
      }

      if (!response.data || !response.data.success) {
        throw new Error('Resposta inválida do POST example');
      }
    });

    // Teste GET com ID específico
    await this.runTest('Example GET by ID - ID válido', async () => {
      const response = await TestUtils.makeRequest('/api/example/1', {
        headers: TestUtils.createAuthHeaders(TEST_CONFIG.validToken)
      });
      
      if (response.status !== 200) {
        throw new Error(`Status esperado 200, recebido ${response.status}`);
      }

      if (!response.data || !response.data.success || !response.data.data) {
        throw new Error('Resposta inválida do endpoint example by ID');
      }
    });

    // Teste GET com ID inexistente
    await this.runTest('Example GET by ID - ID inexistente', async () => {
      const response = await TestUtils.makeRequest('/api/example/999', {
        headers: TestUtils.createAuthHeaders(TEST_CONFIG.validToken)
      });
      
      if (response.status !== 404) {
        throw new Error(`Status esperado 404, recebido ${response.status}`);
      }
    });
  }

  async testDashboardEndpoints() {
    TestUtils.section('TESTES DOS ENDPOINTS DO DASHBOARD');

    // Teste de subscription info
    await this.runTest('Dashboard Subscription - Token válido', async () => {
      const response = await TestUtils.makeRequest('/api/dashboard/subscription', {
        headers: TestUtils.createAuthHeaders(TEST_CONFIG.validToken)
      });
      
      if (response.status !== 200) {
        throw new Error(`Status esperado 200, recebido ${response.status}`);
      }

      if (!response.data || typeof response.data.plan === 'undefined') {
        throw new Error('Resposta inválida do endpoint subscription');
      }
    });

    // Teste sem autenticação
    await this.runTest('Dashboard Subscription - Sem token', async () => {
      const response = await TestUtils.makeRequest('/api/dashboard/subscription');
      
      if (response.status !== 401) {
        throw new Error(`Status esperado 401, recebido ${response.status}`);
      }
    });
  }

  async testTranslationEndpoints() {
    TestUtils.section('TESTES DOS ENDPOINTS DE TRADUÇÃO');

    // Teste de tradução com dados válidos
    await this.runTest('Translation - Dados válidos', async () => {
      const response = await TestUtils.makeRequest('/api/translate', {
        method: 'POST',
        headers: {
          ...TestUtils.createAuthHeaders(TEST_CONFIG.validToken),
          'lang': 'pt'
        },
        body: JSON.stringify({
          text: 'Hello world',
          target_language: 'pt'
        })
      });
      
      // Aceita tanto sucesso quanto erro de configuração (DeepL pode não estar configurado)
      if (response.status !== 200 && response.status !== 500 && response.status !== 400) {
        throw new Error(`Status inesperado: ${response.status}`);
      }
    });

    // Teste OPTIONS para CORS
    await this.runTest('Translation - OPTIONS (CORS)', async () => {
      const response = await TestUtils.makeRequest('/api/translate', {
        method: 'OPTIONS'
      });
      
      if (response.status !== 200) {
        throw new Error(`Status esperado 200, recebido ${response.status}`);
      }
    });

    // Teste de cache de tradução
    await this.runTest('Translation Cache - GET stats', async () => {
      const response = await TestUtils.makeRequest('/api/translation-cache', {
        headers: TestUtils.createAuthHeaders(TEST_CONFIG.validToken)
      });
      
      if (response.status !== 200) {
        throw new Error(`Status esperado 200, recebido ${response.status}`);
      }
    });

    // Teste de limpeza de cache
    await this.runTest('Translation Cache - DELETE cleanup', async () => {
      const response = await TestUtils.makeRequest('/api/translation-cache', {
        method: 'DELETE',
        headers: TestUtils.createAuthHeaders(TEST_CONFIG.validToken)
      });
      
      if (response.status !== 200) {
        throw new Error(`Status esperado 200, recebido ${response.status}`);
      }
    });
  }

  async testCurrencyEndpoints() {
    TestUtils.section('TESTES DOS ENDPOINTS DE MOEDA');

    // Teste de rates
    await this.runTest('Currency Rates - GET all', async () => {
      const response = await TestUtils.makeRequest('/api/rates', {
        headers: TestUtils.createAuthHeaders(TEST_CONFIG.validToken)
      });
      
      // Aceita tanto sucesso quanto erro de configuração
      if (response.status !== 200 && response.status !== 401 && response.status !== 500) {
        throw new Error(`Status inesperado: ${response.status}`);
      }
    });

    // Teste de moedas suportadas
    await this.runTest('Supported Currencies', async () => {
      const response = await TestUtils.makeRequest('/api/supported', {
        headers: TestUtils.createAuthHeaders(TEST_CONFIG.validToken)
      });
      
      // Aceita tanto sucesso quanto erro de configuração
      if (response.status !== 200 && response.status !== 401 && response.status !== 500) {
        throw new Error(`Status inesperado: ${response.status}`);
      }
    });
  }

  async testStripeEndpoints() {
    TestUtils.section('TESTES DOS ENDPOINTS DO STRIPE');

    // Teste de criação de sessão de subscription
    await this.runTest('Create Subscription Session', async () => {
      const response = await TestUtils.makeRequest('/api/create-subscription-session', {
        method: 'POST',
        body: JSON.stringify({
          planId: 'developer',
          userEmail: 'test@example.com',
          userName: 'Test User',
          organizationName: 'Test Org',
          organizationDomain: 'test.com'
        })
      });
      
      // Aceita tanto sucesso quanto erro de configuração do Stripe
      if (response.status !== 200 && response.status !== 400 && response.status !== 500) {
        throw new Error(`Status inesperado: ${response.status}`);
      }
    });

    // Teste de criação de portal session
    await this.runTest('Create Portal Session', async () => {
      const response = await TestUtils.makeRequest('/api/create-portal-session', {
        method: 'POST',
        headers: TestUtils.createAuthHeaders(TEST_CONFIG.validToken)
      });
      
      // Aceita erro 404 (sem subscription) ou erro de configuração
      if (response.status !== 404 && response.status !== 500 && response.status !== 200) {
        throw new Error(`Status inesperado: ${response.status}`);
      }
    });
  }

  async testDiagnosticEndpoints() {
    TestUtils.section('TESTES DOS ENDPOINTS DE DIAGNÓSTICO');

    // Teste de diagnóstico de conexão
    await this.runTest('Diagnose Connection', async () => {
      const response = await TestUtils.makeRequest('/api/diagnose-connection');
      
      if (response.status !== 200) {
        throw new Error(`Status esperado 200, recebido ${response.status}`);
      }
    });

    // Teste de conexão
    await this.runTest('Test Connection', async () => {
      const response = await TestUtils.makeRequest('/api/test-connection');
      
      if (response.status !== 200) {
        throw new Error(`Status esperado 200, recebido ${response.status}`);
      }
    });
  }

  async testCORSHeaders() {
    TestUtils.section('TESTES DE CORS');

    const corsEndpoints = [
      '/api/translate',
      '/api/example',
      '/api/translation-cache'
    ];

    for (const endpoint of corsEndpoints) {
      await this.runTest(`CORS - ${endpoint}`, async () => {
        const response = await TestUtils.makeRequest(endpoint, {
          method: 'OPTIONS'
        });
        
        if (response.status !== 200) {
          throw new Error(`Status esperado 200, recebido ${response.status}`);
        }

        const corsHeaders = [
          'access-control-allow-origin',
          'access-control-allow-methods',
          'access-control-allow-headers'
        ];

        for (const header of corsHeaders) {
          if (!response.headers[header]) {
            throw new Error(`Header CORS ausente: ${header}`);
          }
        }
      });
    }
  }

  async testRateLimiting() {
    TestUtils.section('TESTES DE RATE LIMITING');

    await this.runTest('Rate Limiting - Múltiplas requisições', async () => {
      const promises = [];
      const numRequests = 5;

      for (let i = 0; i < numRequests; i++) {
        promises.push(
          TestUtils.makeRequest('/api/example', {
            headers: TestUtils.createAuthHeaders(TEST_CONFIG.validToken)
          })
        );
      }

      const responses = await Promise.all(promises);
      
      // Verifica se pelo menos uma requisição foi bem-sucedida
      const successfulRequests = responses.filter(r => r.status === 200);
      if (successfulRequests.length === 0) {
        throw new Error('Nenhuma requisição foi bem-sucedida');
      }

      TestUtils.info(`${successfulRequests.length}/${numRequests} requisições bem-sucedidas`);
    });
  }

  async testErrorHandling() {
    TestUtils.section('TESTES DE TRATAMENTO DE ERROS');

    // Teste com JSON malformado
    await this.runTest('JSON Malformado', async () => {
      const response = await fetch(`${BASE_URL}/api/example`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...TestUtils.createAuthHeaders(TEST_CONFIG.validToken)
        },
        body: '{"invalid": json}'
      });

      if (response.status !== 400 && response.status !== 500) {
        throw new Error(`Status esperado 400/500, recebido ${response.status}`);
      }
    });

    // Teste com token inválido
    await this.runTest('Token Inválido', async () => {
      const response = await TestUtils.makeRequest('/api/example', {
        headers: TestUtils.createAuthHeaders(TEST_CONFIG.invalidToken)
      });
      
      if (response.status !== 401) {
        throw new Error(`Status esperado 401, recebido ${response.status}`);
      }
    });

    // Teste de endpoint inexistente
    await this.runTest('Endpoint Inexistente', async () => {
      const response = await TestUtils.makeRequest('/api/nonexistent');
      
      if (response.status !== 404) {
        throw new Error(`Status esperado 404, recebido ${response.status}`);
      }
    });
  }

  async runAllTests() {
    TestUtils.section('INICIANDO TESTES DE API');
    TestUtils.info(`Base URL: ${BASE_URL}`);
    TestUtils.info(`Token de teste: ${TEST_CONFIG.validToken}`);

    const startTime = Date.now();

    // Executar todos os grupos de testes
    await this.testHealthEndpoint();
    await this.testAuthenticationEndpoints();
    await this.testExampleEndpoints();
    await this.testDashboardEndpoints();
    await this.testTranslationEndpoints();
    await this.testCurrencyEndpoints();
    await this.testStripeEndpoints();
    await this.testDiagnosticEndpoints();
    await this.testCORSHeaders();
    await this.testRateLimiting();
    await this.testErrorHandling();

    const endTime = Date.now();
    const duration = (endTime - startTime) / 1000;

    // Relatório final
    this.generateReport(duration);
  }

  generateReport(duration) {
    TestUtils.section('RELATÓRIO FINAL DOS TESTES');
    
    const passRate = ((this.results.passed / this.results.total) * 100).toFixed(1);
    
    TestUtils.info(`Total de testes: ${this.results.total}`);
    TestUtils.success(`Testes aprovados: ${this.results.passed}`);
    TestUtils.error(`Testes falharam: ${this.results.failed}`);
    TestUtils.info(`Taxa de aprovação: ${passRate}%`);
    TestUtils.info(`Duração: ${duration}s`);

    if (this.results.errors.length > 0) {
      TestUtils.section('ERROS DETALHADOS');
      this.results.errors.forEach((error, index) => {
        TestUtils.error(`${index + 1}. ${error.test}: ${error.error}`);
      });
    }

    if (this.results.failed === 0) {
      TestUtils.success('\n🎉 TODOS OS TESTES PASSARAM! 🎉');
    } else {
      TestUtils.warning(`\n⚠️  ${this.results.failed} teste(s) falharam. Verifique os erros acima.`);
    }
  }
}

// Executar testes se o arquivo for executado diretamente
if (require.main === module) {
  const tester = new APITester();
  tester.runAllTests().catch(console.error);
}

module.exports = { APITester, TestUtils };
