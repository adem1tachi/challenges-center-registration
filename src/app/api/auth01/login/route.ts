import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase/server';
import { createAdminSessionToken, COOKIE_NAME } from '@/lib/auth/session';
import { checkRateLimit, getClientIp } from '@/lib/auth/rate-limit';

export async function POST(request: NextRequest) {
  try {
    // 1. Rate limiting: Max 5 login attempts per 15 minutes per IP
    const clientIp = getClientIp(request.headers);
    const rateLimit = checkRateLimit(`login:${clientIp}`, 5, 15 * 60 * 1000);

    if (!rateLimit.success) {
      const waitMinutes = Math.ceil(rateLimit.resetInMs / 60000);
      return NextResponse.json(
        {
          success: false,
          error: `عدد محاولات تسجيل الدخول تجاوز الحد المسموح. يرجى المحاولة بعد ${waitMinutes} دقيقة. (Too many attempts)`,
        },
        { status: 429 }
      );
    }

    const { email, password } = await request.json();

    if (!email || !password || typeof email !== 'string' || typeof password !== 'string') {
      return NextResponse.json(
        { success: false, error: 'البريد الإلكتروني وكلمة المرور مطلوبان' },
        { status: 400 }
      );
    }

    const cleanEmail = email.trim().toLowerCase();

    // 2. Authenticate strictly via Supabase Auth (industry-standard hashed credentials)
    const supabase = createServerSupabaseClient();
    if (!supabase) {
      return NextResponse.json(
        {
          success: false,
          error:
            'خدمة المصادقة غير مهيأة. يرجى تهيئة متغيرات Supabase في بيئة التشغيل. (Authentication service not configured)',
        },
        { status: 503 }
      );
    }

    const { data, error } = await supabase.auth.signInWithPassword({
      email: cleanEmail,
      password,
    });

    if (error || !data?.session || !data.user) {
      return NextResponse.json(
        { success: false, error: 'بيانات الدخول غير صحيحة (Invalid email or password)' },
        { status: 401 }
      );
    }

    const token = await createAdminSessionToken(data.user.email || cleanEmail);
    const response = NextResponse.json({ success: true });
    response.cookies.set(COOKIE_NAME, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: '/',
    });
    return response;
  } catch (error) {
    console.error('Error in login route:', error);
    return NextResponse.json(
      { success: false, error: 'حدث خطأ غير متوقع أثناء معالجة الطلب' },
      { status: 500 }
    );
  }
}
