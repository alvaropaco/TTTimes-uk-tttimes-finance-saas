import { NextRequest, NextResponse } from "next/server"
import { getMongoClient } from "@/lib/vercel-mongodb"

function generateToken(): string {
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, plan = "free", name } = body

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 })
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json({ error: "Invalid email format" }, { status: 400 })
    }

    // Validate plan
    const validPlans = ["free", "pro", "enterprise"]
    if (!validPlans.includes(plan)) {
      return NextResponse.json({ error: "Invalid plan. Must be one of: free, pro, enterprise" }, { status: 400 })
    }

    // Validate name if provided
    if (name !== undefined && (!name || name.trim() === "")) {
      return NextResponse.json({ error: "Name cannot be empty if provided" }, { status: 400 })
    }

    // Connect directly to MongoDB
    const client = await getMongoClient()
    const dbName = process.env.MONGODB_DB_NAME || "tttimes-finance"
    const db = client.db(dbName)
    const usersCollection = db.collection("users")

    // Check if user already exists
    const existingUser = await usersCollection.findOne({ email })
    if (existingUser) {
      return NextResponse.json(
        {
          success: true,
          message: "User already exists",
          user: {
            id: existingUser._id,
            email: existingUser.email,
            token: existingUser.token,
            plan: existingUser.plan,
          },
        },
        { status: 200 },
      )
    }

    // Generate a unique token
    const token = generateToken()

    // Create new user
    const userData = {
      name: name || email.split('@')[0], // Use provided name or email prefix as fallback
      email,
      token,
      plan,
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    const result = await usersCollection.insertOne(userData)
    const user = { ...userData, _id: result.insertedId }

    return NextResponse.json({
      success: true,
      user: {
        id: user._id,
        email: user.email,
        token: user.token,
        plan: user.plan,
      },
    }, { status: 201 })
  } catch (error) {
    console.error("Signup error details:", {
      message: error instanceof Error ? error.message : "Unknown error",
      stack: error instanceof Error ? error.stack : undefined,
      code: error instanceof Error ? error.constructor.name : "Unknown",
    })

    return NextResponse.json({ error: "Failed to create user" }, { status: 500 })
  }
}
