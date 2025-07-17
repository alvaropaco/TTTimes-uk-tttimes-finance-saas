"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
} from "recharts"
import {
  Activity,
  CreditCard,
  Calendar,
  ExternalLink,
  Copy,
  CheckCircle,
  AlertTriangle,
  TrendingUp,
  User,
  HelpCircle,
  LogOut,
  Home,
  BarChart3,
  Key,
  Bell,
  Shield,
} from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"

interface SubscriptionData {
  plan: string
  status: string
  requests: number
  limit: number
  resetDate: string | null
  customerId?: string
  subscriptionId?: string
}

interface UsageData {
  date: string
  requests: number
}

interface EndpointData {
  endpoint: string
  requests: number
}

const sidebarItems = [
  {
    title: "Overview",
    icon: Home,
    url: "#overview",
  },
  {
    title: "API Usage",
    icon: BarChart3,
    url: "#usage",
  },
  {
    title: "API Keys",
    icon: Key,
    url: "#keys",
  },
  {
    title: "Subscription",
    icon: CreditCard,
    url: "#subscription",
  },
  {
    title: "Account",
    icon: User,
    url: "#account",
  },
  {
    title: "Notifications",
    icon: Bell,
    url: "#notifications",
  },
  {
    title: "Security",
    icon: Shield,
    url: "#security",
  },
  {
    title: "Help & Support",
    icon: HelpCircle,
    url: "#help",
  },
]

