import { type NextRequest, NextResponse } from "next/server"
import connectDB from "../mongodb"
import { User } from "../models/User"
import { ApiUsage } from "../models/ApiUsage"
import { getTodayString } from "../utils"

export async function validateApiKey(apiKey: string): Promise<{ valid: boolean; user?: any }> {
  try {
    await connectDB()
    const user = await User.findOne({ apiKey })
    return { valid: !!user, user }
  } catch (error) {
    console.error("API key validation error:", error)
    return { valid: false }
  }
}

export async function checkRateLimit(apiKey: string, endpoint: string): Promise<{ allowed: boolean; usage?: any }> {
  await connectDB()

  const today = getTodayString()

  let usage = await ApiUsage.findOne({ apiKey, date: today })

  if (!usage) {
    usage = new ApiUsage({
      apiKey,
      date: today,
      totalRequests: 0,
      endpoints: new Map(),
    })
  }

  if (usage.totalRequests >= 100) {
    return { allowed: false, usage }
  }

  usage.totalRequests += 1
  
  // Update endpoint-specific count
  const currentEndpointCount = usage.endpoints.get(endpoint) || 0
  usage.endpoints.set(endpoint, currentEndpointCount + 1)

  await usage.save()

  return { allowed: true, usage }
}

export function withAuth(handler: (req: NextRequest, context: { user: any; usage: any }) => Promise<NextResponse>) {
  return async (req: NextRequest): Promise<NextResponse> => {
    try {
      const authHeader = req.headers.get("authorization")
      
      if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return NextResponse.json({ error: "API key required. Use 'Bearer YOUR_API_KEY' in Authorization header" }, { status: 401 })
      }

      const apiKey = authHeader.replace("Bearer ", "")
      
      // Validate API key
      const { valid, user } = await validateApiKey(apiKey)
      
      if (!valid) {
        return NextResponse.json({ error: "Invalid API key" }, { status: 401 })
      }

      // Check rate limit
      const endpoint = req.nextUrl.pathname
      const { allowed, usage } = await checkRateLimit(apiKey, endpoint)

      if (!allowed) {
        return NextResponse.json({ 
          error: "Rate limit exceeded. Try again tomorrow.",
          limit: 100,
          used: usage?.totalRequests || 0
        }, { status: 429 })
      }

      // Add user and usage info to the request context
      return await handler(req, { user, usage })
    } catch (error) {
      console.error("Auth middleware error:", error)
      return NextResponse.json({ error: "Internal server error" }, { status: 500 })
    }
  }
}

export function withRateLimit(handler: (req: NextRequest, context: { user: any; usage: any }) => Promise<NextResponse>) {
  return async (req: NextRequest): Promise<NextResponse> => {
    try {
      const authHeader = req.headers.get("authorization")

      if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return NextResponse.json({ error: "API key required. Use 'Bearer YOUR_API_KEY' in Authorization header" }, { status: 401 })
      }

      const apiKey = authHeader.replace("Bearer ", "")
      
      // Validate API key
      const { valid, user } = await validateApiKey(apiKey)
      
      if (!valid) {
        return NextResponse.json({ error: "Invalid API key" }, { status: 401 })
      }

      const endpoint = req.nextUrl.pathname
      const { allowed, usage } = await checkRateLimit(apiKey, endpoint)

      if (!allowed) {
        return NextResponse.json({ 
          error: "Rate limit exceeded. Try again tomorrow.",
          limit: 100,
          used: usage?.totalRequests || 0
        }, { status: 429 })
      }

      return await handler(req, { user, usage })
    } catch (error) {
      console.error("Rate limit middleware error:", error)
      return NextResponse.json({ error: "Internal server error" }, { status: 500 })
    }
  }
}
