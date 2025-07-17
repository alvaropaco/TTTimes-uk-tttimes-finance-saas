import { type NextRequest, NextResponse } from "next/server"
import { getStripe, STRIPE_PLANS } from "@/lib/stripe-config"

export async function POST(request: NextRequest) {
  try {
    const { planId, userEmail, userName, organizationName, organizationDomain } = await request.json()

    if (!planId || !userEmail || !userName || !organizationName || !organizationDomain) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const plan = STRIPE_PLANS[planId as keyof typeof STRIPE_PLANS]
    if (!plan) {
      return NextResponse.json({ error: "Invalid plan" }, { status: 400 })
    }

    const stripe = getStripe()

    // Create checkout session
    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      payment_method_types: ["card"],
      line_items: [
        {
          price: plan.priceId,
          quantity: 1,
        },
      ],
      success_url: `${process.env.NEXT_PUBLIC_APP_URL || "https://www.zodiiapp.com"}/dashboard?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL || "https://www.zodiiapp.com"}/pricing`,
      customer_email: userEmail,
      metadata: {
        planId,
        userEmail,
        userName,
        organizationName,
        organizationDomain,
      },
    })

    return NextResponse.json({ url: session.url })
  } catch (error) {
    console.error("Error creating subscription session:", error)
    return NextResponse.json({ error: "Failed to create checkout session" }, { status: 500 })
  }
}
