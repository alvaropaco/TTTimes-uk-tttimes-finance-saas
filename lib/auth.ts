import { currentUser } from "@clerk/nextjs/server"
import connectDB from "./mongodb"
import { User } from "./models/User"
import { generateApiKey } from "./utils"
import type { NextAuthOptions } from "next-auth"

export async function getOrCreateUser() {
  try {
    const clerkUser = await currentUser()

    if (!clerkUser) {
      return null
    }

    await connectDB()

    let dbUser = await User.findOne({
      $or: [{ clerkId: clerkUser.id }, { email: clerkUser.emailAddresses[0]?.emailAddress }],
    })

    if (!dbUser) {
      // Create new user
      dbUser = new User({
        clerkId: clerkUser.id,
        email: clerkUser.emailAddresses[0]?.emailAddress,
        name: `${clerkUser.firstName || ""} ${clerkUser.lastName || ""}`.trim(),
        image: clerkUser.imageUrl,
        apiKey: generateApiKey(),
        plan: "free",
        createdAt: new Date(),
      })
      await dbUser.save()
    } else if (!dbUser.clerkId) {
      // Update existing user with Clerk ID
      dbUser.clerkId = clerkUser.id
      if (!dbUser.apiKey) {
        dbUser.apiKey = generateApiKey()
      }
      await dbUser.save()
    }

    return {
      id: dbUser._id.toString(),
      clerkId: dbUser.clerkId,
      email: dbUser.email,
      name: dbUser.name,
      image: dbUser.image,
      apiKey: dbUser.apiKey,
      plan: dbUser.plan,
    }
  } catch (error) {
    console.error("Error getting or creating user:", error)
    return null
  }
}

// -----------------------------------------------------------------------------
// ⚠️ Temporary stub to satisfy legacy NextAuth import in /api/auth route.
// Remove the [...nextauth] API route (and this stub) once Clerk migration
// is totally finished.
// -----------------------------------------------------------------------------
/**
 * Stub export so `/app/api/auth/[...nextauth]/route.ts` still compiles
 * while you finish migrating to Clerk.
 *
 * ➡  Delete this file after removing the legacy NextAuth route.
 */
export const authOptions: NextAuthOptions = {
  providers: [],
  callbacks: {},
}
