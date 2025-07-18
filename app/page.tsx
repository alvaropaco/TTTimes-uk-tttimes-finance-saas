import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16">
        <div className="text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">TTTimes Finance</h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Secure and scalable currency exchange API with real-time rates based on USD. Get accurate currency
            conversions with our reliable API service.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/dashboard">
              <Button size="lg" className="w-full sm:w-auto">
                Get Started
              </Button>
            </Link>
            <Link href="/docs">
              <Button variant="outline" size="lg" className="w-full sm:w-auto bg-transparent">
                View Documentation
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Why Choose TTTimes Finance?</h2>
          <p className="text-lg text-gray-600">Built for developers who need reliable currency data</p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">🔐 Secure Authentication</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">
                OAuth-based authentication with unique API keys for each user. All requests are secured and monitored.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">⚡ Rate Limited</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">
                Fair usage with 100 requests per day per API key. Perfect for development and production use.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">📊 Real-time Data</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">
                Up-to-date currency exchange rates with timestamp information. Reliable data you can trust.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* API Endpoints Preview */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Simple API Endpoints</h2>
          <p className="text-lg text-gray-600">Easy to integrate with your applications</p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Get All Rates</CardTitle>
                <Badge variant="secondary">GET</Badge>
              </div>
              <CardDescription>/api/rates</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600">Returns all available currency rates in USD</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Convert Currency</CardTitle>
                <Badge variant="secondary">GET</Badge>
              </div>
              <CardDescription>/api/convert</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600">Convert between any supported currencies in real-time</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Supported Currencies</CardTitle>
                <Badge variant="secondary">GET</Badge>
              </div>
              <CardDescription>/api/supported</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600">List all supported currency codes and names</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Single Rate</CardTitle>
                <Badge variant="secondary">GET</Badge>
              </div>
              <CardDescription>/api/rate/:iso</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600">Get exchange rate for a specific currency</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
