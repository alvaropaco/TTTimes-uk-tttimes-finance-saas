import { type NextRequest, NextResponse } from "next/server"
import { headers } from "next/headers"
import { getStripe } from "@/lib/stripe-config"
import { Database } from "@/lib/database"
import { upsertSubscription } from "@/lib/subscription-service"

export async function POST(request: NextRequest) {
  try {
    const body = await request.text()
    const headersList = await headers()
    const signature = headersList.get("stripe-signature")

    if (!signature) {
      return NextResponse.json({ error: "No signature" }, { status: 400 })
    }

    const stripe = getStripe()
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET

    if (!webhookSecret) {
      return NextResponse.json({ error: "Webhook secret not configured" }, { status: 500 })
    }

    const event = stripe.webhooks.constructEvent(body, signature, webhookSecret)

    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as any
        const metadata = session.metadata

        if (metadata && session.subscription) {
          // Create user and organization
          const token = `zod_${Math.random().toString(36).substring(2, 15)}${Math.random().toString(36).substring(2, 15)}`

          const user = await Database.createUser({
            name: metadata.userName,
            email: metadata.userEmail,
            token,
            plan: metadata.planId,
          })

          // Create organization with subscription details
          await Database.createOrganizationFromCheckout({
            userId: user._id!,
            organizationName: metadata.organizationName,
            organizationDomain: metadata.organizationDomain,
            subscriptionId: session.subscription,
            customerId: session.customer,
            planId: metadata.planId,
            status: "active",
            currentPeriodStart: new Date(),
            currentPeriodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
          })
        }
        break
      }

      case "invoice.payment_succeeded": {
        const invoice = event.data.object as any
        if (invoice.subscription) {
          await Database.updateSubscriptionStatus(invoice.subscription, "active")
        }
        break
      }

      case "invoice.payment_failed": {
        const invoice = event.data.object as any
        if (invoice.subscription) {
          await Database.updateSubscriptionStatus(invoice.subscription, "past_due")
        }
        break
      }

      case "customer.subscription.updated": {
        const subscription = event.data.object as any
        await upsertSubscription({
          id: subscription.id,
          customerId: subscription.customer,
          status: subscription.status,
          currentPeriodStart: new Date(subscription.current_period_start * 1000),
          currentPeriodEnd: new Date(subscription.current_period_end * 1000),
          planId: subscription.items.data[0]?.price?.lookup_key || "unknown",
          cancelAtPeriodEnd: subscription.cancel_at_period_end,
        })
        break
      }

      case "customer.subscription.deleted": {
        const subscription = event.data.object as any
        await Database.updateSubscriptionStatus(subscription.id, "canceled")
        break
      }
    }

    return NextResponse.json({ received: true })
  } catch (error) {
    console.error("Webhook error:", error)
    return NextResponse.json({ error: "Webhook handler failed" }, { status: 400 })
  }
}
