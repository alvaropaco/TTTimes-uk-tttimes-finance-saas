const { spawn } = require('child_process');
const fs = require('fs');

console.log('Starting Next.js server test...');

// Clear previous logs
fs.writeFileSync('server-test-output.txt', '');

const server = spawn('npm', ['run', 'dev'], {
  cwd: '/Users/alvaropaco/github/Zodii/zodii-saas',
  stdio: ['pipe', 'pipe', 'pipe']
});

let output = '';

server.stdout.on('data', (data) => {
  const text = data.toString();
  console.log('STDOUT:', text);
  output += 'STDOUT: ' + text + '\n';
  fs.appendFileSync('server-test-output.txt', 'STDOUT: ' + text + '\n');
});

server.stderr.on('data', (data) => {
  const text = data.toString();
  console.log('STDERR:', text);
  output += 'STDERR: ' + text + '\n';
  fs.appendFileSync('server-test-output.txt', 'STDERR: ' + text + '\n');
});

server.on('close', (code) => {
  console.log(`Server process exited with code ${code}`);
  output += `Server process exited with code ${code}\n`;
  fs.appendFileSync('server-test-output.txt', `Server process exited with code ${code}\n`);
});

server.on('error', (error) => {
  console.log('Server error:', error);
  output += 'Server error: ' + error.toString() + '\n';
  fs.appendFileSync('server-test-output.txt', 'Server error: ' + error.toString() + '\n');
});

// Wait 10 seconds then kill the server
setTimeout(() => {
  console.log('Killing server after 10 seconds...');
  server.kill('SIGTERM');
  
  setTimeout(() => {
    console.log('Final output written to server-test-output.txt');
    process.exit(0);
  }, 1000);
}, 10000);
