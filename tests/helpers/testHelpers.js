/**
 * Helpers para testes - Centraliza funções comuns
 */

const request = require('supertest');

// Configurações centralizadas
const TEST_CONFIG = {
  BASE_URL: 'http://localhost:3000',
  VALID_TOKEN: 'ttf_1a5510af655ba1a7ac9daa90d9244048be9f82b61a6e3382670f2102e4565da3',
  INVALID_TOKEN: 'invalid_token_123',
  TIMEOUT: 30000
};

// Helper para headers de autenticação
const authHeader = (token) => ({
  'Authorization': `Bearer ${token}`
});

// Helper para requisições autenticadas
const authenticatedRequest = (app, token = TEST_CONFIG.VALID_TOKEN) => {
  return request(app).set(authHeader(token));
};

// Helper para validar estrutura de resposta da API
const validateApiResponse = (response, expectedStatus = 200) => {
  expect(response.status).toBe(expectedStatus);
  if (expectedStatus === 200) {
    expect(response.body).toHaveProperty('success');
    expect(response.body).toHaveProperty('data');
  }
};

// Helper para validar estrutura de erro
const validateErrorResponse = (response, expectedStatus = 400) => {
  expect(response.status).toBe(expectedStatus);
  expect(response.body).toHaveProperty('error');
  expect(response.body.success).toBe(false);
};

// Helper para gerar dados de teste únicos
const generateTestData = () => ({
  email: `test${Date.now()}@example.com`,
  name: `Test User ${Date.now()}`,
  plan: 'free'
});

// Helper para aguardar com timeout
const waitFor = (ms) => new Promise(resolve => setTimeout(resolve, ms));

module.exports = {
  TEST_CONFIG,
  authHeader,
  authenticatedRequest,
  validateApiResponse,
  validateErrorResponse,
  generateTestData,
  waitFor
};