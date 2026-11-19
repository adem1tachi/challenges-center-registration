import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { verifyAdminSessionToken, COOKIE_NAME } from '@/lib/auth/session';

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const method = request.method;

  // 1. Check if the request is for an admin API route
  const isCoursesApiAdmin =
    pathname.startsWith('/api/courses01') && ['POST', 'PUT', 'DELETE'].includes(method);

  const isRegisterApiAdmin =
    pathname.startsWith('/api/register01') && ['GET', 'PATCH', 'DELETE'].includes(method);

  const isProtectedApi = isCoursesApiAdmin || isRegisterApiAdmin;

  // 2. Check if the request is for an admin web page
  const isAdminPage =
    pathname.startsWith('/admin01') || pathname.startsWith('/register01');

  // If route is protected, verify cryptographically signed admin session
  if (isProtectedApi || isAdminPage) {
    const sessionCookie = request.cookies.get(COOKIE_NAME);
    const session = await verifyAdminSessionToken(sessionCookie?.value);

    if (!session.valid) {
      if (isProtectedApi) {
        return NextResponse.json(
          {
            success: false,
            error: 'غير مصرح لك بالوصول (Unauthorized: Admin session required)',
          },
          { status: 401 }
        );
      }

      // Web Page: Redirect to login with return redirect
      const loginUrl = new URL('/login01', request.url);
      loginUrl.searchParams.set('redirect', pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/admin01/:path*',
    '/register01/:path*',
    '/api/courses01/:path*',
    '/api/courses01',
    '/api/register01/:path*',
    '/api/register01',
  ],
};
