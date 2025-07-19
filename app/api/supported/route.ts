import { type NextRequest, NextResponse } from "next/server"
import connectDB from "@/lib/mongodb"
import { Currency } from "@/lib/models/Currency"
import { withAuth } from "@/lib/middleware/rateLimit"

// Force dynamic rendering
export const dynamic = 'force-dynamic'

async function getSupportedHandler(req: NextRequest, context: { user: any; usage: any }) {
  try {
    await connectDB()

    // Fetch only required fields for better performance
    const currencies = await Currency.find(
      { 
        $and: [
          { código_iso: { $exists: true } },
          { código_iso: { $ne: null } },
          { código_iso: { $ne: "" } },
          { moeda: { $exists: true } },
          { moeda: { $ne: null } },
          { moeda: { $ne: "" } }
        ]
      }, 
      "código_iso moeda"
    ).lean()

    // Map and validate currency data
    const supported = currencies
      .filter((currency) => currency.código_iso && currency.moeda) // Extra validation
      .map((currency) => ({
        code: currency.código_iso.toUpperCase(),
        name: currency.moeda.trim(),
      }))
      .filter((currency, index, self) => 
        // Remove duplicates based on code
        index === self.findIndex(c => c.code === currency.code)
      )
      .sort((a, b) => a.code.localeCompare(b.code)) // Sort alphabetically by code

    // Add USD as the base currency at the beginning
    const usdCurrency = { code: "USD", name: "US Dollar" }
    
    // Remove USD if it exists in the list to avoid duplicates
    const filteredSupported = supported.filter(currency => currency.code !== "USD")
    
    // Add USD at the beginning
    const finalSupported = [usdCurrency, ...filteredSupported]

    return NextResponse.json({
      success: true,
      data: finalSupported,
      meta: {
        total: finalSupported.length,
        base_currency: "USD",
        last_updated: new Date().toISOString(),
      },
      usage: {
        requests_today: context.usage.totalRequests,
        limit: 100
      }
    })
  } catch (error) {
    console.error("Supported currencies API error:", error)
    return NextResponse.json({ 
      success: false,
      error: "Internal server error",
      meta: {
        timestamp: new Date().toISOString()
      }
    }, { status: 500 })
  }
}

export const GET = withAuth(getSupportedHandler)
