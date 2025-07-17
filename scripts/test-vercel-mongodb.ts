import { closeMongoDBConnection, connectToMongoDB } from "../lib/vercel-mongodb-fix"

async function testVercelMongoDB() {
  console.log("🔍 Testing MongoDB connection for Vercel serverless...")
  console.log("=".repeat(60))

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
      console.log("   MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/zodii")
      return
    }

    // Test connection with Vercel-optimized config
    console.log("\n2. Vercel-Optimized Connection Test:")
    
    const startTime = Date.now()
    const db = await connectToMongoDB()
    const connectionTime = Date.now() - startTime
    
    console.log(`   ✅ Connected to MongoDB in ${connectionTime}ms`)
    console.log(`   📊 Database: ${db.databaseName}`)

    // Test database operations
    console.log("\n3. Database Operations Test:")

    // List collections
    const collections = await db.listCollections().toArray()
    console.log(`   📋 Collections: ${collections.map((c) => c.name).join(", ") || "None yet"}`)

    // Test ping
    await db.command({ ping: 1 })
    console.log("   ✅ Database ping successful")

    // Test write operation
    const testCollection = db.collection("vercel_test")
    const testDoc = { 
      test: true, 
      timestamp: new Date(),
      environment: process.env.NODE_ENV || "development"
    }
    
    const result = await testCollection.insertOne(testDoc)
    console.log(`   ✅ Write test successful: ${result.insertedId}`)

    // Test read operation
    const readResult = await testCollection.findOne({ _id: result.insertedId })
    console.log(`   ✅ Read test successful: ${readResult ? "Document found" : "Document not found"}`)

    // Clean up test document
    await testCollection.deleteOne({ _id: result.insertedId })
    console.log("   ✅ Cleanup successful")

    // Database stats
    console.log("\n4. Database Statistics:")
    try {
      const stats = await db.stats()
      console.log(`   📊 Collections: ${stats.collections}`)
      console.log(`   📊 Data Size: ${(stats.dataSize / 1024).toFixed(2)} KB`)
      console.log(`   📊 Index Size: ${(stats.indexSize / 1024).toFixed(2)} KB`)
    } catch (error: any) {
      console.log(`   ⚠️  Stats not available: ${error.message}`)
    }

    // Connection info
    console.log("\n5. Connection Information:")
    console.log(`   🔗 Connection String: ${mongoUri.substring(0, 20)}...`)
    console.log(`   🗄️  Database: ${dbName}`)
    console.log(`   ⏱️  Connection Time: ${connectionTime}ms`)

    console.log("\n🎉 Vercel MongoDB test completed successfully!")
    console.log("💡 Your MongoDB setup is optimized for Vercel serverless!")

    // Close connection
    await closeMongoDBConnection()
  } catch (error: any) {
    console.error("\n❌ Vercel MongoDB test failed:")
    console.error(`   Error: ${error.message}`)

    if (error.message.includes("ECONNREFUSED")) {
      console.log("\n💡 Connection refused. Check:")
      console.log("   1. Is MongoDB Atlas accessible?")
      console.log("   2. Is the connection string correct?")
      console.log("   3. Are network access rules configured?")
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
      console.log("   5. Try the optimized Vercel configuration")
    }

    if (error.message.includes("serverSelectionTimeoutMS")) {
      console.log("\n💡 Server selection timeout. This is common in Vercel serverless.")
      console.log("   The optimized configuration should help with this.")
    }

    process.exit(1)
  }
}

// Run the test
testVercelMongoDB()
  .then(() => {
    console.log("\n✨ Test completed!")
    process.exit(0)
  })
  .catch((error) => {
    console.error("\n💥 Test failed:", error)
    process.exit(1)
  })
