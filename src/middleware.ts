import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Protect admin routes: /admin01 and /register01
  const isAdminRoute = pathname.startsWith('/admin01') || pathname.startsWith('/register01');

  if (isAdminRoute) {
    const sessionCookie = request.cookies.get('challenges_admin_session');
    const isAuthenticated = sessionCookie?.value === 'authenticated';

    if (!isAuthenticated) {
      // Redirect to login page with return url
      const loginUrl = new URL('/login01', request.url);
      loginUrl.searchParams.set('redirect', pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin01/:path*', '/register01/:path*'],
};
