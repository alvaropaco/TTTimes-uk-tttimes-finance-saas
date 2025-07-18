import { type NextRequest, NextResponse } from "next/server"
import connectDB from "@/lib/mongodb"
import { Currency } from "@/lib/models/Currency"
import { withRateLimit } from "@/lib/middleware/rateLimit"
import { convertFormula } from "@/lib/utils"

async function convertHandler(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const from = searchParams.get("from")
    const to = searchParams.get("to")
    const amount = Number.parseFloat(searchParams.get("amount") || "1")

    if (!from || !to) {
      return NextResponse.json({ error: "Missing required parameters: from, to" }, { status: 400 })
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
      })
    }

    let result: number
    let rate: number

    if (from === "USD") {
      // USD to other currency
      const toCurrency = await Currency.findOne({ código_iso: to })
      if (!toCurrency) {
        return NextResponse.json({ error: `Currency ${to} not supported` }, { status: 404 })
      }
      rate = convertFormula(toCurrency.fórmula_atualizada)
      result = amount * rate
    } else if (to === "USD") {
      // Other currency to USD
      const fromCurrency = await Currency.findOne({ código_iso: from })
      if (!fromCurrency) {
        return NextResponse.json({ error: `Currency ${from} not supported` }, { status: 404 })
      }
      rate = 1 / convertFormula(fromCurrency.fórmula_atualizada)
      result = amount * rate
    } else {
      // Other currency to other currency (via USD)
      const fromCurrency = await Currency.findOne({ código_iso: from })
      const toCurrency = await Currency.findOne({ código_iso: to })

      if (!fromCurrency || !toCurrency) {
        return NextResponse.json({ error: "One or both currencies not supported" }, { status: 404 })
      }

      const fromRate = convertFormula(fromCurrency.fórmula_atualizada)
      const toRate = convertFormula(toCurrency.fórmula_atualizada)
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
    })
  } catch (error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export const GET = withRateLimit(convertHandler)
