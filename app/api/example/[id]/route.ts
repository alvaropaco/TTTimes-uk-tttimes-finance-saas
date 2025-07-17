import { type NextRequest, NextResponse } from "next/server"
import { validateToken } from "@/lib/auth"

// CORS headers
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  'Access-Control-Max-Age': '86400',
}

// Handle preflight OPTIONS request
export async function OPTIONS(request: NextRequest) {
  return new NextResponse(null, {
    status: 200,
    headers: corsHeaders,
  })
}

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  const authResult = await validateToken(request)

  if (authResult instanceof NextResponse) {
    return authResult
  }

  try {
    const { id } = params
    
    // Example data - replace with your actual data source
    const exampleItems = {
      "1": {
        id: "1",
        name: "Example Item 1",
        description: "This is the first example item",
        category: "sample",
        created_at: "2024-01-01T00:00:00Z"
      },
      "2": {
        id: "2", 
        name: "Example Item 2",
        description: "This is the second example item",
        category: "demo",
        created_at: "2024-01-02T00:00:00Z"
      },
      "3": {
        id: "3",
        name: "Example Item 3", 
        description: "This is the third example item",
        category: "test",
        created_at: "2024-01-03T00:00:00Z"
      }
    }

    const item = exampleItems[id as keyof typeof exampleItems]
    
    if (!item) {
      return NextResponse.json(
        { error: 'Item not found' },
        { 
          status: 404,
          headers: corsHeaders,
        }
      )
    }

    return NextResponse.json({
      success: true,
      data: item,
      user_id: authResult.user.id,
      timestamp: new Date().toISOString()
    }, {
      status: 200,
      headers: corsHeaders,
    })
  } catch (error) {
    console.error('Example item API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { 
        status: 500,
        headers: corsHeaders,
      }
    )
  }
}