import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { verifyAdminSessionToken, COOKIE_NAME } from '@/lib/auth/session';

export async function POST() {
  const response = NextResponse.json({ success: true });
  response.cookies.delete(COOKIE_NAME);
  return response;
}

export async function GET() {
  const cookieStore = cookies();
  const sessionCookie = cookieStore.get(COOKIE_NAME);
  const session = await verifyAdminSessionToken(sessionCookie?.value);

  return NextResponse.json({
    authenticated: session.valid,
    email: session.email || null,
  });
}
