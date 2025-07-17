# Translation Cache System

O sistema de cache de traduções foi implementado para reduzir o consumo da API da DeepL e melhorar a performance das traduções.

## Funcionalidades

### 🚀 Cache Inteligente
- **Hash-based caching**: Usa SHA-256 para gerar chaves únicas para cada texto
- **Multilingual support**: Suporta cache para diferentes pares de idiomas
- **Access tracking**: Rastreia quantas vezes cada tradução foi acessada
- **Automatic cleanup**: Remove entradas antigas automaticamente

### 📊 Estatísticas e Monitoramento
- **Cache hit/miss tracking**: Monitora eficiência do cache
- **Usage statistics**: Estatísticas de uso e performance
- **Size monitoring**: Controla o tamanho do cache

### 🔧 Otimizações de Performance
- **MongoDB indexes**: Índices otimizados para consultas rápidas
- **Text size limits**: Limita cache a textos de até 10KB
- **Batch operations**: Operações em lote para melhor performance

## Estrutura do Cache

### Modelo de Dados
\`\`\`typescript
interface TranslationCache {
  _id?: string
  textHash: string           // SHA-256 hash do texto original
  originalText: string       // Texto original
  translatedText: string     // Texto traduzido
  sourceLanguage: string     // Idioma de origem
  targetLanguage: string     // Idioma de destino
  createdAt?: Date          // Data de criação
  updatedAt?: Date          // Data de atualização
  accessCount?: number      // Número de acessos
  lastAccessed?: Date       // Último acesso
}
\`\`\`

### Índices MongoDB
- **cache_lookup_index**: `{ textHash: 1, sourceLanguage: 1, targetLanguage: 1 }` (unique)
- **last_accessed_index**: `{ lastAccessed: 1 }`
- **access_count_index**: `{ accessCount: -1 }`
- **created_at_index**: `{ createdAt: 1 }`

## APIs

### Translation API (`/api/translate`)
A API de tradução agora verifica automaticamente o cache antes de chamar a DeepL:

\`\`\`typescript
// Resposta com cache hit
{
  "translatedText": "Texto traduzido",
  "sourceLanguage": "en",
  "targetLanguage": "pt",
  "cached": true
}

// Resposta com cache miss (nova tradução)
{
  "translatedText": "Texto traduzido",
  "sourceLanguage": "en",
  "targetLanguage": "pt",
  "cached": false,
  "detectedSourceLanguage": "en"
}
\`\`\`

### Cache Management API (`/api/translation-cache`)

#### GET - Estatísticas do Cache
\`\`\`bash
curl -H "Authorization: Bearer YOUR_TOKEN" \
     https://your-domain.com/api/translation-cache
\`\`\`

Resposta:
\`\`\`json
{
  "success": true,
  "stats": {
    "totalEntries": 1250,
    "totalSize": 524288,
    "mostUsed": [
      {
        "text": "Hello world...",
        "accessCount": 45
      }
    ]
  }
}
\`\`\`

#### DELETE - Limpeza do Cache
\`\`\`bash
curl -X DELETE \
     -H "Authorization: Bearer YOUR_TOKEN" \
     https://your-domain.com/api/translation-cache
\`\`\`

Resposta:
\`\`\`json
{
  "success": true,
  "message": "Cleaned up 150 old cache entries",
  "deletedCount": 150
}
\`\`\`

## Scripts de Manutenção

### Setup de Índices
\`\`\`bash
node scripts/setup-translation-cache-indexes.js
\`\`\`
Cria os índices necessários no MongoDB para otimizar as consultas.

### Teste do Cache
\`\`\`bash
node scripts/test-translation-cache.js
\`\`\`
Testa a funcionalidade básica do cache.

### Limpeza Automática
\`\`\`bash
node scripts/cleanup-translation-cache.js
\`\`\`
Remove entradas antigas do cache (mais de 30 dias sem acesso).

## Configuração de Cron Job

Para limpeza automática, adicione ao crontab:

\`\`\`bash
# Limpeza diária às 2:00 AM
0 2 * * * cd /path/to/zodii-saas && node scripts/cleanup-translation-cache.js

# Limpeza semanal aos domingos às 3:00 AM
0 3 * * 0 cd /path/to/zodii-saas && node scripts/cleanup-translation-cache.js
\`\`\`

## Benefícios

### 💰 Redução de Custos
- **Menos chamadas à DeepL**: Cache hits evitam chamadas desnecessárias
- **Economia significativa**: Especialmente para textos repetidos

### ⚡ Melhor Performance
- **Resposta instantânea**: Cache hits são muito mais rápidos
- **Menor latência**: Sem dependência de APIs externas para conteúdo cached

### 🔄 Escalabilidade
- **Suporte a alto volume**: Cache reduz carga na API externa
- **Crescimento sustentável**: Menos dependência de limites de API

## Monitoramento

### Métricas Importantes
- **Cache hit rate**: Percentual de traduções servidas do cache
- **Cache size**: Tamanho total do cache em bytes
- **Most accessed translations**: Traduções mais populares
- **Cleanup frequency**: Frequência de limpeza necessária

### Alertas Recomendados
- Cache size > 100MB
- Cache hit rate < 30%
- Cleanup failures
- Database connection issues

## Troubleshooting

### Cache não está funcionando
1. Verificar conexão com MongoDB
2. Verificar se os índices foram criados
3. Verificar logs de erro na API

### Performance lenta
1. Verificar índices MongoDB
2. Verificar tamanho do cache
3. Executar limpeza manual

### Espaço em disco
1. Executar script de limpeza
2. Reduzir tempo de retenção
3. Implementar limpeza mais frequente
