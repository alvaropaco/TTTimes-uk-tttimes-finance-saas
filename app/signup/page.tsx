"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { CheckCircle, Loader2, Star, Zap, Shield } from "lucide-react"
import Link from "next/link"

interface Plan {
  id: string
  name: string
  price: number
  description: string
  features: string[]
  popular?: boolean
  icon: React.ReactNode
}

const plans: Plan[] = [
  {
    id: "free",
    name: "Free",
    price: 0,
    description: "Perfect for trying out our API",
    features: ["100 API requests/month", "All endpoints", "Community support", "Basic documentation"],
    icon: <Star className="h-6 w-6" />,
  },
  {
    id: "developer",
    name: "Developer",
    price: 20,
    description: "Great for developers and small projects",
    features: ["10,000 API requests/month", "All endpoints", "Email support", "Usage analytics", "Priority processing"],
    popular: true,
    icon: <Zap className="h-6 w-6" />,
  },
  {
    id: "production",
    name: "Production",
    price: 199,
    description: "For production applications and enterprises",
    features: [
      "Unlimited API requests",
      "All endpoints",
      "24/7 priority support",
      "Advanced analytics",
      "AI features",
      "Multiple environments",
      "Team collaboration",
    ],
    icon: <Shield className="h-6 w-6" />,
  },
]

