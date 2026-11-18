'use client';

import React from 'react';
import Link from 'next/link';
import { useLanguage } from '@/lib/i18n/LanguageContext';
import { ShieldCheck, Scale, FileText, ArrowRight, ArrowLeft } from 'lucide-react';

export default function PrivacyPolicyPage() {
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

        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-800 border border-emerald-200 mb-3">
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          <span>{t('privacyLawHeading')}</span>
        </div>

        <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
          {t('privacyPageTitle')}
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          {locale === 'ar' ? 'آخر تحديث: نوفمبر 2026' : 'Last updated: November 2026'}
        </p>
      </div>

      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-10 shadow-xs space-y-6 text-sm text-slate-700 leading-relaxed">
        {locale === 'ar' ? (
          <>
            <section className="space-y-3">
              <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <Scale className="w-5 h-5 text-brand-gold" />
                <span>1. الإطار القانوني والامتثال لأحكام القانون رقم 18-07</span>
              </h2>
              <p>
                تلتزم مؤسسة <strong>مركز تشالنجز (Challenges Center)</strong>، المنظمة لورشات العمل بالتنسيق مع <strong>صالون التشغيل (Salon de l’Emploi)</strong>، بحماية خصوصية كافة المشاركين والزوار بما يتوافق بدقة مع أحكام <strong>القانون الجزائري رقم 18-07 المؤرخ في 10 جوان 2018</strong> المتعلق بحماية الأشخاص الطبيعيين في مجال معالجة المعطيات ذات الطابع الشخصي.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <FileText className="w-5 h-5 text-brand-gold" />
                <span>2. المعطيات التي يتم جمعها والغرض من معالجتها</span>
              </h2>
              <p>
                تقتصر المعطيات المجمعة من خلال استمارة التسجيل على البيانات الأساسية الضرورية لإدارة الورشات وتنظيم الحضور، وتشمل:
              </p>
              <ul className="list-disc list-inside space-y-1 ps-2 text-slate-600">
                <li>الاسم واللقب (للتعريف وإصدار قوائم الحضور وشهادات المشاركة).</li>
                <li>رقم الهاتف والبريد الإلكتروني (للتواصل المباشر وتأكيد المقاعد وإرسال روابط الجلسات عن بعد).</li>
                <li>تاريخ ووقت التسجيل والبصمة الزمنية للموافقة الصريحة.</li>
              </ul>
              <p>
                تُعالج هذه البيانات حصرياً للأغراض التنظيمية والأكاديمية المرتبطة بالدورات، ولا يتم استغلالها في أي نشاط تجاري أو تسويقي خارج هذا النطاق دون موافقة مسبقة.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-brand-gold" />
                <span>3. أمن البيانات وسريتها</span>
              </h2>
              <p>
                تُخزن جميع البيانات في قواعد بيانات مؤمنة مع تفعيل بروتوكولات الأمان الصارمة وسياسات أمان على مستوى الصفوف (Row Level Security - RLS). ولا يُسمح بالاطلاع على البيانات إلا لمسؤولي المركز المخولين إدارياً. كما نضمن عدم نشر أو مشاركة أي بيانات شخصية أو أرقام هواتف علناً على المنصة.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-lg font-bold text-slate-900">4. حقوق المشارك (صاحب المعطيات)</h2>
              <p>
                وفقاً للمادتين 32 و 34 من القانون 18-07، يحق لكل مشارك مسجل:
              </p>
              <ul className="list-disc list-inside space-y-1 ps-2 text-slate-600">
                <li>حق الاطلاع على بياناته الشخصية المسجلة في النظام.</li>
                <li>حق طلب تصحيح أي بيانات غير دقيقة أو تعديلها.</li>
                <li>حق طلب حذف تسجيله وإلغاء مقعده في أي وقت عبر التواصل مع إدارة المركز.</li>
              </ul>
            </section>

            <section className="space-y-2 pt-4 border-t border-slate-100 text-xs text-slate-500">
              <p>
                لأي استفسار بخصوص معالجة البيانات الشخصية أو ممارسة حقوقكم القانونية، يمكنكم التواصل مع مسؤول حماية البيانات عبر: <strong>privacy@challengescenter.dz</strong>
              </p>
            </section>
          </>
        ) : (
          <>
            <section className="space-y-3">
              <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <Scale className="w-5 h-5 text-brand-gold" />
                <span>1. Legal Framework & Algerian Law No. 18-07 Compliance</span>
              </h2>
              <p>
                <strong>Challenges Center</strong>, in strategic partnership with <strong>Salon de l’Emploi</strong>, is rigorously committed to safeguarding participant privacy in full conformity with <strong>Algerian Law No. 18-07 of June 10, 2018</strong> regarding the protection of natural persons in the processing of personal data.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <FileText className="w-5 h-5 text-brand-gold" />
                <span>2. Data Collected & Processing Purpose</span>
              </h2>
              <p>
                The data collected via our registration form is strictly limited to information necessary for workshop coordination, seat allocation, and attendance certification:
              </p>
              <ul className="list-disc list-inside space-y-1 ps-2 text-slate-600">
                <li>First Name and Last Name (for attendee identification and official attendance rosters).</li>
                <li>Phone Number and Email Address (for confirmation calls, notifications, and private online meeting access).</li>
                <li>Registration timestamps and explicit consent logs.</li>
              </ul>
              <p>
                This data is used solely for educational, administrative, and admission purposes related to the scheduled masterclasses.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-brand-gold" />
                <span>3. Data Security & Row-Level Confidentiality</span>
              </h2>
              <p>
                All data is encrypted in transit and stored in protected databases utilizing Row Level Security (RLS) policies. Only authenticated, authorized administrative staff can access participant lists. Participant information is never disclosed publicly.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-lg font-bold text-slate-900">4. Participant Rights</h2>
              <p>
                Pursuant to Articles 32 and 34 of Algerian Law No. 18-07, each registrant holds the right to access, rectify, or request deletion of their personal data by contacting Challenges Center administration.
              </p>
            </section>

            <section className="space-y-2 pt-4 border-t border-slate-100 text-xs text-slate-500">
              <p>
                For any inquiries regarding data protection, please contact: <strong>privacy@challengescenter.dz</strong>
              </p>
            </section>
          </>
        )}
      </div>
    </div>
  );
}
