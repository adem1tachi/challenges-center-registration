'use client';

import React, { useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { useLanguage } from '@/lib/i18n/LanguageContext';
import { Lock, Mail, Loader2, AlertCircle, Shield, ArrowRight, ArrowLeft } from 'lucide-react';

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
        throw new Error(data.error || 'Authentication failed');
      }

      router.push(redirectPath);
      router.refresh();
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Invalid email or password');
    } finally {
      setLoading(false);
    }
  };

  const handleFillDemo = () => {
    setEmail('admin@challengescenter.dz');
    setPassword('ChallengesCenter2026!');
  };

  const ArrowIcon = isRtl ? ArrowRight : ArrowLeft;

  return (
    <div className="max-w-md w-full space-y-8 bg-white p-8 sm:p-10 rounded-3xl border border-slate-200 shadow-xl">
      {/* Header & Logos */}
      <div className="text-center">
        <div className="inline-flex items-center gap-3 bg-slate-50 p-2 rounded-2xl border border-slate-200 mb-4">
          <div className="w-10 h-10 rounded-full bg-white p-1 flex items-center justify-center shadow-xs">
            <Image
              src="/images/salon-emploi-logo.png"
              alt="Salon de l'Emploi"
              width={36}
              height={36}
              className="object-contain"
            />
          </div>
          <div className="h-6 w-px bg-slate-200" />
          <div className="h-8 w-24 flex items-center">
            <Image
              src="/images/challenges-center-logo.png"
              alt="Challenges Center"
              width={96}
              height={30}
              className="object-contain"
            />
          </div>
        </div>

        <h2 className="text-2xl font-black text-slate-900 tracking-tight">
          {locale === 'ar' ? 'تسجيل دخول الإدارة' : 'Staff & Administration Login'}
        </h2>
        <p className="mt-1 text-xs text-slate-500">
          {locale === 'ar'
            ? 'يرجى تسجيل الدخول للوصول إلى لوحة التحكم وإدارة الورشات والتسجيلات'
            : 'Sign in to access course management and participant rosters'}
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
              placeholder="admin@challengescenter.dz"
              dir="ltr"
              className="w-full ps-10 pe-3 py-2.5 rounded-xl border border-slate-200 text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-brand-gold/40 focus:border-brand-navy"
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
              className="w-full ps-10 pe-3 py-2.5 rounded-xl border border-slate-200 text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-brand-gold/40 focus:border-brand-navy"
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

      {/* Demo Credentials Helper Box */}
      <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2 text-xs">
        <div className="flex items-center justify-between">
          <span className="font-bold text-slate-700 flex items-center gap-1">
            <Shield className="w-3.5 h-3.5 text-brand-gold" />
            <span>{locale === 'ar' ? 'بيانات المشرف التجريبية:' : 'Staff Demo Access:'}</span>
          </span>
          <button
            type="button"
            onClick={handleFillDemo}
            className="text-brand-navy font-bold hover:underline"
          >
            {locale === 'ar' ? 'تعبئة تلقائية' : 'Auto-fill'}
          </button>
        </div>
        <div className="font-mono text-[11px] text-slate-600 space-y-0.5" dir="ltr">
          <div>Email: <span className="font-semibold text-slate-800">admin@challengescenter.dz</span></div>
          <div>Password: <span className="font-semibold text-slate-800">ChallengesCenter2026!</span></div>
        </div>
      </div>

      <div className="text-center">
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
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
      <Suspense fallback={<div className="h-96 w-full max-w-md bg-slate-100 rounded-3xl animate-pulse" />}>
        <LoginForm />
      </Suspense>
    </div>
  );
}
