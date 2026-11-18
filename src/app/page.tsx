'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Course } from '@/types';
import { useLanguage } from '@/lib/i18n/LanguageContext';
import CourseCard from '@/components/CourseCard';
import {
  Sparkles,
  ArrowRight,
  ArrowLeft,
  GraduationCap,
  Briefcase,
  Users,
  Target,
  Award,
  PhoneCall,
  CheckCircle2,
  Calendar,
} from 'lucide-react';

export default function HomePage() {
  const { t, locale, isRtl } = useLanguage();
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/courses01')
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          // Prioritize featured courses or take the first 3
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
          HERO SECTION
          ========================================================================= */}
      <section className="relative overflow-hidden pt-12 sm:pt-20 pb-16 lg:pb-24 bg-gradient-to-b from-brand-navyDark via-brand-navy to-slate-900 text-white">
        {/* Decorative background glows */}
        <div className="absolute top-0 end-0 -translate-y-12 translate-x-12 w-96 h-96 bg-brand-gold/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 start-0 translate-y-12 -translate-x-12 w-96 h-96 bg-brand-crimson/20 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="max-w-3xl mx-auto text-center space-y-6 sm:space-y-8">
            {/* Dual Logos Presentation */}
            <div className="inline-flex items-center gap-4 sm:gap-6 bg-white/10 backdrop-blur-md px-5 py-2.5 rounded-2xl border border-white/15 shadow-lg">
              {/* Salon de l'Emploi Logo */}
              <div className="flex items-center gap-2">
                <div className="w-12 h-12 rounded-full overflow-hidden bg-white p-1 flex items-center justify-center shadow-md">
                  <Image
                    src="/images/salon-emploi-logo.png"
                    alt="Salon de l'Emploi"
                    width={44}
                    height={44}
                    className="object-contain"
                    priority
                  />
                </div>
                <div className="text-start hidden sm:block">
                  <span className="block text-xs font-black tracking-tight text-white uppercase">
                    Salon de l’Emploi
                  </span>
                  <span className="block text-[10px] text-brand-gold font-semibold">
                    {locale === 'ar' ? 'الصالون الوطني للتشغيل' : 'National Employment Fair'}
                  </span>
                </div>
              </div>

              <div className="h-8 w-px bg-white/20" />

              {/* Challenges Center Logo */}
              <div className="flex items-center gap-2">
                <div className="h-10 w-28 sm:w-32 bg-white rounded-lg p-1.5 flex items-center justify-center shadow-md">
                  <Image
                    src="/images/challenges-center-logo.png"
                    alt="Challenges Center"
                    width={120}
                    height={38}
                    className="object-contain"
                    priority
                  />
                </div>
              </div>
            </div>

            {/* Event Badge */}
            <div>
              <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-brand-gold/20 text-brand-gold border border-brand-gold/30">
                <Sparkles className="w-3.5 h-3.5" />
                <span>{t('heroBadge')}</span>
              </span>
            </div>

            {/* Main Headline */}
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-[1.15] text-white">
              {t('heroTitle')}
            </h1>

            {/* Supporting Subtitle */}
            <p className="text-base sm:text-lg text-slate-300 leading-relaxed max-w-2xl mx-auto">
              {t('heroSubtitle')}
            </p>

            {/* Two Call to Action Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
              <Link
                href="/courses01"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-7 py-4 rounded-xl text-base font-bold bg-brand-gold hover:bg-brand-goldHover text-brand-navy shadow-lg shadow-brand-gold/20 transition-all transform hover:-translate-y-0.5"
              >
                <span>{t('heroPrimaryCta')}</span>
                <ArrowIcon className="w-5 h-5" />
              </Link>

              <a
                href="#about-section"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-7 py-4 rounded-xl text-base font-semibold bg-white/10 hover:bg-white/15 text-white border border-white/20 backdrop-blur-sm transition-all"
              >
                <PhoneCall className="w-4 h-4 text-brand-gold" />
                <span>{t('heroSecondaryCta')}</span>
              </a>
            </div>

            {/* Metrics Row */}
            <div className="grid grid-cols-3 gap-4 pt-8 border-t border-white/10 text-center">
              <div>
                <span className="block text-2xl sm:text-3xl font-black text-brand-gold">100%</span>
                <span className="block text-xs sm:text-sm text-slate-300 font-medium">
                  {t('heroStatsCourses')}
                </span>
              </div>
              <div>
                <span className="block text-2xl sm:text-3xl font-black text-white">+500</span>
                <span className="block text-xs sm:text-sm text-slate-300 font-medium">
                  {t('heroStatsParticipants')}
                </span>
              </div>
              <div>
                <span className="block text-2xl sm:text-3xl font-black text-brand-gold">15+</span>
                <span className="block text-xs sm:text-sm text-slate-300 font-medium">
                  {t('heroStatsMentors')}
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          FEATURED COURSES SECTION
          ========================================================================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-brand-navy mb-2">
              <GraduationCap className="w-4 h-4 text-brand-gold" />
              <span>{locale === 'ar' ? 'فرص تدريبية استثنائية' : 'Curated Masterclasses'}</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900">
              {t('featuredTitle')}
            </h2>
            <p className="text-sm text-slate-500 mt-1 max-w-xl">
              {t('featuredSubtitle')}
            </p>
          </div>

          <Link
            href="/courses01"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold text-brand-navy bg-brand-goldLight hover:bg-brand-gold/30 border border-brand-gold/40 transition-colors shrink-0"
          >
            <span>{t('viewAllCourses')}</span>
            <ArrowIcon className="w-4 h-4" />
          </Link>
        </div>

        {/* Courses Cards List */}
        {loading ? (
          <div className="space-y-4">
            {[1, 2, 3].map(i => (
              <div
                key={i}
                className="h-44 bg-slate-100 rounded-2xl animate-pulse border border-slate-200"
              />
            ))}
          </div>
        ) : courses.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-2xl border border-slate-200">
            <p className="text-slate-500 text-sm">{t('noCoursesFound')}</p>
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
          ABOUT THE EVENT & CHALLENGES CENTER
          ========================================================================= */}
      <section
        id="about-section"
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 scroll-mt-28"
      >
        <div className="bg-gradient-to-br from-slate-900 via-brand-navy to-slate-900 rounded-3xl p-8 sm:p-12 lg:p-16 text-white shadow-xl relative overflow-hidden">
          {/* Subtle watermark logo in background */}
          <div className="absolute end-0 bottom-0 translate-x-12 translate-y-12 opacity-10 pointer-events-none">
            <Image
              src="/images/salon-emploi-logo.png"
              alt="Background Watermark"
              width={400}
              height={400}
            />
          </div>

          <div className="max-w-3xl relative z-10 space-y-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full text-xs font-semibold bg-white/10 text-brand-gold border border-white/15">
              <Briefcase className="w-3.5 h-3.5" />
              <span>{locale === 'ar' ? 'صالون التشغيل x مركز تشالنجز' : 'Salon de l’Emploi x Challenges Center'}</span>
            </div>

            <h2 className="text-2xl sm:text-4xl font-black text-white leading-tight">
              {t('aboutTitle')}
            </h2>

            <div className="space-y-4 text-slate-300 text-sm sm:text-base leading-relaxed">
              <p>{t('aboutParagraph1')}</p>
              <p>{t('aboutParagraph2')}</p>
            </div>

            {/* Feature Cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-6 border-t border-white/15">
              <div className="bg-white/5 border border-white/10 rounded-2xl p-4">
                <Award className="w-6 h-6 text-brand-gold mb-2" />
                <h3 className="font-bold text-sm text-white mb-1">{t('feature1Title')}</h3>
                <p className="text-xs text-slate-300 leading-relaxed">{t('feature1Desc')}</p>
              </div>

              <div className="bg-white/5 border border-white/10 rounded-2xl p-4">
                <Target className="w-6 h-6 text-brand-gold mb-2" />
                <h3 className="font-bold text-sm text-white mb-1">{t('feature2Title')}</h3>
                <p className="text-xs text-slate-300 leading-relaxed">{t('feature2Desc')}</p>
              </div>

              <div className="bg-white/5 border border-white/10 rounded-2xl p-4">
                <Users className="w-6 h-6 text-brand-gold mb-2" />
                <h3 className="font-bold text-sm text-white mb-1">{t('feature3Title')}</h3>
                <p className="text-xs text-slate-300 leading-relaxed">{t('feature3Desc')}</p>
              </div>
            </div>

            {/* Direct Contact Bar */}
            <div className="pt-4 flex flex-wrap items-center gap-4 text-xs text-slate-300">
              <span className="font-bold text-brand-gold uppercase tracking-wider">
                {locale === 'ar' ? 'للتواصل والاستفسار:' : 'Direct Inquiries:'}
              </span>
              <span>contact@challengescenter.dz</span>
              <span>•</span>
              <span dir="ltr">+213 (0) 550 00 00 00</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
