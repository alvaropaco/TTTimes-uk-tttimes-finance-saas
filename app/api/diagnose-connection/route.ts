import { NextResponse } from "next/server"
import { findBestConnection } from "@/lib/database-connection-helper"

export async function GET() {
  try {
    const mongoUri = process.env.MONGODB_URI || process.env.DATABASE_URL

    if (!mongoUri) {
      return NextResponse.json(
        {
          success: false,
          error: "MONGODB_URI not configured",
          timestamp: new Date().toISOString(),
        },
        { status: 500 },
      )
    }

    console.log("🔍 Starting connection diagnosis...")

    // Test different configurations
    const bestConfig = await findBestConnection(mongoUri)

    if (!bestConfig) {
      return NextResponse.json(
        {
          success: false,
          error: "No working connection configuration found",
          tested_configs: ["Vercel Optimized", "Basic SSL", "Minimal Config"],
          timestamp: new Date().toISOString(),
        },
        { status: 500 },
      )
    }

    // Try to connect with the working config
    const { Database } = await import("@/lib/database")
    const db = await Database.getDb()

    // Test basic operations
    await db.command({ ping: 1 })
    const collections = await db.listCollections().toArray()

    return NextResponse.json({
      success: true,
      message: "Connection successful",
      config_used: bestConfig.name,
      database: db.databaseName,
      collections: collections.map((c) => c.name),
      timestamp: new Date().toISOString(),
    })
  } catch (error: any) {
    console.error("Connection diagnosis failed:", error)

    return NextResponse.json(
      {
        success: false,
        error: error.message,
        error_type: error.constructor.name,
        timestamp: new Date().toISOString(),
        suggestions: [
          "Check MongoDB Atlas IP whitelist",
          "Verify connection string format",
          "Check database user permissions",
          "Ensure network connectivity",
        ],
      },
      { status: 500 },
    )
  }
}
