import { type NextRequest, NextResponse } from "next/server"
import connectDB from "@/lib/mongodb"
import { Currency } from "@/lib/models/Currency"
import { withAuth } from "@/lib/middleware/rateLimit"

// Helper function to extract rate from currency data
function extractRate(currency: any): number {
  let rate = 1.0
  try {
    // Try to extract numeric value from exemplo_de_cotação
    const rateMatch = currency.exemplo_de_cotação?.match(/[\d.,]+/)
    if (rateMatch) {
      rate = parseFloat(rateMatch[0].replace(',', '.'))
    }
  } catch (error) {
    console.warn(`Could not parse rate for ${currency.código_iso}, using default 1.0`)
  }
  return rate
}

async function getRatesHandler(req: NextRequest, context: { user: any; usage: any }) {
  try {
    await connectDB()

    const currencies = await Currency.find({})

    const rates = currencies.map((currency) => ({
      currency: currency.moeda,
      code: currency.código_iso,
      rate: extractRate(currency),
      example: currency.exemplo_de_cotação,
      formula: currency.fórmula_atualizada,
      lastUpdated: currency.timestamp,
    }))

    // Add USD as base currency at the beginning
    rates.unshift({
      currency: "US Dollar",
      code: "USD",
      rate: 1.0,
      example: "1.00",
      formula: "1.0",
      lastUpdated: new Date().toISOString(),
    })

    return NextResponse.json({
      success: true,
      data: rates,
      total: rates.length,
      usage: {
        requests_today: context.usage.totalRequests,
        limit: 100
      }
    })
  } catch (error) {
    console.error("Rates API error:", error)
    return NextResponse.json({ 
      success: false,
      error: "Internal server error" 
    }, { status: 500 })
  }
}

export const GET = withAuth(getRatesHandler)
