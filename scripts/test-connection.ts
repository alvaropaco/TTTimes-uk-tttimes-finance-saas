import 'dotenv/config'
import { findBestConnection } from "../lib/database-connection-helper"

async function testConnection() {
  console.log("🔍 Testing Zodii MongoDB Connection...")
  console.log("=".repeat(50))

  try {
    // Check environment variables
    console.log("1. Environment Check:")
    const mongoUri = process.env.MONGODB_URI || process.env.DATABASE_URL
    const dbName = process.env.MONGODB_DB_NAME || "zodii"

    console.log(`   📍 MONGODB_URI: ${mongoUri ? "✅ Set" : "❌ Missing"}`)
    console.log(`   📍 MONGODB_DB_NAME: ${dbName}`)
    console.log(`   📍 NODE_ENV: ${process.env.NODE_ENV || "development"}`)

    if (!mongoUri) {
      console.log("\n❌ MONGODB_URI is not set!")
      console.log("💡 Add to .env.local:")
      console.log("   MONGODB_URI=mongodb://localhost:27017/zodii")
      console.log("   # OR for Atlas:")
      console.log("   MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/zodii")
      return
    }

    // Test different connection configurations
    console.log("\n2. Connection Configuration Test:")
    const bestConfig = await findBestConnection(mongoUri)

    if (!bestConfig) {
      console.log("❌ Could not establish connection with any configuration")
      return
    }

    // Test database connection with the working config
    console.log("\n3. Database Connection:")
    const { Database } = await import("../lib/database")
    const db = await Database.getDb()
    console.log(`   ✅ Connected to MongoDB`)
    console.log(`   📊 Database: ${db.databaseName}`)

    // Test database operations
    console.log("\n4. Database Operations:")

    // Create indexes
    await Database.createIndexes()
    console.log("   ✅ Indexes created/verified")

    // List collections
    const collections = await db.listCollections().toArray()
    console.log(`   📋 Collections: ${collections.map((c) => c.name).join(", ") || "None yet"}`)

    // Test user creation
    console.log("\n5. User Operations Test:")
    const testEmail = `test-${Date.now()}@zodii.com`

    try {
      const testUser = await Database.createUser({
        email: testEmail,
        name: "Test User",
        token: "test-token",
        plan: "free",
      })
      console.log(`   ✅ User created: ${testUser.email}`)
      console.log(`   🔑 Token: ${testUser.token.substring(0, 20)}...`)

      // Test user retrieval
      const foundUser = await db.collection('users').findOne({ token: testUser.token })
      console.log(`   ✅ User retrieved by token: ${foundUser?.email}`)

      const foundByEmail = await db.collection('users').findOne({ email: testEmail })
      console.log(`   ✅ User retrieved by email: ${foundByEmail?.email}`)
    } catch (error: any) {
      console.log(`   ❌ User operations failed: ${error.message}`)
    }

    // Test API usage logging
    console.log("\n6. API Usage Logging Test:")
    try {
      await Database.logApiUsage({
        userId: "test-user-id",
        token: "test-token",
        endpoint: "/api/test",
        method: "GET",
        status_code: 200,
        response_time_ms: 150,
        ip: "127.0.0.1",
      })
      console.log("   ✅ API usage logged successfully")
    } catch (error: any) {
      console.log(`   ❌ API usage logging failed: ${error.message}`)
    }

    // Test analytics
    console.log("\n7. Analytics Test:")
    try {
      const stats = await Database.getApiUsageStats()
      console.log(`   ✅ Analytics retrieved:`)
      console.log(`      👥 Users: ${('userCount' in stats) ? stats.userCount : 'N/A'}`)
      console.log(`      📊 Requests: ${stats.totalRequests}`)
      // Calculate success rate from status codes if available
      const successRate = stats.statusCodes?.find(code => code._id === 200)?.count 
        ? ((stats.statusCodes.find(code => code._id === 200)?.count || 0) / stats.totalRequests * 100).toFixed(1)
        : 'N/A';
      console.log(`      ✅ Success Rate: ${successRate}%`)
    } catch (error: any) {
      console.log(`   ❌ Analytics failed: ${error.message}`)
    }

    // Database stats
    console.log("\n8. Database Statistics:")
    try {
      const stats = await db.stats()
      console.log(`   📊 Collections: ${stats.collections}`)
      console.log(`   📊 Data Size: ${(stats.dataSize / 1024).toFixed(2)} KB`)
      console.log(`   📊 Index Size: ${(stats.indexSize / 1024).toFixed(2)} KB`)
    } catch (error: any) {
      console.log(`   ⚠️  Stats not available: ${error.message}`)
    }

    console.log("\n🎉 Connection test completed successfully!")
    console.log("💡 Your MongoDB setup is working correctly!")

    // Close connection
    await Database.closeConnection()
  } catch (error: any) {
    console.error("\n❌ Connection test failed:")
    console.error(`   Error: ${error.message}`)

    if (error.message.includes("ECONNREFUSED")) {
      console.log("\n💡 Connection refused. Check:")
      console.log("   1. Is MongoDB running? (mongod)")
      console.log("   2. Is the connection string correct?")
      console.log("   3. Are you using the right port? (default: 27017)")
    }

    if (error.message.includes("authentication failed")) {
      console.log("\n💡 Authentication failed. Check:")
      console.log("   1. Username and password in connection string")
      console.log("   2. Database user permissions")
      console.log("   3. Network access (for Atlas)")
    }

    if (error.message.includes("network timeout") || error.message.includes("SSL")) {
      console.log("\n💡 Network/SSL timeout. Check:")
      console.log("   1. Internet connection (for Atlas)")
      console.log("   2. Firewall settings")
      console.log("   3. MongoDB Atlas IP whitelist")
      console.log("   4. SSL/TLS configuration")
      console.log("   5. Try different connection options")
    }

    process.exit(1)
  }
}

// Run the test
testConnection()
  .then(() => {
    console.log("\n✨ Test completed!")
    process.exit(0)
  })
  .catch((error) => {
    console.error("\n💥 Test failed:", error)
    process.exit(1)
  })
