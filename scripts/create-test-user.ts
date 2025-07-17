import 'dotenv/config'
import { Database } from '../lib/database'
import { closeMongoDBConnection } from '../lib/vercel-mongodb-fix'

async function createTestUser() {
  console.log('🔧 Creating test user...')
  
  try {
    // Check if demo user already exists
    const existingUser = await Database.findUserByEmail('demo@zodii.com')
    if (existingUser) {
      console.log('✅ Demo user already exists:')
      console.log(`   Email: ${existingUser.email}`)
      console.log(`   Name: ${existingUser.name}`)
      console.log(`   Token: ${existingUser.token}`)
      console.log(`   ID: ${existingUser._id}`)
      return
    }

    // Create a test user
    const testUser = await Database.createUser({
      email: 'demo@zodii.com',
      name: 'Demo User',
      token: 'demo_token_abc123def456ghi789jkl012mno345pqr678stu901vwx234yz',
      plan: 'free'
    })
    console.log('✅ Test user created successfully:')
    console.log(`   Email: ${testUser.email}`)
    console.log(`   Name: ${testUser.name}`)
    console.log(`   Token: ${testUser.token}`)
    console.log(`   ID: ${testUser._id}`)
    
    console.log('\n🎯 Test your API with this token:')
    console.log(`curl "http://localhost:3000/api/example?token=${testUser.token}"`)
    
  } catch (error) {
    console.error('❌ Error creating test user:', error)
  } finally {
    await closeMongoDBConnection()
  }
}

createTestUser()
