import { withAuth } from "next-auth/middleware"
import type { NextRequest } from "next/server"
import { NextResponse } from "next/server"

export const middleware = withAuth(
  (req: NextRequest) => {
    const token = (req as any).nextauth?.token
    const pathname = req.nextUrl.pathname

    const protectedRoutes = ["/plan", "/chat", "/generate"]
    const isProtectedRoute = protectedRoutes.some((route) => pathname.startsWith(route))

    // Redirect unauthenticated users away from protected routes
    if (!token && isProtectedRoute) {
      return NextResponse.redirect(new URL("/login", req.url))
    }

    // Redirect authenticated users away from login page
    if (token && pathname === "/login") {
      return NextResponse.redirect(new URL("/", req.url))
    }

    return NextResponse.next()
  },
  {
    callbacks: {
      authorized: ({ token }) => {
        // Let the middleware function handle redirects
        return true
      },
    },
  },
)

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|public).*)"],
}