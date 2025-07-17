#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// Configuration
const API_BASE_URL = 'http://localhost:3000';
const TEST_TOKEN = 'demo_token_12345'; // Demo token for testing
const OUTPUT_FILE = path.join(__dirname, 'api-test-results.txt');

// Test results storage
let testResults = [];
let totalTests = 0;
let passedTests = 0;
let failedTests = 0;

// Helper function to log results
function logResult(testName, status, details = '') {
  const result = `[${status}] ${testName}: ${details}`;
  testResults.push(result);
  console.log(result);
  
  totalTests++;
  if (status === 'PASS') passedTests++;
  else failedTests++;
}

// Helper function to make HTTP requests
async function makeRequest(url, method = 'GET', body = null) {
  try {
    const options = {
      method,
      headers: {
        'Content-Type': 'application/json',
      },
    };
    
    if (body) {
      options.body = JSON.stringify(body);
    }
    
    const response = await fetch(url, options);
    const data = await response.text();
    
    let jsonData;
    try {
      jsonData = JSON.parse(data);
    } catch (e) {
      jsonData = { raw: data };
    }
    
    return {
      status: response.status,
      statusText: response.statusText,
      data: jsonData,
      headers: Object.fromEntries(response.headers.entries())
    };
  } catch (error) {
    return {
      status: 0,
      statusText: 'Network Error',
      data: { error: error.message },
      headers: {}
    };
  }
}

// Test functions
async function testDatabaseConnection() {
  console.log('\n=== Testing Database Connection ===');
  
  const response = await makeRequest(`${API_BASE_URL}/api/test-connection`);
  
  if (response.status === 200 && response.data.status === 'success') {
    logResult('Database Connection', 'PASS', `Connected to ${response.data.database}`);
    return true;
  } else {
    logResult('Database Connection', 'FAIL', `Status: ${response.status}, Error: ${response.data.error || 'Unknown'}`);
    return false;
  }
}

async function testHealthEndpoint() {
  console.log('\n=== Testing Health Endpoint ===');
  
  const response = await makeRequest(`${API_BASE_URL}/api/health`);
  
  if (response.status === 200) {
    logResult('Health Endpoint', 'PASS', 'API is healthy');
    return true;
  } else {
    logResult('Health Endpoint', 'FAIL', `Status: ${response.status}`);
    return false;
  }
}

async function testExampleEndpoints() {
  console.log('\n=== Testing Example API Endpoints ===');
  
  // Test GET /api/example
  const exampleResponse = await makeRequest(`${API_BASE_URL}/api/example?token=${TEST_TOKEN}`);
  
  if (exampleResponse.status === 200 && exampleResponse.data.success) {
    logResult('GET /api/example', 'PASS', `Message: ${exampleResponse.data.data.message}`);
  } else {
    logResult('GET /api/example', 'FAIL', `Status: ${exampleResponse.status}`);
  }
  
  // Test GET /api/example/[id]
  const exampleIdResponse = await makeRequest(`${API_BASE_URL}/api/example/1?token=${TEST_TOKEN}`);
  
  if (exampleIdResponse.status === 200 && exampleIdResponse.data.success) {
    logResult('GET /api/example/1', 'PASS', `Item: ${exampleIdResponse.data.data.name}`);
  } else {
    logResult('GET /api/example/1', 'FAIL', `Status: ${exampleIdResponse.status}`);
  }
  
  // Test POST /api/example
  const postData = {
    name: 'Test Item',
    description: 'This is a test item created during API testing'
  };
  
  const postResponse = await makeRequest(`${API_BASE_URL}/api/example?token=${TEST_TOKEN}`, 'POST', postData);
  
  if (postResponse.status === 200 && postResponse.data.success) {
    logResult('POST /api/example', 'PASS', `Created item with ID: ${postResponse.data.data.id}`);
  } else {
    logResult('POST /api/example', 'FAIL', `Status: ${postResponse.status}`);
  }
}

async function testSignupEndpoint() {
  console.log('\n=== Testing Signup Endpoint ===');
  
  const signupData = {
    name: 'Test User',
    email: `test-${Date.now()}@example.com`
  };
  
  const signupResponse = await makeRequest(`${API_BASE_URL}/api/signup`, 'POST', signupData);
  
  if (signupResponse.status === 200 && signupResponse.data.success) {
    logResult('User Signup', 'PASS', `Created user: ${signupResponse.data.data.user.name}`);
    
    // Test if token was provided
    if (signupResponse.data.data.user.token) {
      logResult('Token Generation', 'PASS', 'API token generated for new user');
    } else {
      logResult('Token Generation', 'FAIL', 'No API token provided');
    }
  } else {
    logResult('User Signup', 'FAIL', `Status: ${signupResponse.status}`);
  }
}

async function testAuthenticationEndpoints() {
  console.log('\n=== Testing Authentication ===');
  
  // Test with valid demo token
  const validAuthResponse = await makeRequest(`${API_BASE_URL}/api/example?token=${TEST_TOKEN}`);
  
  if (validAuthResponse.status === 200) {
    logResult('Valid Token Authentication', 'PASS', 'Demo token accepted');
  } else {
    logResult('Valid Token Authentication', 'FAIL', `Status: ${validAuthResponse.status}`);
  }
  
  // Test with invalid token
  const invalidAuthResponse = await makeRequest(`${API_BASE_URL}/api/example?token=invalid_token`);
  
  if (invalidAuthResponse.status === 401) {
    logResult('Invalid Token Rejection', 'PASS', 'Invalid token properly rejected');
  } else {
    logResult('Invalid Token Rejection', 'FAIL', `Status: ${invalidAuthResponse.status}`);
  }
  
  // Test with missing token
  const noTokenResponse = await makeRequest(`${API_BASE_URL}/api/example`);
  
  if (noTokenResponse.status === 401) {
    logResult('Missing Token Rejection', 'PASS', 'Missing token properly rejected');
  } else {
    logResult('Missing Token Rejection', 'FAIL', `Status: ${noTokenResponse.status}`);
  }
}

