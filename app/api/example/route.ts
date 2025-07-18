import { type NextRequest, NextResponse } from "next/server"
import { validateToken } from "@/lib/auth"

// Force dynamic rendering for this route since it uses request headers
export const dynamic = 'force-dynamic'

// CORS headers for the example API
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
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

export async function GET(request: NextRequest) {
  const authResult = await validateToken(request)

  if (authResult instanceof NextResponse) {
    return authResult
  }

  try {
    // Example API response
    const exampleData = {
      message: "Hello from your SaaS API!",
      timestamp: new Date().toISOString(),
      user_id: authResult._id,
      data: {
        example_field: "This is sample data",
        another_field: "You can customize this API endpoint",
        tips: [
          "Replace this with your actual business logic",
          "Add validation for request parameters",
          "Implement proper error handling",
          "Add rate limiting if needed"
        ]
      }
    }

    return NextResponse.json(exampleData, {
      status: 200,
      headers: corsHeaders,
    })
  } catch (error) {
    console.error('Example API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { 
        status: 500,
        headers: corsHeaders,
      }
    )
  }
}

export async function POST(request: NextRequest) {
  const authResult = await validateToken(request)

  if (authResult instanceof NextResponse) {
    return authResult
  }

  try {
    const body = await request.json()
    
    // Example POST endpoint - customize this for your needs
    const response = {
      message: "Data received successfully",
      timestamp: new Date().toISOString(),
      user_id: authResult._id,
      received_data: body,
      processed: true
    }

    return NextResponse.json(response, {
      status: 200,
      headers: corsHeaders,
    })
  } catch (error) {
    console.error('Example API POST error:', error)
    return NextResponse.json(
      { error: 'Invalid request data' },
      { 
        status: 400,
        headers: corsHeaders,
      }
    )
  }
}