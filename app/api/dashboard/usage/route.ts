import { type NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import connectDB from "@/lib/mongodb"
import { ApiUsage } from "@/lib/models/ApiUsage"
import { User } from "@/lib/models/User"
import { getTodayString } from "@/lib/utils"

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    await connectDB()

    const user = await User.findOne({ email: session.user.email })
    if (!user?.apiKey) {
      return NextResponse.json({ error: "API key not found" }, { status: 404 })
    }

    const today = getTodayString()
    const todayUsage = await ApiUsage.findOne({ apiKey: user.apiKey, date: today })

    // Get last 7 days usage
    const last7Days = []
    for (let i = 6; i >= 0; i--) {
      const date = new Date()
      date.setDate(date.getDate() - i)
      const dateString = date.toISOString().split("T")[0]
      last7Days.push(dateString)
    }

    const weeklyUsage = await ApiUsage.find({
      apiKey: user.apiKey,
      date: { $in: last7Days },
    })

    const usageChart = last7Days.map((date) => {
      const usage = weeklyUsage.find((u) => u.date === date)
      return {
        date,
        requests: usage ? usage.count : 0,
      }
    })

    return NextResponse.json({
      success: true,
      data: {
        todayUsage: todayUsage?.count || 0,
        limit: 100,
        remaining: 100 - (todayUsage?.count || 0),
        weeklyUsage: usageChart,
      },
    })
  } catch (error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
