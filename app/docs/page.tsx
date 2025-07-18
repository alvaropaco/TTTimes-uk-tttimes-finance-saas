import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { ArrowRight, CheckCircle, Zap } from "lucide-react"

export default function DocsPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">API Documentation</h1>
        <p className="text-lg text-gray-600">Complete guide to using the TTTimes Finance API</p>
      </div>

      {/* Quick Start */}
      <Card className="mb-8 border-blue-200 bg-blue-50/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="w-5 h-5 text-blue-600" />
            Quick Start
          </CardTitle>
          <CardDescription>Get up and running in under 5 minutes</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <h4 className="font-semibold mb-2">1. Get your API key</h4>
              <Link href="/dashboard" className="text-blue-600 hover:text-blue-800 flex items-center gap-1">
                Sign up for free <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
            <div>
              <h4 className="font-semibold mb-2">2. Make your first request</h4>
              <div className="bg-gray-900 p-3 rounded text-green-400 text-sm font-mono">
                curl -H "Authorization: Bearer YOUR_KEY"
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Authentication */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Authentication</CardTitle>
          <CardDescription>All API requests require authentication using your API key</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h4 className="font-semibold mb-2">Header Required:</h4>
            <div className="bg-gray-100 p-3 rounded font-mono text-sm">Authorization: Bearer YOUR_API_KEY</div>
          </div>
          <div>
            <h4 className="font-semibold mb-2">Rate Limiting:</h4>
            <p className="text-gray-600">
              Each API key is limited to 100 requests per day on the free plan. Exceeding this limit will return a 429
              error.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Endpoints */}
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Get All Rates</CardTitle>
              <Badge variant="secondary">GET</Badge>
            </div>
            <CardDescription>/api/rates</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-gray-600">Returns all available currency exchange rates based on USD.</p>

            <div>
              <h4 className="font-semibold mb-2">Example Response:</h4>
              <pre className="bg-gray-100 p-3 rounded text-sm overflow-x-auto">
                {`{
  "success": true,
  "data": [
    {
      "currency": "Rial Saudita",
      "code": "SAR",
      "rate": 3.75053961,
      "example": "3.75",
      "lastUpdated": "2025-07-17T15:21:10.965Z"
    }
  ],
  "total": 1
}`}
              </pre>
            </div>
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
          <CardContent className="space-y-4">
            <p className="text-gray-600">Convert between any supported currencies in real-time.</p>

            <div>
              <h4 className="font-semibold mb-2">Query Parameters:</h4>
              <ul className="list-disc list-inside text-gray-600 space-y-1">
                <li>
                  <code>from</code> - Source currency code (e.g., SAR)
                </li>
                <li>
                  <code>to</code> - Target currency code (e.g., USD)
                </li>
                <li>
                  <code>amount</code> - Amount to convert (default: 1)
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-2">Example Request:</h4>
              <div className="bg-gray-100 p-3 rounded font-mono text-sm">
                GET /api/convert?from=SAR&to=USD&amount=1000
              </div>
            </div>

            <div>
              <h4 className="font-semibold mb-2">Example Response:</h4>
              <pre className="bg-gray-100 p-3 rounded text-sm overflow-x-auto">
                {`{
  "success": true,
  "data": {
    "from": "SAR",
    "to": "USD",
    "amount": 1000,
    "result": 266.664,
    "rate": 0.266664
  }
}`}
              </pre>
            </div>
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
          <CardContent className="space-y-4">
            <p className="text-gray-600">Returns a list of all supported currency codes and names.</p>

            <div>
              <h4 className="font-semibold mb-2">Example Response:</h4>
              <pre className="bg-gray-100 p-3 rounded text-sm overflow-x-auto">
                {`{
  "success": true,
  "data": [
    {
      "code": "USD",
      "name": "US Dollar"
    },
    {
      "code": "SAR",
      "name": "Rial Saudita"
    }
  ],
  "total": 2
}`}
              </pre>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Get Single Rate</CardTitle>
              <Badge variant="secondary">GET</Badge>
            </div>
            <CardDescription>/api/rate/:iso</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-gray-600">Get the exchange rate for a specific currency.</p>

            <div>
              <h4 className="font-semibold mb-2">Example Request:</h4>
              <div className="bg-gray-100 p-3 rounded font-mono text-sm">GET /api/rate/SAR</div>
            </div>

            <div>
              <h4 className="font-semibold mb-2">Example Response:</h4>
              <pre className="bg-gray-100 p-3 rounded text-sm overflow-x-auto">
                {`{
  "success": true,
  "data": {
    "currency": "Rial Saudita",
    "code": "SAR",
    "rate": 3.75053961,
    "example": "3.75",
    "lastUpdated": "2025-07-17T15:21:10.965Z"
  }
}`}
              </pre>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Error Responses */}
      <Card className="mt-8">
        <CardHeader>
          <CardTitle>Error Responses</CardTitle>
          <CardDescription>Common error responses you might encounter</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h4 className="font-semibold mb-2">401 Unauthorized:</h4>
            <pre className="bg-gray-100 p-3 rounded text-sm">
              {`{
  "error": "API key required"
}`}
            </pre>
          </div>

          <div>
            <h4 className="font-semibold mb-2">429 Rate Limit Exceeded:</h4>
            <pre className="bg-gray-100 p-3 rounded text-sm">
              {`{
  "error": "Rate limit exceeded. Try again tomorrow."
}`}
            </pre>
          </div>

          <div>
            <h4 className="font-semibold mb-2">404 Not Found:</h4>
            <pre className="bg-gray-100 p-3 rounded text-sm">
              {`{
  "error": "Currency SAR not found"
}`}
            </pre>
          </div>
        </CardContent>
      </Card>

      {/* Pricing Section */}
      <section id="pricing" className="py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Simple, Transparent Pricing</h2>
          <p className="text-lg text-gray-600">Choose the plan that fits your needs. No hidden fees.</p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {/* Free Plan */}
          <Card className="border-2 border-gray-200 hover:border-blue-300 transition-colors">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl">Free</CardTitle>
              <div className="text-4xl font-bold text-gray-900 mb-2">
                $0<span className="text-lg text-gray-600">/month</span>
              </div>
              <CardDescription>Perfect for testing and small projects</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <ul className="space-y-3">
                <li className="flex items-center">
                  <CheckCircle className="w-5 h-5 text-green-500 mr-3 flex-shrink-0" />
                  <span>100 requests/day</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="w-5 h-5 text-green-500 mr-3 flex-shrink-0" />
                  <span>150+ currencies</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="w-5 h-5 text-green-500 mr-3 flex-shrink-0" />
                  <span>Real-time rates</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="w-5 h-5 text-green-500 mr-3 flex-shrink-0" />
                  <span>Basic support</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="w-5 h-5 text-green-500 mr-3 flex-shrink-0" />
                  <span>API documentation</span>
                </li>
              </ul>
              <Link href="/dashboard" className="block">
                <button className="w-full border-2 border-gray-300 text-gray-700 py-3 rounded-xl font-semibold hover:border-gray-400 transition-colors mt-6">
                  Get Started Free
                </button>
              </Link>
            </CardContent>
          </Card>

          {/* Pro Plan */}
          <Card className="border-2 border-blue-500 relative bg-gradient-to-br from-blue-50 to-purple-50">
            <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-1 rounded-full text-sm font-semibold">
                Most Popular
              </span>
            </div>
            <CardHeader className="text-center">
              <CardTitle className="text-2xl">Pro</CardTitle>
              <div className="mb-2">
                <div className="text-4xl font-bold text-gray-900">
                  $0.022<span className="text-lg text-gray-600">/request</span>
                </div>
                <p className="text-sm text-gray-500 mt-1">Pay as you scale</p>
              </div>
              <CardDescription>For growing businesses and applications</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <ul className="space-y-3">
                <li className="flex items-center">
                  <CheckCircle className="w-5 h-5 text-green-500 mr-3 flex-shrink-0" />
                  <span>Unlimited requests</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="w-5 h-5 text-green-500 mr-3 flex-shrink-0" />
                  <span>150+ currencies</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="w-5 h-5 text-green-500 mr-3 flex-shrink-0" />
                  <span>Historical data</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="w-5 h-5 text-green-500 mr-3 flex-shrink-0" />
                  <span>Priority support</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="w-5 h-5 text-green-500 mr-3 flex-shrink-0" />
                  <span>99.9% SLA</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="w-5 h-5 text-green-500 mr-3 flex-shrink-0" />
                  <span>Advanced analytics</span>
                </li>
              </ul>
              <Link href="/dashboard" className="block">
                <button className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 rounded-xl font-semibold hover:shadow-lg transition-shadow mt-6">
                  Start Free Trial
                </button>
              </Link>
            </CardContent>
          </Card>

          {/* Enterprise Plan */}
          <Card className="border-2 border-gray-200 hover:border-blue-300 transition-colors">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl">Enterprise</CardTitle>
              <div className="text-4xl font-bold text-gray-900 mb-2">Custom</div>
              <CardDescription>For large-scale applications</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <ul className="space-y-3">
                <li className="flex items-center">
                  <CheckCircle className="w-5 h-5 text-green-500 mr-3 flex-shrink-0" />
                  <span>Volume discounts</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="w-5 h-5 text-green-500 mr-3 flex-shrink-0" />
                  <span>Dedicated support</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="w-5 h-5 text-green-500 mr-3 flex-shrink-0" />
                  <span>Custom integrations</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="w-5 h-5 text-green-500 mr-3 flex-shrink-0" />
                  <span>99.99% SLA</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="w-5 h-5 text-green-500 mr-3 flex-shrink-0" />
                  <span>On-premise options</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="w-5 h-5 text-green-500 mr-3 flex-shrink-0" />
                  <span>White-label solutions</span>
                </li>
              </ul>
              <button className="w-full border-2 border-gray-300 text-gray-700 py-3 rounded-xl font-semibold hover:border-gray-400 transition-colors mt-6">
                Get in Touch
              </button>
            </CardContent>
          </Card>
        </div>

        {/* Pricing FAQ */}
        <div className="mt-16 max-w-3xl mx-auto">
          <h3 className="text-2xl font-bold text-center mb-8">Frequently Asked Questions</h3>
          <div className="space-y-6">
            <Card>
              <CardContent className="pt-6">
                <h4 className="font-semibold mb-2">How is usage calculated?</h4>
                <p className="text-gray-600">
                  Each API request counts as one usage unit. This includes all endpoints: conversion, rates, and
                  supported currencies.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <h4 className="font-semibold mb-2">What happens if I exceed my free limit?</h4>
                <p className="text-gray-600">
                  Your requests will be blocked until the next day. Upgrade to Pro for unlimited requests with
                  pay-per-use pricing.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <h4 className="font-semibold mb-2">Can I change plans anytime?</h4>
                <p className="text-gray-600">
                  Yes! You can upgrade or downgrade your plan at any time. Changes take effect immediately.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <h4 className="font-semibold mb-2">Do you offer volume discounts?</h4>
                <p className="text-gray-600">
                  Yes, Enterprise customers can get significant volume discounts. Contact us for custom pricing based on
                  your usage.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <Card className="mt-16 bg-gradient-to-r from-blue-600 to-purple-600 text-white border-0">
        <CardContent className="text-center py-12">
          <h3 className="text-3xl font-bold mb-4">Ready to get started?</h3>
          <p className="text-xl text-blue-100 mb-8">Join thousands of developers using our currency API</p>
          <Link href="/dashboard">
            <button className="bg-white text-blue-600 px-8 py-4 rounded-xl font-semibold text-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 inline-flex items-center">
              Get your free API key
              <ArrowRight className="ml-2 w-5 h-5" />
            </button>
          </Link>
        </CardContent>
      </Card>
    </div>
  )
}
