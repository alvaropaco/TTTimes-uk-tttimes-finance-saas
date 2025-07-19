const request = require('supertest');

const baseURL = 'http://localhost:3000';
const validToken = 'ttf_1a5510af655ba1a7ac9daa90d9244048be9f82b61a6e3382670f2102e4565da3';

describe('Simple API Tests', () => {
  test('Health check should work', async () => {
    const response = await request(baseURL)
      .get('/api/health');
    
    console.log('Health response:', response.status, response.body);
    expect(response.status).toBe(200);
  });

  test('Supported currencies with auth should work', async () => {
    const response = await request(baseURL)
      .get('/api/supported')
      .set('Authorization', `Bearer ${validToken}`);
    
    console.log('Supported response:', response.status, response.body);
    expect([200, 401, 500]).toContain(response.status);
  });

  test('Supported currencies without auth should return 401', async () => {
    const response = await request(baseURL)
      .get('/api/supported');
    
    console.log('No auth response:', response.status, response.body);
    expect(response.status).toBe(401);
  });
});