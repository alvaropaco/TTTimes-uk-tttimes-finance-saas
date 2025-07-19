import { CheckCircle } from "lucide-react"
import Link from "next/link"

export default function DocsPage() {
  return (
    <div className="py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        <h1 className="text-5xl font-bold text-gray-900 text-center mb-8">Unlock the Power of Currency Conversion</h1>
        <p className="text-xl text-gray-700 text-center mb-12">
          Seamlessly convert currencies with our reliable and easy-to-use API.
        </p>

        {/* Pricing Section */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-8">Simple, Transparent Pricing</h2>
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <div className="border-2 border-gray-200 rounded-2xl p-8 hover:border-blue-300 transition-colors">
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Free</h3>
              <p className="text-4xl font-bold text-gray-900 mb-6">
                $0<span className="text-lg text-gray-600">/month</span>
              </p>
              <ul className="space-y-3 mb-8">
                <li className="flex items-center">
                  <CheckCircle className="w-5 h-5 text-green-500 mr-3" />
                  Up to 100 requests
                </li>
                <li className="flex items-center">
                  <CheckCircle className="w-5 h-5 text-green-500 mr-3" />1 seat
                </li>
                <li className="flex items-center">
                  <CheckCircle className="w-5 h-5 text-green-500 mr-3" />
                  For development
                </li>
                <li className="flex items-center">
                  <CheckCircle className="w-5 h-5 text-green-500 mr-3" />
                  One origin allowed
                </li>
                <li className="flex items-center">
                  <CheckCircle className="w-5 h-5 text-green-500 mr-3" />
                  150+ currencies
                </li>
                <li className="flex items-center">
                  <CheckCircle className="w-5 h-5 text-green-500 mr-3" />
                  Basic support
                </li>
              </ul>
              <Link
                href="/dashboard"
                className="block w-full border-2 border-gray-300 text-gray-700 py-3 rounded-xl font-semibold hover:border-gray-400 transition-colors text-center"
              >
                Get Started
              </Link>
            </div>

            <div className="border-2 border-blue-500 rounded-2xl p-8 relative bg-gradient-to-br from-blue-50 to-purple-50">
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                <span className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-1 rounded-full text-sm font-semibold">
                  Most Popular
                </span>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Pro</h3>
              <div className="mb-6">
                <p className="text-4xl font-bold text-gray-900">
                  $10<span className="text-lg text-gray-600">/month</span>
                </p>
                <p className="text-sm text-gray-500 mt-1">Everything you need to scale</p>
              </div>
              <ul className="space-y-3 mb-8">
                <li className="flex items-center">
                  <CheckCircle className="w-5 h-5 text-green-500 mr-3" />
                  Up to 100k API requests
                </li>
                <li className="flex items-center">
                  <CheckCircle className="w-5 h-5 text-green-500 mr-3" />
                  Unlimited origins
                </li>
                <li className="flex items-center">
                  <CheckCircle className="w-5 h-5 text-green-500 mr-3" />
                  Unlimited seats
                </li>
                <li className="flex items-center">
                  <CheckCircle className="w-5 h-5 text-green-500 mr-3" />
                  150+ currencies
                </li>
                <li className="flex items-center">
                  <CheckCircle className="w-5 h-5 text-green-500 mr-3" />
                  Historical data
                </li>
                <li className="flex items-center">
                  <CheckCircle className="w-5 h-5 text-green-500 mr-3" />
                  Priority support
                </li>
                <li className="flex items-center">
                  <CheckCircle className="w-5 h-5 text-green-500 mr-3" />
                  99.9% SLA
                </li>
              </ul>
              <Link
                href="/dashboard"
                className="block w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 rounded-xl font-semibold hover:shadow-lg transition-shadow text-center"
              >
                Start Free Trial
              </Link>
            </div>

            <div className="border-2 border-gray-200 rounded-2xl p-8 hover:border-blue-300 transition-colors">
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Enterprise</h3>
              <p className="text-4xl font-bold text-gray-900 mb-6">Custom</p>
              <ul className="space-y-3 mb-8">
                <li className="flex items-center">
                  <CheckCircle className="w-5 h-5 text-green-500 mr-3" />
                  Volume discounts
                </li>
                <li className="flex items-center">
                  <CheckCircle className="w-5 h-5 text-green-500 mr-3" />
                  Dedicated support
                </li>
                <li className="flex items-center">
                  <CheckCircle className="w-5 h-5 text-green-500 mr-3" />
                  Custom integrations
                </li>
                <li className="flex items-center">
                  <CheckCircle className="w-5 h-5 text-green-500 mr-3" />
                  99.99% SLA
                </li>
                <li className="flex items-center">
                  <CheckCircle className="w-5 h-5 text-green-500 mr-3" />
                  On-premise options
                </li>
                <li className="flex items-center">
                  <CheckCircle className="w-5 h-5 text-green-500 mr-3" />
                  White-label solutions
                </li>
              </ul>
              <button className="w-full border-2 border-gray-300 text-gray-700 py-3 rounded-xl font-semibold hover:border-gray-400 transition-colors">
                Get in Touch
              </button>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section>
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-8">Frequently Asked Questions</h2>
          <div className="max-w-3xl mx-auto space-y-6">
            <div className="space-y-6">
              <div>
                <h4 className="text-lg font-semibold text-gray-900 mb-2">How is usage calculated?</h4>
                <p className="text-gray-600">
                  Each API request counts towards your monthly limit. The Free plan includes up to 100 requests total,
                  while the Pro plan includes up to 100,000 requests per month for $10.
                </p>
              </div>
              <div>
                <h4 className="text-lg font-semibold text-gray-900 mb-2">What happens if I exceed my limit?</h4>
                <p className="text-gray-600">
                  Free plan users will receive a 429 rate limit error. Pro plan users can continue using the service and
                  will be notified about potential overage charges for usage beyond 100k requests.
                </p>
              </div>
              <div>
                <h4 className="text-lg font-semibold text-gray-900 mb-2">Can I upgrade or downgrade anytime?</h4>
                <p className="text-gray-600">
                  Yes, you can change your plan at any time. Upgrades take effect immediately, while downgrades take
                  effect at the start of your next billing cycle.
                </p>
              </div>
              <div>
                <h4 className="text-lg font-semibold text-gray-900 mb-2">What does "unlimited origins" mean?</h4>
                <p className="text-gray-600">
                  Pro plan users can make API requests from any domain or application, while Free plan users are limited
                  to one registered origin for security purposes.
                </p>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}
