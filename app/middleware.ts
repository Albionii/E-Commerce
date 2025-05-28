import { withAuth } from "next-auth/middleware"
import { NextResponse } from "next/server"

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token
    const path = req.nextUrl.pathname

    console.log("NextAuth middleware processing:", {
      path,
      hasToken: !!token,
      role: token?.role,
      userId: token?.userId,
    })

    if (path.startsWith("/admin") && token?.role !== "admin") {
      console.log("Redirecting to dashboard - insufficient permissions for admin route")
      return NextResponse.redirect(new URL("/dashboard", req.url))
    }

    if (token && (path === "/login" || path === "/register")) {
      console.log("Redirecting authenticated user away from auth pages")
      const redirectPath = token.role === "admin" ? "/admin" : "/dashboard"
      return NextResponse.redirect(new URL(redirectPath, req.url))
    }

    return NextResponse.next()
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        const path = req.nextUrl.pathname

        if (
          path === "/" ||
          path === "/login" ||
          path === "/register" ||
          path === "/products" ||
          path.startsWith("/products/") ||
          path.startsWith("/api/products") ||
          path.startsWith("/api/auth") ||
          path.startsWith("/_next") ||
          path.startsWith("/favicon")
        ) {
          return true
        }

        if (path.startsWith("/dashboard") || path.startsWith("/admin")) {
          return !!token
        }

        return true
      },
    },
  },
)

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|.*\\.png$).*)"],
}
