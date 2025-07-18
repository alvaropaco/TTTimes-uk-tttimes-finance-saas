import { type NextRequest, NextResponse } from "next/server"
import { validateToken } from "@/lib/auth"
import { Database } from "@/lib/database"

// Force dynamic rendering for this route since it uses request headers
export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  try {
    // Validate the user token
    const userOrError = await validateToken(request)

    // If validation failed, return the error response
    if (userOrError instanceof NextResponse) {
      return userOrError
    }

    const user = userOrError

    // For demo token, return mock data
    if (user.token === "demo_token") {
      return NextResponse.json({
        plan: "free",
        status: "active",
        requests: 45,
        limit: 100,
        resetDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 days from now
        customerId: null,
        subscriptionId: null,
      })
    }

    // Get current month's usage
    const startOfMonth = new Date()
    startOfMonth.setDate(1)
    startOfMonth.setHours(0, 0, 0, 0)

    const endOfMonth = new Date()
    endOfMonth.setMonth(endOfMonth.getMonth() + 1)
    endOfMonth.setDate(0)
    endOfMonth.setHours(23, 59, 59, 999)

    // Get user usage data for current month
    const usageData = await Database.getUserUsage(user._id!.toString(), startOfMonth, endOfMonth)
    const usageCount = usageData.length

    // Determine limits based on plan
    let limit = 100 // free plan default
    if (user.plan === "developer") limit = 10000
    if (user.plan === "production") limit = -1 // unlimited

    // Calculate next reset date (first day of next month)
    const nextResetDate = new Date()
    nextResetDate.setMonth(nextResetDate.getMonth() + 1)
    nextResetDate.setDate(1)
    nextResetDate.setHours(0, 0, 0, 0)

    return NextResponse.json({
      plan: user.plan || "free",
      status: "active",
      requests: usageCount,
      limit,
      resetDate: nextResetDate.toISOString(),
      customerId: null, // Would be populated from Stripe
      subscriptionId: null, // Would be populated from Stripe
    })
  } catch (error) {
    console.error("Subscription API error:", error)
    return NextResponse.json({ error: "Failed to fetch subscription data" }, { status: 500 })
  }
}
