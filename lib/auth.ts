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
      await connectDB()
      const dbUser = await User.findOne({ email: session.user?.email })

      if (dbUser && !dbUser.apiKey) {
        dbUser.apiKey = generateApiKey()
        await dbUser.save()
      }

      if (dbUser) {
        session.user.apiKey = dbUser.apiKey
      }

      return session
    },
  },
  pages: {
    signIn: "/auth/signin",
  },
}
