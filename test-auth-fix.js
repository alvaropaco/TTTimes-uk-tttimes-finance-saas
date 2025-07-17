const { exec } = require('child_process');
const fs = require('fs');

function runTest(description, command) {
  return new Promise((resolve) => {
    console.log(`\n${description}`);
    console.log(`Command: ${command}`);
    
    exec(command, (error, stdout, stderr) => {
      if (error) {
        console.log(`Error: ${error.message}`);
      }
      if (stderr) {
        console.log(`Stderr: ${stderr}`);
      }
      if (stdout) {
        console.log(`Response: ${stdout}`);
      }
      console.log('---');
      resolve(true);
    });
  });
}

async function testAuthentication() {
  console.log('Testing Authentication After Fix');
  console.log('================================');
  
  // Test with demo token
  await runTest(
    'Test 1: Demo Token Authentication',
    'curl -s -H "Authorization: Bearer demo_token" http://localhost:3000/api/zodiac/signs'
  );
  
  // Test with manual token
  await runTest(
    'Test 2: Manual Token Authentication',
    'curl -s -H "Authorization: Bearer manual_test_token_123" http://localhost:3000/api/zodiac/signs'
  );
  
  // Test with a real user token from database
  await runTest(
    'Test 3: Real User Token Authentication',
    'curl -s -H "Authorization: Bearer d9e9f3114cc3a63a5a301a51dfea3281e17795ba2f26f38bc6749b944cd0481f" http://localhost:3000/api/zodiac/signs'
  );
  
  // Test signup to verify it's working
  const testEmail = `auth-test-${Date.now()}@example.com`;
  await runTest(
    'Test 4: New User Signup',
    `curl -s -X POST http://localhost:3000/api/signup -H "Content-Type: application/json" -d '{"name":"Auth Test User","email":"${testEmail}","plan":"free"}'`
  );
  
  console.log('\nAuthentication tests completed!');
}

testAuthentication().catch(console.error);
