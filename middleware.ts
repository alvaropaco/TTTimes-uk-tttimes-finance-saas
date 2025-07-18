import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'

const isPublicRoute = createRouteMatcher([
  '/',
  '/sign-in(.*)',
  '/sign-up(.*)',
  '/signin(.*)',
  '/signup(.*)',
  '/api/rates',
  '/api/convert',
  '/api/supported',
  '/api/rate/(.*)',
  '/api/webhooks/clerk',
  '/api/health'
])

export default clerkMiddleware(async (auth, request) => {
  // Handle CORS for API routes
  if (request.nextUrl.pathname.startsWith('/api/')) {
    const response = NextResponse.next()
    
    // Set CORS headers
    response.headers.set('Access-Control-Allow-Origin', '*')
    response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
    response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization')
    response.headers.set('Access-Control-Max-Age', '86400')
    
    // Handle preflight requests
    if (request.method === 'OPTIONS') {
      return new NextResponse(null, { status: 200, headers: response.headers })
    }
    
    return response
  }

  // Debug logging for authentication issues
  if (process.env.NODE_ENV === 'development') {
    console.log('Middleware - Path:', request.nextUrl.pathname)
    console.log('Middleware - Is Public Route:', isPublicRoute(request))
  }

  // Protect non-public routes
  if (!isPublicRoute(request)) {
    try {
      await auth.protect()
    } catch (error) {
      console.error('Auth protection error:', error)
      // Redirect to sign-in if authentication fails
      return NextResponse.redirect(new URL('/sign-in', request.url))
    }
  }
})

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ]
}
