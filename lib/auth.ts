import { type NextRequest, NextResponse } from "next/server"
import { Database } from "./database"
import crypto from "crypto"

export interface AuthenticatedUser {
  _id?: string
  email: string
  token: string
  plan?: string
  createdAt?: Date
  stripeCustomerId?: string
  stripeSubscriptionId?: string
}

export async function validateToken(request: NextRequest): Promise<AuthenticatedUser | NextResponse> {
  try {
    // Get token from Authorization header
    const authHeader = request.headers.get("authorization")
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json({ error: "Missing or invalid authorization header" }, { status: 401 })
    }

    const token = authHeader.substring(7) // Remove "Bearer " prefix

  if (!token) {
    return NextResponse.json({ error: "Token is required" }, { status: 401 })
  }

    // For demo purposes, allow demo_token
    if (token === "demo_token") {
      return {
        _id: "demo_user_id",
        email: "demo@example.com",
        token: "demo_token",
        plan: "free",
        createdAt: new Date(),
      }
    }

    // Validate token with database using the correct method
    const user = await Database.findUserByToken(token)
    if (!user) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 })
    }

    return {
      _id: user._id?.toString(),
      email: user.email,
      token: user.token,
      plan: user.plan,
      createdAt: user.createdAt,
      stripeCustomerId: user.stripeCustomerId,
      stripeSubscriptionId: user.stripeSubscriptionId,
    }
  } catch (error) {
    console.error("Token validation error:", error)
    return NextResponse.json({ error: "Authentication failed" }, { status: 401 })
  }

}

/**
 * Generate a secure random token for user authentication
 * @returns A 64-character hexadecimal token
 */
export function generateToken(): string {
  return crypto.randomBytes(32).toString('hex')
}
