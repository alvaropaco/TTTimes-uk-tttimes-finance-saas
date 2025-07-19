/**
 * Configuração de Ambiente para Testes
 * Define variáveis e configurações necessárias para os testes
 */

// Configurações de ambiente para testes
process.env.NODE_ENV = 'test';
process.env.NEXT_PUBLIC_APP_URL = 'http://localhost:3000';

// Aumenta o timeout para operações de rede
jest.setTimeout(30000);

// Configuração global para fetch (se necessário)
if (typeof global.fetch === 'undefined') {
  global.fetch = require('node-fetch');
}

// Suprime logs desnecessários durante os testes
const originalConsoleLog = console.log;
const originalConsoleError = console.error;

// Filtra logs do Next.js durante os testes
console.log = (...args) => {
  const message = args.join(' ');
  if (
    !message.includes('webpack') &&
    !message.includes('compiled') &&
    !message.includes('Fast Refresh') &&
    !message.includes('event -')
  ) {
    originalConsoleLog(...args);
  }
};

console.error = (...args) => {
  const message = args.join(' ');
  if (
    !message.includes('Warning:') &&
    !message.includes('webpack')
  ) {
    originalConsoleError(...args);
  }
};

// Restaura logs originais após os testes
afterAll(() => {
  console.log = originalConsoleLog;
  console.error = originalConsoleError;
});