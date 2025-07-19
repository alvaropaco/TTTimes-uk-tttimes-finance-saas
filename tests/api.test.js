const request = require('supertest');
const { describe, it, expect, beforeAll, afterAll } = require('@jest/globals');

const BASE_URL = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

// Helper function to create auth headers
const authHeader = (token) => ({ Authorization: `Bearer ${token}` });

const validToken = 'ttf_rrk5kmfro1sepohjtswkww';
const invalidToken = 'invalid_token_123';

// Jest test suite

describe('API Endpoints', () => {
  // Health check
  it('Health Check - should return status 200 and valid response', async () => {
    const res = await request(BASE_URL).get('/api/health');
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('status');
  });

  // Authentication tests
  describe('Authentication Endpoints', () => {
    it('Signup - valid data should succeed', async () => {
      const res = await request(BASE_URL).post('/api/signup').send({
        name: `Test User ${Date.now()}`,
        email: `test${Date.now()}@example.com`,
        plan: 'free'
      });
      expect([200, 201]).toContain(res.status);
    });

    it('Signup - invalid data should return 400', async () => {
      const res = await request(BASE_URL).post('/api/signup').send({
        name: '',
        email: ''
      });
      expect(res.status).toBe(400);
    });

    it('Signin - valid data should return 200 or 401 or 404', async () => {
      const res = await request(BASE_URL).post('/api/signin').send({
        email: 'test@example.com',
        password: 'password123'
      });
      expect([200, 401, 404]).toContain(res.status);
    });
  });

  // Currency endpoints (principais endpoints da aplicação)
  describe('Currency Endpoints', () => {
    it('GET /api/supported should return supported currencies', async () => {
      const res = await request(BASE_URL).get('/api/supported').set(authHeader(validToken));
      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('success', true);
      expect(res.body).toHaveProperty('data');
      expect(Array.isArray(res.body.data)).toBe(true);
    });

    it('GET /api/rates should return exchange rates', async () => {
      const res = await request(BASE_URL).get('/api/rates').set(authHeader(validToken));
      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('success', true);
      expect(res.body).toHaveProperty('data');
    });

    it('GET /api/convert should convert currency correctly', async () => {
      const res = await request(BASE_URL)
        .get('/api/convert?from=USD&to=EUR&amount=100')
        .set(authHeader(validToken));
      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('success', true);
      expect(res.body.data).toHaveProperty('from', 'USD');
      expect(res.body.data).toHaveProperty('to', 'EUR');
      expect(res.body.data).toHaveProperty('amount', 100);
      expect(res.body.data).toHaveProperty('result');
      expect(res.body.data).toHaveProperty('rate');
    });

    it('GET /api/convert without auth should return 401', async () => {
      const res = await request(BASE_URL).get('/api/convert?from=USD&to=EUR&amount=100');
      expect(res.status).toBe(401);
    });

    it('GET /api/convert with invalid currency should return error', async () => {
      const res = await request(BASE_URL)
        .get('/api/convert?from=INVALID&to=EUR&amount=100')
        .set(authHeader(validToken));
      expect(res.status).toBe(400);
      expect(res.body).toHaveProperty('success', false);
    });

    it('GET /api/rate/USD should return USD rate', async () => {
      const res = await request(BASE_URL).get('/api/rate/USD').set(authHeader(validToken));
      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('success', true);
      expect(res.body.data).toHaveProperty('currency', 'USD');
    });
  });

  // Dashboard endpoints
  describe('Dashboard Endpoints', () => {
    it('GET /api/dashboard/subscription with valid token should return 200 or 401', async () => {
      const res = await request(BASE_URL).get('/api/dashboard/subscription').set(authHeader(validToken));
      expect([200, 401]).toContain(res.status);
      if (res.status === 200) {
        expect(res.body.plan).toBeDefined();
      }
    });

    it('GET /api/dashboard/subscription without token should return 401 or 307 (redirect)', async () => {
      const res = await request(BASE_URL).get('/api/dashboard/subscription');
      expect([401, 307]).toContain(res.status);
    });
  });

  // Rate limiting test
  describe('Rate Limiting', () => {
    it('Multiple requests should respect rate limits', async () => {
      const numRequests = 5;
      const requests = [];
      for (let i = 0; i < numRequests; i++) {
        requests.push(request(BASE_URL).get('/api/supported').set(authHeader(validToken)));
      }
      const responses = await Promise.all(requests);
      
      // Pelo menos uma requisição deve ser bem-sucedida
      const successful = responses.filter(r => r.status === 200);
      expect(successful.length).toBeGreaterThan(0);
      
      // Verifica se alguma requisição foi limitada (429) ou todas passaram
      const rateLimited = responses.filter(r => r.status === 429);
      expect(rateLimited.length + successful.length).toBe(numRequests);
    });
  });

  // Error handling tests
  describe('Error Handling', () => {
    it('Invalid endpoint should return 404', async () => {
      const res = await request(BASE_URL).get('/api/nonexistent');
      expect(res.status).toBe(404);
    });

    it('Invalid token should return 401 or 500', async () => {
      const res = await request(BASE_URL).get('/api/supported').set(authHeader(invalidToken));
      expect([401, 500]).toContain(res.status);
    });
  });
});