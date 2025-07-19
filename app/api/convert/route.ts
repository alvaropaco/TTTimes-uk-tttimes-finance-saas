import { type NextRequest, NextResponse } from "next/server"
import connectDB from "@/lib/mongodb"
import { Currency } from "@/lib/models/Currency"
import { withAuth } from "@/lib/middleware/rateLimit"
import { convertFormula } from "@/lib/utils"

async function convertHandler(req: NextRequest, context: { user: any; usage: any }) {
  try {
    const { searchParams } = new URL(req.url)
    const from = searchParams.get("from")?.toUpperCase()
    const to = searchParams.get("to")?.toUpperCase()
    const amount = Number.parseFloat(searchParams.get("amount") || "1")

    if (!from || !to) {
      return NextResponse.json({ 
        success: false,
        error: "Missing required parameters: from, to" 
      }, { status: 400 })
    }

    if (isNaN(amount) || amount <= 0) {
      return NextResponse.json({ 
        success: false,
        error: "Invalid amount. Must be a positive number" 
      }, { status: 400 })
    }

    await connectDB()

    if (from === "USD" && to === "USD") {
      return NextResponse.json({
        success: true,
        data: {
          from,
          to,
          amount,
          result: amount,
          rate: 1,
        },
        usage: {
          requests_today: context.usage.totalRequests,
          limit: 100
        }
      })
    }

    let result: number
    let rate: number

    if (from === "USD") {
      // USD to other currency
      const toCurrency = await Currency.findOne({ código_iso: to })
      if (!toCurrency) {
        return NextResponse.json({ 
          success: false,
          error: `Currency ${to} not supported` 
        }, { status: 400 })
      }
      rate = Number(convertFormula(from, to, amount))
      result = amount * rate
    } else if (to === "USD") {
      // Other currency to USD
      const fromCurrency = await Currency.findOne({ código_iso: from })
      if (!fromCurrency) {
        return NextResponse.json({ 
          success: false,
          error: `Currency ${from} not supported` 
        }, { status: 400 })
      }
      rate = 1 / Number(convertFormula(from, to, amount))
      result = amount * rate
    } else {
      // Other currency to other currency (via USD)
      const fromCurrency = await Currency.findOne({ código_iso: from })
      const toCurrency = await Currency.findOne({ código_iso: to })

      if (!fromCurrency || !toCurrency) {
        return NextResponse.json({ 
          success: false,
          error: "One or both currencies not supported" 
        }, { status: 400 })
      }

      const fromRate = Number(convertFormula(from, to, amount))
      const toRate = Number(convertFormula(from, to, amount))
      rate = toRate / fromRate
      result = amount * rate
    }

    return NextResponse.json({
      success: true,
      data: {
        from,
        to,
        amount,
        result: Number.parseFloat(result.toFixed(6)),
        rate: Number.parseFloat(rate.toFixed(6)),
      },
      usage: {
        requests_today: context.usage.totalRequests,
        limit: 100
      }
    })
  } catch (error) {
    console.error("Convert API error:", error)
    return NextResponse.json({ 
      success: false,
      error: "Internal server error" 
    }, { status: 500 })
  }
}

export const GET = withAuth(convertHandler)
