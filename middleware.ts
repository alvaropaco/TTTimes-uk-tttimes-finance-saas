// Conditional Clerk imports
let clerkMiddleware: any, createRouteMatcher: any

try {
  const clerkModule = require("@clerk/nextjs/server")
  clerkMiddleware = clerkModule.clerkMiddleware
  createRouteMatcher = clerkModule.createRouteMatcher
} catch (error) {
  // Fallback when Clerk is not available
  clerkMiddleware = (handler: any) => handler
  createRouteMatcher = (routes: string[]) => () => false
}

// Check if Clerk is properly configured
const isClerkConfigured = () => {
  const publishableKey = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY
  return publishableKey && publishableKey.startsWith('pk_') && !publishableKey.includes('placeholder')
}

const isProtectedRoute = createRouteMatcher(["/dashboard(.*)", "/api/dashboard(.*)"])

export default clerkMiddleware(async (auth: any, req: any) => {
  if (isClerkConfigured() && isProtectedRoute(req)) {
    await auth.protect()
  }
})

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    // Always run for API routes
    "/(api|trpc)(.*)",
  ],
}
