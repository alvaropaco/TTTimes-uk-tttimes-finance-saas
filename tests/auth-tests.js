/**
 * Testes Específicos de Autenticação
 * Testes detalhados para endpoints de signin/signup
 */

const { TestUtils } = require('./api-tests');

const BASE_URL = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

class AuthenticationTester {
  constructor() {
    this.results = { total: 0, passed: 0, failed: 0, errors: [] };
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

  async testSignupValidation() {
    TestUtils.section('TESTES DE VALIDAÇÃO DO SIGNUP');

    // Teste com email inválido
    await this.runTest('Signup - Email inválido', async () => {
      const response = await TestUtils.makeRequest('/api/signup', {
        method: 'POST',
        body: JSON.stringify({
          name: 'Test User',
          email: 'invalid-email',
          plan: 'free'
        })
      });

      if (response.status !== 400) {
        throw new Error(`Status esperado 400, recebido ${response.status}`);
      }
    });

    // Teste com nome vazio
    await this.runTest('Signup - Nome vazio', async () => {
      const response = await TestUtils.makeRequest('/api/signup', {
        method: 'POST',
        body: JSON.stringify({
          name: '',
          email: 'test@example.com',
          plan: 'free'
        })
      });

      if (response.status !== 400) {
        throw new Error(`Status esperado 400, recebido ${response.status}`);
      }
    });

    // Teste com plano inválido
    await this.runTest('Signup - Plano inválido', async () => {
      const response = await TestUtils.makeRequest('/api/signup', {
        method: 'POST',
        body: JSON.stringify({
          name: 'Test User',
          email: 'test@example.com',
          plan: 'invalid_plan'
        })
      });

      if (response.status !== 400) {
        throw new Error(`Status esperado 400, recebido ${response.status}`);
      }
    });

    // Teste com dados válidos
    await this.runTest('Signup - Dados válidos', async () => {
      const timestamp = Date.now();
      const response = await TestUtils.makeRequest('/api/signup', {
        method: 'POST',
        body: JSON.stringify({
          name: `Test User ${timestamp}`,
          email: `test${timestamp}@example.com`,
          plan: 'free'
        })
      });

      if (response.status !== 200 && response.status !== 201) {
        throw new Error(`Status esperado 200/201, recebido ${response.status}`);
      }

      if (!response.data || !response.data.success) {
        throw new Error('Resposta de signup inválida');
      }
    });
  }

  async testSigninValidation() {
    TestUtils.section('TESTES DE VALIDAÇÃO DO SIGNIN');

    // Teste com email vazio
    await this.runTest('Signin - Email vazio', async () => {
      const response = await TestUtils.makeRequest('/api/signin', {
        method: 'POST',
        body: JSON.stringify({
          email: '',
          password: 'password123'
        })
      });

      if (response.status !== 400) {
        throw new Error(`Status esperado 400, recebido ${response.status}`);
      }
    });

    // Teste com senha vazia
    await this.runTest('Signin - Senha vazia', async () => {
      const response = await TestUtils.makeRequest('/api/signin', {
        method: 'POST',
        body: JSON.stringify({
          email: 'test@example.com',
          password: ''
        })
      });

      if (response.status !== 400) {
        throw new Error(`Status esperado 400, recebido ${response.status}`);
      }
    });

    // Teste com credenciais inexistentes
    await this.runTest('Signin - Credenciais inexistentes', async () => {
      const response = await TestUtils.makeRequest('/api/signin', {
        method: 'POST',
        body: JSON.stringify({
          email: 'nonexistent@example.com',
          password: 'wrongpassword'
        })
      });

      if (response.status !== 401 && response.status !== 404) {
        throw new Error(`Status esperado 401/404, recebido ${response.status}`);
      }
    });
  }

  async testTokenValidation() {
    TestUtils.section('TESTES DE VALIDAÇÃO DE TOKEN');

    // Teste com token malformado
    await this.runTest('Token malformado', async () => {
      const response = await TestUtils.makeRequest('/api/example', {
        headers: { 'Authorization': 'Bearer invalid_token_format' }
      });

      if (response.status !== 401) {
        throw new Error(`Status esperado 401, recebido ${response.status}`);
      }
    });

    // Teste sem header Authorization
    await this.runTest('Sem header Authorization', async () => {
      const response = await TestUtils.makeRequest('/api/example');

      if (response.status !== 401) {
        throw new Error(`Status esperado 401, recebido ${response.status}`);
      }
    });

    // Teste com token demo válido
    await this.runTest('Token demo válido', async () => {
      const response = await TestUtils.makeRequest('/api/example', {
        headers: TestUtils.createAuthHeaders('demo_token')
      });

      if (response.status !== 200) {
        throw new Error(`Status esperado 200, recebido ${response.status}`);
      }
    });
  }

  async testSecurityHeaders() {
    TestUtils.section('TESTES DE HEADERS DE SEGURANÇA');

    const endpoints = ['/api/signin', '/api/signup', '/api/example'];

    for (const endpoint of endpoints) {
      await this.runTest(`Headers de segurança - ${endpoint}`, async () => {
        const response = await TestUtils.makeRequest(endpoint, {
          method: 'OPTIONS'
        });

        // Verifica headers CORS
        const requiredHeaders = [
          'access-control-allow-origin',
          'access-control-allow-methods',
          'access-control-allow-headers'
        ];

        for (const header of requiredHeaders) {
          if (!response.headers[header]) {
            throw new Error(`Header de segurança ausente: ${header}`);
          }
        }
      });
    }
  }

  async runAllTests() {
    TestUtils.section('INICIANDO TESTES DE AUTENTICAÇÃO');
    
    const startTime = Date.now();

    await this.testSignupValidation();
    await this.testSigninValidation();
    await this.testTokenValidation();
    await this.testSecurityHeaders();

    const endTime = Date.now();
    const duration = (endTime - startTime) / 1000;

    this.generateReport(duration);
  }

  generateReport(duration) {
    TestUtils.section('RELATÓRIO DE TESTES DE AUTENTICAÇÃO');
    
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
  }
}

// Executar testes se o arquivo for executado diretamente
if (require.main === module) {
  const tester = new AuthenticationTester();
  tester.runAllTests().catch(console.error);
}

module.exports = { AuthenticationTester };
