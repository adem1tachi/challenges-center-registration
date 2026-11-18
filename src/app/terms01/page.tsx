'use client';

import React from 'react';
import Link from 'next/link';
import { useLanguage } from '@/lib/i18n/LanguageContext';
import { BookOpen, CheckCircle2, Clock, Users, ArrowRight, ArrowLeft } from 'lucide-react';

export default function TermsPage() {
  const { t, locale, isRtl } = useLanguage();
  const ArrowIcon = isRtl ? ArrowRight : ArrowLeft;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 space-y-8">
      <div>
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-xs sm:text-sm font-semibold text-slate-600 hover:text-brand-navy mb-4 transition-colors"
        >
          <ArrowIcon className="w-4 h-4" />
          <span>{locale === 'ar' ? 'العودة للرئيسية' : 'Back to Home'}</span>
        </Link>

        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full text-xs font-bold bg-amber-50 text-amber-900 border border-amber-200 mb-3">
          <BookOpen className="w-4 h-4 text-brand-gold" />
          <span>{locale === 'ar' ? 'ميثاق المشاركة والالتزام' : 'Participation Charter'}</span>
        </div>

        <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
          {t('termsPageTitle')}
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          {locale === 'ar' ? 'ساري المفعول لصالون التشغيل ودورات مركز تشالنجز' : 'Valid for Salon de l’Emploi & Challenges Center Programs'}
        </p>
      </div>

      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-10 shadow-xs space-y-6 text-sm text-slate-700 leading-relaxed">
        {locale === 'ar' ? (
          <>
            <section className="space-y-3">
              <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                <span>1. شروط الأهلية والتسجيل</span>
              </h2>
              <p>
                التسجيل في ورشات عمل ودورات مركز تشالنجز مفتوح لجميع رواد صالون التشغيل والطلبة والخريجين والمهنيين الباحثين عن تطوير مهاراتهم. يُشترط تقديم معلومات صحيحة ودقيقة (الاسم، رقم الهاتف، والبريد الإلكتروني). لا يُسمح بالتسجيل المكرر في نفس الورشة بنفس البريد الإلكتروني.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <Clock className="w-5 h-5 text-brand-gold" />
                <span>2. الالتزام بالحضور والمواعيد</span>
              </h2>
              <p>
                نظراً لمحدودية المقاعد المتاحة لكل ورشة عمل، يُعد تأكيد التسجيل التزاماً أدبياً وأخلاقياً بالحضور. يُرجى التواجد في قاعة الورشة أو الانضمام إلى الغرفة الافتراضية قبل الموعد المحدد بربع ساعة على الأقل. في حالة تعذر الحضور، يُرجى إخطار الإدارة مسبقاً لإتاحة المقعد للمشاركين في قائمة الانتظار.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <Users className="w-5 h-5 text-brand-navy" />
                <span>3. توقيع سجل الحضور الرسمي</span>
              </h2>
              <p>
                يُشترط التوقيع اليدوي على ورقة الحضور الرسمية في بداية الجلسة للحصول على شهادة المشاركة والمواد التدريبية المرافقة.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-lg font-bold text-slate-900">4. تعديل أو تأجيل الورشات</h2>
              <p>
                يحتفظ مركز تشالنجز بالحق في تعديل توقيت الورشة أو نقلها في حالات الضرورة القاهرة، مع إخطار جميع المشاركين المقبولين بوقت كافٍ عبر رسائل نصية أو بريد إلكتروني.
              </p>
            </section>
          </>
        ) : (
          <>
            <section className="space-y-3">
              <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                <span>1. Eligibility and Registration Validity</span>
              </h2>
              <p>
                Registration for Challenges Center masterclasses is open to Salon de l’Emploi attendees, students, graduates, and professionals. Registrants must submit accurate and verifiable contact information. Duplicate registrations using the same email address for the same workshop are automatically prevented.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <Clock className="w-5 h-5 text-brand-gold" />
                <span>2. Attendance Commitment & Punctuality</span>
              </h2>
              <p>
                Given limited classroom and lab capacities, seat allocation represents a strict commitment to attend. Participants are requested to arrive at the venue or log into the live virtual session at least 15 minutes prior to start time.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <Users className="w-5 h-5 text-brand-navy" />
                <span>3. Attendance Roster Signature</span>
              </h2>
              <p>
                Physical sign-off on the official attendance sheet is required to validate session completion and receive certified training deliverables.
              </p>
            </section>
          </>
        )}
      </div>
    </div>
  );
}
