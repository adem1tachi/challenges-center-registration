'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Course } from '@/types';
import { useLanguage } from '@/lib/i18n/LanguageContext';
import CourseCard from '@/components/CourseCard';
import { ArrowRight, ArrowLeft, BookOpen, ChevronDown, ExternalLink } from 'lucide-react';

export default function HomePage() {
  const { t, locale, isRtl } = useLanguage();
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/courses01')
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          const allCourses: Course[] = data.courses || [];
          const featured = allCourses.filter(c => c.is_featured);
          setCourses(featured.length > 0 ? featured.slice(0, 3) : allCourses.slice(0, 3));
        }
      })
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  const ArrowIcon = isRtl ? ArrowLeft : ArrowRight;

  return (
    <div className="space-y-16 sm:space-y-24 pb-20">
      {/* =========================================================================
          HERO SECTION (Fullscreen 100dvh Dynamic Viewport - Balanced Responsive Layout)
          ========================================================================= */}
      <section className="relative overflow-hidden min-h-[calc(100dvh-5rem)] flex flex-col justify-between py-6 sm:py-10 lg:py-12 bg-gradient-to-b from-slate-950 via-brand-navyDark to-slate-900 text-white border-b border-slate-800">
        <div className="w-full flex-1 flex flex-col items-center justify-center max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-4 sm:space-y-6 my-auto">
          {/* Main Organizer Spotlight: Salon de l'Emploi */}
          <div className="inline-flex items-center gap-2.5 sm:gap-3 bg-white/10 backdrop-blur-md px-3.5 py-1.5 sm:px-4 sm:py-2 rounded-2xl border border-white/15 shadow-sm">
            <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full flex items-center justify-center shrink-0">
              <Image
                src="/images/salon-emploi-logo.png"
                alt="Salon de l'Emploi"
                width={36}
                height={36}
                className="object-contain drop-shadow-sm"
                priority
              />
            </div>
            <div className="text-start leading-tight">
              <span className="block text-[11px] sm:text-xs font-black tracking-tight text-white uppercase">
                Salon de l’Emploi 2026
              </span>
              <span className="block text-[9px] sm:text-[10px] text-brand-gold font-semibold">
                {locale === 'ar'
                  ? 'الصالون الوطني للتشغيل • المنصة الرسمية'
                  : 'National Career Fair • Official Platform'}
              </span>
            </div>
          </div>

          {/* Main Headline with balanced font scaling */}
          <h1 className="text-2xl sm:text-4xl lg:text-5xl font-black tracking-tight leading-snug text-white max-w-3xl mx-auto">
            {locale === 'ar' ? (
              <>
                <span>الصالون الوطني للتشغيل 2026</span>
                <span className="block text-brand-gold text-lg sm:text-2xl lg:text-3xl mt-1.5 sm:mt-2.5 font-bold">
                  المنصة الرسمية للتسجيل في الورشات التدريبية
                </span>
              </>
            ) : (
              <>
                <span>Salon de l’Emploi 2026</span>
                <span className="block text-brand-gold text-lg sm:text-2xl lg:text-3xl mt-1.5 sm:mt-2.5 font-bold">
                  Official Workshop & Masterclass Registration Platform
                </span>
              </>
            )}
          </h1>

          {/* Subtitle with Primary Organizer & Secondary School Partner Mention */}
          <p className="text-xs sm:text-sm lg:text-base text-slate-300 max-w-2xl mx-auto leading-relaxed">
            {locale === 'ar'
              ? 'ينظم الصالون الوطني للتشغيل باقة من الورشات التطبيقية المتخصصة بالشراكة مع مركز تشالنجز (Challenges Center) لتمكين الشباب وتأهيلهم المباشر لسوق العمل. احجز مقعدك مجاناً وبادر بالتسجيل.'
              : 'Organized by Salon de l’Emploi in partnership with Challenges Center to deliver specialized career workshops. Reserve your seat directly and register now.'}
          </p>

          {/* Primary Action Button */}
          <div className="pt-1 sm:pt-2">
            <Link
              href="/courses01"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 sm:px-8 sm:py-3.5 rounded-xl text-sm sm:text-base font-bold bg-brand-gold hover:bg-brand-goldHover text-brand-navy shadow-md shadow-brand-gold/15 transition-all transform hover:-translate-y-0.5"
            >
              <span>{t('heroPrimaryCta')}</span>
              <ArrowIcon className="w-4 h-4 sm:w-5 sm:h-5" />
            </Link>
          </div>
        </div>

        {/* Bottom Smooth Scroll Down Indicator */}
        <div className="w-full text-center pt-2 sm:pt-4">
          <a
            href="#workshops-section"
            className="inline-flex flex-col items-center gap-1 text-slate-400 hover:text-brand-gold transition-colors text-xs font-medium group"
          >
            <span>{locale === 'ar' ? 'استعراض الورشات المتاحة' : 'Explore Workshops'}</span>
            <ChevronDown className="w-4 h-4 animate-bounce group-hover:translate-y-0.5 transition-transform" />
          </a>
        </div>
      </section>

      {/* =========================================================================
          AVAILABLE WORKSHOPS SECTION
          ========================================================================= */}
      <section id="workshops-section" className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 scroll-mt-24">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 sm:gap-4 mb-6">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
              {t('featuredTitle')}
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              {t('featuredSubtitle')}
            </p>
          </div>

          <Link
            href="/courses01"
            className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-brand-navy hover:text-brand-gold transition-colors shrink-0 self-start sm:self-auto"
          >
            <span>{t('viewAllCourses')}</span>
            <ArrowIcon className="w-4 h-4" />
          </Link>
        </div>

        {/* Courses Cards List */}
        {loading ? (
          <div className="space-y-4">
            {[1, 2].map(i => (
              <div
                key={i}
                className="h-36 bg-slate-100 rounded-2xl animate-pulse border border-slate-200"
              />
            ))}
          </div>
        ) : courses.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-2xl border border-slate-200 p-8 space-y-3">
            <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center mx-auto text-slate-400">
              <BookOpen className="w-6 h-6" />
            </div>
            <p className="text-slate-700 font-bold text-sm">
              {locale === 'ar' ? 'لا توجد ورشات معروضة حالياً' : 'No courses currently available'}
            </p>
            <p className="text-slate-500 text-xs max-w-sm mx-auto">
              {locale === 'ar'
                ? 'ترقبوا الإعلان عن مواعيد الورشات التدريبية الجديدة قريباً.'
                : 'Check back soon for upcoming workshops and training sessions.'}
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {courses.map(course => (
              <CourseCard key={course.id} course={course} />
            ))}
          </div>
        )}
      </section>

      {/* =========================================================================
          PARTNERSHIP NOTE
          ========================================================================= */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 text-center space-y-3 shadow-xs">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-slate-100 text-slate-700">
            <span>{locale === 'ar' ? 'شراكة تدريبية معتمدة' : 'Official Training Partnership'}</span>
          </div>
          <h3 className="text-lg font-bold text-slate-900">
            {locale === 'ar' ? 'الصالون الوطني للتشغيل x مركز تشالنجز' : 'Salon de l’Emploi x Challenges Center'}
          </h3>
          <p className="text-xs sm:text-sm text-slate-600 max-w-2xl mx-auto leading-relaxed">
            {locale === 'ar'
              ? 'مبادرة تدريبية مشتركة تهدف إلى سد الفجوة بين التكوين واحتياجات سوق العمل من خلال ورشات تفاعلية يقدمها نخبة من الخبراء والمؤطرين المعتمدين.'
              : 'A joint initiative aimed at bridging the gap between talent and market needs through specialized workshops led by certified industry experts.'}
          </p>
          {/* Official External Links */}
          <div className="pt-3 flex flex-wrap items-center justify-center gap-3 sm:gap-4 text-xs font-semibold">
            <a
              href="https://salon.eicclub.org"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-brand-navy hover:text-brand-gold transition-colors py-1.5 px-3.5 rounded-xl bg-slate-50 border border-slate-200 hover:border-brand-gold/40 shadow-xs"
            >
              <ExternalLink className="w-3.5 h-3.5 text-brand-gold" />
              <span>{locale === 'ar' ? 'الموقع الرسمي للصالون: salon.eicclub.org' : 'Official Event Site: salon.eicclub.org'}</span>
            </a>

            <a
              href="https://challengescenter.dz"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-brand-navy hover:text-brand-gold transition-colors py-1.5 px-3.5 rounded-xl bg-slate-50 border border-slate-200 hover:border-brand-gold/40 shadow-xs"
            >
              <ExternalLink className="w-3.5 h-3.5 text-brand-gold" />
              <span>{locale === 'ar' ? 'موقع مركز تشالنجز: challengescenter.dz' : 'Challenges Center: challengescenter.dz'}</span>
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
