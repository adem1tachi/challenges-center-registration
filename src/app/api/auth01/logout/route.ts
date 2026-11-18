import { NextResponse } from 'next/server';

export async function POST() {
  const response = NextResponse.json({ success: true });
  response.cookies.delete('challenges_admin_session');
  return response;
}

export async function GET(request: Request) {
  const cookieHeader = request.headers.get('cookie') || '';
  const isAuthenticated = cookieHeader.includes('challenges_admin_session=authenticated');
  return NextResponse.json({ authenticated: isAuthenticated });
}
