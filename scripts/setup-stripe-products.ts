import { stripe } from "../lib/stripe-config"

async function setupStripeProducts() {
  try {
    console.log("Setting up Stripe products...")

    // Developer Plan
    const developerProduct = await stripe.products.create({
      name: "Zodii Developer Plan",
      description: "Perfect for individual developers and small projects",
    })

    const developerPrice = await stripe.prices.create({
      unit_amount: 2000, // $20.00
      currency: "usd",
      recurring: { interval: "month" },
      product: developerProduct.id,
    })

    console.log("Developer Plan created:")
    console.log(`Product ID: ${developerProduct.id}`)
    console.log(`Price ID: ${developerPrice.id}`)

    // Production Plan
    const productionProduct = await stripe.products.create({
      name: "Zodii Production Plan",
      description: "For teams and high-volume applications",
    })

    const productionPrice = await stripe.prices.create({
      unit_amount: 19900, // $199.00
      currency: "usd",
      recurring: { interval: "month" },
      product: productionProduct.id,
    })

    console.log("\nProduction Plan created:")
    console.log(`Product ID: ${productionProduct.id}`)
    console.log(`Price ID: ${productionPrice.id}`)

    console.log("\n✅ Stripe products setup complete!")
    console.log("\n📝 Update lib/stripe-config.ts with these Price IDs:")
    console.log(`Developer priceId: "${developerPrice.id}"`)
    console.log(`Production priceId: "${productionPrice.id}"`)
  } catch (error) {
    console.error("Error setting up Stripe products:", error)
    process.exit(1)
  }
}

setupStripeProducts()
