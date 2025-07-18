import { type NextRequest, NextResponse } from "next/server"
import connectDB from "@/lib/mongodb"
import { Currency } from "@/lib/models/Currency"
import { withRateLimit } from "@/lib/middleware/rateLimit"
import { convertFormula } from "@/lib/utils"

async function getRatesHandler(req: NextRequest) {
  try {
    await connectDB()

    const currencies = await Currency.find({})

    const rates = currencies.map((currency) => ({
      currency: currency.moeda,
      code: currency.código_iso,
      rate: convertFormula(currency.fórmula_atualizada),
      example: currency.exemplo_de_cotação,
      lastUpdated: currency.timestamp,
    }))

    return NextResponse.json({
      success: true,
      data: rates,
      total: rates.length,
    })
  } catch (error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export const GET = withRateLimit(getRatesHandler)
