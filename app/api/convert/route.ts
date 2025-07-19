import { type NextRequest, NextResponse } from "next/server"
import connectDB from "@/lib/mongodb"
import { Currency } from "@/lib/models/Currency"
import { withAuth } from "@/lib/middleware/rateLimit"
import { convertFormula } from "@/lib/utils"
import { exchangeRateCache, CacheKeys } from "@/lib/cache"
import { logger, createRequestLogger } from "@/lib/logger"
import { metricsCollector } from "@/lib/metrics"
import { convertSchema } from "@/lib/validation"

// Force dynamic rendering
export const dynamic = 'force-dynamic'

async function convertHandler(req: NextRequest, context: { user: any; usage: any }) {
  const requestLogger = createRequestLogger(req)
  const startTime = Date.now()

  try {
    const { searchParams } = new URL(req.url)
    const from = searchParams.get("from")?.toUpperCase()
    const to = searchParams.get("to")?.toUpperCase()
    const amount = Number.parseFloat(searchParams.get("amount") || "1")

    // Validação usando Zod
    const validation = convertSchema.safeParse({ from, to, amount })
    if (!validation.success) {
      const errorMessage = validation.error.errors.map(e => e.message).join(", ")
      logger.warn("Convert API validation failed", {
        userId: context.user?.id,
        errors: validation.error.errors,
        params: { from, to, amount }
      })
      
      return NextResponse.json({ 
        success: false,
        error: errorMessage,
        details: validation.error.errors
      }, { status: 400 })
    }

    const { from: validFrom, to: validTo, amount: validAmount } = validation.data

    requestLogger.log("Convert request", {
      userId: context.user?.id,
      from: validFrom,
      to: validTo,
      amount: validAmount
    })

    // Verifica cache primeiro
    const cacheKey = CacheKeys.exchangeRate(validFrom, validTo)
    let rate = exchangeRateCache.get<number>(cacheKey)
    let cacheHit = rate !== null

    if (cacheHit) {
      logger.cacheEvent('hit', cacheKey, { userId: context.user?.id })
    } else {
      logger.cacheEvent('miss', cacheKey, { userId: context.user?.id })
    }

    await connectDB()

    // Caso especial: mesma moeda
    if (validFrom === validTo) {
      const result = {
        success: true,
        data: {
          from: validFrom,
          to: validTo,
          amount: validAmount,
          result: validAmount,
          rate: 1,
          cached: false
        },
        usage: {
          requests_today: context.usage.totalRequests,
          limit: 100
        }
      }

      requestLogger.logResponse(200, { 
        userId: context.user?.id,
        cacheHit: false,
        sameCurrency: true
      })

      return NextResponse.json(result)
    }

    let result: number

    if (!cacheHit) {
      // Busca taxa de câmbio do banco de dados
      if (validFrom === "USD") {
        // USD to other currency
        const toCurrency = await Currency.findOne({ código_iso: validTo })
        if (!toCurrency) {
          logger.warn("Currency not found", { 
            userId: context.user?.id,
            currency: validTo,
            operation: "USD_to_other"
          })
          
          return NextResponse.json({ 
            success: false,
            error: `Currency ${validTo} not supported` 
          }, { status: 400 })
        }
        rate = Number(convertFormula(validFrom, validTo, 1))
      } else if (validTo === "USD") {
        // Other currency to USD
        const fromCurrency = await Currency.findOne({ código_iso: validFrom })
        if (!fromCurrency) {
          logger.warn("Currency not found", { 
            userId: context.user?.id,
            currency: validFrom,
            operation: "other_to_USD"
          })
          
          return NextResponse.json({ 
            success: false,
            error: `Currency ${validFrom} not supported` 
          }, { status: 400 })
        }
        rate = 1 / Number(convertFormula(validFrom, validTo, 1))
      } else {
        // Other currency to other currency (via USD)
        const fromCurrency = await Currency.findOne({ código_iso: validFrom })
        const toCurrency = await Currency.findOne({ código_iso: validTo })

        if (!fromCurrency || !toCurrency) {
          logger.warn("One or both currencies not found", { 
            userId: context.user?.id,
            fromCurrency: validFrom,
            toCurrency: validTo,
            operation: "cross_currency"
          })
          
          return NextResponse.json({ 
            success: false,
            error: "One or both currencies not supported" 
          }, { status: 400 })
        }

        const fromToUsdRate = 1 / Number(convertFormula(validFrom, "USD", 1))
        const usdToToRate = Number(convertFormula("USD", validTo, 1))
        rate = fromToUsdRate * usdToToRate
      }

      // Armazena no cache
      exchangeRateCache.set(cacheKey, rate)
      logger.cacheEvent('set', cacheKey, { 
        userId: context.user?.id,
        rate: rate
      })
    }

    result = validAmount * rate!

    const responseData = {
      success: true,
      data: {
        from: validFrom,
        to: validTo,
        amount: validAmount,
        result: Number.parseFloat(result.toFixed(6)),
        rate: Number.parseFloat(rate!.toFixed(6)),
        cached: cacheHit
      },
      usage: {
        requests_today: context.usage.totalRequests,
        limit: 100
      }
    }

    const responseTime = Date.now() - startTime

    // Registra métricas
    metricsCollector.record({
      endpoint: '/api/convert',
      method: 'GET',
      statusCode: 200,
      responseTime,
      timestamp: new Date(),
      userId: context.user?.id
    })

    requestLogger.logResponse(200, { 
      userId: context.user?.id,
      cacheHit,
      responseTime,
      from: validFrom,
      to: validTo,
      amount: validAmount
    })

    logger.info("Conversion completed successfully", {
      userId: context.user?.id,
      from: validFrom,
      to: validTo,
      amount: validAmount,
      result: responseData.data.result,
      rate: responseData.data.rate,
      cached: cacheHit,
      responseTime
    })

    return NextResponse.json(responseData)

  } catch (error) {
    const responseTime = Date.now() - startTime
    
    // Registra métricas de erro
    metricsCollector.record({
      endpoint: '/api/convert',
      method: 'GET',
      statusCode: 500,
      responseTime,
      timestamp: new Date(),
      userId: context.user?.id,
      error: error instanceof Error ? error.message : 'Unknown error'
    })

    requestLogger.logError(error instanceof Error ? error : new Error(String(error)), {
      userId: context.user?.id,
      responseTime
    })

    logger.error("Convert API error", error instanceof Error ? error : new Error(String(error)), {
      userId: context.user?.id,
      responseTime
    })

    return NextResponse.json({ 
      success: false,
      error: "Internal server error" 
    }, { status: 500 })
  }
}

export const GET = withAuth(convertHandler)
