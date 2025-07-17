import { type NextRequest, NextResponse } from "next/server"
import { getStripe } from "@/lib/stripe-config"
import { validateToken } from "@/lib/auth"
import { Database } from "@/lib/database"

export async function POST(request: NextRequest) {
  try {
    const authResult = await validateToken(request)
    if (authResult instanceof NextResponse) {
      return authResult
    }

    const user = authResult
    const organization = await Database.findOrganizationByUserId(user._id!)

    if (!organization?.customerId) {
      return NextResponse.json({ error: "No subscription found" }, { status: 404 })
    }

    const stripe = getStripe()

    const session = await stripe.billingPortal.sessions.create({
      customer: organization.customerId,
      return_url: `${process.env.NEXT_PUBLIC_APP_URL || "https://www.zodiiapp.com"}/dashboard`,
    })

    return NextResponse.json({ url: session.url })
  } catch (error) {
    console.error("Error creating portal session:", error)
    return NextResponse.json({ error: "Failed to create portal session" }, { status: 500 })
  }
}
