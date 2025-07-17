// Test script for translation cache functionality
// Run this script using: node scripts/test-translation-cache.js

const { TranslationCacheService } = require('../lib/translation-cache')
require('dotenv').config({ path: '.env.local' })

async function testTranslationCache() {
  console.log('🧪 Testing Translation Cache...')
  
  try {
    // Test data
    const testText = 'Hello, this is a test message for translation caching.'
    const sourceLanguage = 'en'
    const targetLanguage = 'pt'
    const translatedText = 'Olá, esta é uma mensagem de teste para cache de tradução.'
    
    console.log('\n1. Testing cache miss (should return null)...')
    const cacheMiss = await TranslationCacheService.getCachedTranslation(
      testText,
      sourceLanguage,
      targetLanguage
    )
    console.log('Cache miss result:', cacheMiss)
    
    console.log('\n2. Setting cache entry...')
    await TranslationCacheService.setCachedTranslation(
      testText,
      translatedText,
      sourceLanguage,
      targetLanguage
    )
    console.log('✅ Cache entry set successfully')
    
    console.log('\n3. Testing cache hit (should return translation)...')
    const cacheHit = await TranslationCacheService.getCachedTranslation(
      testText,
      sourceLanguage,
      targetLanguage
    )
    console.log('Cache hit result:', cacheHit)
    
    console.log('\n4. Getting cache statistics...')
    const stats = await TranslationCacheService.getCacheStats()
    console.log('Cache stats:', JSON.stringify(stats, null, 2))
    
    console.log('\n🎉 Translation cache test completed successfully!')
    
  } catch (error) {
    console.error('❌ Error testing translation cache:', error)
  }
  
  process.exit(0)
}

testTranslationCache()
