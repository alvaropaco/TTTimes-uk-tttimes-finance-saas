import { type NextRequest, NextResponse } from "next/server"

// Force dynamic rendering
export const dynamic = "force-dynamic"

// Conditional Clerk import
let currentUser: any
try {
  currentUser = require("@clerk/nextjs/server").currentUser
} catch (error) {
  currentUser = async () => null
}

// Conditional auth import
let getOrCreateUser: any
try {
  getOrCreateUser = require("@/lib/auth").getOrCreateUser
} catch (error) {
  getOrCreateUser = async () => null
}

export async function GET(request: NextRequest) {
  try {
    const clerkUser = await currentUser()

    if (!clerkUser) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const user = await getOrCreateUser()

    if (!user) {
      return NextResponse.json({ error: "Failed to get user data" }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        apiKey: user.apiKey,
        plan: user.plan,
      },
    })
  } catch (error) {
    console.error("Dashboard user API error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
