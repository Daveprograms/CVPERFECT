import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const token = request.cookies.get('auth-storage')?.value;
  const isAuthPage = request.nextUrl.pathname.startsWith('/sign-in') || 
                    request.nextUrl.pathname.startsWith('/sign-up');
  const isDashboardPage = request.nextUrl.pathname.startsWith('/dashboard');

  // If trying to access auth pages while logged in, redirect to dashboard
  if (isAuthPage && token) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  // If trying to access dashboard without being logged in, redirect to sign in
  if (isDashboardPage && !token) {
    return NextResponse.redirect(new URL('/sign-in', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/dashboard/:path*', '/sign-in', '/sign-up'],
}; 