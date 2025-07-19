import { NextRequest, NextResponse } from "next/server"
import connectDB from "@/lib/mongodb"
import { User } from "@/lib/models/User"
import { generateApiKey } from "@/lib/utils"

// Force dynamic rendering
export const dynamic = 'force-dynamic'

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

    // Connect to MongoDB
    await connectDB()

    // Check if user already exists
    const existingUser = await User.findOne({ email })
    if (existingUser) {
      return NextResponse.json(
        {
          success: true,
          message: "User already exists",
          user: {
            id: existingUser._id,
            email: existingUser.email,
            apiKey: existingUser.apiKey,
            plan: existingUser.plan,
          },
        },
        { status: 200 },
      )
    }

    // Create new user
    const user = new User({
      name: name || email.split('@')[0],
      email,
      apiKey: generateApiKey(),
      plan,
    })

    await user.save()

    return NextResponse.json({
      success: true,
      user: {
        id: user._id,
        email: user.email,
        apiKey: user.apiKey,
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
