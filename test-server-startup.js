#!/usr/bin/env node

const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🚀 Starting server test...');

// Start the development server
const server = spawn('npm', ['run', 'dev'], {
  cwd: __dirname,
  stdio: ['pipe', 'pipe', 'pipe']
});

let serverOutput = '';
let serverError = '';

server.stdout.on('data', (data) => {
  const output = data.toString();
  serverOutput += output;
  console.log('STDOUT:', output);
});

server.stderr.on('data', (data) => {
  const error = data.toString();
  serverError += error;
  console.log('STDERR:', error);
});

server.on('close', (code) => {
  console.log(`Server process exited with code ${code}`);
  
  // Save outputs to files
  fs.writeFileSync('server-stdout.log', serverOutput);
  fs.writeFileSync('server-stderr.log', serverError);
  
  console.log('Logs saved to server-stdout.log and server-stderr.log');
});

// Wait for server to start, then test
setTimeout(async () => {
  console.log('\n🔍 Testing server after 10 seconds...');
  
  try {
    const response = await fetch('http://localhost:3000/api/health');
    const data = await response.text();
    
    console.log('Health check response:', response.status, data);
    
    // Test database connection
    const dbResponse = await fetch('http://localhost:3000/api/test-connection');
    const dbData = await dbResponse.text();
    
    console.log('Database test response:', dbResponse.status, dbData);
    
  } catch (error) {
    console.log('Test failed:', error.message);
  }
  
  // Kill the server
  server.kill('SIGTERM');
  
  setTimeout(() => {
    process.exit(0);
  }, 2000);
  
}, 10000);

// Handle process termination
process.on('SIGINT', () => {
  console.log('\nTerminating server...');
  server.kill('SIGTERM');
  process.exit(0);
});
