import { type NextRequest, NextResponse } from "next/server"
import { currentUser } from "@clerk/nextjs/server"
import { getOrCreateUser } from "@/lib/auth"

// Force dynamic rendering
export const dynamic = "force-dynamic"

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

    // Mock usage data - replace with real data from your database
    const mockUsageData = {
      todayUsage: 45,
      limit: user.plan === "free" ? 100 : 100000,
      remaining: user.plan === "free" ? 55 : 99955,
      weeklyUsage: [
        { date: "2024-01-15", requests: 23 },
        { date: "2024-01-16", requests: 45 },
        { date: "2024-01-17", requests: 67 },
        { date: "2024-01-18", requests: 34 },
        { date: "2024-01-19", requests: 56 },
        { date: "2024-01-20", requests: 78 },
        { date: "2024-01-21", requests: 45 },
      ],
    }

    return NextResponse.json({
      success: true,
      data: mockUsageData,
    })
  } catch (error) {
    console.error("Dashboard usage API error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
