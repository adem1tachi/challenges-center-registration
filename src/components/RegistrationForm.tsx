'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Course } from '@/types';
import { useLanguage } from '@/lib/i18n/LanguageContext';
import confetti from 'canvas-confetti';
import {
  CheckCircle2,
  AlertCircle,
  Loader2,
  User,
  Phone,
  Mail,
  Ticket,
} from 'lucide-react';

interface RegistrationFormProps {
  course: Course;
}

export default function RegistrationForm({ course }: RegistrationFormProps) {
  const { t, locale } = useLanguage();

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');

  const [consentAgreed, setConsentAgreed] = useState(false);

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successData, setSuccessData] = useState<{ id: string } | null>(null);

  const accepted = course.accepted_count ?? 0;
  const isFull = accepted >= course.max_seats;
  const isClosed = !course.is_published || isFull;

  const triggerConfetti = () => {
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#991B1B', '#B91C1C', '#D4A373', '#22C55E'],
      });
    } catch {
      // safe fallback
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (isClosed) {
      setErrorMsg(locale === 'ar' ? 'التسجيل مغلق في هذه الدورة' : 'Registration is currently closed for this workshop');
      return;
    }

    if (!consentAgreed) {
      setErrorMsg(t('errConsent'));
      return;
    }

    setLoading(true);

    try {
      const res = await fetch('/api/register01', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          course_id: course.id,
          first_name: firstName.trim(),
          last_name: lastName.trim(),
          phone: phone.trim(),
          email: email.trim().toLowerCase(),
          consent_privacy: consentAgreed,
          consent_terms: consentAgreed,
          consent_data_law: consentAgreed,
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        if (data.error === 'ALREADY_REGISTERED') {
          throw new Error(t('errDuplicate'));
        } else if (data.error === 'COURSE_FULL') {
          throw new Error(t('errFull'));
        } else if (data.details) {
          const firstField = Object.keys(data.details)[0];
          const msg = data.details[firstField]?.[0] || 'Validation error';
          throw new Error(msg);
        } else {
          throw new Error(data.error || 'Failed to submit registration');
        }
      }

      setSuccessData({ id: data.registration.id });
      triggerConfetti();
    } catch (err: any) {
      console.error(err);
      setErrorMsg(err.message || 'Error occurred');
    } finally {
      setLoading(false);
    }
  };

  if (isClosed) {
    return (
      <div className="p-8 bg-beige-100 rounded-3xl border border-beige-300 text-center space-y-3">
        <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center mx-auto text-rose-600 shadow-xs">
          <AlertCircle className="w-6 h-6" />
        </div>
        <h4 className="text-lg font-bold text-beige-900">
          {locale === 'ar' ? 'التسجيل في هذه الدورة غير متاح' : 'Registration Unavailable'}
        </h4>
        <p className="text-xs sm:text-sm text-beige-700 max-w-md mx-auto">
          {isFull
            ? (locale === 'ar' ? 'اكتملت المقاعد المخصصة لهذه الورشة التدريبية.' : 'This workshop has reached maximum capacity.')
            : (locale === 'ar' ? 'هذه الورشة غير متاحة للتسجيل حالياً.' : 'This workshop is currently not open for new enrollments.')}
        </p>
        <div className="pt-2">
          <Link
            href="/courses01"
            className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl text-xs font-bold bg-ruby-700 text-white hover:bg-ruby-800 transition-colors shadow-xs"
          >
            <span>{t('viewAllCourses')}</span>
          </Link>
        </div>
      </div>
    );
  }

  if (successData) {
    return (
      <div className="p-8 sm:p-10 bg-white rounded-3xl border border-emerald-200 text-center space-y-6 shadow-sm animate-in fade-in zoom-in-95">
        <div className="w-16 h-16 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto border border-emerald-200 shadow-xs">
          <CheckCircle2 className="w-8 h-8" />
        </div>

        <div className="space-y-2">
          <h3 className="text-xl sm:text-2xl font-black text-beige-900">
            {t('regSuccessTitle')}
          </h3>
          <p className="text-xs sm:text-sm text-beige-700 max-w-lg mx-auto">
            {t('regSuccessDesc')}
          </p>
        </div>

        {/* Ticket Badge */}
        <div className="p-4 bg-beige-50 rounded-2xl border border-beige-300 max-w-sm mx-auto flex items-center justify-between gap-3 text-start">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-ruby-700 text-beige-50 flex items-center justify-center shrink-0">
              <Ticket className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold text-beige-600 block">
                {locale === 'ar' ? 'رقم طلب التسجيل' : 'Application Ref'}
              </span>
              <span className="font-mono font-bold text-xs sm:text-sm text-beige-900">
                {successData.id.slice(0, 18)}...
              </span>
            </div>
          </div>
          <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-amber-50 text-amber-800 border border-amber-200 shrink-0">
            {locale === 'ar' ? 'قيد المراجعة' : 'Pending'}
          </span>
        </div>

        <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link
            href="/courses01"
            className="w-full sm:w-auto inline-flex items-center justify-center px-6 py-2.5 rounded-xl text-sm font-bold text-white bg-ruby-700 hover:bg-ruby-800 shadow-xs transition-colors"
          >
            <span>{t('backToCourses')}</span>
          </Link>
          <button
            onClick={() => {
              setSuccessData(null);
              setFirstName('');
              setLastName('');
              setPhone('');
              setEmail('');
              setConsentAgreed(false);
            }}
            type="button"
            className="w-full sm:w-auto inline-flex items-center justify-center px-6 py-2.5 rounded-xl text-sm font-semibold text-beige-800 bg-beige-100 hover:bg-beige-200 transition-colors"
          >
            {locale === 'ar' ? 'تسجيل مشارك آخر في هذه الدورة' : 'Register another attendee'}
          </button>
        </div>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white rounded-3xl border border-beige-300 p-6 sm:p-8 shadow-xs"
    >
      <div className="mb-6">
        <h3 className="text-xl font-bold text-beige-900 mb-1">
          {t('regFormTitle')}
        </h3>
        <p className="text-sm text-beige-700">
          {t('regFormSubtitle')}
        </p>
      </div>

      {errorMsg && (
        <div className="mb-6 p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-sm flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Grid: First Name & Last Name */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
        <div>
          <label className="block text-xs font-semibold text-beige-800 uppercase tracking-wider mb-1.5">
            {t('firstName')} <span className="text-rose-500">*</span>
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 start-0 ps-3.5 flex items-center pointer-events-none text-beige-500">
              <User className="w-4 h-4" />
            </div>
            <input
              type="text"
              required
              value={firstName}
              onChange={e => setFirstName(e.target.value)}
              placeholder={t('firstNamePlaceholder')}
              className="w-full ps-10 pe-3 py-2.5 rounded-xl border border-beige-300 bg-beige-50/50 text-beige-900 text-sm placeholder:text-beige-500 focus:outline-none focus:ring-2 focus:ring-ruby-600/30 focus:border-ruby-700 transition-all"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-beige-800 uppercase tracking-wider mb-1.5">
            {t('lastName')} <span className="text-rose-500">*</span>
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 start-0 ps-3.5 flex items-center pointer-events-none text-beige-500">
              <User className="w-4 h-4" />
            </div>
            <input
              type="text"
              required
              value={lastName}
              onChange={e => setLastName(e.target.value)}
              placeholder={t('lastNamePlaceholder')}
              className="w-full ps-10 pe-3 py-2.5 rounded-xl border border-beige-300 bg-beige-50/50 text-beige-900 text-sm placeholder:text-beige-500 focus:outline-none focus:ring-2 focus:ring-ruby-600/30 focus:border-ruby-700 transition-all"
            />
          </div>
        </div>
      </div>

      {/* Grid: Phone Number & Email */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
        <div>
          <label className="block text-xs font-semibold text-beige-800 uppercase tracking-wider mb-1.5">
            {t('phone')} <span className="text-rose-500">*</span>
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 start-0 ps-3.5 flex items-center pointer-events-none text-beige-500">
              <Phone className="w-4 h-4" />
            </div>
            <input
              type="tel"
              required
              value={phone}
              onChange={e => setPhone(e.target.value)}
              placeholder={t('phonePlaceholder')}
              dir="ltr"
              className="w-full ps-10 pe-3 py-2.5 rounded-xl border border-beige-300 bg-beige-50/50 text-beige-900 text-sm placeholder:text-beige-500 focus:outline-none focus:ring-2 focus:ring-ruby-600/30 focus:border-ruby-700 text-start transition-all"
            />
          </div>
          <span className="text-[11px] text-beige-600 mt-1 block">
            {t('phoneHelper')}
          </span>
        </div>

        <div>
          <label className="block text-xs font-semibold text-beige-800 uppercase tracking-wider mb-1.5">
            {t('email')} <span className="text-rose-500">*</span>
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 start-0 ps-3.5 flex items-center pointer-events-none text-beige-500">
              <Mail className="w-4 h-4" />
            </div>
            <input
              type="email"
              required
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder={t('emailPlaceholder')}
              dir="ltr"
              className="w-full ps-10 pe-3 py-2.5 rounded-xl border border-beige-300 bg-beige-50/50 text-beige-900 text-sm placeholder:text-beige-500 focus:outline-none focus:ring-2 focus:ring-ruby-600/30 focus:border-ruby-700 text-start transition-all"
            />
          </div>
        </div>
      </div>

      {/* Mandatory Consents (Law 18-07 Compliance) - Single Line */}
      <div className="mb-6">
        <label className="flex items-start gap-2.5 cursor-pointer text-xs sm:text-sm text-beige-800 select-none">
          <input
            type="checkbox"
            required
            checked={consentAgreed}
            onChange={e => setConsentAgreed(e.target.checked)}
            className="mt-0.5 h-4 w-4 rounded border-beige-300 text-ruby-700 focus:ring-ruby-600 cursor-pointer"
          />
          <span className="leading-relaxed">
            {locale === 'ar' ? (
              <>
                أوافق على{' '}
                <Link
                  href="/terms01"
                  target="_blank"
                  className="text-ruby-700 hover:text-ruby-800 font-semibold underline underline-offset-2"
                >
                  الشروط والأحكام
                </Link>{' '}
                و
                <Link
                  href="/privacy01"
                  target="_blank"
                  className="text-ruby-700 hover:text-ruby-800 font-semibold underline underline-offset-2"
                >
                  سياسة الخصوصية
                </Link>{' '}
                وفق القانون الجزائري 18-07.
              </>
            ) : (
              <>
                I agree to the{' '}
                <Link
                  href="/terms01"
                  target="_blank"
                  className="text-ruby-700 hover:text-ruby-800 font-semibold underline underline-offset-2"
                >
                  Terms and Conditions
                </Link>{' '}
                and{' '}
                <Link
                  href="/privacy01"
                  target="_blank"
                  className="text-ruby-700 hover:text-ruby-800 font-semibold underline underline-offset-2"
                >
                  Privacy Policy
                </Link>{' '}
                in accordance with Algerian Law 18-07.
              </>
            )}
          </span>
        </label>
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={loading}
        className="w-full flex items-center justify-center gap-2 py-3.5 px-6 rounded-xl font-bold text-white bg-ruby-700 hover:bg-ruby-800 focus:ring-4 focus:ring-ruby-600/30 shadow-md transition-all disabled:opacity-60 disabled:cursor-not-allowed"
      >
        {loading ? (
          <>
            <Loader2 className="w-5 h-5 animate-spin" />
            <span>{t('submitting')}</span>
          </>
        ) : (
          <span>{t('submitRegistration')}</span>
        )}
      </button>
    </form>
  );
}
