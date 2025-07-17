import { generateToken } from "@/lib/auth"
import { Database } from "@/lib/database"
import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, email, plan = "free" } = body

    if (!name || !email) {
      return NextResponse.json({ error: "Name and email are required" }, { status: 400 })
    }

    // Check if user already exists
    const existingUser = await Database.findUserByEmail(email)
    if (existingUser) {
      console.log("User already exists, returning existing token:", email)
      return NextResponse.json(
        {
          message: "User already exists",
          user: {
            id: existingUser._id,
            email: existingUser.email,
            name: existingUser.name,
            token: existingUser.token,
          },
        },
        { status: 200 },
      )
    }

    // Generate a unique token
    const token = generateToken()

    // Create new user
    const user = await Database.createUser({
      name,
      email,
      token,
      plan,
    })

    return NextResponse.json({
      success: true,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        token: user.token,
        plan: user.plan,
      },
    })
  } catch (error) {
    console.error("Signup error details:", {
      message: error instanceof Error ? error.message : "Unknown error",
      stack: error instanceof Error ? error.stack : undefined,
      code: error instanceof Error ? error.constructor.name : "Unknown",
    })

    return NextResponse.json({ error: "Failed to create user" }, { status: 500 })
  }
}
