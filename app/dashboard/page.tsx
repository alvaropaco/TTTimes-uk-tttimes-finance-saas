"use client"

import { useUser } from "@clerk/nextjs"
import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Copy, Eye, EyeOff } from "lucide-react"
import UsageChart from "@/components/UsageChart"
import Link from "next/link"

interface UsageData {
  todayUsage: number
  limit: number
  remaining: number
  weeklyUsage: Array<{
    date: string
    requests: number
  }>
}

export default function DashboardPage() {
  const { isSignedIn, user, isLoaded } = useUser()
  const [usageData, setUsageData] = useState<UsageData | null>(null)
  const [showApiKey, setShowApiKey] = useState(false)
  const [copied, setCopied] = useState(false)
  const [apiKey, setApiKey] = useState<string | null>(null)

  useEffect(() => {
    if (isSignedIn && user) {
      fetchUsageData()
      // Generate or fetch API key for the user
      generateApiKey()
    }
  }, [isSignedIn, user])

  const generateApiKey = async () => {
    // This would typically be handled by your backend
    // For now, we'll simulate an API key based on user ID
    if (user?.id) {
      const simulatedApiKey = `ttf_${user.id.slice(0, 8)}_${Math.random().toString(36).substring(2, 15)}`
      setApiKey(simulatedApiKey)
    }
  }

  const fetchUsageData = async () => {
    try {
      const response = await fetch("/api/dashboard/usage")
      if (response.ok) {
        const data = await response.json()
        setUsageData(data.data)
      }
    } catch (error) {
      console.error("Failed to fetch usage data:", error)
    }
  }

  const copyApiKey = async () => {
    if (apiKey) {
      await navigator.clipboard.writeText(apiKey)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  if (!isLoaded) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="w-8 h-8 animate-spin rounded-full border-2 border-blue-600 border-t-transparent" />
      </div>
    )
  }

  if (!isSignedIn) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center">
        <h1 className="text-2xl font-bold mb-4">Please sign in to access your dashboard</h1>
        <p className="text-gray-600 mb-8">
          You need to be authenticated to view your API usage and manage your account.
        </p>
      </div>
    )
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Welcome back, {user?.firstName || user?.fullName || "Developer"}!
        </h1>
        <p className="text-gray-600">Manage your API access and monitor your usage</p>
      </div>

      {/* API Key Section */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Your API Key</CardTitle>
          <CardDescription>Use this key in the Authorization header: Bearer YOUR_API_KEY</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-2">
            <div className="flex-1 font-mono text-sm bg-gray-100 p-3 rounded border">
              {showApiKey ? apiKey : "••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••"}
            </div>
            <Button variant="outline" size="sm" onClick={() => setShowApiKey(!showApiKey)}>
              {showApiKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </Button>
            <Button variant="outline" size="sm" onClick={copyApiKey}>
              <Copy className="w-4 h-4" />
              {copied ? "Copied!" : "Copy"}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Usage Stats */}
      {usageData && (
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Today's Usage</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{usageData.todayUsage}</div>
              <p className="text-xs text-gray-600">requests made today</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Remaining</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{usageData.remaining}</div>
              <p className="text-xs text-gray-600">requests left today</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Daily Limit</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{usageData.limit}</div>
              <p className="text-xs text-gray-600">requests per day</p>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Usage Chart */}
      {usageData && (
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Usage History (Last 7 Days)</CardTitle>
            <CardDescription>Track your API usage over time</CardDescription>
          </CardHeader>
          <CardContent>
            <UsageChart data={usageData.weeklyUsage} />
          </CardContent>
        </Card>
      )}

      {/* Quick Links */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Links</CardTitle>
          <CardDescription>Get started with our API</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-4">
            <Link href="/docs">
              <Button variant="outline" className="w-full justify-start bg-transparent">
                📚 API Documentation
              </Button>
            </Link>
            <Button variant="outline" className="w-full justify-start bg-transparent" disabled>
              🔧 API Testing Tool (Coming Soon)
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