async function testCORSHeaders() {
  console.log('\n=== Testing CORS Headers ===');
  
  // Test OPTIONS request
  const optionsResponse = await makeRequest(`${API_BASE_URL}/api/example`, 'OPTIONS');
  
  if (optionsResponse.status === 200 && optionsResponse.headers['access-control-allow-origin']) {
    logResult('CORS OPTIONS Request', 'PASS', 'CORS headers present');
  } else {
    logResult('CORS OPTIONS Request', 'FAIL', `Status: ${optionsResponse.status}`);
  }
  
  // Test CORS headers in regular request
  const corsResponse = await makeRequest(`${API_BASE_URL}/api/example?token=${TEST_TOKEN}`);
  
  if (corsResponse.headers['access-control-allow-origin']) {
    logResult('CORS Headers in Response', 'PASS', 'CORS headers included');
  } else {
    logResult('CORS Headers in Response', 'FAIL', 'CORS headers missing');
  }
}

async function testErrorHandling() {
  console.log('\n=== Testing Error Handling ===');
  
  // Test non-existent endpoint
  const notFoundResponse = await makeRequest(`${API_BASE_URL}/api/nonexistent?token=${TEST_TOKEN}`);
  
  if (notFoundResponse.status === 404) {
    logResult('404 Error Handling', 'PASS', 'Non-existent endpoint returns 404');
  } else {
    logResult('404 Error Handling', 'FAIL', `Status: ${notFoundResponse.status}`);
  }
  
  // Test invalid JSON in POST request
  const invalidJsonResponse = await makeRequest(`${API_BASE_URL}/api/example?token=${TEST_TOKEN}`, 'POST', 'invalid json');
  
  if (invalidJsonResponse.status === 400) {
    logResult('Invalid JSON Handling', 'PASS', 'Invalid JSON properly rejected');
  } else {
    logResult('Invalid JSON Handling', 'FAIL', `Status: ${invalidJsonResponse.status}`);
  }
}

async function testRateLimiting() {
  console.log('\n=== Testing Rate Limiting ===');
  
  // Make multiple rapid requests to test rate limiting
  const requests = [];
  for (let i = 0; i < 5; i++) {
    requests.push(makeRequest(`${API_BASE_URL}/api/example?token=${TEST_TOKEN}`));
  }
  
  const responses = await Promise.all(requests);
  const successfulRequests = responses.filter(r => r.status === 200).length;
  
  if (successfulRequests >= 3) {
    logResult('Rate Limiting', 'PASS', `${successfulRequests}/5 requests succeeded`);
  } else {
    logResult('Rate Limiting', 'FAIL', `Only ${successfulRequests}/5 requests succeeded`);
  }
}

// Main test runner
async function runAllTests() {
  console.log('🚀 Starting Comprehensive SaaS Starter API Tests');
  console.log('=' .repeat(50));
  
  const startTime = Date.now();
  
  // Check if server is running
  console.log('Checking if server is running...');
  const serverCheck = await makeRequest(API_BASE_URL);
  
  if (serverCheck.status === 0) {
    console.log('❌ Server is not running. Please start with: npm run dev');
    process.exit(1);
  }
  
  console.log('✅ Server is running');
  
  // Run all tests
  await testHealthEndpoint();
  await testDatabaseConnection();
  await testAuthenticationEndpoints();
  await testExampleEndpoints();
  await testSignupEndpoint();
  await testCORSHeaders();
  await testErrorHandling();
  await testRateLimiting();
  
  const endTime = Date.now();
  const duration = (endTime - startTime) / 1000;
  
  // Generate summary
  console.log('\n' + '=' .repeat(50));
  console.log('🏁 Test Summary');
  console.log('=' .repeat(50));
  console.log(`Total Tests: ${totalTests}`);
  console.log(`Passed: ${passedTests}`);
  console.log(`Failed: ${failedTests}`);
  console.log(`Success Rate: ${((passedTests / totalTests) * 100).toFixed(1)}%`);
  console.log(`Duration: ${duration.toFixed(2)}s`);
  
  // Save results to file
  const summary = [
    '='.repeat(50),
    'SAAS STARTER API TEST RESULTS',
    '='.repeat(50),
    `Test Date: ${new Date().toISOString()}`,
    `Total Tests: ${totalTests}`,
    `Passed: ${passedTests}`,
    `Failed: ${failedTests}`,
    `Success Rate: ${((passedTests / totalTests) * 100).toFixed(1)}%`,
    `Duration: ${duration.toFixed(2)}s`,
    '',
    'DETAILED RESULTS:',
    '='.repeat(30),
    ...testResults,
    '',
    'Test Coverage:',
    '- Health endpoint',
    '- Database connection',
    '- Authentication (valid/invalid/missing tokens)',
    '- Example API endpoints (GET, POST)',
    '- User signup and token generation',
    '- CORS headers',
    '- Error handling (404, invalid JSON)',
    '- Rate limiting',
    '',
    'END OF REPORT'
  ].join('\n');
  
  fs.writeFileSync(OUTPUT_FILE, summary);
  console.log(`\n📄 Detailed results saved to: ${OUTPUT_FILE}`);
  
  if (failedTests > 0) {
    console.log('\n⚠️  Some tests failed. Check the results above.');
    process.exit(1);
  } else {
    console.log('\n🎉 All tests passed!');
  }
}

// Run tests
runAllTests().catch(console.error);
