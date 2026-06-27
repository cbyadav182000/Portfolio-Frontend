import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function proxy(request: NextRequest) {
  const token = request.cookies.get('token')?.value
  const isLoginPage = request.nextUrl.pathname.startsWith('/admin/login')

  if (request.nextUrl.pathname.startsWith('/admin')) {
    if (!token && !isLoginPage) {
      return NextResponse.redirect(new URL('/admin/login', request.url))
    }
    if (token && isLoginPage) {
      return NextResponse.redirect(new URL('/admin', request.url))
    }
  }
  
  return NextResponse.next()
}

export const config = {
  matcher: '/admin/:path*',
}
