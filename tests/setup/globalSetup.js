/**
 * Configuração Global dos Testes
 * Inicia o servidor Next.js antes de executar os testes
 */

const { spawn } = require('child_process');
const { promisify } = require('util');

const sleep = promisify(setTimeout);

class TestServerManager {
  constructor() {
    this.serverProcess = null;
    this.serverUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
    this.maxRetries = 30; // 30 segundos de timeout
    this.retryInterval = 1000; // 1 segundo entre tentativas
    this.fetch = null;
  }

  async initFetch() {
    if (!this.fetch) {
      const fetchModule = await import('node-fetch');
      this.fetch = fetchModule.default;
    }
    return this.fetch;
  }

  async startServer() {
    console.log('🚀 Iniciando servidor Next.js para testes...');
    
    return new Promise((resolve, reject) => {
      // Inicia o servidor Next.js em modo desenvolvimento
      this.serverProcess = spawn('npm', ['run', 'dev'], {
        stdio: ['pipe', 'pipe', 'pipe'],
        env: {
          ...process.env,
          NODE_ENV: 'test',
          PORT: '3000'
        }
      });

      let serverOutput = '';
      let serverReady = false;

      // Captura a saída do servidor
      this.serverProcess.stdout.on('data', (data) => {
        const output = data.toString();
        serverOutput += output;
        
        // Verifica se o servidor está pronto
        if (output.includes('Ready in') || output.includes('ready started server')) {
          serverReady = true;
        }
      });

      this.serverProcess.stderr.on('data', (data) => {
        console.error('Erro do servidor:', data.toString());
      });

      this.serverProcess.on('error', (error) => {
        console.error('❌ Erro ao iniciar servidor:', error);
        reject(error);
      });

      this.serverProcess.on('exit', (code) => {
        if (code !== 0 && !serverReady) {
          console.error(`❌ Servidor encerrou com código ${code}`);
          reject(new Error(`Servidor falhou com código ${code}`));
        }
      });

      // Aguarda o servidor ficar pronto
      const checkServer = async () => {
        for (let i = 0; i < this.maxRetries; i++) {
          if (serverReady) {
            // Aguarda um pouco mais para garantir que está totalmente pronto
            await sleep(2000);
            
            // Verifica se o servidor está respondendo
            try {
              const fetch = await this.initFetch();
              const response = await fetch(`${this.serverUrl}/api/health`);
              if (response.ok) {
                console.log('✅ Servidor Next.js iniciado com sucesso!');
                console.log(`📍 Servidor disponível em: ${this.serverUrl}`);
                resolve();
                return;
              }
            } catch (error) {
              // Continua tentando
            }
          }
          
          await sleep(this.retryInterval);
        }
        
        reject(new Error('Timeout: Servidor não ficou pronto a tempo'));
      };

      checkServer();
    });
  }

  async stopServer() {
    if (this.serverProcess) {
      console.log('🛑 Encerrando servidor Next.js...');
      
      return new Promise((resolve) => {
        this.serverProcess.on('exit', () => {
          console.log('✅ Servidor encerrado com sucesso!');
          resolve();
        });

        // Tenta encerrar graciosamente
        this.serverProcess.kill('SIGTERM');
        
        // Se não encerrar em 5 segundos, força o encerramento
        setTimeout(() => {
          if (this.serverProcess && !this.serverProcess.killed) {
            console.log('⚠️ Forçando encerramento do servidor...');
            this.serverProcess.kill('SIGKILL');
          }
          resolve();
        }, 5000);
      });
    }
  }

  async waitForServer() {
    console.log('⏳ Aguardando servidor ficar disponível...');
    
    const fetch = await this.initFetch();
    
    for (let i = 0; i < this.maxRetries; i++) {
      try {
        const response = await fetch(`${this.serverUrl}/api/health`, {
          timeout: 5000
        });
        
        if (response.ok) {
          console.log('✅ Servidor está respondendo!');
          return true;
        }
      } catch (error) {
        // Continua tentando
      }
      
      await sleep(this.retryInterval);
    }
    
    throw new Error('Servidor não está respondendo após múltiplas tentativas');
  }
}

// Instância global do gerenciador
const serverManager = new TestServerManager();

module.exports = async () => {
  console.log('\n' + '='.repeat(60));
  console.log('🧪 CONFIGURAÇÃO GLOBAL DOS TESTES');
  console.log('='.repeat(60));
  
  try {
    await serverManager.startServer();
    
    // Armazena a referência do servidor para o teardown
    global.__SERVER_MANAGER__ = serverManager;
    
    console.log('🎯 Configuração concluída! Iniciando testes...\n');
  } catch (error) {
    console.error('❌ Falha na configuração dos testes:', error);
    process.exit(1);
  }
};