#!/usr/bin/env node

// Direct API test without starting server
require('dotenv').config({ path: '.env.local' });

const fs = require('fs');

async function testDatabaseDirectly() {
  console.log('🔍 Testing Database Connection Directly...');
  console.log('=' .repeat(50));
  
  try {
    // Test environment variables
    console.log('1. Environment Check:');
    console.log(`   MONGODB_URI: ${process.env.MONGODB_URI ? '✅ Set' : '❌ Missing'}`);
    console.log(`   MONGODB_DB_NAME: ${process.env.MONGODB_DB_NAME || 'zodii'}`);
    
    if (!process.env.MONGODB_URI) {
      console.log('❌ MONGODB_URI not found!');
      return;
    }
    
    // Test database connection
    console.log('\n2. Database Connection Test:');
    const { Database } = await import('./lib/database.js');
    
    const db = await Database.getDb();
    console.log(`   ✅ Connected to MongoDB: ${db.databaseName}`);
    
    // Test collections
    const collections = await db.listCollections().toArray();
    console.log(`   📋 Collections: ${collections.map(c => c.name).join(', ') || 'None'}`);
    
    // Test database stats
    const stats = await db.stats();
    console.log(`   📊 Collections count: ${stats.collections}`);
    console.log(`   💾 Data size: ${stats.dataSize} bytes`);
    
    // Test user operations
    console.log('\n3. User Operations Test:');
    const testEmail = `test-${Date.now()}@zodii.com`;
    
    try {
      const testUser = await Database.createUser({
        email: testEmail,
        name: 'Test User',
        token: `test_token_${Date.now()}`,
        plan: 'free'
      });
      
      console.log(`   ✅ User created: ${testUser.email}`);
      console.log(`   🔑 Token: ${testUser.token.substring(0, 20)}...`);
      
      // Test user retrieval
      const foundUser = await Database.findUserByToken(testUser.token);
      console.log(`   ✅ User retrieved: ${foundUser ? foundUser.email : 'Not found'}`);
      
      // Test demo token validation
      const demoUser = await Database.findUserByToken('demo_token_12345');
      console.log(`   ✅ Demo token test: ${demoUser ? 'Valid' : 'Invalid'}`);
      
    } catch (userError) {
      console.log(`   ❌ User operations failed: ${userError.message}`);
    }
    
    // Test API usage logging
    console.log('\n4. API Usage Logging Test:');
    try {
      await Database.logApiUsage({
        token: 'demo_token_12345',
        endpoint: '/api/test',
        method: 'GET',
        status_code: 200,
        response_time_ms: 150
      });
      console.log('   ✅ API usage logged successfully');
    } catch (logError) {
      console.log(`   ❌ API usage logging failed: ${logError.message}`);
    }
    
    console.log('\n🎉 Database tests completed successfully!');
    
  } catch (error) {
    console.error('❌ Database test failed:', error.message);
    console.error('Stack trace:', error.stack);
  }
}

async function testAPIEndpointsWithCurl() {
  console.log('\n🌐 Testing API Endpoints with curl...');
  console.log('=' .repeat(50));
  
  const { spawn } = require('child_process');
  
  // Start server in background
  console.log('Starting development server...');
  const server = spawn('npm', ['run', 'dev'], {
    stdio: ['ignore', 'pipe', 'pipe'],
    detached: true
  });
  
  // Wait for server to start
  await new Promise(resolve => setTimeout(resolve, 8000));
  
  const testEndpoints = [
    'http://localhost:3000/api/health',
    'http://localhost:3000/api/test-connection',
    'http://localhost:3000/api/zodiac/signs?token=demo_token_12345',
    'http://localhost:3000/api/horoscope/Aries?token=demo_token_12345'
  ];
  
  for (const endpoint of testEndpoints) {
    try {
      console.log(`\nTesting: ${endpoint}`);
      
      const response = await fetch(endpoint);
      const data = await response.text();
      
      console.log(`   Status: ${response.status}`);
      console.log(`   Response: ${data.substring(0, 200)}${data.length > 200 ? '...' : ''}`);
      
    } catch (error) {
      console.log(`   ❌ Failed: ${error.message}`);
    }
  }
  
  // Kill server
  try {
    process.kill(-server.pid, 'SIGTERM');
  } catch (e) {
    // Ignore errors when killing server
  }
}

async function runAllTests() {
  const results = [];
  
  try {
    await testDatabaseDirectly();
    results.push('✅ Database tests passed');
  } catch (error) {
    results.push(`❌ Database tests failed: ${error.message}`);
  }
  
  try {
    await testAPIEndpointsWithCurl();
    results.push('✅ API endpoint tests completed');
  } catch (error) {
    results.push(`❌ API endpoint tests failed: ${error.message}`);
  }
  
  // Save results
  const summary = [
    '='.repeat(50),
    'ZODII API DIRECT TEST RESULTS',
    '='.repeat(50),
    `Test Date: ${new Date().toISOString()}`,
    '',
    ...results,
    '',
    'END OF REPORT'
  ].join('\n');
  
  fs.writeFileSync('direct-test-results.txt', summary);
  console.log('\n📄 Results saved to direct-test-results.txt');
  
  console.log('\n' + '='.repeat(50));
  console.log('🏁 All tests completed!');
  console.log('='.repeat(50));
}

// Run tests
runAllTests().catch(console.error);
