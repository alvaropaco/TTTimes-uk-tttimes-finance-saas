# Testes de API - Sistema de Finanças SaaS

Este diretório contém um sistema completo de testes para todas as APIs implementadas no sistema.

## 📁 Estrutura dos Testes

\`\`\`
tests/
├── api-tests.js           # Testes gerais de API (classe principal)
├── auth-tests.js          # Testes específicos de autenticação
├── performance-tests.js   # Testes de performance e carga
├── run-all-tests.js      # Script para executar todos os testes
├── package.json          # Configurações e scripts npm
└── README.md            # Esta documentação
\`\`\`

## 🚀 Como Executar os Testes

### Pré-requisitos

1. Certifique-se de que o servidor de desenvolvimento está rodando:
\`\`\`bash
npm run dev
\`\`\`

2. Instale as dependências dos testes (se necessário):
\`\`\`bash
cd tests
npm install
\`\`\`

### Executar Todos os Testes

\`\`\`bash
# Executar todos os testes com relatório completo
node run-all-tests.js

# Ou usando npm
npm run test:all
\`\`\`

### Executar Testes Específicos

\`\`\`bash
# Testes gerais de API
node api-tests.js
npm run test

# Testes de autenticação
node tests/auth-tests.js
npm run test:auth

# Testes de performance
node tests/performance-tests.js
npm run test:performance
\`\`\`

## 📊 Tipos de Testes Implementados

### 1. Testes Gerais de API (`api-tests.js`)
- ✅ Health check
- ✅ Endpoints de autenticação (signin/signup)
- ✅ Endpoints de exemplo (GET/POST)
- ✅ Dashboard e subscription
- ✅ Tradução e cache
- ✅ Moedas e rates
- ✅ Stripe (subscription/portal)
- ✅ Diagnóstico
- ✅ Headers CORS
- ✅ Rate limiting
- ✅ Tratamento de erros

### 2. Testes de Autenticação (`auth-tests.js`)
- ✅ Validação de signup (email, nome, plano)
- ✅ Validação de signin (credenciais)
- ✅ Validação de tokens
- ✅ Headers de segurança
- ✅ Cenários de erro

### 3. Testes de Performance (`performance-tests.js`)
- ✅ Tempo de resposta dos endpoints
- ✅ Requisições concorrentes (10 e 25 simultâneas)
- ✅ Teste de memória (50 requisições sequenciais)
- ✅ Payloads grandes (10KB+)
- ✅ Recuperação após erros

## 🎯 Endpoints Testados

| Endpoint | Método | Autenticação | Testado |
|----------|--------|--------------|---------|
| `/api/health` | GET | ❌ | ✅ |
| `/api/signin` | POST | ❌ | ✅ |
| `/api/signup` | POST | ❌ | ✅ |
| `/api/example` | GET/POST | ✅ | ✅ |
| `/api/example/[id]` | GET | ✅ | ✅ |
| `/api/dashboard/subscription` | GET | ✅ | ✅ |
| `/api/translate` | POST/OPTIONS | ✅ | ✅ |
| `/api/translation-cache` | GET/DELETE | ✅ | ✅ |
| `/api/rates` | GET | ✅ | ✅ |
| `/api/supported` | GET | ✅ | ✅ |
| `/api/create-subscription-session` | POST | ❌ | ✅ |
| `/api/create-portal-session` | POST | ✅ | ✅ |
| `/api/diagnose-connection` | GET | ❌ | ✅ |
| `/api/test-connection` | GET | ❌ | ✅ |

## 📈 Métricas e Critérios de Aprovação

### Critérios de Sucesso
- **Taxa de aprovação geral**: > 80%
- **Tempo de resposta médio**: < 5 segundos
- **Requisições concorrentes**: > 80% de sucesso
- **Degradação de performance**: < 100% em testes sequenciais

### Métricas Coletadas
- Tempo de resposta (médio, mínimo, máximo)
- Taxa de sucesso por endpoint
- Performance sob carga
- Recuperação após erros

## 🔧 Configuração

### Variáveis de Ambiente
\`\`\`bash
NEXT_PUBLIC_APP_URL=http://localhost:3000  # URL base da API
\`\`\`

### Token de Teste
Os testes usam `demo_token` como token válido para autenticação. Este token é configurado no sistema para usuários de demonstração.

## 📋 Interpretando os Resultados

### Códigos de Status Esperados
- **200**: Sucesso
- **201**: Criado com sucesso
- **400**: Dados inválidos (esperado em testes de validação)
- **401**: Não autorizado (esperado sem token)
- **404**: Não encontrado (esperado para recursos inexistentes)
- **500**: Erro interno (aceitável para APIs não configuradas)

### Cores no Output
- 🟢 **Verde**: Teste passou
- 🔴 **Vermelho**: Teste falhou
- 🔵 **Azul**: Informação
- 🟡 **Amarelo**: Aviso
- 🟣 **Roxo**: Recomendação

## 🐛 Troubleshooting

### Problemas Comuns

1. **Servidor não está rodando**
   \`\`\`bash
   # Inicie o servidor de desenvolvimento
   npm run dev
   \`\`\`

2. **Falhas de conexão**
   - Verifique se a URL base está correta
   - Confirme que não há firewall bloqueando

3. **Muitos testes falhando**
   - Verifique se todas as dependências estão instaladas
   - Confirme se o banco de dados está conectado
   - Verifique configurações de ambiente

4. **Testes de Stripe falhando**
   - Normal se as chaves do Stripe não estiverem configuradas
   - Configure `STRIPE_SECRET_KEY` e `STRIPE_PUBLISHABLE_KEY`

## 🔄 Integração Contínua

Para integrar com CI/CD, adicione ao seu pipeline:

\`\`\`yaml
# Exemplo para GitHub Actions
- name: Run API Tests
  run: |
    npm run dev &
    sleep 10
    cd tests
    npm install
    node run-all-tests.js
\`\`\`

## 📝 Contribuindo

Para adicionar novos testes:

1. Crie uma nova classe de teste seguindo o padrão existente
2. Implemente o método `runAllTests()`
3. Adicione ao `run-all-tests.js`
4. Documente os novos endpoints testados

## 📞 Suporte

Se encontrar problemas com os testes:
1. Verifique os logs detalhados no output
2. Confirme que todos os pré-requisitos estão atendidos
3. Execute testes individuais para isolar problemas
4. Consulte a documentação da API
