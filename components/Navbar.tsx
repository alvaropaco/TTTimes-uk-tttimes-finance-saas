"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Menu, X, Zap, ArrowRight } from "lucide-react"
import { useState } from "react"

// Conditional Clerk imports
let useUser: any, SignInButton: any, SignUpButton: any, UserButton: any

try {
  const clerkModule = require("@clerk/nextjs")
  useUser = clerkModule.useUser
  SignInButton = clerkModule.SignInButton
  SignUpButton = clerkModule.SignUpButton
  UserButton = clerkModule.UserButton
} catch (error) {
  // Fallback when Clerk is not available
  useUser = () => ({ user: null, isLoaded: true })
  SignInButton = ({ children }: any) => children
  SignUpButton = ({ children }: any) => children
  UserButton = () => null
}

// Check if Clerk is properly configured
const isClerkConfigured = () => {
  if (typeof window === 'undefined') {
    // Server-side check
    const publishableKey = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY
    return publishableKey && publishableKey.startsWith('pk_') && !publishableKey.includes('placeholder')
  }
  return false
}

export default function Navbar() {
  const clerkConfigured = isClerkConfigured()
  const { user, isLoaded } = clerkConfigured ? useUser() : { user: null, isLoaded: true }
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const scrollToPricing = () => {
    const pricingSection = document.getElementById("pricing")
    if (pricingSection) {
      pricingSection.scrollIntoView({ behavior: "smooth" })
    }
    setIsMenuOpen(false)
  }

  return (
    <nav className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-gray-200/50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Enhanced Logo */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-3 group">
              <div className="relative">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-600 via-purple-600 to-blue-800 rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-105">
                  <Zap className="w-6 h-6 text-white" />
                </div>
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
              </div>
              <div className="flex flex-col">
                <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  TTTimes Finance
                </span>
                <span className="text-xs text-gray-500 -mt-1">CurrencyAPI</span>
              </div>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link
              href="/docs"
              className="text-gray-600 hover:text-blue-600 font-medium transition-colors duration-200 relative group"
            >
              Documentation
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-blue-600 transition-all duration-200 group-hover:w-full"></span>
            </Link>

            <button
              onClick={scrollToPricing}
              className="text-gray-600 hover:text-blue-600 font-medium transition-colors duration-200 relative group"
            >
              Pricing
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-blue-600 transition-all duration-200 group-hover:w-full"></span>
            </button>

            <div className="flex items-center space-x-1 text-sm text-gray-500">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              <span>99.9% uptime</span>
            </div>
          </div>

          {/* Auth Section */}
          <div className="flex items-center space-x-4">
            {!isLoaded ? (
              <div className="w-8 h-8 animate-spin rounded-full border-2 border-blue-600 border-t-transparent" />
            ) : user && clerkConfigured ? (
              <div className="flex items-center space-x-3">
                <div className="hidden sm:flex items-center space-x-2 bg-blue-50 px-3 py-1.5 rounded-full">
                  <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                  <span className="text-sm text-blue-700 font-medium">{user.firstName || "User"}</span>
                </div>

                <Link
                  href="/dashboard"
                  className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-blue-200 bg-transparent text-blue-600 hover:bg-blue-50 hover:border-blue-300 h-10 px-4 py-2"
                >
                  Dashboard
                </Link>

                <UserButton
                  afterSignOutUrl="/"
                  appearance={{
                    elements: {
                      avatarBox: "w-8 h-8",
                    },
                  }}
                />
              </div>
            ) : clerkConfigured ? (
              <div className="flex items-center space-x-3">
                <SignInButton mode="modal">
                  <Button variant="ghost" className="text-gray-600 hover:text-gray-900 hidden sm:inline-flex">
                    Sign In
                  </Button>
                </SignInButton>

                <SignUpButton mode="modal">
                  <Button className="bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:shadow-lg hover:shadow-blue-500/25 transition-all duration-300 group">
                    Get API Key
                    <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                  </Button>
                </SignUpButton>
              </div>
            ) : (
              <div className="flex items-center space-x-3">
                <Button variant="ghost" className="text-gray-600 hover:text-gray-900 hidden sm:inline-flex">
                  Sign In
                </Button>
                <Button className="bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:shadow-lg hover:shadow-blue-500/25 transition-all duration-300 group">
                  Get API Key
                  <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                </Button>
              </div>
            )}

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
            >
              {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden border-t border-gray-200 bg-white/95 backdrop-blur-md">
            <div className="px-4 py-4 space-y-4">
              <Link
                href="/docs"
                className="block text-gray-600 hover:text-blue-600 font-medium py-2"
                onClick={() => setIsMenuOpen(false)}
              >
                Documentation
              </Link>

              <button
                onClick={scrollToPricing}
                className="block text-gray-600 hover:text-blue-600 font-medium py-2 text-left w-full"
              >
                Pricing
              </button>

              <div className="flex items-center space-x-2 py-2">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                <span className="text-sm text-gray-500">99.9% uptime</span>
              </div>

              {!user && clerkConfigured && (
                <div className="pt-4 border-t border-gray-200 space-y-2">
                  <SignInButton mode="modal">
                    <Button variant="outline" className="w-full bg-transparent" onClick={() => setIsMenuOpen(false)}>
                      Sign In
                    </Button>
                  </SignInButton>
                  <SignUpButton mode="modal">
                    <Button
                      className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Get API Key
                    </Button>
                  </SignUpButton>
                </div>
              )}

              {!clerkConfigured && (
                <div className="pt-4 border-t border-gray-200 space-y-2">
                  <Button variant="outline" className="w-full bg-transparent">
                    Sign In
                  </Button>
                  <Button className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white">
                    Get API Key
                  </Button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}
