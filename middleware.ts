import { type NextRequest, NextResponse } from "next/server"
import { getToken } from "next-auth/jwt"

export async function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname

  // Define paths that require web authentication (NextAuth JWT)
  const protectedPaths = ["/dashboard", "/api/dashboard"]

  // Check if the current path is protected
  const isProtectedPath = protectedPaths.some((protectedPath) => path.startsWith(protectedPath))

  if (isProtectedPath) {
    try {
      const token = await getToken({
        req: request,
        secret: process.env.NEXTAUTH_SECRET,
      })

      // If no token, redirect to sign in
      if (!token) {
        const url = new URL("/auth/signin", request.url)
        url.searchParams.set("callbackUrl", request.url)
        return NextResponse.redirect(url)
      }
    } catch (error) {
      console.error("Middleware auth error:", error)
      // Redirect to sign in on any auth error
      const url = new URL("/auth/signin", request.url)
      url.searchParams.set("callbackUrl", request.url)
      return NextResponse.redirect(url)
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api/auth (authentication routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     * - auth pages
     */
    "/((?!api/auth|_next/static|_next/image|favicon.ico|public|auth).*)",
  ],
}
