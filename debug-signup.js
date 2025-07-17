const fs = require('fs');
const path = require('path');

async function testSignup() {
  const logFile = path.join(__dirname, 'debug-output.txt');
  const log = (message) => {
    const timestamp = new Date().toISOString();
    const logMessage = `[${timestamp}] ${message}\n`;
    fs.appendFileSync(logFile, logMessage);
    console.log(message);
  };
  
  // Clear previous log
  fs.writeFileSync(logFile, '');
  
  try {
    log('Starting signup debug test...');
    
    // Import modules using require for TypeScript files
    log('Importing modules...');
    
    // Use tsx to run TypeScript directly
    const { execSync } = require('child_process');
    
    // Test the signup API endpoint directly
    log('Testing signup API endpoint directly...');
    
    const testData = {
      name: 'Debug Test User',
      email: 'debug@test.com',
      plan: 'free'
    };
    
    log(`Testing with data: ${JSON.stringify(testData)}`);
    
    // Use curl to test the API
    const curlCommand = `curl -X POST http://localhost:3000/api/signup \
      -H "Content-Type: application/json" \
      -d '${JSON.stringify(testData)}' \
      -w "\nHTTP_CODE:%{http_code}\n"`;
    
    log('Executing curl command...');
    const result = execSync(curlCommand, { encoding: 'utf8', timeout: 10000 });
    log(`API Response: ${result}`);
    
    log('Test completed successfully!');
    
  } catch (error) {
    log(`Error during signup test: ${error.message}`);
    log(`Error stack: ${error.stack}`);
    log(`Error name: ${error.name}`);
    if (error.cause) {
      log(`Error cause: ${error.cause}`);
    }
  }
}

testSignup().then(() => {
  console.log('Test completed - check debug-output.txt for details');
}).catch(error => {
  console.error('Test failed:', error);
  fs.appendFileSync(path.join(__dirname, 'debug-output.txt'), `FATAL ERROR: ${error.message}\n${error.stack}\n`);
});
