import { type NextRequest, NextResponse } from "next/server"
import connectDB from "../mongodb"
import { ApiUsage } from "../models/ApiUsage"
import { getTodayString } from "../utils"

export async function checkRateLimit(apiKey: string, endpoint: string): Promise<{ allowed: boolean; usage?: any }> {
  await connectDB()

  const today = getTodayString()

  let usage = await ApiUsage.findOne({ apiKey, date: today })

  if (!usage) {
    usage = new ApiUsage({
      apiKey,
      date: today,
      count: 0,
      requests: [],
    })
  }

  if (usage.count >= 100) {
    return { allowed: false, usage }
  }

  usage.count += 1
  usage.requests.push({
    endpoint,
    timestamp: new Date(),
  })

  await usage.save()

  return { allowed: true, usage }
}

export function withRateLimit(handler: Function) {
  return async (req: NextRequest) => {
    const apiKey = req.headers.get("authorization")?.replace("Bearer ", "")

    if (!apiKey) {
      return NextResponse.json({ error: "API key required" }, { status: 401 })
    }

    const endpoint = req.nextUrl.pathname
    const { allowed, usage } = await checkRateLimit(apiKey, endpoint)

    if (!allowed) {
      return NextResponse.json({ error: "Rate limit exceeded. Try again tomorrow." }, { status: 429 })
    }

    return handler(req, { usage })
  }
}
