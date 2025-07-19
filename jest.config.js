module.exports = {
  testEnvironment: 'node',
  testMatch: [
    '**/tests/**/*.test.js',
    '**/tests/**/*.test.ts'
  ],
  moduleFileExtensions: ['js', 'ts'],
  transform: {
    '^.+\.ts$': 'ts-jest',
  },
  
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
    '/coverage/'
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
  ]
};