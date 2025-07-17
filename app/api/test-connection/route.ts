import { NextResponse } from "next/server"
import { DatabaseAdapter } from "@/lib/database-adapter"

export async function GET() {
  try {
    console.log("Testing database connection...")

    // Check if we're in preview mode
    const isPreview = typeof process.env.VERCEL_ENV !== "undefined" && process.env.VERCEL_ENV === "preview"
    const hasMongoUri = !!(process.env.MONGODB_URI || process.env.DATABASE_URL)

    if (isPreview || !hasMongoUri) {
      return NextResponse.json({
        status: "success",
        message: "Running in preview mode with mock database",
        database: "mock",
        environment: "preview",
        timestamp: new Date().toISOString(),
      })
    }

    // Test real database connection
    const { Database } = await import("@/lib/database")
    const db = await Database.getDb()

    // Test basic operations
    const collections = await db.listCollections().toArray()
    const stats = await db.stats()

    // Test user operations
    const testResult = await testUserOperations()

    return NextResponse.json({
      status: "success",
      message: "Database connection successful",
      database: "mongodb",
      db_name: db.databaseName,
      collections: collections.map((c) => c.name),
      stats: {
        collections: stats.collections,
        dataSize: stats.dataSize,
        indexSize: stats.indexSize,
      },
      test_results: testResult,
      timestamp: new Date().toISOString(),
    })
  } catch (error: any) {
    console.error("Database connection test failed:", error)

    return NextResponse.json(
      {
        status: "error",
        message: "Database connection failed",
        error: error.message,
        error_code: error.code,
        timestamp: new Date().toISOString(),
      },
      { status: 500 },
    )
  }
}

async function testUserOperations() {
  try {
    // Test creating a user
    const testEmail = `test-${Date.now()}@zodii.com`
    const user = await DatabaseAdapter.createUser(testEmail, "Test User")

    // Test retrieving the user
    const foundUser = await DatabaseAdapter.getUserByToken(user.token)

    return {
      user_creation: "success",
      user_retrieval: foundUser ? "success" : "failed",
      test_user_email: testEmail,
      test_user_token: user.token.substring(0, 20) + "...",
    }
  } catch (error: any) {
    return {
      user_creation: "failed",
      error: error.message,
    }
  }
}
