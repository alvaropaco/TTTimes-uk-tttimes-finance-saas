"use client"

import { useUser } from "@clerk/nextjs"
import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Copy, Eye, EyeOff } from "lucide-react"
import Link from "next/link"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Line,
  AreaChart,
  Area,
} from "recharts"

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

    // Simulate cost data for now
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

      {/* API Usage Over Time Chart */}
      {usageData && (
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>API Usage Over Time</CardTitle>
            <CardDescription>Daily API requests for the last 7 days</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={usageData.weeklyUsage}>
                  <defs>
                    <linearGradient id="colorRequests" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.8} />
                      <stop offset="95%" stopColor="#3B82F6" stopOpacity={0.1} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis
                    dataKey="date"
                    stroke="#6b7280"
                    fontSize={12}
                    tickFormatter={(value) =>
                      new Date(value).toLocaleDateString("en-US", { month: "short", day: "numeric" })
                    }
                  />
                  <YAxis stroke="#6b7280" fontSize={12} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "white",
                      border: "1px solid #e5e7eb",
                      borderRadius: "8px",
                      boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                    }}
                    labelFormatter={(value) =>
                      new Date(value).toLocaleDateString("en-US", {
                        weekday: "long",
                        month: "short",
                        day: "numeric",
                      })
                    }
                  />
                  <Area
                    type="monotone"
                    dataKey="requests"
                    stroke="#3B82F6"
                    fillOpacity={1}
                    fill="url(#colorRequests)"
                    strokeWidth={2}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Monthly Cost Analysis */}
      {costData && (
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Monthly Cost Analysis</CardTitle>
            <CardDescription>Total API costs and request volume by month</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={costData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="month" stroke="#6b7280" fontSize={12} />
                  <YAxis
                    yAxisId="cost"
                    orientation="left"
                    stroke="#6b7280"
                    fontSize={12}
                    tickFormatter={(value) => `$${value}`}
                  />
                  <YAxis
                    yAxisId="requests"
                    orientation="right"
                    stroke="#6b7280"
                    fontSize={12}
                    tickFormatter={(value) => `${(value / 1000).toFixed(0)}k`}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "white",
                      border: "1px solid #e5e7eb",
                      borderRadius: "8px",
                      boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                    }}
                    formatter={(value, name) => {
                      if (name === "cost") return [`$${value}`, "Total Cost"]
                      if (name === "requests") return [`${value.toLocaleString()}`, "Requests"]
                      return [value, name]
                    }}
                  />
                  <Bar yAxisId="cost" dataKey="cost" fill="#3B82F6" radius={[4, 4, 0, 0]} name="cost" />
                  <Line
                    yAxisId="requests"
                    type="monotone"
                    dataKey="requests"
                    stroke="#10B981"
                    strokeWidth={3}
                    dot={{ fill: "#10B981", strokeWidth: 2, r: 4 }}
                    name="requests"
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Cost Summary */}
            <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-blue-50 p-4 rounded-lg">
                <div className="text-2xl font-bold text-blue-600">
                  ${costData.reduce((sum, month) => sum + month.cost, 0).toFixed(2)}
                </div>
                <div className="text-sm text-blue-600">Total Cost (6 months)</div>
              </div>
              <div className="bg-green-50 p-4 rounded-lg">
                <div className="text-2xl font-bold text-green-600">
                  {costData.reduce((sum, month) => sum + month.requests, 0).toLocaleString()}
                </div>
                <div className="text-sm text-green-600">Total Requests</div>
              </div>
              <div className="bg-purple-50 p-4 rounded-lg">
                <div className="text-2xl font-bold text-purple-600">
                  $
                  {(
                    (costData.reduce((sum, month) => sum + month.cost, 0) /
                      costData.reduce((sum, month) => sum + month.requests, 0)) *
                    1000
                  ).toFixed(3)}
                </div>
                <div className="text-sm text-purple-600">Avg Cost per 1K requests</div>
              </div>
            </div>
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
