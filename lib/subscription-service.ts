import { Database } from "./database"
import { getStripe } from "./stripe-config"

export interface SubscriptionData {
  id: string
  customerId: string
  status: string
  currentPeriodStart: Date
  currentPeriodEnd: Date
  planId: string
  cancelAtPeriodEnd: boolean
}

export async function upsertSubscription(subscriptionData: SubscriptionData): Promise<void> {
  try {
    await Database.updateSubscriptionDetails(subscriptionData.id, {
      status: subscriptionData.status,
      currentPeriodStart: subscriptionData.currentPeriodStart,
      currentPeriodEnd: subscriptionData.currentPeriodEnd,
    })
  } catch (error) {
    console.error("Error upserting subscription:", error)
    throw error
  }
}

export async function cancelSubscription(subscriptionId: string): Promise<void> {
  const stripe = getStripe()

  try {
    await stripe.subscriptions.update(subscriptionId, {
      cancel_at_period_end: true,
    })

    await Database.updateSubscriptionStatus(subscriptionId, "cancel_at_period_end")
  } catch (error) {
    console.error("Error canceling subscription:", error)
    throw error
  }
}

export async function reactivateSubscription(subscriptionId: string): Promise<void> {
  const stripe = getStripe()

  try {
    await stripe.subscriptions.update(subscriptionId, {
      cancel_at_period_end: false,
    })

    await Database.updateSubscriptionStatus(subscriptionId, "active")
  } catch (error) {
    console.error("Error reactivating subscription:", error)
    throw error
  }
}
