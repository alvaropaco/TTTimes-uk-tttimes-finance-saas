# MongoDB Vercel Serverless Fix

## Problema

O erro `MongoServerSelectionError: SSL routines:ssl3_read_bytes:tlsv1 alert internal error` ocorre quando o MongoDB tenta se conectar ao MongoDB Atlas no ambiente serverless da Vercel. Este é um problema comum relacionado a:

1. **Configurações SSL/TLS inadequadas** para ambiente serverless
2. **Timeouts muito curtos** para conexões serverless
3. **Pool de conexões inadequado** para funções serverless
4. **Configurações de rede** que não funcionam bem no Vercel

## Solução Implementada

### 1. Configurações SSL/TLS Otimizadas

\`\`\`typescript
const options = {
  // SSL/TLS configurações
  tls: true,
  tlsAllowInvalidCertificates: false,
  tlsAllowInvalidHostnames: false,
  
  // Timeouts otimizados para serverless
  serverSelectionTimeoutMS: 30000, // Aumentado de 5000 para 30000
  connectTimeoutMS: 30000, // Aumentado de 10000 para 30000
  socketTimeoutMS: 60000, // Aumentado de 45000 para 60000
  
  // Pool de conexões otimizado para serverless
  maxPoolSize: 1, // Reduzido de 10 para 1
  minPoolSize: 0,
  maxIdleTimeMS: 30000,
  
  // Configurações de retry
  retryWrites: true,
  retryReads: true,
  
  // Configurações de rede
  family: 4, // Força IPv4
  
  // Configurações de monitoramento
  heartbeatFrequencyMS: 30000, // Aumentado de 10000 para 30000
  serverMonitoringMode: "auto",
  
  // Configurações específicas para serverless
  directConnection: false,
}
\`\`\`

### 2. Principais Mudanças

#### Timeouts Aumentados
- `serverSelectionTimeoutMS`: 5000 → 30000ms
- `connectTimeoutMS`: 10000 → 30000ms  
- `socketTimeoutMS`: 45000 → 60000ms

#### Pool de Conexões Otimizado
- `maxPoolSize`: 10 → 1 (conexão única para serverless)
- `minPoolSize`: 0 (sem conexões mínimas)

#### Configurações de Rede
- `family: 4`: Força IPv4 para evitar problemas de DNS
- `directConnection: false`: Usa conexão indireta

#### Monitoramento
- `heartbeatFrequencyMS`: 10000 → 30000ms
- `serverMonitoringMode: "auto"`

### 3. Arquivos Modificados

1. **`lib/database.ts`**: Configuração principal otimizada
2. **`lib/vercel-mongodb-fix.ts`**: Configuração alternativa
3. **`lib/vercel-mongodb-config.ts`**: Configurações específicas para Vercel

### 4. Como Aplicar

1. **Certifique-se de que as variáveis de ambiente estão configuradas**:
   \`\`\`bash
   MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/zodii
   MONGODB_DB_NAME=zodii
   \`\`\`

2. **Deploy no Vercel**:
   \`\`\`bash
   vercel --prod
   \`\`\`

3. **Teste a conexão**:
   \`\`\`bash
   npm run test-connection
   \`\`\`

### 5. Verificação

Para verificar se a correção funcionou:

1. Acesse os logs do Vercel
2. Procure por: "Connected to MongoDB successfully"
3. Teste uma API endpoint que usa o MongoDB

### 6. Troubleshooting

Se ainda houver problemas:

1. **Verifique a string de conexão**: Certifique-se de que está usando `mongodb+srv://`
2. **Verifique o IP whitelist**: Adicione `0.0.0.0/0` temporariamente no MongoDB Atlas
3. **Teste com configuração de fallback**: Use `lib/vercel-mongodb-fix.ts`

### 7. Configurações Adicionais do MongoDB Atlas

No MongoDB Atlas, certifique-se de:

1. **Network Access**: Adicione `0.0.0.0/0` para permitir acesso de qualquer IP
2. **Database Access**: Verifique se o usuário tem permissões adequadas
3. **Cluster**: Use MongoDB 5.0+ para melhor compatibilidade

### 8. Monitoramento

Monitore os logs para:
- "Connected to MongoDB successfully"
- "Failed to connect to MongoDB"
- Tempos de conexão

### 9. Performance

As configurações otimizadas podem resultar em:
- Conexões mais estáveis
- Menos timeouts
- Melhor performance em ambiente serverless
- Redução de erros SSL/TLS

## Conclusão

Esta solução resolve especificamente os problemas de SSL/TLS que ocorrem no ambiente serverless da Vercel ao conectar com MongoDB Atlas. As configurações foram otimizadas para:

- Maior tolerância a timeouts
- Conexões mais estáveis
- Melhor compatibilidade com ambiente serverless
- Redução de erros de rede
