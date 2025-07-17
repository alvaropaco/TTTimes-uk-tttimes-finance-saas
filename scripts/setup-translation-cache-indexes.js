// MongoDB script to create indexes for translation cache optimization
// Run this script using: node scripts/setup-translation-cache-indexes.js

const { MongoClient } = require('mongodb')
require('dotenv').config({ path: '.env.local' })

async function setupIndexes() {
  const client = new MongoClient(process.env.MONGODB_URI)
  
  try {
    await client.connect()
    console.log('Connected to MongoDB')
    
    const db = client.db()
    const collection = db.collection('translation_cache')
    
    // Create compound index for fast cache lookups
    await collection.createIndex(
      {
        textHash: 1,
        sourceLanguage: 1,
        targetLanguage: 1
      },
      {
        name: 'cache_lookup_index',
        unique: true
      }
    )
    console.log('✅ Created cache lookup index')
    
    // Create index for cleanup operations (TTL-like behavior)
    await collection.createIndex(
      { lastAccessed: 1 },
      {
        name: 'last_accessed_index'
      }
    )
    console.log('✅ Created last accessed index')
    
    // Create index for statistics queries
    await collection.createIndex(
      { accessCount: -1 },
      {
        name: 'access_count_index'
      }
    )
    console.log('✅ Created access count index')
    
    // Create index for creation date
    await collection.createIndex(
      { createdAt: 1 },
      {
        name: 'created_at_index'
      }
    )
    console.log('✅ Created creation date index')
    
    console.log('\n🎉 All translation cache indexes created successfully!')
    
  } catch (error) {
    console.error('❌ Error setting up indexes:', error)
  } finally {
    await client.close()
  }
}

setupIndexes()
