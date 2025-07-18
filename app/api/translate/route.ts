import { type NextRequest, NextResponse } from "next/server"
import { validateToken } from "@/lib/auth"
import * as deepl from 'deepl-node'
import { TranslationCacheService } from "@/lib/translation-cache"

// Force dynamic rendering for this route since it uses request headers
export const dynamic = 'force-dynamic'

// CORS headers for the translation API
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization, lang',
  'Access-Control-Max-Age': '86400',
}

// Handle preflight OPTIONS request
export async function OPTIONS(request: NextRequest) {
  return new NextResponse(null, {
    status: 200,
    headers: corsHeaders,
  })
}

// Language mapping for DeepL compatibility
const languageMapping: Record<string, string> = {
  'pt': 'pt-PT', // Default Portuguese to European Portuguese
  'zh': 'zh-CN', // Default Chinese to Simplified Chinese
  // Add other mappings as needed
}

export async function POST(request: NextRequest) {
  const authResult = await validateToken(request)

  if (authResult instanceof NextResponse) {
    return authResult
  }

  try {
    // Get the lang header parameter
    const lang = request.headers.get("lang")
    
    if (!lang) {
      return NextResponse.json({ error: "Language parameter is required in headers" }, { 
        status: 400,
        headers: corsHeaders
      })
    }

    // Get the text to translate from request body
    const body = await request.json()
    const { text } = body

    if (!text || typeof text !== 'string' || text.trim().length === 0) {
      return NextResponse.json({ error: "Text to translate is required and must be a non-empty string" }, { 
        status: 400,
        headers: corsHeaders
      })
    }

    // Trim whitespace from text
    const trimmedText = text.trim()

    // Map language code for DeepL compatibility
    const targetLang = languageMapping[lang] || lang

    // Check cache first
    const cachedTranslation = await TranslationCacheService.getCachedTranslation(
      trimmedText,
      "en",
      targetLang
    )

    if (cachedTranslation) {
      return NextResponse.json({
        success: true,
        translatedText: cachedTranslation,
        originalText: trimmedText,
        targetLanguage: targetLang,
        requestedLanguage: lang,
        sourceLanguage: 'en',
        cached: true
      }, {
        headers: corsHeaders
      })
    }

    // Check if DeepL API key is configured
    const deeplApiKey = process.env.DEEPL_API_KEY
    if (!deeplApiKey) {
      return NextResponse.json({ error: "Translation service not configured" }, { 
        status: 500,
        headers: corsHeaders
      })
    }

    // Initialize DeepL translator
    const translator = new deepl.Translator(deeplApiKey)

    // Translate the text
    const result = await translator.translateText(
      trimmedText,
      'en',
      targetLang as deepl.TargetLanguageCode
    )

    // Cache the translation for future use
    await TranslationCacheService.setCachedTranslation(
      trimmedText,
      result.text,
      "en",
      targetLang
    )
    
    return NextResponse.json({
      success: true,
      translatedText: result.text,
      originalText: trimmedText,
      targetLanguage: targetLang,
      requestedLanguage: lang,
      sourceLanguage: 'en',
      cached: false
    }, {
      headers: corsHeaders
    })
  } catch (error) {
    console.error("Error in translation API:", error)
    return NextResponse.json({ error: "Internal server error" }, { 
      status: 500,
      headers: corsHeaders
    })
  }
}
