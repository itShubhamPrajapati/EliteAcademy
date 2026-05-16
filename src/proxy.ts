import { withAuth } from "next-auth/middleware"
import { NextResponse } from "next/server"

export default withAuth(
  function middleware(req) {
    const role = req.nextauth.token?.role as string
    const path = req.nextUrl.pathname

    if (path.startsWith('/dashboard/admin') && role !== 'ADMIN') {
      return NextResponse.redirect(new URL('/dashboard/' + role.toLowerCase(), req.url))
    }
    if (path.startsWith('/dashboard/student') && role !== 'STUDENT') {
      return NextResponse.redirect(new URL('/dashboard/' + role.toLowerCase(), req.url))
    }
    if (path.startsWith('/dashboard/parent') && role !== 'PARENT') {
      return NextResponse.redirect(new URL('/dashboard/' + role.toLowerCase(), req.url))
    }
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token,
    },
  }
)

export const config = {
  matcher: ['/dashboard/:path*'],
}
