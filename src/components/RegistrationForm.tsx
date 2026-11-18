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
  ShieldCheck,
  ExternalLink,
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

  const [consentPrivacy, setConsentPrivacy] = useState(false);
  const [consentTerms, setConsentTerms] = useState(false);
  const [consentDataLaw, setConsentDataLaw] = useState(false);

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
        colors: ['#182249', '#E6B441', '#8C1D24', '#22C55E'],
      });
    } catch {
      // safe fallback
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    // Validation
    if (!firstName.trim() || !lastName.trim()) {
      setErrorMsg(locale === 'ar' ? 'يرجى إدخال الاسم واللقب بشكل كامل.' : 'Please enter your full first and last name.');
      return;
    }

    const cleanPhone = phone.trim().replace(/\s+/g, '');
    const algerianPhoneRegex = /^(0)(5|6|7)[0-9]{8}$/;
    if (!algerianPhoneRegex.test(cleanPhone)) {
      setErrorMsg(
        locale === 'ar'
          ? 'يرجى إدخال رقم هاتف جزائري صحيح (مثال: 0550123456 أو 0661234567 أو 0770123456).'
          : 'Please enter a valid 10-digit Algerian phone number (e.g. 0550123456).'
      );
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      setErrorMsg(locale === 'ar' ? 'يرجى إدخال بريد إلكتروني صحيح.' : 'Please enter a valid email address.');
      return;
    }

    // Checkbox validation
    if (!consentPrivacy || !consentTerms || !consentDataLaw) {
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
          phone: cleanPhone,
          email: email.trim().toLowerCase(),
          consent_privacy: consentPrivacy,
          consent_terms: consentTerms,
          consent_data_law: consentDataLaw,
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        if (data.error === 'ALREADY_REGISTERED') {
          setErrorMsg(t('errDuplicate'));
        } else if (data.error === 'COURSE_FULL') {
          setErrorMsg(t('errFull'));
        } else {
          setErrorMsg(t('errGeneral'));
        }
        setLoading(false);
        return;
      }

      // Success!
      setSuccessData(data.registration);
      triggerConfetti();
    } catch (err) {
      console.error(err);
      setErrorMsg(t('errGeneral'));
    } finally {
      setLoading(false);
    }
  };

  if (isClosed) {
    return (
      <div className="bg-amber-50 border border-amber-200 rounded-2xl p-6 sm:p-8 text-center text-amber-900">
        <AlertCircle className="w-10 h-10 text-amber-600 mx-auto mb-3" />
        <h3 className="text-lg font-bold mb-1">
          {isFull ? t('fullyBooked') : t('regClosedAlert')}
        </h3>
        <p className="text-sm text-amber-700 max-w-md mx-auto">
          {locale === 'ar'
            ? 'نعتذر، لقد تم استيفاء المقاعد المتاحة لهذه الورشة أو تم إغلاق التسجيل من قبل الإدارة.'
            : 'We apologize, the available seats for this workshop have reached capacity or registration is closed.'}
        </p>
        <div className="mt-5">
          <Link
            href="/courses01"
            className="inline-flex items-center justify-center px-5 py-2.5 rounded-xl text-sm font-semibold text-brand-navy bg-white border border-amber-300 shadow-xs hover:bg-amber-100/50 transition-colors"
          >
            {t('backToCourses')}
          </Link>
        </div>
      </div>
    );
  }

  if (successData) {
    return (
      <div className="bg-white border-2 border-emerald-500/30 rounded-2xl p-6 sm:p-8 shadow-md text-center animate-in zoom-in-95 duration-300">
        <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4 text-emerald-600">
          <CheckCircle2 className="w-10 h-10" />
        </div>

        <h3 className="text-2xl font-black text-slate-900 mb-2">
          {t('regSuccessTitle')}
        </h3>

        <p className="text-sm text-slate-600 max-w-lg mx-auto mb-6 leading-relaxed">
          {t('regSuccessDesc')}
        </p>

        {/* Ticket Reference Card */}
        <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 max-w-md mx-auto mb-6 text-start">
          <div className="flex items-center gap-2 text-xs font-semibold uppercase text-brand-navy mb-2">
            <Ticket className="w-4 h-4 text-brand-gold" />
            <span>{t('regSuccessNumber')}</span>
          </div>
          <div className="font-mono text-base font-bold text-slate-900 bg-white p-2.5 rounded border border-slate-200 select-all">
            {successData.id}
          </div>
          <div className="text-xs text-slate-500 mt-2">
            {t('regSuccessNote')}
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link
            href="/courses01"
            className="w-full sm:w-auto inline-flex items-center justify-center px-6 py-2.5 rounded-xl text-sm font-semibold text-white bg-brand-navy hover:bg-brand-navyLight shadow-xs transition-colors"
          >
            {t('registerAnother')}
          </Link>
          <button
            onClick={() => {
              setSuccessData(null);
              setFirstName('');
              setLastName('');
              setPhone('');
              setEmail('');
              setConsentPrivacy(false);
              setConsentTerms(false);
              setConsentDataLaw(false);
            }}
            type="button"
            className="w-full sm:w-auto inline-flex items-center justify-center px-6 py-2.5 rounded-xl text-sm font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 transition-colors"
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
      className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs"
    >
      <div className="mb-6">
        <h3 className="text-xl font-bold text-slate-900 mb-1">
          {t('regFormTitle')}
        </h3>
        <p className="text-sm text-slate-500">
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
          <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
            {t('firstName')} <span className="text-rose-500">*</span>
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 start-0 ps-3.5 flex items-center pointer-events-none text-slate-400">
              <User className="w-4 h-4" />
            </div>
            <input
              type="text"
              required
              value={firstName}
              onChange={e => setFirstName(e.target.value)}
              placeholder={locale === 'ar' ? 'محمد' : 'Mohammed'}
              className="w-full ps-10 pe-3 py-2.5 rounded-xl border border-slate-200 bg-slate-50/50 text-slate-900 text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-gold/40 focus:border-brand-navy"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
            {t('lastName')} <span className="text-rose-500">*</span>
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 start-0 ps-3.5 flex items-center pointer-events-none text-slate-400">
              <User className="w-4 h-4" />
            </div>
            <input
              type="text"
              required
              value={lastName}
              onChange={e => setLastName(e.target.value)}
              placeholder={locale === 'ar' ? 'بن علي' : 'Benali'}
              className="w-full ps-10 pe-3 py-2.5 rounded-xl border border-slate-200 bg-slate-50/50 text-slate-900 text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-gold/40 focus:border-brand-navy"
            />
          </div>
        </div>
      </div>

      {/* Grid: Phone Number & Email */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
        <div>
          <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
            {t('phone')} <span className="text-rose-500">*</span>
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 start-0 ps-3.5 flex items-center pointer-events-none text-slate-400">
              <Phone className="w-4 h-4" />
            </div>
            <input
              type="tel"
              required
              value={phone}
              onChange={e => setPhone(e.target.value)}
              placeholder={t('phonePlaceholder')}
              dir="ltr"
              className="w-full ps-10 pe-3 py-2.5 rounded-xl border border-slate-200 bg-slate-50/50 text-slate-900 text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-gold/40 focus:border-brand-navy text-start"
            />
          </div>
          <span className="text-[11px] text-slate-400 mt-1 block">
            {locale === 'ar' ? 'مثال: 0550123456 أو 0661234567 أو 0770123456' : 'e.g., 0550123456 / 0661234567 / 0770123456'}
          </span>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
            {t('email')} <span className="text-rose-500">*</span>
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
              placeholder={t('emailPlaceholder')}
              dir="ltr"
              className="w-full ps-10 pe-3 py-2.5 rounded-xl border border-slate-200 bg-slate-50/50 text-slate-900 text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-gold/40 focus:border-brand-navy text-start"
            />
          </div>
          <span className="text-[11px] text-slate-400 mt-1 block">
            {locale === 'ar' ? 'مطلوب لمنع التكرار واستلام تأكيد الحضور' : 'Used for unique enrollment and confirmation'}
          </span>
        </div>
      </div>

      {/* Mandatory Consents (Section 7 Compliance) */}
      <div className="p-4 sm:p-5 rounded-xl bg-slate-50 border border-slate-200 space-y-3.5 mb-6">
        <div className="flex items-center gap-2 text-xs font-bold text-slate-800">
          <ShieldCheck className="w-4 h-4 text-brand-gold" />
          <span>{t('consentTitle')}</span>
        </div>

        {/* Checkbox 1: Privacy Policy */}
        <label className="flex items-start gap-3 cursor-pointer text-xs sm:text-sm text-slate-700 select-none">
          <input
            type="checkbox"
            required
            checked={consentPrivacy}
            onChange={e => setConsentPrivacy(e.target.checked)}
            className="mt-1 h-4 w-4 rounded border-slate-300 text-brand-navy focus:ring-brand-gold"
          />
          <span className="leading-relaxed">
            {t('consentPrivacy')}{' '}
            <Link
              href="/privacy01"
              target="_blank"
              className="text-brand-navy hover:text-brand-gold font-semibold underline underline-offset-2 inline-flex items-center gap-0.5"
            >
              <span>{t('readPrivacy')}</span>
              <ExternalLink className="w-3 h-3" />
            </Link>
          </span>
        </label>

        {/* Checkbox 2: Terms of Participation */}
        <label className="flex items-start gap-3 cursor-pointer text-xs sm:text-sm text-slate-700 select-none">
          <input
            type="checkbox"
            required
            checked={consentTerms}
            onChange={e => setConsentTerms(e.target.checked)}
            className="mt-1 h-4 w-4 rounded border-slate-300 text-brand-navy focus:ring-brand-gold"
          />
          <span className="leading-relaxed">
            {t('consentTerms')}{' '}
            <Link
              href="/terms01"
              target="_blank"
              className="text-brand-navy hover:text-brand-gold font-semibold underline underline-offset-2 inline-flex items-center gap-0.5"
            >
              <span>{t('readTerms')}</span>
              <ExternalLink className="w-3 h-3" />
            </Link>
          </span>
        </label>

        {/* Checkbox 3: Algerian Law No. 18-07 */}
        <label className="flex items-start gap-3 cursor-pointer text-xs sm:text-sm text-slate-700 select-none">
          <input
            type="checkbox"
            required
            checked={consentDataLaw}
            onChange={e => setConsentDataLaw(e.target.checked)}
            className="mt-1 h-4 w-4 rounded border-slate-300 text-brand-navy focus:ring-brand-gold"
          />
          <span className="leading-relaxed text-slate-800 font-medium">
            {t('consentLaw1807')}
          </span>
        </label>
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={loading}
        className="w-full flex items-center justify-center gap-2 py-3.5 px-6 rounded-xl font-bold text-white bg-brand-navy hover:bg-brand-navyLight focus:ring-4 focus:ring-brand-gold/30 shadow-md transition-all disabled:opacity-60 disabled:cursor-not-allowed"
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
