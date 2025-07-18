import type { NextAuthOptions } from "next-auth"
import GoogleProvider from "next-auth/providers/google"
import { MongoDBAdapter } from "@auth/mongodb-adapter"
import { MongoClient } from "mongodb"
import connectDB from "./mongodb"
import { User } from "./models/User"
import { generateApiKey } from "./utils"

const client = new MongoClient(process.env.MONGODB_URI!)

export const authOptions: NextAuthOptions = {
  adapter: MongoDBAdapter(client),
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  callbacks: {
    async session({ session, user }) {
      try {
        await connectDB()

        if (session.user?.email) {
          const dbUser = await User.findOne({ email: session.user.email })

          if (dbUser) {
            // Generate API key if user doesn't have one
            if (!dbUser.apiKey) {
              dbUser.apiKey = generateApiKey()
              await dbUser.save()
            }

            // Add user data to session
            session.user.apiKey = dbUser.apiKey
            session.user.id = dbUser._id.toString()
            session.user.plan = dbUser.plan || "free"
          } else {
            // Create new user if doesn't exist
            const newUser = new User({
              email: session.user.email,
              name: session.user.name,
              image: session.user.image,
              apiKey: generateApiKey(),
              plan: "free",
              createdAt: new Date(),
            })
            await newUser.save()

            session.user.apiKey = newUser.apiKey
            session.user.id = newUser._id.toString()
            session.user.plan = "free"
          }
        }

        return session
      } catch (error) {
        console.error("Session callback error:", error)
        // Return session even if database operations fail
        return session
      }
    },
    async jwt({ token, user, account }) {
      if (account) {
        token.accessToken = account.access_token
      }
      return token
    },
    async signIn({ user, account, profile }) {
      try {
        // Allow sign in
        return true
      } catch (error) {
        console.error("SignIn callback error:", error)
        return false
      }
    },
  },
  pages: {
    signIn: "/auth/signin",
    error: "/auth/error",
  },
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  secret: process.env.NEXTAUTH_SECRET,
  debug: process.env.NODE_ENV === "development",
}
