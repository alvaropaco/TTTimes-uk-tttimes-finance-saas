import { NextRequest, NextResponse } from "next/server"
import { validateToken } from "@/lib/auth"
import { TranslationCacheService } from "@/lib/translation-cache"

// Force dynamic rendering for this route since it uses request headers
export const dynamic = 'force-dynamic'

// CORS headers
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, Accept-Language",
}

export async function OPTIONS() {
  return new Response(null, { status: 200, headers: corsHeaders })
}

export async function GET(request: NextRequest) {
  try {
    // Validate token using standard auth
    const user = await validateToken(request)
    if (user instanceof NextResponse) {
      return NextResponse.json(
        user.body,
        { status: user.status, headers: corsHeaders }
      )
    }

    // Get cache statistics
    const stats = await TranslationCacheService.getCacheStats()

    return NextResponse.json(
      {
        success: true,
        stats,
      },
      { headers: corsHeaders }
    )
  } catch (error) {
    console.error("Translation cache stats error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500, headers: corsHeaders }
    )
  }
}

export async function DELETE(request: NextRequest) {
  try {
    // Validate token using standard auth
    const user = await validateToken(request)
    if (user instanceof NextResponse) {
      return NextResponse.json(
        user.body,
        { status: user.status, headers: corsHeaders }
      )
    }

    // Clean up old cache entries
    const deletedCount = await TranslationCacheService.cleanupCache()

    return NextResponse.json(
      {
        success: true,
        message: `Cleaned up ${deletedCount} old cache entries`,
        deletedCount,
      },
      { headers: corsHeaders }
    )
  } catch (error) {
    console.error("Translation cache cleanup error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500, headers: corsHeaders }
    )
  }
}
