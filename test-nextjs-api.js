const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

// Function to make HTTP requests
function makeRequest(url, options = {}) {
  return new Promise((resolve, reject) => {
    const http = require('http');
    const urlObj = new URL(url);
    
    const requestOptions = {
      hostname: urlObj.hostname,
      port: urlObj.port || 80,
      path: urlObj.pathname + urlObj.search,
      method: options.method || 'GET',
      headers: options.headers || {}
    };

    const req = http.request(requestOptions, (res) => {
      let data = '';
      res.on('data', (chunk) => {
        data += chunk;
      });
      res.on('end', () => {
        resolve({
          statusCode: res.statusCode,
          headers: res.headers,
          body: data
        });
      });
    });

    req.on('error', (err) => {
      reject(err);
    });

    if (options.body) {
      req.write(options.body);
    }
    
    req.end();
  });
}

// Function to wait for server to be ready
function waitForServer(url, maxAttempts = 30) {
  return new Promise((resolve, reject) => {
    let attempts = 0;
    
    function check() {
      attempts++;
      makeRequest(url)
        .then(() => {
          console.log(`Server is ready after ${attempts} attempts`);
          resolve();
        })
        .catch(() => {
          if (attempts >= maxAttempts) {
            reject(new Error(`Server not ready after ${maxAttempts} attempts`));
          } else {
            setTimeout(check, 1000);
          }
        });
    }
    
    check();
  });
}

// Main test function
async function runTests() {
  const results = [];
  
  console.log('Starting Next.js development server...');
  
  // Start the Next.js server
  const server = spawn('npm', ['run', 'dev'], {
    stdio: ['pipe', 'pipe', 'pipe'],
    cwd: process.cwd()
  });
  
  let serverOutput = '';
  let serverError = '';
  
  server.stdout.on('data', (data) => {
    serverOutput += data.toString();
    console.log('Server stdout:', data.toString());
  });
  
  server.stderr.on('data', (data) => {
    serverError += data.toString();
    console.log('Server stderr:', data.toString());
  });
  
  try {
    // Wait for server to be ready
    console.log('Waiting for server to start...');
    await waitForServer('http://localhost:3000');
    
    // Test endpoints
    const endpoints = [
      { name: 'Health Check', url: 'http://localhost:3000/api/health' },
      { name: 'Database Connection', url: 'http://localhost:3000/api/test-connection' },
      { name: 'Home Page', url: 'http://localhost:3000' }
    ];
    
    for (const endpoint of endpoints) {
      try {
        console.log(`Testing ${endpoint.name}...`);
        const response = await makeRequest(endpoint.url);
        results.push({
          name: endpoint.name,
          url: endpoint.url,
          status: response.statusCode,
          success: response.statusCode < 400,
          body: response.body.substring(0, 500) // First 500 chars
        });
        console.log(`✓ ${endpoint.name}: ${response.statusCode}`);
      } catch (error) {
        results.push({
          name: endpoint.name,
          url: endpoint.url,
          status: 'ERROR',
          success: false,
          error: error.message
        });
        console.log(`✗ ${endpoint.name}: ${error.message}`);
      }
    }
    
  } catch (error) {
    console.error('Failed to start or connect to server:', error.message);
    results.push({
      name: 'Server Startup',
      success: false,
      error: error.message
    });
  } finally {
    // Kill the server
    console.log('Stopping server...');
    server.kill('SIGTERM');
    
    // Wait a bit for graceful shutdown
    setTimeout(() => {
      server.kill('SIGKILL');
    }, 2000);
  }
  
  // Write results to file
  const resultText = [
    '=== Next.js API Test Results ===',
    `Test run at: ${new Date().toISOString()}`,
    '',
    'Results:',
    ...results.map(r => {
      if (r.success) {
        return `✓ ${r.name}: ${r.status} - SUCCESS`;
      } else {
        return `✗ ${r.name}: ${r.status || 'ERROR'} - ${r.error || 'FAILED'}`;
      }
    }),
    '',
    'Detailed Results:',
    JSON.stringify(results, null, 2),
    '',
    'Server Output:',
    serverOutput,
    '',
    'Server Errors:',
    serverError
  ].join('\n');
  
  fs.writeFileSync('nextjs-test-results.txt', resultText);
  console.log('\nTest results written to nextjs-test-results.txt');
  
  // Print summary
  console.log('\n=== Test Summary ===');
  results.forEach(r => {
    if (r.success) {
      console.log(`✓ ${r.name}: SUCCESS`);
    } else {
      console.log(`✗ ${r.name}: FAILED`);
    }
  });
}

// Run the tests
runTests().catch(console.error);
