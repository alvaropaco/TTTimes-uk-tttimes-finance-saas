# Translation API Documentation

## Overview
The Translation API allows you to translate English text to other languages using the DeepL translation service.

## Endpoint
\`\`\`
POST /api/translate
\`\`\`

## Authentication
Requires a valid authentication token in one of the following ways:
- Query parameter: `?token=your_token_here`
- Authorization header: `Authorization: Bearer your_token_here`

## Headers
- `Content-Type: application/json`
- `lang: target_language_code` (required) - The target language code (e.g., 'es' for Spanish, 'fr' for French, 'de' for German)

## Request Body
\`\`\`json
{
  "text": "Hello, how are you today?"
}
\`\`\`

## Response
### Success Response (200)
\`\`\`json
{
  "success": true,
  "data": {
    "originalText": "Hello, how are you today?",
    "translatedText": "Hola, ¿cómo estás hoy?",
    "targetLanguage": "es",
    "sourceLanguage": "en"
  }
}
\`\`\`

### Error Responses

#### Missing Authentication (401)
\`\`\`json
{
  "error": "Token is required"
}
\`\`\`

#### Missing Language Header (400)
\`\`\`json
{
  "error": "Language parameter is required in headers"
}
\`\`\`

#### Missing Text (400)
\`\`\`json
{
  "error": "Text to translate is required"
}
\`\`\`

#### Service Not Configured (500)
\`\`\`json
{
  "error": "Translation service not configured"
}
\`\`\`

## Example Usage

### cURL
\`\`\`bash
curl -X POST http://localhost:3000/api/translate \
  -H "Content-Type: application/json" \
  -H "lang: es" \
  -H "Authorization: Bearer your_token_here" \
  -d '{"text": "Hello, how are you today?"}'
\`\`\`

### JavaScript/TypeScript
\`\`\`typescript
const response = await fetch('/api/translate', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'lang': 'es',
    'Authorization': 'Bearer your_token_here'
  },
  body: JSON.stringify({
    text: 'Hello, how are you today?'
  })
});

const result = await response.json();
console.log(result.data.translatedText); // "Hola, ¿cómo estás hoy?"
\`\`\`

## Supported Languages
The API supports all languages supported by DeepL. Common language codes include:
- `es` - Spanish
- `fr` - French
- `de` - German
- `it` - Italian
- `pt` - Portuguese
- `ru` - Russian
- `ja` - Japanese
- `zh` - Chinese
- `ko` - Korean
- `nl` - Dutch
- `pl` - Polish

For a complete list, refer to the [DeepL API documentation](https://www.deepl.com/docs-api/translate/translate-text/).

## Environment Setup
To use this API, you need to:

1. Sign up for a DeepL API account at https://www.deepl.com/pro-api
2. Get your API key
3. Add it to your environment variables:
   \`\`\`
   DEEPL_API_KEY=your-deepl-api-key-here
   \`\`\`

## Rate Limits
Rate limits depend on your DeepL API plan. The free plan includes 500,000 characters per month.