export default function SignupPage() {
  const [selectedPlan, setSelectedPlan] = useState<string>("developer")
  const [step, setStep] = useState<"plan" | "form" | "success">("plan")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    organizationName: "",
    organizationDomain: "",
  })

  const handlePlanSelect = (planId: string) => {
    setSelectedPlan(planId)
    if (planId === "free") {
      setStep("form")
    } else {
      setStep("form")
    }
  }

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    try {
      if (selectedPlan === "free") {
        // Handle free plan signup
        const response = await fetch("/api/signup", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            ...formData,
            plan: "free",
          }),
        })

        if (response.ok) {
          const data = await response.json()
          localStorage.setItem("zodii_token", data.token)
          setStep("success")
        } else {
          const errorData = await response.json()
          setError(errorData.error || "Signup failed")
        }
      } else {
        // Handle paid plan signup - redirect to Stripe
        const response = await fetch("/api/create-subscription-session", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            planId: selectedPlan,
            userEmail: formData.email,
            userName: formData.name,
            organizationName: formData.organizationName,
            organizationDomain: formData.organizationDomain,
          }),
        })

        if (response.ok) {
          const data = await response.json()
          window.location.href = data.url
        } else {
          const errorData = await response.json()
          setError(errorData.error || "Failed to create checkout session")
        }
      }
    } catch (err) {
      setError("Network error occurred")
    } finally {
      setLoading(false)
    }
  }

  const selectedPlanData = plans.find((p) => p.id === selectedPlan)

  if (step === "success") {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8 text-center">
          <div>
            <CheckCircle className="mx-auto h-16 w-16 text-green-500" />
            <h2 className="mt-6 text-3xl font-bold text-gray-900">Welcome to Zodii!</h2>
            <p className="mt-2 text-gray-600">Your account has been created successfully.</p>
          </div>
          <div className="space-y-4">
            <Link href="/dashboard">
              <Button className="w-full">Go to Dashboard</Button>
            </Link>
            <Link href="/docs">
              <Button variant="outline" className="w-full bg-transparent">
                View API Documentation
              </Button>
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <Link href="/" className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-700 rounded-xl flex items-center justify-center">
                <span className="text-white font-bold text-lg">Z</span>
              </div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-700 bg-clip-text text-transparent">
                Zodii
              </h1>
            </Link>
            <Link href="/signin">
              <Button variant="outline">Sign In</Button>
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {step === "plan" && (
          <div className="space-y-8">
            <div className="text-center">
              <h1 className="text-4xl font-bold text-gray-900 mb-4">Choose Your Plan</h1>
              <p className="text-xl text-gray-600">Start building with our powerful astrology API</p>
            </div>

            <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
              {plans.map((plan) => (
                <Card
                  key={plan.id}
                  className={`relative cursor-pointer transition-all duration-200 hover:shadow-lg ${
                    selectedPlan === plan.id ? "ring-2 ring-blue-500 shadow-lg" : ""
                  } ${plan.popular ? "border-blue-500" : ""}`}
                  onClick={() => handlePlanSelect(plan.id)}
                >
                  {plan.popular && (
                    <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                      <Badge className="bg-blue-500 text-white px-3 py-1">Most Popular</Badge>
                    </div>
                  )}
                  <CardHeader className="text-center pb-4">
                    <div className="flex justify-center mb-4">{plan.icon}</div>
                    <CardTitle className="text-2xl">{plan.name}</CardTitle>
                    <div className="text-4xl font-bold text-gray-900">
                      ${plan.price}
                      <span className="text-lg font-normal text-gray-600">/month</span>
                    </div>
                    <CardDescription className="text-base">{plan.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-3">
                      {plan.features.map((feature, index) => (
                        <li key={index} className="flex items-center">
                          <CheckCircle className="h-5 w-5 text-green-500 mr-3 flex-shrink-0" />
                          <span className="text-gray-700">{feature}</span>
                        </li>
                      ))}
                    </ul>
                    <Button
                      className={`w-full mt-6 ${plan.popular ? "bg-blue-600 hover:bg-blue-700" : ""}`}
                      variant={selectedPlan === plan.id ? "default" : "outline"}
                      onClick={() => handlePlanSelect(plan.id)}
                    >
                      {selectedPlan === plan.id ? "Selected" : "Select Plan"}
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {step === "form" && (
          <div className="max-w-2xl mx-auto">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Create Your Account</h1>
              <p className="text-gray-600">
                You've selected the <strong>{selectedPlanData?.name}</strong> plan
                {selectedPlanData?.price ? ` for $${selectedPlanData.price}/month` : " (Free)"}
              </p>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Account Information</CardTitle>
                <CardDescription>
                  {selectedPlan === "free"
                    ? "Fill out the form below to create your free account"
                    : "Fill out the form below and you'll be redirected to complete payment"}
                </CardDescription>
              </CardHeader>
              <CardContent>
                {error && (
                  <Alert className="mb-6" variant="destructive">
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}

                <form onSubmit={handleFormSubmit} className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="name">Full Name</Label>
                      <Input
                        id="name"
                        type="text"
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder="John Doe"
                      />
                    </div>
                    <div>
                      <Label htmlFor="email">Email Address</Label>
                      <Input
                        id="email"
                        type="email"
                        required
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        placeholder="john@example.com"
                      />
                    </div>
                  </div>

                  {selectedPlan === "free" && (
                    <div>
                      <Label htmlFor="password">Password</Label>
                      <Input
                        id="password"
                        type="password"
                        required
                        value={formData.password}
                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                        placeholder="Enter a secure password"
                        minLength={8}
                      />
                    </div>
                  )}

                  {selectedPlan !== "free" && (
                    <>
                      <div>
                        <Label htmlFor="organizationName">Organization Name</Label>
                        <Input
                          id="organizationName"
                          type="text"
                          required
                          value={formData.organizationName}
                          onChange={(e) => setFormData({ ...formData, organizationName: e.target.value })}
                          placeholder="Acme Inc"
                        />
                      </div>
                      <div>
                        <Label htmlFor="organizationDomain">Organization Domain</Label>
                        <Input
                          id="organizationDomain"
                          type="text"
                          required
                          value={formData.organizationDomain}
                          onChange={(e) => setFormData({ ...formData, organizationDomain: e.target.value })}
                          placeholder="acme.com"
                        />
                      </div>
                    </>
                  )}

                  <div className="flex items-center justify-between pt-4">
                    <Button type="button" variant="outline" onClick={() => setStep("plan")}>
                      Back to Plans
                    </Button>
                    <Button type="submit" disabled={loading}>
                      {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                      {selectedPlan === "free" ? "Create Account" : "Continue to Payment"}
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  )
}
