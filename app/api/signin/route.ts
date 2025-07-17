import { type NextRequest, NextResponse } from "next/server"
import { Database } from "@/lib/database"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, password } = body

    if (!email || !password) {
      return NextResponse.json({ error: "Email and password are required" }, { status: 400 })
    }

    // Find user by email
    const user = await Database.findUserByEmail(email)
    if (!user) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 })
    }

    // For demo purposes, accept any password for existing users
    // In production, you would verify the password hash
    // const isValidPassword = await bcrypt.compare(password, user.passwordHash)
    // if (!isValidPassword) {
    //   return NextResponse.json({ error: "Invalid credentials" }, { status: 401 })
    // }

    return NextResponse.json({
      success: true,
      token: user.token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        plan: user.plan,
      },
    })
  } catch (error) {
    console.error("Sign in error:", error)
    return NextResponse.json({ error: "Sign in failed" }, { status: 500 })
  }
}
