import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase/server';

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json(
        { success: false, error: 'Email and password are required' },
        { status: 400 }
      );
    }

    const defaultEmail = process.env.ADMIN_DEFAULT_EMAIL || 'admin@challengescenter.dz';
    const defaultPassword = process.env.ADMIN_DEFAULT_PASSWORD || 'ChallengesCenter2026!';

    // Try Supabase auth first if configured
    const supabase = createServerSupabaseClient();
    if (supabase) {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (!error && data?.session) {
        const response = NextResponse.json({ success: true });
        response.cookies.set('challenges_admin_session', 'authenticated', {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'lax',
          maxAge: 60 * 60 * 24 * 7, // 7 days
          path: '/',
        });
        return response;
      }
    }

    // Default admin fallback
    if (email.trim().toLowerCase() === defaultEmail.toLowerCase() && password === defaultPassword) {
      const response = NextResponse.json({ success: true });
      response.cookies.set('challenges_admin_session', 'authenticated', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 60 * 60 * 24 * 7,
        path: '/',
      });
      return response;
    }

    return NextResponse.json(
      { success: false, error: 'Invalid email or password' },
      { status: 401 }
    );
  } catch (error) {
    console.error('Error in login route:', error);
    return NextResponse.json(
      { success: false, error: 'An unexpected error occurred' },
      { status: 500 }
    );
  }
}
