import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { getSession } from "./lib/auth"

export async function middleware(request: NextRequest) {
  const session = await getSession(request)
  const { pathname } = request.nextUrl

  console.log(`Middleware processing path: ${pathname}`)

  // Public routes - accessible to everyone
  if (
    pathname === "/login" ||
    pathname === "/" ||
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api/login") ||
    pathname.startsWith("/api/signup") ||
    pathname.match(/^\/[^/]+\/?$/) || // Match /{barber} routes
    pathname.match(/^\/[^/]+\/thank-you\/?$/) // Match /{barber}/thank-you routes
  ) {
    console.log(`Allowing public access to: ${pathname}`)
    return NextResponse.next()
  }

  // Admin routes - require admin access
  if (pathname.startsWith("/admin")) {
    if (!session) {
      console.log(`Redirecting to login from: ${pathname} (no session)`)
      return NextResponse.redirect(new URL("/login", request.url))
    }

    if (!session.isAdmin) {
      console.log(`Redirecting to app from: ${pathname} (not admin)`)
      return NextResponse.redirect(new URL("/app", request.url))
    }

    return NextResponse.next()
  }

  // Barber routes - require authentication
  if (pathname.startsWith("/app")) {
    if (!session) {
      console.log(`Redirecting to login from: ${pathname} (no session)`)
      return NextResponse.redirect(new URL("/login", request.url))
    }

    return NextResponse.next()
  }

  // Default - allow access
  console.log(`Default allow for: ${pathname}`)
  return NextResponse.next()
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
}
