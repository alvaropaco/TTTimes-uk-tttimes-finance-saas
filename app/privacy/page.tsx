"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ArrowLeft, Shield, Eye, Database, Cookie, Mail, Scale } from "lucide-react"

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-100">
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
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Privacy Policy</h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Your privacy is important to us. This policy explains how Zodii collects, uses, and protects your personal
              information.
            </p>
            <p className="text-sm text-gray-500 mt-2">Last updated: January 16, 2025</p>
          </div>
        </div>

        <div className="max-w-4xl mx-auto space-y-6">
          {/* Information We Collect */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Database className="mr-2 h-5 w-5 text-purple-600" />
                Information We Collect
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="font-semibold text-lg mb-2">Personal Information</h3>
                <ul className="list-disc list-inside space-y-1 text-gray-700">
                  <li>Email address (for account creation and communication)</li>
                  <li>Name (optional, for personalization)</li>
                  <li>Birth date and time (for astrological calculations)</li>
                  <li>Birth location (for accurate chart generation)</li>
                  <li>Payment information (processed securely through Stripe)</li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold text-lg mb-2">Usage Data</h3>
                <ul className="list-disc list-inside space-y-1 text-gray-700">
                  <li>API requests and responses</li>
                  <li>Usage patterns and frequency</li>
                  <li>Device information and IP address</li>
                  <li>Browser type and version</li>
                  <li>Pages visited and time spent</li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold text-lg mb-2">Astrological Data</h3>
                <ul className="list-disc list-inside space-y-1 text-gray-700">
                  <li>Birth chart calculations and interpretations</li>
                  <li>Horoscope preferences and history</li>
                  <li>Tarot card readings and results</li>
                  <li>Numerology calculations</li>
                  <li>Compatibility analysis results</li>
                </ul>
              </div>
            </CardContent>
          </Card>

          {/* How We Use Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Eye className="mr-2 h-5 w-5 text-blue-600" />
                How We Use Your Information
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="list-disc list-inside space-y-2 text-gray-700">
                <li>
                  <strong>Service Provision:</strong> Generate personalized astrological content, birth charts,
                  horoscopes, and readings
                </li>
                <li>
                  <strong>Account Management:</strong> Create and maintain your account, process payments, and provide
                  customer support
                </li>
                <li>
                  <strong>API Services:</strong> Process API requests, track usage limits, and ensure service quality
                </li>
                <li>
                  <strong>Communication:</strong> Send service updates, billing notifications, and respond to inquiries
                </li>
                <li>
                  <strong>Improvement:</strong> Analyze usage patterns to improve our services and develop new features
                </li>
                <li>
                  <strong>Legal Compliance:</strong> Meet legal obligations and protect against fraud or abuse
                </li>
                <li>
                  <strong>Marketing:</strong> Send promotional content (with your consent, and you can opt-out anytime)
                </li>
              </ul>
            </CardContent>
          </Card>

          {/* Data Sharing */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Shield className="mr-2 h-5 w-5 text-green-600" />
                Data Sharing and Disclosure
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-gray-700">
                We do not sell, trade, or rent your personal information to third parties. We may share your information
                only in the following circumstances:
              </p>
              <ul className="list-disc list-inside space-y-2 text-gray-700">
                <li>
                  <strong>Service Providers:</strong> Trusted third-party services (Stripe for payments, MongoDB for
                  data storage, Vercel for hosting)
                </li>
                <li>
                  <strong>Legal Requirements:</strong> When required by law, court order, or government request
                </li>
                <li>
                  <strong>Business Transfer:</strong> In case of merger, acquisition, or sale of business assets
                </li>
                <li>
                  <strong>Protection:</strong> To protect our rights, property, or safety, or that of our users
                </li>
                <li>
                  <strong>Consent:</strong> With your explicit consent for specific purposes
                </li>
              </ul>
            </CardContent>
          </Card>

          {/* Data Security */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Shield className="mr-2 h-5 w-5 text-red-600" />
                Data Security
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="list-disc list-inside space-y-2 text-gray-700">
                <li>Industry-standard encryption for data transmission (SSL/TLS)</li>
                <li>Secure database storage with access controls</li>
                <li>Regular security audits and updates</li>
                <li>Limited access to personal data on a need-to-know basis</li>
                <li>Secure payment processing through Stripe (PCI DSS compliant)</li>
                <li>Regular backups and disaster recovery procedures</li>
              </ul>
            </CardContent>
          </Card>

          {/* Cookies and Tracking */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Cookie className="mr-2 h-5 w-5 text-orange-600" />
                Cookies and Tracking
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-gray-700">We use cookies and similar technologies to enhance your experience:</p>
              <ul className="list-disc list-inside space-y-2 text-gray-700">
                <li>
                  <strong>Essential Cookies:</strong> Required for basic site functionality and security
                </li>
                <li>
                  <strong>Authentication:</strong> To keep you logged in and secure your session
                </li>
                <li>
                  <strong>Preferences:</strong> To remember your settings and preferences
                </li>
                <li>
                  <strong>Analytics:</strong> To understand how our service is used (anonymized data)
                </li>
                <li>
                  <strong>Performance:</strong> To optimize loading times and user experience
                </li>
              </ul>
              <p className="text-gray-700">
                You can control cookies through your browser settings, but some features may not work properly if
                disabled.
              </p>
            </CardContent>
          </Card>

          {/* Your Rights */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Scale className="mr-2 h-5 w-5 text-indigo-600" />
                Your Rights and Choices
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="list-disc list-inside space-y-2 text-gray-700">
                <li>
                  <strong>Access:</strong> Request a copy of your personal data
                </li>
                <li>
                  <strong>Correction:</strong> Update or correct inaccurate information
                </li>
                <li>
                  <strong>Deletion:</strong> Request deletion of your account and data
                </li>
                <li>
                  <strong>Portability:</strong> Export your data in a machine-readable format
                </li>
                <li>
                  <strong>Restriction:</strong> Limit how we process your data
                </li>
                <li>
                  <strong>Objection:</strong> Object to certain types of processing
                </li>
                <li>
                  <strong>Opt-out:</strong> Unsubscribe from marketing communications
                </li>
                <li>
                  <strong>Withdraw Consent:</strong> Revoke consent for data processing
                </li>
              </ul>
              <p className="text-gray-700 mt-4">
                To exercise these rights, contact us at{" "}
                <a href="mailto:privacy@zodiiapp.com" className="text-purple-600 hover:underline">
                  privacy@zodiiapp.com
                </a>
              </p>
            </CardContent>
          </Card>

          {/* Data Retention */}
          <Card>
            <CardHeader>
              <CardTitle>Data Retention</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="list-disc list-inside space-y-2 text-gray-700">
                <li>
                  <strong>Account Data:</strong> Retained while your account is active
                </li>
                <li>
                  <strong>Usage Data:</strong> Kept for up to 2 years for analytics and improvement
                </li>
                <li>
                  <strong>Payment Data:</strong> Retained as required by law and payment processors
                </li>
                <li>
                  <strong>Support Data:</strong> Kept for 3 years to provide ongoing support
                </li>
                <li>
                  <strong>Legal Data:</strong> Retained as required by applicable laws
                </li>
              </ul>
              <p className="text-gray-700 mt-4">
                When you delete your account, we will delete or anonymize your personal data within 30 days, except
                where retention is required by law.
              </p>
            </CardContent>
          </Card>

          {/* International Transfers */}
          <Card>
            <CardHeader>
              <CardTitle>International Data Transfers</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700">
                Your data may be processed in countries other than your own. We ensure appropriate safeguards are in
                place, including:
              </p>
              <ul className="list-disc list-inside space-y-1 text-gray-700 mt-2">
                <li>Standard contractual clauses approved by regulatory authorities</li>
                <li>Adequacy decisions by relevant data protection authorities</li>
                <li>Certification schemes and codes of conduct</li>
              </ul>
            </CardContent>
          </Card>

          {/* Children's Privacy */}
          <Card>
            <CardHeader>
              <CardTitle>Children's Privacy</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700">
                Our service is not intended for children under 13 years of age. We do not knowingly collect personal
                information from children under 13. If you are a parent or guardian and believe your child has provided
                us with personal information, please contact us immediately.
              </p>
            </CardContent>
          </Card>

          {/* Changes to Policy */}
          <Card>
            <CardHeader>
              <CardTitle>Changes to This Policy</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700">
                We may update this privacy policy from time to time. We will notify you of any changes by posting the
                new policy on this page and updating the "Last updated" date. For significant changes, we may also send
                you an email notification.
              </p>
            </CardContent>
          </Card>

          {/* Contact Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Mail className="mr-2 h-5 w-5 text-purple-600" />
                Contact Us
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700 mb-4">
                If you have any questions about this privacy policy or our data practices, please contact us:
              </p>
              <div className="space-y-2 text-gray-700">
                <p>
                  <strong>Email:</strong>{" "}
                  <a href="mailto:privacy@zodiiapp.com" className="text-purple-600 hover:underline">
                    privacy@zodiiapp.com
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
            By using Zodii, you acknowledge that you have read and understood this privacy policy.
          </p>
          <div className="mt-4 space-x-4">
            <Link href="/terms" className="text-purple-600 hover:underline">
              Terms of Service
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
