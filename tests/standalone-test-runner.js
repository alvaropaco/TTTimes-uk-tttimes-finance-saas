/**
 * Script de Teste Standalone
 * Permite executar testes com gerenciamento automático do servidor
 * sem depender do Jest para casos específicos
 */

const { spawn } = require('child_process');
const { promisify } = require('util');
const fetch = require('node-fetch');

const sleep = promisify(setTimeout);

class StandaloneTestRunner {
  constructor() {
    this.serverProcess = null;
    this.serverUrl = 'http://localhost:3000';
  }

  async startServer() {
    console.log('🚀 Iniciando servidor para testes standalone...');
    
    return new Promise((resolve, reject) => {
      this.serverProcess = spawn('npm', ['run', 'dev'], {
        stdio: ['pipe', 'pipe', 'pipe'],
        env: { ...process.env, NODE_ENV: 'test' }
      });

      let serverReady = false;

      this.serverProcess.stdout.on('data', (data) => {
        const output = data.toString();
        if (output.includes('Ready in') || output.includes('ready started server')) {
          serverReady = true;
        }
      });

      this.serverProcess.stderr.on('data', (data) => {
        console.error('Erro do servidor:', data.toString());
      });

      this.serverProcess.on('error', reject);

      // Aguarda o servidor ficar pronto
      const checkServer = async () => {
        for (let i = 0; i < 30; i++) {
          if (serverReady) {
            await sleep(2000);
            try {
              const response = await fetch(`${this.serverUrl}/api/health`);
              if (response.ok) {
                console.log('✅ Servidor pronto!');
                resolve();
                return;
              }
            } catch (error) {
              // Continua tentando
            }
          }
          await sleep(1000);
        }
        reject(new Error('Timeout: Servidor não ficou pronto'));
      };

      checkServer();
    });
  }

  async stopServer() {
    if (this.serverProcess) {
      console.log('🛑 Encerrando servidor...');
      return new Promise((resolve) => {
        this.serverProcess.on('exit', () => {
          console.log('✅ Servidor encerrado!');
          resolve();
        });
        this.serverProcess.kill('SIGTERM');
        setTimeout(() => {
          if (this.serverProcess && !this.serverProcess.killed) {
            this.serverProcess.kill('SIGKILL');
          }
          resolve();
        }, 5000);
      });
    }
  }

  async runTests() {
    console.log('🧪 Executando testes...');
    
    return new Promise((resolve, reject) => {
      const testProcess = spawn('npm', ['run', 'test'], {
        stdio: 'inherit',
        env: { ...process.env, NODE_ENV: 'test' }
      });

      testProcess.on('exit', (code) => {
        if (code === 0) {
          console.log('✅ Todos os testes passaram!');
          resolve();
        } else {
          console.log(`❌ Testes falharam com código ${code}`);
          reject(new Error(`Testes falharam com código ${code}`));
        }
      });

      testProcess.on('error', reject);
    });
  }

  async run() {
    try {
      await this.startServer();
      await this.runTests();
    } catch (error) {
      console.error('❌ Erro durante execução:', error);
      process.exit(1);
    } finally {
      await this.stopServer();
    }
  }
}

// Executa se chamado diretamente
if (require.main === module) {
  const runner = new StandaloneTestRunner();
  runner.run().catch(error => {
    console.error('❌ Erro fatal:', error);
    process.exit(1);
  });
}

module.exports = { StandaloneTestRunner };