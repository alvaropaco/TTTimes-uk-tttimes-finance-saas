import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Check, Star, Zap, Crown, Rocket, Code, Database, Shield } from "lucide-react"

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
      {/* Navigation */}
      <nav className="border-b bg-white/90 backdrop-blur-md sticky top-0 z-50 shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-700 rounded-2xl flex items-center justify-center shadow-lg">
                <span className="text-white font-bold text-xl">S</span>
              </div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-700 bg-clip-text text-transparent">
                SaaS Starter
              </h1>
            </div>
            <div className="flex items-center space-x-6">
              <Link href="/docs">
                <Button variant="ghost" className="text-gray-600 hover:text-blue-600 font-medium">
                  Documentation
                </Button>
              </Link>
              <Link href="/demo">
                <Button variant="ghost" className="text-gray-600 hover:text-blue-600 font-medium">
                  Demo
                </Button>
              </Link>
              <Link href="/signup">
                <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-lg">
                  Get Started
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="py-24 lg:py-32 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 via-purple-50/30 to-indigo-50/50"></div>
        <div className="container mx-auto px-4 text-center relative">
          <div className="max-w-5xl mx-auto">
            <Badge className="mb-8 bg-blue-100 text-blue-700 hover:bg-blue-100 px-4 py-2 text-sm font-medium">
              🚀 The Complete SaaS Starter Template
            </Badge>
            <h1 className="text-6xl lg:text-8xl font-bold mb-8 bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-700 bg-clip-text text-transparent leading-tight tracking-tight">
              Build SaaS
              <br />
              Apps Faster
            </h1>
            <p className="text-xl lg:text-2xl text-gray-600 mb-12 max-w-4xl mx-auto leading-relaxed font-light">
              The most comprehensive Next.js SaaS template with authentication, payments, dashboard, and API infrastructure. 
              Everything you need to launch your SaaS product quickly.
            </p>
            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-16">
              <Link href="/signup">
                <Button
                  size="lg"
                  className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-lg px-10 py-6 h-auto shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105"
                >
                  Start Building Free
                  <Rocket className="ml-3 h-6 w-6" />
                </Button>
              </Link>
              <Link href="/docs">
                <Button
                  size="lg"
                  variant="outline"
                  className="text-lg px-10 py-6 h-auto border-2 hover:bg-blue-50 bg-white/80 backdrop-blur-sm shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  View Documentation
                </Button>
              </Link>
            </div>
            <div className="flex flex-wrap items-center justify-center gap-8 text-sm text-gray-500">
              <div className="flex items-center space-x-2">
                <Check className="h-5 w-5 text-green-500" />
                <span className="font-medium">No credit card required</span>
              </div>
              <div className="flex items-center space-x-2">
                <Check className="h-5 w-5 text-green-500" />
                <span className="font-medium">100 free API calls monthly</span>
              </div>
              <div className="flex items-center space-x-2">
                <Check className="h-5 w-5 text-green-500" />
                <span className="font-medium">Instant deployment ready</span>
              </div>
              <div className="flex items-center space-x-2">
                <Check className="h-5 w-5 text-green-500" />
                <span className="font-medium">Production-ready infrastructure</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-white relative">
        <div className="container mx-auto px-4">
          <div className="text-center mb-20">
            <h2 className="text-5xl lg:text-6xl font-bold mb-8 bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-700 bg-clip-text text-transparent">
              Everything You Need
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto font-light">
              Complete SaaS infrastructure with authentication, payments, and scalable API architecture
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-10 max-w-7xl mx-auto">
            {/* Authentication & User Management */}
            <Card className="relative overflow-hidden border-0 shadow-xl hover:shadow-2xl transition-all duration-500 hover:scale-105 bg-gradient-to-br from-white to-blue-50/30 group">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <CardHeader className="relative p-8">
                <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-3xl flex items-center justify-center mb-6 shadow-lg group-hover:shadow-xl transition-shadow duration-300">
                  <Shield className="h-10 w-10 text-white" />
                </div>
                <CardTitle className="text-3xl text-blue-600 mb-3 font-bold">Authentication</CardTitle>
                <CardDescription className="text-lg text-gray-600 leading-relaxed">
                  Complete user authentication system with secure token-based API access and user management
                </CardDescription>
              </CardHeader>
              <CardContent className="relative p-8 pt-0">
                <ul className="space-y-4 mb-8">
                  <li className="flex items-center space-x-4">
                    <div className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0"></div>
                    <span className="text-gray-700">Secure user registration & login</span>
                  </li>
                  <li className="flex items-center space-x-4">
                    <div className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0"></div>
                    <span className="text-gray-700">Token-based API authentication</span>
                  </li>
                  <li className="flex items-center space-x-4">
                    <div className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0"></div>
                    <span className="text-gray-700">User dashboard & profile management</span>
                  </li>
                  <li className="flex items-center space-x-4">
                    <div className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0"></div>
                    <span className="text-gray-700">MongoDB integration ready</span>
                  </li>
                </ul>
                <Link href="/signup">
                  <Button
                    variant="outline"
                    className="w-full group-hover:bg-blue-50 group-hover:border-blue-300 bg-white/80 backdrop-blur-sm shadow-md hover:shadow-lg transition-all duration-300"
                  >
                    Try Authentication
                  </Button>
                </Link>
              </CardContent>
            </Card>

            {/* Payments & Subscriptions */}
            <Card className="relative overflow-hidden border-0 shadow-xl hover:shadow-2xl transition-all duration-500 hover:scale-105 bg-gradient-to-br from-white to-purple-50/30 group">
              <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-pink-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <CardHeader className="relative p-8">
                <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-pink-600 rounded-3xl flex items-center justify-center mb-6 shadow-lg group-hover:shadow-xl transition-shadow duration-300">
                  <Crown className="h-10 w-10 text-white" />
                </div>
                <CardTitle className="text-3xl text-purple-600 mb-3 font-bold">Stripe Payments</CardTitle>
                <CardDescription className="text-lg text-gray-600 leading-relaxed">
                  Complete Stripe integration with subscription management, billing portal, and webhook handling
                </CardDescription>
              </CardHeader>
              <CardContent className="relative p-8 pt-0">
                <ul className="space-y-4 mb-8">
                  <li className="flex items-center space-x-4">
                    <div className="w-2 h-2 bg-purple-500 rounded-full flex-shrink-0"></div>
                    <span className="text-gray-700">Subscription plans & billing</span>
                  </li>
                  <li className="flex items-center space-x-4">
                    <div className="w-2 h-2 bg-purple-500 rounded-full flex-shrink-0"></div>
                    <span className="text-gray-700">Customer portal integration</span>
                  </li>
                  <li className="flex items-center space-x-4">
                    <div className="w-2 h-2 bg-purple-500 rounded-full flex-shrink-0"></div>
                    <span className="text-gray-700">Webhook event handling</span>
                  </li>
                  <li className="flex items-center space-x-4">
                    <div className="w-2 h-2 bg-purple-500 rounded-full flex-shrink-0"></div>
                    <span className="text-gray-700">Usage-based pricing support</span>
                  </li>
                </ul>
                <Link href="/pricing">
                  <Button
                    variant="outline"
                    className="w-full group-hover:bg-purple-50 group-hover:border-purple-300 bg-white/80 backdrop-blur-sm shadow-md hover:shadow-lg transition-all duration-300"
                  >
                    View Pricing
                  </Button>
                </Link>
              </CardContent>
            </Card>

            {/* API Infrastructure */}
            <Card className="relative overflow-hidden border-0 shadow-xl hover:shadow-2xl transition-all duration-500 hover:scale-105 bg-gradient-to-br from-white to-indigo-50/30 group">
              <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 to-blue-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <CardHeader className="relative p-8">
                <div className="w-20 h-20 bg-gradient-to-br from-indigo-500 to-blue-600 rounded-3xl flex items-center justify-center mb-6 shadow-lg group-hover:shadow-xl transition-shadow duration-300">
                  <Code className="h-10 w-10 text-white" />
                </div>
                <CardTitle className="text-3xl text-indigo-600 mb-3 font-bold">API Infrastructure</CardTitle>
                <CardDescription className="text-lg text-gray-600 leading-relaxed">
                  Scalable REST API with rate limiting, CORS support, and comprehensive error handling
                </CardDescription>
              </CardHeader>
              <CardContent className="relative p-8 pt-0">
                <ul className="space-y-4 mb-8">
                  <li className="flex items-center space-x-4">
                    <div className="w-2 h-2 bg-indigo-500 rounded-full flex-shrink-0"></div>
                    <span className="text-gray-700">RESTful API endpoints</span>
                  </li>
                  <li className="flex items-center space-x-4">
                    <div className="w-2 h-2 bg-indigo-500 rounded-full flex-shrink-0"></div>
                    <span className="text-gray-700">Rate limiting & CORS support</span>
                  </li>
                  <li className="flex items-center space-x-4">
                    <div className="w-2 h-2 bg-indigo-500 rounded-full flex-shrink-0"></div>
                    <span className="text-gray-700">Translation & caching system</span>
                  </li>
                </ul>
                <Link href="/docs">
                  <Button
                    variant="outline"
                    className="w-full group-hover:bg-indigo-50 group-hover:border-indigo-300 bg-white/80 backdrop-blur-sm shadow-md hover:shadow-lg transition-all duration-300"
                  >
                    API Documentation
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-24 bg-gradient-to-br from-slate-50 to-blue-50 relative">
        <div className="container mx-auto px-4">
          <div className="text-center mb-20">
            <h2 className="text-5xl lg:text-6xl font-bold mb-8 bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-700 bg-clip-text text-transparent">
              Simple Pricing
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto font-light">
              Start free and scale as you grow. No hidden fees, no surprises.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {/* Free Plan */}
            <Card className="relative border-2 border-gray-200 shadow-lg hover:shadow-xl transition-all duration-300 bg-white">
              <CardHeader className="p-8 text-center">
                <CardTitle className="text-2xl text-gray-800 mb-2">Starter</CardTitle>
                <div className="text-4xl font-bold text-gray-900 mb-2">
                  $0<span className="text-lg font-normal text-gray-600">/month</span>
                </div>
                <CardDescription className="text-gray-600">Perfect for getting started</CardDescription>
              </CardHeader>
              <CardContent className="p-8 pt-0">
                <ul className="space-y-4 mb-8">
                  <li className="flex items-center space-x-3">
                    <Check className="h-5 w-5 text-green-500 flex-shrink-0" />
                    <span className="text-gray-700">100 API calls/month</span>
                  </li>
                  <li className="flex items-center space-x-3">
                    <Check className="h-5 w-5 text-green-500 flex-shrink-0" />
                    <span className="text-gray-700">Basic authentication</span>
                  </li>
                  <li className="flex items-center space-x-3">
                    <Check className="h-5 w-5 text-green-500 flex-shrink-0" />
                    <span className="text-gray-700">Community support</span>
                  </li>
                  <li className="flex items-center space-x-3">
                    <Check className="h-5 w-5 text-green-500 flex-shrink-0" />
                    <span className="text-gray-700">Basic dashboard</span>
                  </li>
                </ul>
                <Link href="/signup">
                  <Button className="w-full bg-gray-900 hover:bg-gray-800 text-white">Get Started Free</Button>
                </Link>
              </CardContent>
            </Card>

            {/* Pro Plan */}
            <Card className="relative border-2 border-blue-500 shadow-xl hover:shadow-2xl transition-all duration-300 bg-white transform scale-105">
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                <Badge className="bg-blue-500 text-white px-4 py-1 text-sm font-medium">Most Popular</Badge>
              </div>
              <CardHeader className="p-8 text-center">
                <CardTitle className="text-2xl text-blue-600 mb-2">Professional</CardTitle>
                <div className="text-4xl font-bold text-gray-900 mb-2">
                  $29<span className="text-lg font-normal text-gray-600">/month</span>
                </div>
                <CardDescription className="text-gray-600">For growing businesses</CardDescription>
              </CardHeader>
              <CardContent className="p-8 pt-0">
                <ul className="space-y-4 mb-8">
                  <li className="flex items-center space-x-3">
                    <Check className="h-5 w-5 text-green-500 flex-shrink-0" />
                    <span className="text-gray-700">10,000 API calls/month</span>
                  </li>
                  <li className="flex items-center space-x-3">
                    <Check className="h-5 w-5 text-green-500 flex-shrink-0" />
                    <span className="text-gray-700">Advanced authentication</span>
                  </li>
                  <li className="flex items-center space-x-3">
                    <Check className="h-5 w-5 text-green-500 flex-shrink-0" />
                    <span className="text-gray-700">Priority support</span>
                  </li>
                  <li className="flex items-center space-x-3">
                    <Check className="h-5 w-5 text-green-500 flex-shrink-0" />
                    <span className="text-gray-700">Advanced dashboard</span>
                  </li>
                </ul>
                <Link href="/signup">
                  <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white">Start Pro Trial</Button>
                </Link>
              </CardContent>
            </Card>

            {/* Enterprise Plan */}
            <Card className="relative border-2 border-gray-200 shadow-lg hover:shadow-xl transition-all duration-300 bg-white">
              <CardHeader className="p-8 text-center">
                <CardTitle className="text-2xl text-gray-800 mb-2">Enterprise</CardTitle>
                <div className="text-4xl font-bold text-gray-900 mb-2">
                  $99<span className="text-lg font-normal text-gray-600">/month</span>
                </div>
                <CardDescription className="text-gray-600">For large scale applications</CardDescription>
              </CardHeader>
              <CardContent className="p-8 pt-0">
                <ul className="space-y-4 mb-8">
                  <li className="flex items-center space-x-3">
                    <Check className="h-5 w-5 text-green-500 flex-shrink-0" />
                    <span className="text-gray-700">100,000 API calls/month</span>
                  </li>
                  <li className="flex items-center space-x-3">
                    <Check className="h-5 w-5 text-green-500 flex-shrink-0" />
                    <span className="text-gray-700">Enterprise authentication</span>
                  </li>
                  <li className="flex items-center space-x-3">
                    <Check className="h-5 w-5 text-green-500 flex-shrink-0" />
                    <span className="text-gray-700">24/7 dedicated support</span>
                  </li>
                  <li className="flex items-center space-x-3">
                    <Check className="h-5 w-5 text-green-500 flex-shrink-0" />
                    <span className="text-gray-700">Custom integrations</span>
                  </li>
                  <li className="flex items-center space-x-3">
                    <Check className="h-5 w-5 text-green-500 flex-shrink-0" />
                    <span className="text-gray-700">SLA guarantee</span>
                  </li>
                </ul>
                <Link href="/contact">
                  <Button className="w-full bg-gray-900 hover:bg-gray-800 text-white">Contact Sales</Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-700 relative overflow-hidden">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="container mx-auto px-4 text-center relative">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-5xl lg:text-6xl font-bold text-white mb-8 leading-tight">
              Ready to Build Your SaaS?
            </h2>
            <p className="text-xl lg:text-2xl text-blue-100 mb-12 font-light leading-relaxed">
              Join thousands of developers who trust our platform to power their applications.
              Start building today with our comprehensive SaaS template.
            </p>
            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
              <Link href="/signup">
                <Button
                  size="lg"
                  className="bg-white text-blue-600 hover:bg-blue-50 text-lg px-10 py-6 h-auto shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105 font-semibold"
                >
                  Start Building Now
                  <Rocket className="ml-3 h-6 w-6" />
                </Button>
              </Link>
              <Link href="/contact">
                <Button
                  size="lg"
                  variant="outline"
                  className="text-lg px-10 py-6 h-auto border-2 border-white text-white hover:bg-white hover:text-blue-600 bg-transparent backdrop-blur-sm shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  Contact Sales
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-16">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8">
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-700 rounded-xl flex items-center justify-center">
                  <span className="text-white font-bold">S</span>
                </div>
                <h3 className="text-2xl font-bold">SaaS Starter</h3>
              </div>
              <p className="text-gray-400 leading-relaxed">
                The complete Next.js SaaS template for building modern applications with authentication, payments, and API infrastructure.
              </p>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">Product</h4>
              <ul className="space-y-2 text-gray-400">
                <li><Link href="/docs" className="hover:text-white transition-colors">Documentation</Link></li>
                <li><Link href="/pricing" className="hover:text-white transition-colors">Pricing</Link></li>
                <li><Link href="/demo" className="hover:text-white transition-colors">Demo</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-gray-400">
                <li><Link href="/contact" className="hover:text-white transition-colors">Contact</Link></li>
                <li><Link href="/privacy" className="hover:text-white transition-colors">Privacy</Link></li>
                <li><Link href="/terms" className="hover:text-white transition-colors">Terms</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">Support</h4>
              <ul className="space-y-2 text-gray-400">
                <li><Link href="/docs" className="hover:text-white transition-colors">Help Center</Link></li>
                <li><Link href="/contact" className="hover:text-white transition-colors">Contact Support</Link></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-12 pt-8 text-center text-gray-400">
            <p>&copy; 2024 SaaS Starter. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
