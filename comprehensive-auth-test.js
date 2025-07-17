const { spawn } = require('child_process');
const fs = require('fs');
const { exec } = require('child_process');

console.log('Starting comprehensive authentication test...');

// Clear previous logs
fs.writeFileSync('auth-test-results.txt', 'Comprehensive Authentication Test Results\n===========================================\n\n');

function log(message) {
  console.log(message);
  fs.appendFileSync('auth-test-results.txt', message + '\n');
}

function runTest(description, command) {
  return new Promise((resolve) => {
    log(`\n${description}`);
    log(`Command: ${command}`);
    log('Response:');
    
    exec(command, (error, stdout, stderr) => {
      if (error) {
        log(`Error: ${error.message}`);
      }
      if (stderr) {
        log(`Stderr: ${stderr}`);
      }
      if (stdout) {
        log(`Stdout: ${stdout}`);
      }
      log('---');
      resolve();
    });
  });
}

async function runTests() {
  // Test 1: Health check
  await runTest(
    'Test 1: Health Check',
    'curl -s http://localhost:3000/api/health'
  );
  
  // Test 2: Test connection
  await runTest(
    'Test 2: Database Connection Test',
    'curl -s http://localhost:3000/api/test-connection'
  );
  
  // Test 3: Signup new user
  const testEmail = `test-${Date.now()}@example.com`;
  await runTest(
    'Test 3: Signup New User',
    `curl -s -X POST http://localhost:3000/api/signup -H "Content-Type: application/json" -d '{"name":"Test User","email":"${testEmail}","plan":"free"}'`
  );
  
  // Test 4: Try authentication with demo token
  await runTest(
    'Test 4: Authentication with Demo Token',
    'curl -s -H "Authorization: Bearer demo_token" http://localhost:3000/api/zodiac/signs'
  );
  
  // Test 5: Try authentication with manual token
  await runTest(
    'Test 5: Authentication with Manual Token',
    'curl -s -H "Authorization: Bearer manual_test_token_123" http://localhost:3000/api/zodiac/signs'
  );
  
  // Test 6: Check if users exist in database
  log('\nTest 6: Database Query Results');
  log('This would require MongoDB query - check manually');
  
  log('\n===========================================');
  log('Test completed. Check auth-test-results.txt for full results.');
}

// Start server first
log('Starting Next.js server...');
const server = spawn('npm', ['run', 'dev'], {
  cwd: '/Users/alvaropaco/github/Zodii/zodii-saas',
  stdio: ['pipe', 'pipe', 'pipe']
});

let serverReady = false;

server.stdout.on('data', (data) => {
  const text = data.toString();
  if (text.includes('Ready in')) {
    serverReady = true;
    log('Server is ready, starting tests...');
    
    // Wait a bit more then run tests
    setTimeout(async () => {
      await runTests();
      
      // Kill server
      server.kill('SIGTERM');
      setTimeout(() => {
        process.exit(0);
      }, 1000);
    }, 2000);
  }
});

server.stderr.on('data', (data) => {
  log(`Server Error: ${data.toString()}`);
});

// Timeout after 30 seconds
setTimeout(() => {
  if (!serverReady) {
    log('Server failed to start within 30 seconds');
    server.kill('SIGTERM');
    process.exit(1);
  }
}, 30000);
