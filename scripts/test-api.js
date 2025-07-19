const axios = require('axios');

const BASE_URL = 'http://localhost:3000';
const API_TOKEN = 'ttf_rrk5kmfro1sepohjtswkww';

async function testAPI() {
  console.log('Testing API endpoints...\n');
  
  try {
    // Test 1: Health check
    console.log('1. Testing health check...');
    const healthResponse = await axios.get(`${BASE_URL}/api/health`);
    console.log('✅ Health check:', healthResponse.status, healthResponse.data);
  } catch (error) {
    console.log('❌ Health check failed:', error.message);
  }
  
  try {
    // Test 2: Supported currencies with auth
    console.log('\n2. Testing supported currencies with auth...');
    const supportedResponse = await axios.get(`${BASE_URL}/api/supported`, {
      headers: { Authorization: `Bearer ${API_TOKEN}` }
    });
    console.log('✅ Supported currencies:', supportedResponse.status, 'Total currencies:', supportedResponse.data.total);
  } catch (error) {
    console.log('❌ Supported currencies failed:', error.message);
  }
  
  try {
    // Test 3: Supported currencies without auth
    console.log('\n3. Testing supported currencies without auth...');
    const noAuthResponse = await axios.get(`${BASE_URL}/api/supported`);
    console.log('❌ Should have failed but got:', noAuthResponse.status);
  } catch (error) {
    if (error.response && error.response.status === 401) {
      console.log('✅ Correctly returned 401 for missing auth');
    } else {
      console.log('❌ Unexpected error:', error.message);
    }
  }
  
  try {
    // Test 4: Convert currency
    console.log('\n4. Testing currency conversion...');
    const convertResponse = await axios.get(`${BASE_URL}/api/convert?from=USD&to=EUR&amount=100`, {
      headers: { Authorization: `Bearer ${API_TOKEN}` }
    });
    console.log('✅ Currency conversion:', convertResponse.status, 'Result:', convertResponse.data.result);
  } catch (error) {
    console.log('❌ Currency conversion failed:', error.message);
  }
  
  try {
    // Test 5: Get rates
    console.log('\n5. Testing exchange rates...');
    const ratesResponse = await axios.get(`${BASE_URL}/api/rates?from=USD&to=EUR`, {
      headers: { Authorization: `Bearer ${API_TOKEN}` }
    });
    console.log('✅ Exchange rates:', ratesResponse.status, 'Rate:', ratesResponse.data.rate);
  } catch (error) {
    console.log('❌ Exchange rates failed:', error.message);
  }
}

testAPI().catch(console.error);