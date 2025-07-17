// Example usage of the translation cache system
// This demonstrates how the cache reduces DeepL API calls

const fetch = require('node-fetch')
require('dotenv').config({ path: '.env.local' })

const API_BASE_URL = 'http://localhost:3000'
const AUTH_TOKEN = 'your-auth-token-here' // Replace with actual token

async function demonstrateTranslationCache() {
  console.log('🔄 Translation Cache Demonstration')
  console.log('================================\n')
  
  const testTexts = [
    'Hello, how are you today?',
    'The weather is beautiful.',
    'Thank you for your help.',
    'Hello, how are you today?', // Duplicate to show cache hit
  ]
  
  console.log('📊 Testing translations with cache...')
  
  for (let i = 0; i < testTexts.length; i++) {
    const text = testTexts[i]
    console.log(`\n${i + 1}. Translating: "${text}"`)
    
    const startTime = Date.now()
    
    try {
      const response = await fetch(`${API_BASE_URL}/api/translate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${AUTH_TOKEN}`,
          'Accept-Language': 'pt'
        },
        body: JSON.stringify({ text })
      })
      
      const result = await response.json()
      const endTime = Date.now()
      const duration = endTime - startTime
      
      if (result.success) {
        console.log(`   ✅ Translation: "${result.translatedText}"`)
        console.log(`   📈 Cached: ${result.cached ? 'YES' : 'NO'}`)
        console.log(`   ⏱️  Duration: ${duration}ms`)
        
        if (result.cached) {
          console.log('   🎯 Cache hit! No DeepL API call made.')
        } else {
          console.log('   🔄 Cache miss. DeepL API called and result cached.')
        }
      } else {
        console.log(`   ❌ Error: ${result.error}`)
      }
      
    } catch (error) {
      console.log(`   ❌ Request failed: ${error.message}`)
    }
  }
  
  // Get cache statistics
  console.log('\n📊 Getting cache statistics...')
  
  try {
    const response = await fetch(`${API_BASE_URL}/api/translation-cache`, {
      headers: {
        'Authorization': `Bearer ${AUTH_TOKEN}`
      }
    })
    
    const result = await response.json()
    
    if (result.success) {
      console.log('\n📈 Cache Statistics:')
      console.log(`   - Total entries: ${result.stats.totalEntries}`)
      console.log(`   - Cache size: ${Math.round(result.stats.totalSize / 1024)} KB`)
      console.log('   - Most used translations:')
      
      result.stats.mostUsed.forEach((item, index) => {
        console.log(`     ${index + 1}. "${item.text}" (${item.accessCount} times)`)
      })
    }
    
  } catch (error) {
    console.log(`   ❌ Failed to get cache stats: ${error.message}`)
  }
  
  console.log('\n🎉 Cache demonstration completed!')
  console.log('\n💡 Benefits observed:')
  console.log('   - Faster response times for cached translations')
  console.log('   - Reduced DeepL API consumption')
  console.log('   - Better user experience with instant responses')
}

// Run the demonstration
if (require.main === module) {
  demonstrateTranslationCache().catch(console.error)
}

module.exports = { demonstrateTranslationCache }
