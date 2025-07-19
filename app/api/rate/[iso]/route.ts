import { type NextRequest, NextResponse } from "next/server"
import connectDB from "@/lib/mongodb"
import { Currency } from "@/lib/models/Currency"
import { withAuth } from "@/lib/middleware/rateLimit"

async function getRateHandler(req: NextRequest, context: { user: any; usage: any }) {
  try {
    // Extract ISO code from the URL path
    const url = new URL(req.url)
    const pathSegments = url.pathname.split('/')
    const iso = pathSegments[pathSegments.length - 1] // Get the last segment
    const isoCode = iso.toUpperCase()

    // USD is always 1.0 as base currency
    if (isoCode === "USD") {
      return NextResponse.json({
        success: true,
        data: {
          currency: "USD",
          code: "USD",
          name: "US Dollar",
          rate: 1.0,
          lastUpdated: new Date().toISOString(),
        },
        usage: {
          requests_today: context.usage.totalRequests,
          limit: 100
        }
      })
    }

    await connectDB()

    const currency = await Currency.findOne({ código_iso: isoCode })

    if (!currency) {
      return NextResponse.json({ 
        success: false,
        error: `Currency ${isoCode} not found` 
      }, { status: 404 })
    }

    // Extract rate from the formula or example
    let rate = 1.0
    try {
      // Try to extract numeric value from exemplo_de_cotação
      const rateMatch = currency.exemplo_de_cotação.match(/[\d.,]+/)
      if (rateMatch) {
        rate = parseFloat(rateMatch[0].replace(',', '.'))
      }
    } catch (error) {
      console.warn(`Could not parse rate for ${isoCode}, using default 1.0`)
    }

    return NextResponse.json({
      success: true,
      data: {
        currency: currency.código_iso,
        code: currency.código_iso,
        name: currency.moeda,
        rate: rate,
        example: currency.exemplo_de_cotação,
        formula: currency.fórmula_atualizada,
        lastUpdated: currency.timestamp,
      },
      usage: {
        requests_today: context.usage.totalRequests,
        limit: 100
      }
    })
  } catch (error) {
    console.error("Rate API error:", error)
    return NextResponse.json({ 
      success: false,
      error: "Internal server error" 
    }, { status: 500 })
  }
}

export const GET = withAuth(getRateHandler)
