import Stripe from "stripe"

let stripeInstance: Stripe | null = null

export function getStripe(): Stripe {
  if (!stripeInstance) {
    const secretKey = process.env.STRIPE_SECRET_KEY
    if (!secretKey) {
      throw new Error("STRIPE_SECRET_KEY is required")
    }
    stripeInstance = new Stripe(secretKey, {
      apiVersion: "2024-06-20",
    })
  }
  return stripeInstance
}

// Lazy export for backward compatibility
export const stripe = getStripe

// Plan configuration
export const STRIPE_PLANS = {
  developer: {
    priceId: process.env.STRIPE_PRICE_DEVELOPER || "price_developer_placeholder",
    name: "Developer",
    price: 20,
    requests: 10000,
    features: ["10,000 API requests/month", "Email support", "All endpoints"],
  },
  production: {
    priceId: process.env.STRIPE_PRICE_PRODUCTION || "price_production_placeholder",
    name: "Production",
    price: 199,
    requests: -1, // Unlimited
    features: ["Unlimited API requests", "Priority support", "All endpoints", "Advanced analytics"],
  },
}
