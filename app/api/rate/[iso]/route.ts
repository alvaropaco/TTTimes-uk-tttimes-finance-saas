import { type NextRequest, NextResponse } from "next/server"
import connectDB from "@/lib/mongodb"
import { Currency } from "@/lib/models/Currency"
import { withRateLimit } from "@/lib/middleware/rateLimit"
import { convertFormula } from "@/lib/utils"

async function getRateHandler(req: NextRequest, { params }: { params: { iso: string } }) {
  try {
    const { iso } = params

    if (iso === "USD") {
      return NextResponse.json({
        success: true,
        data: {
          currency: "US Dollar",
          code: "USD",
          rate: 1,
          lastUpdated: new Date().toISOString(),
        },
      })
    }

    await connectDB()

    const currency = await Currency.findOne({ código_iso: iso.toUpperCase() })

    if (!currency) {
      return NextResponse.json({ error: `Currency ${iso} not found` }, { status: 404 })
    }

    return NextResponse.json({
      success: true,
      data: {
        currency: currency.moeda,
        code: currency.código_iso,
        rate: convertFormula(currency.fórmula_atualizada),
        example: currency.exemplo_de_cotação,
        lastUpdated: currency.timestamp,
      },
    })
  } catch (error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export const GET = withRateLimit(getRateHandler)
