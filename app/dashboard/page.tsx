"use client"

import { useUser } from "@clerk/nextjs"
import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Copy, Eye, EyeOff, BarChart3, TrendingUp } from "lucide-react"
import Link from "next/link"
import { AreaChart } from "@/components/charts/AreaChart"
import { BarChart } from "@/components/charts/BarChart"

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
  const [costData, setCostData] = useState<Array<{
    month: string
    cost: number
    requests: number
  }> | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (isSignedIn && user) {
      fetchUsageData()
      generateApiKey()
    }
  }, [isSignedIn, user])

  const generateApiKey = async () => {
    if (user?.id) {
      const simulatedApiKey = `ttf_${user.id.slice(0, 8)}_${Math.random().toString(36).substring(2, 15)}`
      setApiKey(simulatedApiKey)
    }
  }

  const fetchUsageData = async () => {
    setIsLoading(true)
    try {
      const response = await fetch("/api/dashboard/usage")
      if (response.ok) {
        const data = await response.json()
        setUsageData(data.data)

        // Only set cost data if we have actual usage data
        if (data.data && data.data.weeklyUsage && data.data.weeklyUsage.some((day: any) => day.requests > 0)) {
          const mockCostData = [
            { month: "Jan", cost: 45.67, requests: 2076 },
            { month: "Feb", cost: 78.23, requests: 3556 },
            { month: "Mar", cost: 92.15, requests: 4189 },
            { month: "Apr", cost: 156.78, requests: 7126 },
            { month: "May", cost: 203.45, requests: 9248 },
            { month: "Jun", cost: 267.89, requests: 12177 },
          ]
          setCostData(mockCostData)
        }
      }
    } catch (error) {
      console.error("Failed to fetch usage data:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const copyApiKey = async () => {
    if (apiKey) {
      await navigator.clipboard.writeText(apiKey)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  // Check if we have any meaningful usage data
  const hasUsageData = usageData && usageData.weeklyUsage && usageData.weeklyUsage.some((day) => day.requests > 0)
  const hasCostData = costData && costData.some((month) => month.cost > 0)

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

  const EmptyStateCard = ({
    icon: Icon,
    title,
    description,
    actionText,
    actionHref,
  }: {
    icon: any
    title: string
    description: string
    actionText: string
    actionHref: string
  }) => (
    <Card className="border-2 border-dashed border-gray-300 bg-gray-50/50">
      <CardContent className="flex flex-col items-center justify-center py-12 text-center">
        <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mb-4">
          <Icon className="w-8 h-8 text-gray-400" />
        </div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">{title}</h3>
        <p className="text-gray-600 mb-6 max-w-sm">{description}</p>
        <Link href={actionHref}>
          <Button variant="outline" className="bg-white">
            {actionText}
          </Button>
        </Link>
      </CardContent>
    </Card>
  )

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
      {isLoading ? (
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          {[1, 2, 3].map((i) => (
            <Card key={i}>
              <CardContent className="p-6">
                <div className="animate-pulse">
                  <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
                  <div className="h-8 bg-gray-200 rounded w-1/3 mb-1"></div>
                  <div className="h-3 bg-gray-200 rounded w-2/3"></div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : usageData ? (
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
      ) : null}

      {/* API Usage Over Time Chart */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>API Usage Over Time</CardTitle>
          <CardDescription>Daily API requests for the last 7 days</CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="h-64 flex items-center justify-center">
              <div className="animate-pulse flex flex-col items-center">
                <div className="w-8 h-8 bg-gray-200 rounded mb-4"></div>
                <div className="h-4 bg-gray-200 rounded w-32"></div>
              </div>
            </div>
          ) : hasUsageData ? (
            <div className="h-64">
              <AreaChart data={usageData!.weeklyUsage} />
            </div>
          ) : (
            <EmptyStateCard
              icon={TrendingUp}
              title="No Usage Data Yet"
              description="Start making API requests to see your usage analytics and trends over time."
              actionText="View API Documentation"
              actionHref="/docs"
            />
          )}
        </CardContent>
      </Card>

      {/* Monthly Cost Analysis */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Monthly Cost Analysis</CardTitle>
          <CardDescription>Total API costs and request volume by month</CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="h-80 flex items-center justify-center">
              <div className="animate-pulse flex flex-col items-center">
                <div className="w-8 h-8 bg-gray-200 rounded mb-4"></div>
                <div className="h-4 bg-gray-200 rounded w-40"></div>
              </div>
            </div>
          ) : hasCostData ? (
            <>
              <div className="h-80">
                <BarChart data={costData!} />
              </div>

              {/* Cost Summary */}
              <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-blue-50 p-4 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600">
                    ${costData!.reduce((sum, month) => sum + month.cost, 0).toFixed(2)}
                  </div>
                  <div className="text-sm text-blue-600">Total Cost (6 months)</div>
                </div>
                <div className="bg-green-50 p-4 rounded-lg">
                  <div className="text-2xl font-bold text-green-600">
                    {costData!.reduce((sum, month) => sum + month.requests, 0).toLocaleString()}
                  </div>
                  <div className="text-sm text-green-600">Total Requests</div>
                </div>
                <div className="bg-purple-50 p-4 rounded-lg">
                  <div className="text-2xl font-bold text-purple-600">
                    $
                    {(
                      (costData!.reduce((sum, month) => sum + month.cost, 0) /
                        costData!.reduce((sum, month) => sum + month.requests, 0)) *
                      1000
                    ).toFixed(3)}
                  </div>
                  <div className="text-sm text-purple-600">Avg Cost per 1K requests</div>
                </div>
              </div>
            </>
          ) : (
            <EmptyStateCard
              icon={BarChart3}
              title="No Cost Data Available"
              description="Upgrade to Pro plan and start making requests to see detailed cost analysis and billing information."
              actionText="View Pricing Plans"
              actionHref="/docs#pricing"
            />
          )}
        </CardContent>
      </Card>

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
