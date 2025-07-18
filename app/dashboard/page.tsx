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
import { useUser } from "@clerk/nextjs";

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
  const { user, isLoaded } = useUser();
  const [data, setData] = useState({ apiKey: '', dailyCount: 0, usageHistory: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (isLoaded && user) {
      fetch('/api/dashboard')
        .then(res => res.json())
        .then(setData)
        .catch(() => setError('Failed to load data'))
        .finally(() => setLoading(false));
    }
  }, [isLoaded, user]);

  if (!isLoaded || loading) return <div>Loading...</div>;
  if (!user) return <div>Please sign in</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <h1 className="text-3xl font-bold mb-8">CurrencyAPI Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>API Key</CardTitle>
          </CardHeader>
          <CardContent>
            <p>{data.apiKey}</p>
            <Button onClick={() => navigator.clipboard.writeText(data.apiKey)}>Copy</Button>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Daily Requests</CardTitle>
          </CardHeader>
          <CardContent>
            <p>{data.dailyCount} / 100</p>
            <Progress value={(data.dailyCount / 100) * 100} />
          </CardContent>
        </Card>
      </div>
      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Usage History (Last 7 Days)</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={data.usageHistory}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="requests" stroke="#8884d8" />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
      <div className="mt-6">
        <Link href="/docs">
          <Button>API Documentation</Button>
        </Link>
      </div>
    </div>
  );
}
