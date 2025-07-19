# Guia de Testes Automatizados

Este projeto agora possui um sistema completo de testes automatizados com gerenciamento automático do servidor Next.js.

## 🚀 Funcionalidades

### Gerenciamento Automático do Servidor
- **Início automático**: O servidor Next.js é iniciado automaticamente antes dos testes
- **Encerramento automático**: O servidor é encerrado automaticamente após os testes
- **Verificação de saúde**: Aguarda o servidor estar totalmente pronto antes de executar testes
- **Timeout inteligente**: Sistema de timeout para evitar travamentos

### Configuração de Testes
- **Setup global**: Configuração automática do ambiente de teste
- **Teardown global**: Limpeza automática após os testes
- **Execução sequencial**: Evita conflitos de porta executando testes em sequência
- **Logs filtrados**: Remove logs desnecessários do Next.js durante os testes

## 📋 Scripts Disponíveis

### Scripts Principais
```bash
# Executa todos os testes com servidor automático
npm run test

# Executa testes em modo watch (desenvolvimento)
npm run test:watch

# Executa testes com relatório de cobertura
npm run test:coverage

# Executa todos os testes (alias para npm run test)
npm run test:all
```

### Scripts Específicos
```bash
# Testa apenas endpoints de API
npm run test:api

# Testa apenas autenticação
npm run test:auth

# Testa apenas performance
npm run test:performance
```

### Scripts de Utilitários
```bash
# Apenas inicia o servidor (para debug)
npm run test:setup

# Apenas encerra o servidor (para limpeza manual)
npm run test:teardown
```

## 🔧 Estrutura dos Testes

### Arquivos de Configuração
- `tests/setup/globalSetup.js` - Inicia o servidor antes dos testes
- `tests/setup/globalTeardown.js` - Encerra o servidor após os testes
- `tests/setup/testEnvironment.js` - Configurações de ambiente
- `jest.config.js` - Configuração principal do Jest

### Arquivos de Teste
- `tests/api.test.js` - Testes principais de API
- `tests/auth-tests.js` - Testes de autenticação
- `tests/performance-tests.js` - Testes de performance
- `tests/run-all-tests.js` - Runner personalizado (legacy)

## 🧪 Como Executar

### Execução Simples
```bash
# Executa todos os testes
npm run test
```

### Execução com Cobertura
```bash
# Gera relatório de cobertura
npm run test:coverage
```

### Execução em Modo Watch
```bash
# Executa testes automaticamente quando arquivos mudam
npm run test:watch
```

### Execução Standalone
```bash
# Executa com runner personalizado
node tests/standalone-test-runner.js
```

## 📊 Relatórios

### Cobertura de Código
Os relatórios de cobertura são gerados em:
- `coverage/lcov-report/index.html` - Relatório HTML
- `coverage/lcov.info` - Dados LCOV
- Terminal - Resumo da cobertura

### Logs de Teste
- Logs detalhados no terminal
- Indicadores visuais de progresso
- Relatórios de erro detalhados
- Estatísticas de performance

## ⚙️ Configurações

### Variáveis de Ambiente
```bash
NODE_ENV=test                    # Ambiente de teste
NEXT_PUBLIC_APP_URL=http://localhost:3000  # URL do servidor
```

### Timeouts
- **Teste individual**: 30 segundos
- **Startup do servidor**: 30 segundos
- **Shutdown do servidor**: 5 segundos

### Portas
- **Servidor de teste**: 3000 (padrão)
- **Configurável via**: NEXT_PUBLIC_APP_URL

## 🔍 Debugging

### Logs Detalhados
Para ver logs detalhados do servidor durante os testes:
```bash
DEBUG=* npm run test
```

### Execução Manual
Para executar componentes individualmente:
```bash
# Apenas inicia servidor
npm run test:setup

# Em outro terminal, executa testes
npx jest tests/api.test.js

# Encerra servidor
npm run test:teardown
```

### Verificação de Saúde
Para verificar se o servidor está respondendo:
```bash
curl http://localhost:3000/api/health
```

## 🚨 Troubleshooting

### Servidor não inicia
1. Verifique se a porta 3000 está livre
2. Verifique as dependências: `npm install`
3. Verifique o banco de dados MongoDB

### Testes falham
1. Verifique se o servidor está respondendo
2. Verifique as variáveis de ambiente
3. Execute testes individuais para isolar problemas

### Timeout
1. Aumente o timeout em `jest.config.js`
2. Verifique a performance do sistema
3. Execute `npm run test:performance` para diagnóstico

## 📈 Melhorias Futuras

- [ ] Integração com CI/CD
- [ ] Testes de integração com banco de dados
- [ ] Testes de carga automatizados
- [ ] Relatórios de performance
- [ ] Testes de regressão visual
- [ ] Cobertura de testes E2E

## 🤝 Contribuindo

Para adicionar novos testes:
1. Crie arquivos `.test.js` na pasta `tests/`
2. Use a estrutura padrão do Jest
3. Aproveite o servidor automático já configurado
4. Execute `npm run test` para validar

Para modificar configurações:
1. Edite `jest.config.js` para configurações do Jest
2. Edite `tests/setup/` para configurações de ambiente
3. Teste as mudanças com `npm run test`
