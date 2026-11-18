'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { Course } from '@/types';
import { useLanguage } from '@/lib/i18n/LanguageContext';
import { formatDate } from '@/lib/utils';
import RegistrationForm from '@/components/RegistrationForm';
import {
  Calendar,
  Clock,
  MapPin,
  Video,
  Users,
  User,
  ArrowLeft,
  ArrowRight,
  ShieldCheck,
  Sparkles,
  Info,
} from 'lucide-react';

export default function CourseDetailsPage() {
  const { id } = useParams() as { id: string };
  const { t, locale, isRtl } = useLanguage();

  const [course, setCourse] = useState<Course | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    fetch(`/api/courses01?all=true`)
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          const found = (data.courses as Course[]).find(c => c.id === id);
          if (found) {
            setCourse(found);
          } else {
            setError('COURSE_NOT_FOUND');
          }
        }
      })
      .catch(err => {
        console.error(err);
        setError('FETCH_ERROR');
      })
      .finally(() => setLoading(false));
  }, [id]);

  const ArrowIcon = isRtl ? ArrowRight : ArrowLeft;

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 space-y-6">
        <div className="h-8 w-48 bg-slate-200 rounded animate-pulse" />
        <div className="h-64 bg-slate-100 rounded-2xl animate-pulse" />
        <div className="h-80 bg-slate-100 rounded-2xl animate-pulse" />
      </div>
    );
  }

  if (error || !course) {
    return (
      <div className="max-w-md mx-auto px-4 py-20 text-center">
        <div className="w-16 h-16 bg-rose-50 text-rose-600 rounded-full flex items-center justify-center mx-auto mb-4">
          <Info className="w-8 h-8" />
        </div>
        <h2 className="text-xl font-bold text-slate-900 mb-2">
          {locale === 'ar' ? 'الورشة غير متوفرة' : 'Course Not Found'}
        </h2>
        <p className="text-sm text-slate-500 mb-6">
          {locale === 'ar'
            ? 'لم يتم العثور على الورشة المطلوبة، ربما تم تغيير معرف الرابط أو حذفها.'
            : 'The requested course could not be found or has been unpublished.'}
        </p>
        <Link
          href="/courses01"
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-brand-navy text-white rounded-xl text-sm font-semibold hover:bg-brand-navyLight"
        >
          <ArrowIcon className="w-4 h-4" />
          <span>{t('backToCourses')}</span>
        </Link>
      </div>
    );
  }

  const title = locale === 'ar' ? course.title_ar : course.title_en;
  const description = locale === 'ar' ? course.description_ar : course.description_en;
  const location = locale === 'ar' ? course.location_ar : course.location_en;
  const accepted = course.accepted_count ?? 0;
  const seatsLeft = Math.max(0, course.max_seats - accepted);
  const isFull = seatsLeft <= 0;
  const isOnline = course.delivery_mode === 'online';

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 space-y-10">
      {/* Back Button */}
      <div>
        <Link
          href="/courses01"
          className="inline-flex items-center gap-2 text-sm font-semibold text-slate-600 hover:text-brand-navy transition-colors"
        >
          <ArrowIcon className="w-4 h-4" />
          <span>{t('backToCourses')}</span>
        </Link>
      </div>

      {/* Course Overview Card */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 sm:p-10 space-y-8">
        <div>
          {/* Header Badges */}
          <div className="flex flex-wrap items-center gap-2.5 mb-4">
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-slate-100 text-slate-800">
              {course.category}
            </span>

            <span
              className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold ${
                isOnline
                  ? 'bg-blue-50 text-blue-700 border border-blue-200'
                  : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
              }`}
            >
              {isOnline ? (
                <>
                  <Video className="w-3.5 h-3.5" />
                  <span>{t('filterOnline')}</span>
                </>
              ) : (
                <>
                  <MapPin className="w-3.5 h-3.5" />
                  <span>{t('filterInPerson')}</span>
                </>
              )}
            </span>

            {course.is_featured && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-50 text-amber-800 border border-amber-200">
                <Sparkles className="w-3.5 h-3.5 text-brand-gold" />
                <span>{locale === 'ar' ? 'ورشة مميزة' : 'Featured'}</span>
              </span>
            )}

            {isFull ? (
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-rose-100 text-rose-800 border border-rose-200">
                {t('fullyBooked')}
              </span>
            ) : (
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
                {seatsLeft} {t('seatsLeft')}
              </span>
            )}
          </div>

          {/* Title */}
          <h1 className="text-2xl sm:text-4xl font-black text-slate-900 tracking-tight leading-tight mb-4">
            {title}
          </h1>

          {/* Description */}
          <p className="text-base sm:text-lg text-slate-700 leading-relaxed whitespace-pre-line">
            {description}
          </p>
        </div>

        {/* Key Information Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-5 sm:p-6 bg-slate-50 rounded-2xl border border-slate-200/80">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-white border border-slate-200 flex items-center justify-center shrink-0 shadow-xs">
              <Calendar className="w-5 h-5 text-brand-gold" />
            </div>
            <div>
              <span className="block text-xs font-bold uppercase tracking-wider text-slate-500">
                {t('dateAndTime')}
              </span>
              <span className="font-bold text-sm text-slate-900 block mt-0.5">
                {formatDate(course.date, locale)}
              </span>
              <span className="text-xs text-slate-600 flex items-center gap-1 mt-0.5">
                <Clock className="w-3.5 h-3.5" />
                <span>{course.time}</span>
              </span>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-white border border-slate-200 flex items-center justify-center shrink-0 shadow-xs">
              {isOnline ? (
                <Video className="w-5 h-5 text-blue-600" />
              ) : (
                <MapPin className="w-5 h-5 text-emerald-600" />
              )}
            </div>
            <div>
              <span className="block text-xs font-bold uppercase tracking-wider text-slate-500">
                {t('locationVenue')}
              </span>
              <span className="font-bold text-sm text-slate-900 block mt-0.5">
                {location}
              </span>
              {isOnline && (
                <span className="text-[11px] text-blue-700 block mt-0.5 leading-snug">
                  {t('onlineLinkNotice')}
                </span>
              )}
            </div>
          </div>

          {/* Instructor Information */}
          {course.instructor_name && (
            <div className="flex items-start gap-3 sm:col-span-2 pt-3 border-t border-slate-200/60">
              <div className="w-10 h-10 rounded-xl bg-white border border-slate-200 flex items-center justify-center shrink-0 shadow-xs">
                <User className="w-5 h-5 text-brand-navy" />
              </div>
              <div>
                <span className="block text-xs font-bold uppercase tracking-wider text-slate-500">
                  {t('instructor')}
                </span>
                <span className="font-bold text-sm text-slate-900 block mt-0.5">
                  {course.instructor_name}
                </span>
                {course.instructor_title && (
                  <span className="text-xs text-slate-600 block mt-0.5">
                    {course.instructor_title}
                  </span>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Capacity Bar */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-700">
            <span className="flex items-center gap-1.5">
              <Users className="w-4 h-4 text-brand-gold" />
              <span>{locale === 'ar' ? 'المقاعد المحجوزة حالياً:' : 'Confirmed Seat Allocations:'}</span>
            </span>
            <span className="font-bold text-slate-900">
              {accepted} / {course.max_seats} ({locale === 'ar' ? `${seatsLeft} مقعد متاح` : `${seatsLeft} available`})
            </span>
          </div>

          <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden border border-slate-200">
            <div
              className={`h-full transition-all duration-500 rounded-full ${
                isFull
                  ? 'bg-rose-500'
                  : accepted / course.max_seats > 0.75
                  ? 'bg-amber-500'
                  : 'bg-emerald-500'
              }`}
              style={{
                width: `${Math.min(100, Math.round((accepted / course.max_seats) * 100))}%`,
              }}
            />
          </div>
        </div>
      </div>

      {/* Registration Section */}
      <section id="registration-form" className="scroll-mt-28">
        <RegistrationForm course={course} />
      </section>
    </div>
  );
}
