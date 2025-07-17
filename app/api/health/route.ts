import { NextResponse } from "next/server"

const isPreviewEnvironment = () => {
  return (
    typeof window !== "undefined" ||
    (!process.env.MONGODB_URI && !process.env.DATABASE_URL) ||
    process.env.NODE_ENV === "test" ||
    process.env.VERCEL_ENV === "preview"
  )
}

export async function GET() {
  try {
    if (isPreviewEnvironment()) {
      return NextResponse.json({
        status: "healthy",
        database: "mock",
        environment: "preview/demo",
        message: "Running in preview mode with mock database",
        demo_tokens: [
          "demo_token_abc123def456ghi789jkl012mno345pqr678stu901vwx234yz",
          "test_token_xyz987wvu654tsr321qpo098nml765kji432hgf109edc876ba",
        ],
        timestamp: new Date().toISOString(),
      })
    }

    // Real database health check
    const { Database } = await import("@/lib/database")
    const db = await Database.getDb()

    // Get database information
    const collections = await db.listCollections().toArray()
    const stats = await db.stats()

    // Test a simple query
    const userCount = await db.collection("users").countDocuments()

    return NextResponse.json({
      status: "healthy",
      database: "mongodb",
      db_name: db.databaseName,
      collections: collections.map((c) => c.name),
      user_count: userCount,
      stats: {
        collections: stats.collections,
        data_size_kb: Math.round(stats.dataSize / 1024),
        index_size_kb: Math.round(stats.indexSize / 1024),
      },
      environment: process.env.NODE_ENV || "development",
      timestamp: new Date().toISOString(),
    })
  } catch (error: any) {
    console.error("Health check failed:", error)
    return NextResponse.json(
      {
        status: "unhealthy",
        database: "mongodb",
        error: error.message,
        error_code: error.code,
        environment: process.env.NODE_ENV || "development",
        timestamp: new Date().toISOString(),
      },
      { status: 500 },
    )
  }
}
