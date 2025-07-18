import { type NextRequest, NextResponse } from "next/server"
import connectDB from "@/lib/mongodb"
import { Currency } from "@/lib/models/Currency"
import { withRateLimit } from "@/lib/middleware/rateLimit"

async function getSupportedHandler(req: NextRequest) {
  try {
    await connectDB()

    const currencies = await Currency.find({}, "código_iso moeda")

    const supported = currencies.map((currency) => ({
      code: currency.código_iso,
      name: currency.moeda,
    }))

    // Add USD as it's the base currency
    supported.unshift({ code: "USD", name: "US Dollar" })

    return NextResponse.json({
      success: true,
      data: supported,
      total: supported.length,
    })
  } catch (error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export const GET = withRateLimit(getSupportedHandler)
