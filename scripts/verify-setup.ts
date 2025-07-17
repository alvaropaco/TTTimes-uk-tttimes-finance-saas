import pool from "../lib/database"
import { Database } from "../lib/database"

async function verifySetup() {
  console.log("🔍 Verifying Zodii setup...")

  try {
    // Test database connection
    console.log("1. Testing database connection...")
    const client = await pool.connect()

    try {
      const result = await client.query("SELECT NOW() as current_time")
      console.log("   ✅ Database connected successfully")
      console.log("   📅 Current time:", result.rows[0].current_time)
    } finally {
      client.release()
    }

    // Check if tables exist
    console.log("2. Checking database tables...")
    const client2 = await pool.connect()

    try {
      const tableCheck = await client2.query(`
        SELECT table_name 
        FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name IN ('users', 'api_usage')
        ORDER BY table_name;
      `)

      const existingTables = tableCheck.rows.map((row) => row.table_name)
      console.log("   📋 Existing tables:", existingTables)

      if (existingTables.length === 0) {
        console.log("   ⚠️  No tables found. Run: npm run init-db")
      } else {
        console.log("   ✅ Database tables found")
      }
    } finally {
      client2.release()
    }

    // Test user creation (dry run)
    console.log("3. Testing user operations...")
    try {
      const testEmail = "test-verify@zodii.com"

      // Check if test user exists
      const existingUser = await Database.getUserByEmail(testEmail)
      if (existingUser) {
        console.log("   ✅ User operations working (test user found)")
      } else {
        console.log("   ✅ User operations working (ready to create users)")
      }
    } catch (error) {
      console.log("   ❌ User operations failed:", error.message)
    }

    // Environment check
    console.log("4. Checking environment...")
    console.log("   🌍 NODE_ENV:", process.env.NODE_ENV || "not set")
    console.log("   🔗 DATABASE_URL:", process.env.DATABASE_URL ? "configured" : "NOT SET")

    if (!process.env.DATABASE_URL) {
      console.log("   ⚠️  DATABASE_URL not found in environment variables")
      console.log("   💡 Create .env.local file with DATABASE_URL")
    }

    console.log("\n🎉 Setup verification completed!")
    console.log("💡 Next steps:")
    console.log("   1. If tables missing: npm run init-db")
    console.log("   2. To add sample data: npm run seed-db")
    console.log("   3. Test health endpoint: curl http://localhost:3000/api/health")
  } catch (error) {
    console.error("❌ Setup verification failed:")
    console.error("   Error:", error.message)

    if (error.code === "ECONNREFUSED") {
      console.log("\n💡 Database connection refused. Check:")
      console.log("   1. Is PostgreSQL running?")
      console.log("   2. Is DATABASE_URL correct in .env.local?")
      console.log("   3. Can you connect manually: psql $DATABASE_URL")
    }

    if (error.message.includes("does not exist")) {
      console.log("\n💡 Database does not exist. Create it:")
      console.log("   createdb zodii")
    }
  }
}

verifySetup()
  .then(() => process.exit(0))
  .catch(() => process.exit(1))
