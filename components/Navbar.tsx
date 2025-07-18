"use client"

import { useSession, signIn, signOut } from "next-auth/react"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function Navbar() {
  const { data: session, status } = useSession()

  return (
    <nav className="border-b bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="text-xl font-bold text-blue-600">
              TTTimes Finance
            </Link>
          </div>

          <div className="flex items-center space-x-4">
            <Link href="/docs" className="text-gray-600 hover:text-gray-900">
              Documentation
            </Link>

            {status === "loading" ? (
              <div className="w-8 h-8 animate-spin rounded-full border-2 border-blue-600 border-t-transparent" />
            ) : session ? (
              <div className="flex items-center space-x-4">
                <Link href="/dashboard">
                  <Button variant="outline">Dashboard</Button>
                </Link>
                <Button onClick={() => signOut()} variant="ghost">
                  Sign Out
                </Button>
              </div>
            ) : (
              <Button onClick={() => signIn("google")}>Sign In</Button>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}
