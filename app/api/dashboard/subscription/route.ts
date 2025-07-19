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
      plan: user.plan,
      subscription: {
        plan: user.plan,
        status: "active",
        createdAt: user.createdAt,
        features: user.plan === "free" ? ["Basic API access", "100 requests/day"] : ["Full API access", "Unlimited requests"]
      }
    })
  } catch (error) {
    console.error("Dashboard subscription API error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}