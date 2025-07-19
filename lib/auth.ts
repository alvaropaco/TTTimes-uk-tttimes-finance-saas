import { currentUser } from "@clerk/nextjs/server"
import connectDB from "@/lib/mongodb"
import { User } from "@/lib/models/User"
import { generateApiKey } from "@/lib/security"
import type { NextAuthOptions } from "next-auth"

// Stub export for legacy NextAuth route compatibility
export const authOptions: NextAuthOptions = {}

export async function getOrCreateUser() {
  try {
    const clerkUser = await currentUser()

    if (!clerkUser) {
      return null
    }

    await connectDB()

    // Try to find existing user by Clerk ID
    let user = await User.findOne({ clerkId: clerkUser.id })

    if (!user) {
      // Create new user if doesn't exist
      user = new User({
        clerkId: clerkUser.id,
        email: clerkUser.emailAddresses[0]?.emailAddress,
        name:
          clerkUser.firstName && clerkUser.lastName
            ? `${clerkUser.firstName} ${clerkUser.lastName}`
            : clerkUser.username || clerkUser.emailAddresses[0]?.emailAddress,
        apiKey: generateApiKey(),
        plan: "free",
        createdAt: new Date(),
      })

      await user.save()
    }

    return user
  } catch (error) {
    console.error("Error in getOrCreateUser:", error)
    return null
  }
}
