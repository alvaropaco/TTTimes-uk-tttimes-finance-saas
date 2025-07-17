const { MongoClient } = require('mongodb');
const fs = require('fs');

// Load environment variables
require('dotenv').config({ path: '.env.local' });

const uri = process.env.MONGODB_URI;
const dbName = process.env.MONGODB_DB_NAME || 'zodii';

if (!uri) {
  console.error('MONGODB_URI not found in environment');
  process.exit(1);
}

async function testDatabaseOperations() {
  const logFile = 'database-test-results.txt';
  fs.writeFileSync(logFile, 'Database Direct Test Results\n==============================\n\n');
  
  function log(message) {
    console.log(message);
    fs.appendFileSync(logFile, message + '\n');
  }
  
  let client;
  
  try {
    log('Connecting to MongoDB...');
    client = new MongoClient(uri);
    await client.connect();
    log('✓ Connected to MongoDB');
    
    const db = client.db(dbName);
    const usersCollection = db.collection('users');
    
    // Test 1: Check current users
    log('\nTest 1: Current users in database');
    const existingUsers = await usersCollection.find({}).toArray();
    log(`Found ${existingUsers.length} existing users`);
    existingUsers.forEach((user, index) => {
      log(`  ${index + 1}. ${user.email} (token: ${user.token?.substring(0, 10)}...)`);
    });
    
    // Test 2: Try to insert a new user directly
    log('\nTest 2: Direct user insertion');
    const testUser = {
      name: 'Direct Test User',
      email: `direct-test-${Date.now()}@example.com`,
      token: `direct_token_${Date.now()}`,
      plan: 'free',
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    log(`Attempting to insert user: ${testUser.email}`);
    const insertResult = await usersCollection.insertOne(testUser);
    log(`✓ Insert successful. ID: ${insertResult.insertedId}`);
    
    // Test 3: Verify the user was inserted
    log('\nTest 3: Verify insertion');
    const insertedUser = await usersCollection.findOne({ email: testUser.email });
    if (insertedUser) {
      log(`✓ User found: ${insertedUser.email}`);
    } else {
      log('✗ User not found after insertion');
    }
    
    // Test 4: Test the Database class method
    log('\nTest 4: Testing Database class method');
    try {
      // Import the Database class
      const { Database } = require('./lib/database.ts');
      
      const dbTestUser = {
        name: 'Database Class Test User',
        email: `db-class-test-${Date.now()}@example.com`,
        token: `db_class_token_${Date.now()}`,
        plan: 'free'
      };
      
      log(`Attempting to create user via Database class: ${dbTestUser.email}`);
      const createdUser = await Database.createUser(dbTestUser);
      log(`✓ Database.createUser successful. ID: ${createdUser._id}`);
      
      // Verify it was actually saved
      const verifyUser = await usersCollection.findOne({ email: dbTestUser.email });
      if (verifyUser) {
        log(`✓ User verified in database: ${verifyUser.email}`);
      } else {
        log('✗ User not found in database after Database.createUser');
      }
      
    } catch (dbError) {
      log(`✗ Database class error: ${dbError.message}`);
      log(`Stack: ${dbError.stack}`);
    }
    
    log('\n==============================');
    log('Test completed successfully');
    
  } catch (error) {
    log(`\n✗ Error: ${error.message}`);
    log(`Stack: ${error.stack}`);
  } finally {
    if (client) {
      await client.close();
      log('\nMongoDB connection closed');
    }
  }
}

testDatabaseOperations().catch(console.error);
