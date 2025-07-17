// Cleanup script for translation cache
// This script can be run periodically via cron job or scheduled task
// Run this script using: node scripts/cleanup-translation-cache.js

const { TranslationCacheService } = require('../lib/translation-cache')
require('dotenv').config({ path: '.env.local' })

async function cleanupTranslationCache() {
  console.log('🧹 Starting translation cache cleanup...')
  
  try {
    // Get stats before cleanup
    const statsBefore = await TranslationCacheService.getCacheStats()
    console.log('\n📊 Cache stats before cleanup:')
    console.log(`- Total entries: ${statsBefore.totalEntries}`)
    console.log(`- Estimated size: ${Math.round(statsBefore.totalSize / 1024)} KB`)
    
    // Perform cleanup (remove entries older than 30 days)
    const deletedCount = await TranslationCacheService.cleanupCache()
    console.log(`\n🗑️  Cleaned up ${deletedCount} old cache entries`)
    
    // Get stats after cleanup
    const statsAfter = await TranslationCacheService.getCacheStats()
    console.log('\n📊 Cache stats after cleanup:')
    console.log(`- Total entries: ${statsAfter.totalEntries}`)
    console.log(`- Estimated size: ${Math.round(statsAfter.totalSize / 1024)} KB`)
    
    const savedSpace = statsBefore.totalSize - statsAfter.totalSize
    if (savedSpace > 0) {
      console.log(`- Space saved: ${Math.round(savedSpace / 1024)} KB`)
    }
    
    console.log('\n✅ Translation cache cleanup completed successfully!')
    
  } catch (error) {
    console.error('❌ Error during cache cleanup:', error)
    process.exit(1)
  }
  
  process.exit(0)
}

cleanupTranslationCache()