export default function DashboardPage() {
  const router = useRouter()
  const [subscription, setSubscription] = useState<SubscriptionData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [copied, setCopied] = useState(false)
  const [activeTab, setActiveTab] = useState("overview")
  const [userEmail, setUserEmail] = useState("demo@example.com")

  // Mock data for charts
  const usageData: UsageData[] = [
    { date: "Jan", requests: 45 },
    { date: "Feb", requests: 52 },
    { date: "Mar", requests: 48 },
    { date: "Apr", requests: 61 },
    { date: "May", requests: 55 },
    { date: "Jun", requests: 67 },
    { date: "Jul", requests: 73 },
  ]

  const endpointData: EndpointData[] = [
    { endpoint: "/api/zodiac/signs", requests: 234 },
    { endpoint: "/api/numerology/life-path", requests: 189 },
    { endpoint: "/api/tarot/draw", requests: 156 },
    { endpoint: "/api/compatibility", requests: 98 },
    { endpoint: "/api/birth-chart", requests: 67 },
  ]

  const statusData = [
    { name: "Success", value: 892, color: "#10b981" },
    { name: "Error", value: 23, color: "#ef4444" },
    { name: "Timeout", value: 5, color: "#f59e0b" },
  ]

  useEffect(() => {
    // Check if user has a token, if not redirect to signup
    const token = localStorage.getItem("zodii_token")
    if (!token) {
      // Set a demo token for testing
      localStorage.setItem("zodii_token", "demo_token")
    }

    fetchSubscriptionData()
  }, [])

  const fetchSubscriptionData = async () => {
    try {
      const token = localStorage.getItem("zodii_token")
      if (!token) {
        setError("No authentication token found")
        return
      }

      const response = await fetch("/api/dashboard/subscription", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (response.ok) {
        const data = await response.json()
        setSubscription(data)
      } else {
        const errorData = await response.json()
        setError(errorData.error || "Failed to load subscription data")
      }
    } catch (err) {
      console.error("Network error:", err)
      setError("Network error - please check your connection")
    } finally {
      setLoading(false)
    }
  }

  const handleManageSubscription = async () => {
    if (!subscription?.customerId) return

    try {
      const response = await fetch("/api/create-portal-session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ customerId: subscription.customerId }),
      })

      const data = await response.json()
      if (data.url) {
        window.location.href = data.url
      }
    } catch (err) {
      console.error("Failed to create portal session:", err)
    }
  }

  const copyToken = () => {
    const token = localStorage.getItem("zodii_token")
    if (token) {
      navigator.clipboard.writeText(token)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  const handleSignOut = () => {
    localStorage.removeItem("zodii_token")
    router.push("/")
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="max-w-md w-full">
          <Alert className="mb-4">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
          <div className="text-center space-y-4">
            <Button onClick={fetchSubscriptionData} variant="outline">
              Retry
            </Button>
            <div>
              <Link href="/signup">
                <Button>Go to Signup</Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    )
  }

  const usagePercentage =
    subscription?.limit === -1 ? 0 : ((subscription?.requests || 0) / (subscription?.limit || 1)) * 100

  const planColors = {
    free: "bg-green-500",
    developer: "bg-blue-500",
    production: "bg-purple-500",
  }

  const planColor = planColors[subscription?.plan as keyof typeof planColors] || "bg-gray-500"

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <Sidebar>
          <SidebarHeader>
            <div className="flex items-center space-x-3 px-2 py-4">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-700 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold">Z</span>
              </div>
              <h1 className="text-lg font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-700 bg-clip-text text-transparent">
                Zodii
              </h1>
            </div>
          </SidebarHeader>
          <SidebarContent>
            <SidebarGroup>
              <SidebarGroupLabel>Dashboard</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {sidebarItems.map((item) => (
                    <SidebarMenuItem key={item.title}>
                      <SidebarMenuButton
                        onClick={() => setActiveTab(item.url.replace("#", ""))}
                        isActive={activeTab === item.url.replace("#", "")}
                      >
                        <item.icon className="h-4 w-4" />
                        <span>{item.title}</span>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>
          <SidebarFooter>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton>
                  <User className="h-4 w-4" />
                  <span>{userEmail}</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton onClick={handleSignOut}>
                  <LogOut className="h-4 w-4" />
                  <span>Sign Out</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarFooter>
        </Sidebar>

        <SidebarInset>
          <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mr-2 h-4" />
            <h1 className="text-lg font-semibold capitalize">{activeTab.replace("-", " ")}</h1>
          </header>

          <div className="flex-1 space-y-4 p-4 md:p-8">
            {activeTab === "overview" && (
              <div className="space-y-6">
                {/* Overview Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">Current Plan</CardTitle>
                      <CreditCard className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center space-x-2">
                        <Badge className={`${planColor} text-white`}>{subscription?.plan?.toUpperCase()}</Badge>
                        <span className="text-xs text-gray-500">({subscription?.status})</span>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">API Requests</CardTitle>
                      <Activity className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">{subscription?.requests || 0}</div>
                      <p className="text-xs text-muted-foreground">
                        {subscription?.limit === -1 ? "Unlimited" : `of ${subscription?.limit} this month`}
                      </p>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">Usage</CardTitle>
                      <TrendingUp className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">
                        {subscription?.limit === -1 ? "∞" : `${Math.round(usagePercentage)}%`}
                      </div>
                      {subscription?.limit !== -1 && <Progress value={usagePercentage} className="mt-2" />}
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">Reset Date</CardTitle>
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">
                        {subscription?.resetDate ? new Date(subscription.resetDate).toLocaleDateString() : "N/A"}
                      </div>
                      <p className="text-xs text-muted-foreground">Next billing cycle</p>
                    </CardContent>
                  </Card>
                </div>

                {/* Usage Warning */}
                {subscription?.plan === "free" && usagePercentage > 80 && (
                  <Alert>
                    <AlertTriangle className="h-4 w-4" />
                    <AlertDescription>
                      You're approaching your monthly limit. Consider{" "}
                      <Link href="/pricing" className="font-medium text-blue-600 hover:underline">
                        upgrading your plan
                      </Link>{" "}
                      for more requests.
                    </AlertDescription>
                  </Alert>
                )}

                {/* Quick Actions */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Quick Start</CardTitle>
                      <CardDescription>Get started with the Zodii API</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-2">
                        <h4 className="font-medium">1. Get your API token</h4>
                        <p className="text-sm text-gray-600">Use your token to authenticate API requests</p>
                      </div>
                      <div className="space-y-2">
                        <h4 className="font-medium">2. Make your first request</h4>
                        <p className="text-sm text-gray-600">Try our zodiac signs endpoint</p>
                      </div>
                      <div className="space-y-2">
                        <h4 className="font-medium">3. Explore more endpoints</h4>
                        <p className="text-sm text-gray-600">Numerology, Tarot, and more</p>
                      </div>
                      <Link href="/docs">
                        <Button className="w-full">
                          <ExternalLink className="h-4 w-4 mr-2" />
                          View Documentation
                        </Button>
                      </Link>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Plan Features</CardTitle>
                      <CardDescription>What's included in your {subscription?.plan} plan</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {subscription?.plan === "free" && (
                          <>
                            <div className="flex items-center">
                              <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                              <span className="text-sm">100 API requests/month</span>
                            </div>
                            <div className="flex items-center">
                              <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                              <span className="text-sm">All API endpoints</span>
                            </div>
                            <div className="flex items-center">
                              <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                              <span className="text-sm">Community support</span>
                            </div>
                            <Link href="/pricing">
                              <Button variant="outline" className="w-full mt-4 bg-transparent">
                                Upgrade Plan
                              </Button>
                            </Link>
                          </>
                        )}
                        {subscription?.plan === "developer" && (
                          <>
                            <div className="flex items-center">
                              <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                              <span className="text-sm">10,000 API requests/month</span>
                            </div>
                            <div className="flex items-center">
                              <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                              <span className="text-sm">Priority email support</span>
                            </div>
                            <div className="flex items-center">
                              <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                              <span className="text-sm">Usage analytics</span>
                            </div>
                          </>
                        )}
                        {subscription?.plan === "production" && (
                          <>
                            <div className="flex items-center">
                              <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                              <span className="text-sm">Unlimited API requests</span>
                            </div>
                            <div className="flex items-center">
                              <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                              <span className="text-sm">24/7 priority support</span>
                            </div>
                            <div className="flex items-center">
                              <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                              <span className="text-sm">Advanced analytics</span>
                            </div>
                            <div className="flex items-center">
                              <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                              <span className="text-sm">AI features</span>
                            </div>
                          </>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            )}

            {activeTab === "usage" && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Usage Over Time</CardTitle>
                      <CardDescription>API requests over the last 7 months</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="h-64 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                          <LineChart data={usageData}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="date" />
                            <YAxis />
                            <Tooltip />
                            <Line type="monotone" dataKey="requests" stroke="#3b82f6" strokeWidth={2} />
                          </LineChart>
                        </ResponsiveContainer>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Top Endpoints</CardTitle>
                      <CardDescription>Most used API endpoints this month</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="h-64 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                          <BarChart data={endpointData}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="endpoint" angle={-45} textAnchor="end" height={80} />
                            <YAxis />
                            <Tooltip />
                            <Bar dataKey="requests" fill="#8884d8" />
                          </BarChart>
                        </ResponsiveContainer>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Response Status</CardTitle>
                      <CardDescription>API response status distribution</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="h-64 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                          <PieChart>
                            <Pie
                              data={statusData}
                              cx="50%"
                              cy="50%"
                              labelLine={false}
                              label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                              outerRadius={80}
                              fill="#8884d8"
                              dataKey="value"
                            >
                              {statusData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={entry.color} />
                              ))}
                            </Pie>
                            <Tooltip />
                          </PieChart>
                        </ResponsiveContainer>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Usage Statistics</CardTitle>
                      <CardDescription>Detailed usage metrics</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex justify-between">
                        <span className="text-sm font-medium">Total Requests</span>
                        <span className="text-sm">920</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm font-medium">Success Rate</span>
                        <span className="text-sm">97.0%</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm font-medium">Avg Response Time</span>
                        <span className="text-sm">245ms</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm font-medium">Peak Usage</span>
                        <span className="text-sm">73 requests (July)</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm font-medium">Most Used Endpoint</span>
                        <span className="text-sm">/api/zodiac/signs</span>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            )}

            {activeTab === "keys" && (
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>API Token</CardTitle>
                    <CardDescription>Use this token to authenticate your API requests</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center space-x-2">
                      <code className="flex-1 p-3 bg-gray-100 rounded font-mono text-sm">
                        {localStorage.getItem("zodii_token") || "No token found"}
                      </code>
                      <Button onClick={copyToken} variant="outline" size="sm">
                        {copied ? <CheckCircle className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                      </Button>
                    </div>
                    <Alert>
                      <AlertDescription>
                        Keep your API token secure and never share it publicly. Include it in the Authorization header
                        of your requests.
                      </AlertDescription>
                    </Alert>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Usage Example</CardTitle>
                    <CardDescription>How to use your API token in requests</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto">
                      <pre className="text-sm">
                        {`curl -X GET "https://www.zodiiapp.com/api/zodiac/signs" \\
  -H "Authorization: Bearer YOUR_API_TOKEN" \\
  -H "Content-Type: application/json"`}
                      </pre>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {activeTab === "subscription" && (
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Subscription Details</CardTitle>
                    <CardDescription>Manage your subscription and billing</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label className="text-sm font-medium">Current Plan</Label>
                        <p className="text-lg font-semibold capitalize">{subscription?.plan}</p>
                      </div>
                      <div>
                        <Label className="text-sm font-medium">Status</Label>
                        <p className="text-lg font-semibold capitalize">{subscription?.status}</p>
                      </div>
                    </div>

                    {subscription?.plan !== "free" && (
                      <>
                        <div>
                          <Label className="text-sm font-medium">Next Billing Date</Label>
                          <p className="text-lg">
                            {subscription?.resetDate ? new Date(subscription.resetDate).toLocaleDateString() : "N/A"}
                          </p>
                        </div>

                        <Button onClick={handleManageSubscription} className="w-full">
                          <ExternalLink className="h-4 w-4 mr-2" />
                          Manage Subscription
                        </Button>
                      </>
                    )}

                    {subscription?.plan === "free" && (
                      <Link href="/pricing">
                        <Button className="w-full">
                          <TrendingUp className="h-4 w-4 mr-2" />
                          Upgrade Plan
                        </Button>
                      </Link>
                    )}
                  </CardContent>
                </Card>
              </div>
            )}

            {activeTab === "account" && (
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Account Information</CardTitle>
                    <CardDescription>Update your account details</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="name">Full Name</Label>
                        <Input id="name" defaultValue="John Doe" />
                      </div>
                      <div>
                        <Label htmlFor="email">Email Address</Label>
                        <Input id="email" type="email" defaultValue={userEmail} />
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="company">Company</Label>
                      <Input id="company" defaultValue="Acme Inc" />
                    </div>
                    <Button>Save Changes</Button>
                  </CardContent>
                </Card>
              </div>
            )}

            {activeTab === "notifications" && (
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Notification Preferences</CardTitle>
                    <CardDescription>Manage how you receive notifications</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-medium">Usage Alerts</h4>
                          <p className="text-sm text-gray-600">Get notified when you reach 80% of your limit</p>
                        </div>
                        <input type="checkbox" defaultChecked className="rounded" />
                      </div>
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-medium">Billing Notifications</h4>
                          <p className="text-sm text-gray-600">Receive billing and payment notifications</p>
                        </div>
                        <input type="checkbox" defaultChecked className="rounded" />
                      </div>
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-medium">Product Updates</h4>
                          <p className="text-sm text-gray-600">Stay informed about new features and updates</p>
                        </div>
                        <input type="checkbox" className="rounded" />
                      </div>
                    </div>
                    <Button>Save Preferences</Button>
                  </CardContent>
                </Card>
              </div>
            )}

            {activeTab === "security" && (
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Security Settings</CardTitle>
                    <CardDescription>Manage your account security</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-4">
                      <div>
                        <h4 className="font-medium mb-2">Change Password</h4>
                        <div className="space-y-2">
                          <Input type="password" placeholder="Current password" />
                          <Input type="password" placeholder="New password" />
                          <Input type="password" placeholder="Confirm new password" />
                        </div>
                        <Button className="mt-2">Update Password</Button>
                      </div>
                      <Separator />
                      <div>
                        <h4 className="font-medium mb-2">API Token Security</h4>
                        <p className="text-sm text-gray-600 mb-2">
                          Your API token provides access to your account. Keep it secure.
                        </p>
                        <Button variant="outline">Regenerate Token</Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {activeTab === "help" && (
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Help & Support</CardTitle>
                    <CardDescription>Get help with your account and API usage</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <Link href="/docs">
                        <Button variant="outline" className="w-full justify-start h-auto p-4 bg-transparent">
                          <div className="text-left">
                            <div className="font-medium">API Documentation</div>
                            <div className="text-sm text-gray-500">Complete API reference and guides</div>
                          </div>
                        </Button>
                      </Link>
                      <Button variant="outline" className="w-full justify-start h-auto p-4 bg-transparent">
                        <div className="text-left">
                          <div className="font-medium">Contact Support</div>
                          <div className="text-sm text-gray-500">Get help from our support team</div>
                        </div>
                      </Button>
                    </div>
                    <div className="mt-6">
                      <h4 className="font-medium mb-2">Frequently Asked Questions</h4>
                      <div className="space-y-2">
                        <details className="border rounded p-3">
                          <summary className="cursor-pointer font-medium">How do I upgrade my plan?</summary>
                          <p className="mt-2 text-sm text-gray-600">
                            You can upgrade your plan by visiting the Subscription tab and clicking "Upgrade Plan".
                          </p>
                        </details>
                        <details className="border rounded p-3">
                          <summary className="cursor-pointer font-medium">What happens if I exceed my limit?</summary>
                          <p className="mt-2 text-sm text-gray-600">
                            If you exceed your monthly request limit, your API requests will be throttled until the next
                            billing cycle.
                          </p>
                        </details>
                        <details className="border rounded p-3">
                          <summary className="cursor-pointer font-medium">How do I cancel my subscription?</summary>
                          <p className="mt-2 text-sm text-gray-600">
                            You can cancel your subscription through the Stripe customer portal accessible from the
                            Subscription tab.
                          </p>
                        </details>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}
          </div>
        </SidebarInset>
      </div>
    </SidebarProvider>
  )
}
