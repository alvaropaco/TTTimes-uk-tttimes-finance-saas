// Render on every request – never at build time
export const dynamic = "force-dynamic"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Star, Users, Activity, TrendingUp } from "lucide-react"
import { DatabaseAdapter } from "@/lib/database-adapter"

async function getAnalytics() {
  try {
    return await DatabaseAdapter.getApiUsageStats()
  } catch (error: any) {
    console.warn("[analytics] Error fetching stats:", error.message)
    // Return safe fallback
    return {
      userCount: 0,
      totalRequests: 0,
      successRate: 0,
      popularEndpoints: [],
      recentActivity: [],
    }
  }
}

export default async function AnalyticsPage() {
  const analytics = await getAnalytics()

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center space-x-2">
            <Star className="h-8 w-8 text-yellow-500" />
            <span className="text-2xl font-bold">Zodii Analytics</span>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-4">API Analytics Dashboard</h1>
          <p className="text-gray-600">Overview of your Zodii API usage and performance</p>
        </div>

        {/* Stats Cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Users</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{analytics.userCount}</div>
              <p className="text-xs text-muted-foreground">Active API users</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">API Requests</CardTitle>
              <Activity className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{analytics.totalRequests}</div>
              <p className="text-xs text-muted-foreground">Total API calls</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Success Rate</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{analytics.successRate.toFixed(1)}%</div>
              <p className="text-xs text-muted-foreground">Successful requests</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Avg Response</CardTitle>
              <Star className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">~200ms</div>
              <p className="text-xs text-muted-foreground">Response time</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Popular Endpoints */}
          <Card>
            <CardHeader>
              <CardTitle>Popular Endpoints</CardTitle>
              <CardDescription>Most frequently used API endpoints</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {analytics.popularEndpoints.map((endpoint, index) => (
                  <div key={endpoint.endpoint} className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Badge variant="outline">#{index + 1}</Badge>
                      <code className="text-sm bg-gray-100 px-2 py-1 rounded">{endpoint.endpoint}</code>
                    </div>
                    <span className="text-sm font-medium">{endpoint.count} calls</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Recent Activity */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
              <CardDescription>Latest API requests</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {analytics.recentActivity.map((activity, index) => (
                  <div key={index} className="flex items-center justify-between text-sm">
                    <div>
                      <div className="font-medium">{activity.name}</div>
                      <div className="text-gray-500">
                        {activity.method} {activity.endpoint}
                      </div>
                    </div>
                    <div className="text-right">
                      <Badge variant={activity.status_code === 200 ? "default" : "destructive"} className="mb-1">
                        {activity.status_code}
                      </Badge>
                      <div className="text-xs text-gray-500">{new Date(activity.created_at).toLocaleTimeString()}</div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
