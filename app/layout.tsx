import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import Navbar from "@/components/Navbar"
import { ClerkProvider } from "@clerk/nextjs"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "TTTimes Finance - Currency Exchange API",
  description: "Secure and scalable currency exchange API with real-time rates",
  generator: "v0.dev",
}

// Check if Clerk keys are properly configured
const isClerkConfigured = () => {
  const publishableKey = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY
  return publishableKey && publishableKey.startsWith('pk_') && !publishableKey.includes('placeholder')
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const clerkConfigured = isClerkConfigured()
  
  if (clerkConfigured) {
    return (
      <ClerkProvider>
        <html lang="en">
          <body className={inter.className}>
            <Navbar />
            <main>{children}</main>
          </body>
        </html>
      </ClerkProvider>
    )
  }

  // Fallback without Clerk for build/development
  return (
    <html lang="en">
      <body className={inter.className}>
        <Navbar />
        <main>{children}</main>
      </body>
    </html>
  )
}
