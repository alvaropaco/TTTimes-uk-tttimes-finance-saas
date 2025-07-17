"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ArrowLeft, FileText, CreditCard, Shield, AlertTriangle, Scale, Users, Zap } from "lucide-react"

export default function TermsOfService() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-100">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <Link href="/">
            <Button variant="ghost" className="mb-4">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Home
            </Button>
          </Link>
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Terms of Service</h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              These terms govern your use of Zodii's astrology API services and platform.
            </p>
            <p className="text-sm text-gray-500 mt-2">Last updated: January 16, 2025</p>
          </div>
        </div>

        <div className="max-w-4xl mx-auto space-y-6">
          {/* Acceptance of Terms */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <FileText className="mr-2 h-5 w-5 text-blue-600" />
                Acceptance of Terms
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700 mb-4">
                By accessing or using Zodii's services, including our API, website, and related applications, you agree
                to be bound by these Terms of Service ("Terms"). If you do not agree to these terms, please do not use
                our services.
              </p>
              <p className="text-gray-700">
                These Terms constitute a legally binding agreement between you and Zodii. We may update these Terms from
                time to time, and your continued use of our services constitutes acceptance of any changes.
              </p>
            </CardContent>
          </Card>

          {/* Service Description */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Zap className="mr-2 h-5 w-5 text-purple-600" />
                Service Description
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700 mb-4">
                Zodii provides astrological and mystical services through our API platform, including:
              </p>
              <ul className="list-disc list-inside space-y-2 text-gray-700">
                <li>
                  <strong>Birth Chart Generation:</strong> Personalized astrological charts based on birth data
                </li>
                <li>
                  <strong>Horoscope Services:</strong> Daily, weekly, and monthly horoscopes for all zodiac signs
                </li>
                <li>
                  <strong>Tarot Card Readings:</strong> Digital tarot card draws and interpretations
                </li>
                <li>
                  <strong>Numerology Calculations:</strong> Life path numbers, soul urge numbers, and compatibility
                  analysis
                </li>
                <li>
                  <strong>Compatibility Analysis:</strong> Relationship compatibility based on astrological data
                </li>
                <li>
                  <strong>API Access:</strong> Programmatic access to all our astrological services
                </li>
              </ul>
              <p className="text-gray-700 mt-4">
                Our services are provided for entertainment, educational, and personal insight purposes only.
              </p>
            </CardContent>
          </Card>

          {/* Account Registration */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Users className="mr-2 h-5 w-5 text-green-600" />
                Account Registration and Responsibilities
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="font-semibold text-lg mb-2">Account Creation</h3>
                <ul className="list-disc list-inside space-y-1 text-gray-700">
                  <li>You must provide accurate and complete information when creating an account</li>
                  <li>You are responsible for maintaining the confidentiality of your account credentials</li>
                  <li>You must be at least 13 years old to create an account</li>
                  <li>One person may not maintain multiple accounts</li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold text-lg mb-2">Account Security</h3>
                <ul className="list-disc list-inside space-y-1 text-gray-700">
                  <li>You are responsible for all activities that occur under your account</li>
                  <li>Notify us immediately of any unauthorized use of your account</li>
                  <li>Use strong passwords and enable two-factor authentication when available</li>
                  <li>Do not share your API keys or account credentials with others</li>
                </ul>
              </div>
            </CardContent>
          </Card>

          {/* API Usage Terms */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Zap className="mr-2 h-5 w-5 text-orange-600" />
                API Usage Terms
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="font-semibold text-lg mb-2">Permitted Use</h3>
                <ul className="list-disc list-inside space-y-1 text-gray-700">
                  <li>Use the API only for legitimate purposes and in accordance with these Terms</li>
                  <li>Respect rate limits and usage quotas for your subscription plan</li>
                  <li>Implement proper error handling and retry logic</li>
                  <li>Cache responses appropriately to minimize unnecessary requests</li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold text-lg mb-2">Prohibited Use</h3>
                <ul className="list-disc list-inside space-y-1 text-gray-700">
                  <li>Attempting to reverse engineer, decompile, or hack our services</li>
                  <li>Using the API to create competing astrological services</li>
                  <li>Exceeding rate limits or attempting to circumvent usage restrictions</li>
                  <li>Sharing or reselling API access without explicit permission</li>
                  <li>Using the service for illegal activities or to harm others</li>
                  <li>Scraping or automated data collection beyond API usage</li>
                </ul>
              </div>
            </CardContent>
          </Card>

          {/* Subscription Plans and Billing */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <CreditCard className="mr-2 h-5 w-5 text-blue-600" />
                Subscription Plans and Billing
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="font-semibold text-lg mb-2">Plan Types</h3>
                <ul className="list-disc list-inside space-y-1 text-gray-700">
                  <li>
                    <strong>Free Tier:</strong> 100 API requests per month, 1 seat
                  </li>
                  <li>
                    <strong>Developer Plan:</strong> $20/month, 10,000 requests, 1 seat
                  </li>
                  <li>
                    <strong>Production Plan:</strong> $199/month, unlimited requests, multiple seats, priority support
                  </li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold text-lg mb-2">Billing Terms</h3>
                <ul className="list-disc list-inside space-y-1 text-gray-700">
                  <li>Subscriptions are billed monthly in advance</li>
                  <li>All fees are non-refundable except as required by law</li>
                  <li>We may change pricing with 30 days' notice</li>
                  <li>Failed payments may result in service suspension</li>
                  <li>You can cancel your subscription at any time</li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold text-lg mb-2">Usage Overages</h3>
                <p className="text-gray-700">
                  If you exceed your plan's request limits, additional usage may be charged at standard rates or your
                  service may be temporarily limited until the next billing cycle.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Intellectual Property */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Shield className="mr-2 h-5 w-5 text-purple-600" />
                Intellectual Property Rights
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="font-semibold text-lg mb-2">Our Rights</h3>
                <p className="text-gray-700">
                  Zodii owns all rights, title, and interest in our services, including our API, algorithms,
                  astrological interpretations, software, and related intellectual property. This includes copyrights,
                  trademarks, trade secrets, and patents.
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-lg mb-2">Your Rights</h3>
                <p className="text-gray-700">
                  You retain ownership of any content you provide to our services. You grant us a license to use this
                  content to provide our services to you. You own the results and outputs generated by our API for your
                  specific requests.
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-lg mb-2">Restrictions</h3>
                <ul className="list-disc list-inside space-y-1 text-gray-700">
                  <li>You may not copy, modify, or create derivative works of our services</li>
                  <li>You may not use our trademarks without permission</li>
                  <li>You may not remove or alter any proprietary notices</li>
                </ul>
              </div>
            </CardContent>
          </Card>

          {/* Data and Privacy */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Shield className="mr-2 h-5 w-5 text-green-600" />
                Data and Privacy
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700 mb-4">
                Your privacy is important to us. Our collection and use of personal information is governed by our
                Privacy Policy, which is incorporated into these Terms by reference.
              </p>
              <ul className="list-disc list-inside space-y-2 text-gray-700">
                <li>We collect only the information necessary to provide our services</li>
                <li>Birth data and personal information are used solely for astrological calculations</li>
                <li>We implement industry-standard security measures to protect your data</li>
                <li>You can request deletion of your data at any time</li>
                <li>We do not sell your personal information to third parties</li>
              </ul>
              <p className="text-gray-700 mt-4">
                Please review our{" "}
                <Link href="/privacy" className="text-purple-600 hover:underline">
                  Privacy Policy
                </Link>{" "}
                for detailed information about our data practices.
              </p>
            </CardContent>
          </Card>

          {/* Disclaimers */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <AlertTriangle className="mr-2 h-5 w-5 text-yellow-600" />
                Disclaimers and Limitations
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="font-semibold text-lg mb-2">Entertainment Purpose</h3>
                <p className="text-gray-700">
                  Our astrological services are provided for entertainment, educational, and personal insight purposes
                  only. They should not be used as a substitute for professional advice in matters of health, finance,
                  legal issues, or other important life decisions.
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-lg mb-2">No Guarantees</h3>
                <p className="text-gray-700">
                  We make no representations or warranties about the accuracy, completeness, or reliability of
                  astrological interpretations. Results may vary, and we cannot guarantee specific outcomes or
                  predictions.
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-lg mb-2">Service Availability</h3>
                <p className="text-gray-700">
                  While we strive for high availability, we cannot guarantee uninterrupted service. We may experience
                  downtime for maintenance, updates, or technical issues.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Limitation of Liability */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Scale className="mr-2 h-5 w-5 text-red-600" />
                Limitation of Liability
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700 mb-4">
                TO THE MAXIMUM EXTENT PERMITTED BY LAW, ZODII SHALL NOT BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL,
                CONSEQUENTIAL, OR PUNITIVE DAMAGES, INCLUDING BUT NOT LIMITED TO:
              </p>
              <ul className="list-disc list-inside space-y-1 text-gray-700">
                <li>Loss of profits, data, or business opportunities</li>
                <li>Service interruptions or security breaches</li>
                <li>Decisions made based on astrological interpretations</li>
                <li>Third-party actions or content</li>
              </ul>
              <p className="text-gray-700 mt-4">
                Our total liability to you for any claims arising from these Terms or your use of our services shall not
                exceed the amount you paid us in the 12 months preceding the claim.
              </p>
            </CardContent>
          </Card>

          {/* Termination */}
          <Card>
            <CardHeader>
              <CardTitle>Termination</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="font-semibold text-lg mb-2">By You</h3>
                <p className="text-gray-700">
                  You may terminate your account at any time by canceling your subscription through your account
                  dashboard or contacting our support team.
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-lg mb-2">By Us</h3>
                <p className="text-gray-700">
                  We may suspend or terminate your account if you violate these Terms, engage in fraudulent activity, or
                  for any other reason at our discretion. We will provide reasonable notice when possible.
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-lg mb-2">Effect of Termination</h3>
                <p className="text-gray-700">
                  Upon termination, your access to our services will cease, and we may delete your account data in
                  accordance with our Privacy Policy. Provisions that should survive termination will remain in effect.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Governing Law */}
          <Card>
            <CardHeader>
              <CardTitle>Governing Law and Disputes</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700 mb-4">
                These Terms are governed by the laws of the jurisdiction where Zodii is incorporated, without regard to
                conflict of law principles.
              </p>
              <p className="text-gray-700 mb-4">
                Any disputes arising from these Terms or your use of our services will be resolved through binding
                arbitration, except for claims that may be brought in small claims court.
              </p>
              <p className="text-gray-700">
                Before initiating any legal proceedings, you agree to first contact us to attempt to resolve the dispute
                informally.
              </p>
            </CardContent>
          </Card>

          {/* Changes to Terms */}
          <Card>
            <CardHeader>
              <CardTitle>Changes to These Terms</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700">
                We may update these Terms from time to time to reflect changes in our services, legal requirements, or
                business practices. We will notify you of material changes by email or through our service. Your
                continued use of our services after changes take effect constitutes acceptance of the new Terms.
              </p>
            </CardContent>
          </Card>

          {/* Contact Information */}
          <Card>
            <CardHeader>
              <CardTitle>Contact Information</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700 mb-4">
                If you have questions about these Terms or need support, please contact us:
              </p>
              <div className="space-y-2 text-gray-700">
                <p>
                  <strong>Email:</strong>{" "}
                  <a href="mailto:legal@zodiiapp.com" className="text-purple-600 hover:underline">
                    legal@zodiiapp.com
                  </a>
                </p>
                <p>
                  <strong>Support:</strong>{" "}
                  <a href="mailto:support@zodiiapp.com" className="text-purple-600 hover:underline">
                    support@zodiiapp.com
                  </a>
                </p>
                <p>
                  <strong>Website:</strong>{" "}
                  <a href="https://www.zodiiapp.com" className="text-purple-600 hover:underline">
                    www.zodiiapp.com
                  </a>
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Footer */}
        <div className="text-center mt-12 pt-8 border-t border-gray-200">
          <p className="text-gray-600">
            By using Zodii, you acknowledge that you have read, understood, and agree to be bound by these Terms of
            Service.
          </p>
          <div className="mt-4 space-x-4">
            <Link href="/privacy" className="text-purple-600 hover:underline">
              Privacy Policy
            </Link>
            <Link href="/contact" className="text-purple-600 hover:underline">
              Contact Us
            </Link>
            <Link href="/" className="text-purple-600 hover:underline">
              Back to Home
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
