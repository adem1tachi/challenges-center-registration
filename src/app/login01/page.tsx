'use client';

import React, { useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { useLanguage } from '@/lib/i18n/LanguageContext';
import LanguageSwitcher from '@/components/LanguageSwitcher';
import { Lock, Mail, Loader2, AlertCircle, ArrowRight, ArrowLeft } from 'lucide-react';

function LoginForm() {
  const { t, locale, isRtl } = useLanguage();
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectPath = searchParams.get('redirect') || '/admin01';

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await fetch('/api/auth01/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim(), password }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || (locale === 'ar' ? 'فشل تسجيل الدخول' : 'Authentication failed'));
      }

      router.push(redirectPath);
      router.refresh();
    } catch (err: any) {
      console.error(err);
      setError(err.message || (locale === 'ar' ? 'بيانات الدخول غير صحيحة' : 'Invalid email or password'));
    } finally {
      setLoading(false);
    }
  };

  const ArrowIcon = isRtl ? ArrowLeft : ArrowRight;

  return (
    <div className="max-w-md w-full space-y-6 bg-white p-8 sm:p-10 rounded-3xl border border-slate-200/90 shadow-xl">
      {/* Header with clean Lock Icon */}
      <div className="text-center">
        <div className="inline-flex items-center justify-center w-13 h-13 rounded-2xl bg-brand-navy text-brand-gold shadow-xs mb-4">
          <Lock className="w-6 h-6" />
        </div>

        <h2 className="text-2xl font-black text-slate-900 tracking-tight">
          {locale === 'ar' ? 'تسجيل دخول الإدارة' : 'Admin Portal Login'}
        </h2>
        <p className="mt-1.5 text-xs text-slate-500">
          {locale === 'ar'
            ? 'يرجى إدخال بيانات الاعتماد للوصول إلى لوحة التحكم'
            : 'Enter authorized credentials to access management dashboard'}
        </p>
      </div>

      {error && (
        <div className="p-3.5 bg-rose-50 border border-rose-200 rounded-xl text-rose-800 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
            {t('email')}
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 start-0 ps-3.5 flex items-center pointer-events-none text-slate-400">
              <Mail className="w-4 h-4" />
            </div>
            <input
              type="email"
              required
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="admin@example.com"
              dir="ltr"
              className="w-full ps-10 pe-3 py-2.5 rounded-xl border border-slate-200 text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-brand-gold/40 focus:border-brand-navy transition-all"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
            {locale === 'ar' ? 'كلمة المرور' : 'Password'}
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 start-0 ps-3.5 flex items-center pointer-events-none text-slate-400">
              <Lock className="w-4 h-4" />
            </div>
            <input
              type="password"
              required
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="••••••••••••"
              dir="ltr"
              className="w-full ps-10 pe-3 py-2.5 rounded-xl border border-slate-200 text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-brand-gold/40 focus:border-brand-navy transition-all"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-sm font-bold text-white bg-brand-navy hover:bg-brand-navyLight shadow-md transition-colors disabled:opacity-50"
        >
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>{locale === 'ar' ? 'جاري التحقق...' : 'Authenticating...'}</span>
            </>
          ) : (
            <span>{locale === 'ar' ? 'تسجيل الدخول' : 'Sign In'}</span>
          )}
        </button>
      </form>

      <div className="text-center pt-2">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-xs text-slate-500 hover:text-brand-navy transition-colors font-medium"
        >
          <ArrowIcon className="w-3.5 h-3.5" />
          <span>{locale === 'ar' ? 'العودة للصفحة الرئيسية' : 'Return to Homepage'}</span>
        </Link>
      </div>
    </div>
  );
}

export default function AdminLoginPage() {
  return (
    <div className="min-h-screen bg-slate-100/80 flex flex-col justify-center items-center px-4 py-12 sm:px-6 lg:px-8 relative">
      <div className="absolute top-5 end-6 z-10">
        <LanguageSwitcher variant="light" />
      </div>
      <Suspense fallback={<div className="h-96 w-full max-w-md bg-white rounded-3xl animate-pulse" />}>
        <LoginForm />
      </Suspense>
    </div>
  );
}
