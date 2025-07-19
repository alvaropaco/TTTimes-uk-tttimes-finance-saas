const nextJest = require('next/jest')

const createJestConfig = nextJest({
  // Provide the path to your Next.js app to load next.config.js and .env files
  dir: './',
})

// Add any custom config to be passed to Jest
const customJestConfig = {
  testEnvironment: 'node',
  testMatch: [
    '**/tests/**/*.test.js',
    '**/tests/**/*.test.ts'
  ],
  moduleFileExtensions: ['js', 'ts', 'tsx', 'jsx'],
  
  // Configuração de setup e teardown globais
  globalSetup: '<rootDir>/tests/setup/globalSetup.js',
  globalTeardown: '<rootDir>/tests/setup/globalTeardown.js',
  setupFilesAfterEnv: ['<rootDir>/tests/setup/testEnvironment.js'],
  
  // Configurações de cobertura
  collectCoverage: true,
  coverageDirectory: 'coverage',
  coverageReporters: ['text', 'lcov', 'html'],
  coveragePathIgnorePatterns: [
    '/node_modules/',
    '/tests/setup/',
    '/coverage/',
    '/.next/'
  ],
  
  // Configurações de timeout e execução
  testTimeout: 30000,
  verbose: true,
  maxWorkers: 1, // Executa testes sequencialmente para evitar conflitos de porta
  
  // Configurações de ambiente
  testEnvironmentOptions: {
    url: 'http://localhost:3000'
  },
  
  // Ignora arquivos de configuração durante os testes
  testPathIgnorePatterns: [
    '/node_modules/',
    '/tests/setup/',
    '/.next/'
  ],

  // Module name mapping for absolute imports
  moduleNameMapping: {
    '^@/(.*)$': '<rootDir>/$1',
  },
}

// createJestConfig is exported this way to ensure that next/jest can load the Next.js config which is async
module.exports = createJestConfig(customJestConfig)