import { config } from 'dotenv'
import { MongoClient } from 'mongodb'
import crypto from 'crypto'

// Load environment variables
config({ path: '.env.local' })

async function createMongoDBUser() {
  console.log('🔧 Creating MongoDB user directly...')
  
  const mongoUri = process.env.MONGODB_URI
  if (!mongoUri) {
    console.error('❌ MONGODB_URI not found in environment')
    return
  }
  
  const client = new MongoClient(mongoUri)
  
  try {
    await client.connect()
    console.log('✅ Connected to MongoDB')
    
    const db = client.db('zodii')
    const users = db.collection('users')
    
    const token = 'demo_token_abc123def456ghi789jkl012mno345pqr678stu901vwx234yz'
    const user = {
      email: 'demo@zodii.com',
      name: 'Demo User',
      token: token,
      createdAt: new Date(),
      plan: 'free',
      usage: {
        requests: 0,
        lastReset: new Date()
      }
    }
    
    // Check if user already exists
    const existingUser = await users.findOne({ email: user.email })
    if (existingUser) {
      console.log('⏭️  User already exists:', existingUser.email)
      console.log('🔑 Token:', existingUser.token)
    } else {
      const result = await users.insertOne(user)
      console.log('✅ User created successfully:')
      console.log(`   Email: ${user.email}`)
      console.log(`   Name: ${user.name}`)
      console.log(`   Token: ${user.token}`)
      console.log(`   ID: ${result.insertedId}`)
    }
    
    console.log('\n🎯 Test your API with this token:')
    console.log(`curl "http://localhost:3001/api/tarot/cards?token=${token}"`)
    
  } catch (error) {
    console.error('❌ Error:', error)
  } finally {
    await client.close()
  }
}

createMongoDBUser()
