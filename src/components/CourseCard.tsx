'use client';

import React from 'react';
import Link from 'next/link';
import { Course } from '@/types';
import { useLanguage } from '@/lib/i18n/LanguageContext';
import { formatDate } from '@/lib/utils';
import { Calendar, Clock, MapPin, Video, Users, ArrowRight, ArrowLeft, Sparkles } from 'lucide-react';

interface CourseCardProps {
  course: Course;
}

export default function CourseCard({ course }: CourseCardProps) {
  const { t, locale, isRtl } = useLanguage();

  const title = locale === 'ar' ? course.title_ar : course.title_en;
  const description = locale === 'ar' ? course.description_ar : course.description_en;
  const location = locale === 'ar' ? course.location_ar : course.location_en;

  const accepted = course.accepted_count ?? 0;
  const seatsLeft = Math.max(0, course.max_seats - accepted);
  const isFull = seatsLeft <= 0;
  const isOnline = course.delivery_mode === 'online';

  const ArrowIcon = isRtl ? ArrowLeft : ArrowRight;

  return (
    <div className="group relative bg-white rounded-2xl border border-slate-200/90 shadow-xs hover:shadow-md hover:border-brand-navy/30 transition-all duration-300 overflow-hidden flex flex-col md:flex-row items-stretch">
      {/* Featured highlight bar */}
      {course.is_featured && (
        <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-brand-gold to-amber-500 z-10" />
      )}

      {/* Main Content Area */}
      <div className="p-5 sm:p-6 flex-1 flex flex-col justify-between">
        <div>
          {/* Header Badges */}
          <div className="flex flex-wrap items-center gap-2 mb-3">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-slate-100 text-slate-700">
              {course.category}
            </span>

            {/* Delivery mode */}
            <span
              className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                isOnline
                  ? 'bg-blue-50 text-blue-700 border border-blue-200/60'
                  : 'bg-emerald-50 text-emerald-700 border border-emerald-200/60'
              }`}
            >
              {isOnline ? (
                <>
                  <Video className="w-3 h-3" />
                  <span>{t('filterOnline')}</span>
                </>
              ) : (
                <>
                  <MapPin className="w-3 h-3" />
                  <span>{t('filterInPerson')}</span>
                </>
              )}
            </span>

            {/* Featured badge */}
            {course.is_featured && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-amber-50 text-amber-800 border border-amber-200">
                <Sparkles className="w-3 h-3 text-brand-gold" />
                <span>{locale === 'ar' ? 'مميزة' : 'Featured'}</span>
              </span>
            )}

            {/* Status: Full or Available */}
            {isFull ? (
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-rose-100 text-rose-800 border border-rose-200">
                {t('fullyBooked')}
              </span>
            ) : (
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800 border border-emerald-200">
                {seatsLeft} {t('seatsLeft')}
              </span>
            )}
          </div>

          {/* Title */}
          <h3 className="text-lg sm:text-xl font-bold text-slate-900 group-hover:text-brand-navy transition-colors mb-2 line-clamp-2">
            {title}
          </h3>

          {/* Description */}
          <p className="text-sm text-slate-600 line-clamp-2 sm:line-clamp-3 mb-4 leading-relaxed">
            {description}
          </p>
        </div>

        {/* Metadata info row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-500 pt-3 border-t border-slate-100">
          <div className="flex items-center gap-2">
            <Calendar className="w-3.5 h-3.5 text-brand-gold shrink-0" />
            <span className="font-medium text-slate-700">{formatDate(course.date, locale)}</span>
          </div>

          <div className="flex items-center gap-2">
            <Clock className="w-3.5 h-3.5 text-brand-gold shrink-0" />
            <span>{course.time}</span>
          </div>

          <div className="flex items-center gap-2 sm:col-span-2 truncate">
            <MapPin className="w-3.5 h-3.5 text-brand-gold shrink-0" />
            <span className="truncate">{location}</span>
          </div>
        </div>
      </div>

      {/* Right/Side CTA Section */}
      <div className="bg-slate-50/80 md:w-56 p-5 sm:p-6 border-t md:border-t-0 md:border-s border-slate-200/80 flex flex-col justify-between items-center md:items-stretch text-center md:text-start gap-4">
        <div className="w-full">
          <div className="flex items-center justify-between text-xs text-slate-500 mb-1.5">
            <span className="flex items-center gap-1 font-medium">
              <Users className="w-3.5 h-3.5 text-slate-400" />
              <span>{t('capacity')}</span>
            </span>
            <span className="font-bold text-slate-800">
              {accepted} / {course.max_seats}
            </span>
          </div>

          {/* Capacity Progress Bar */}
          <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
            <div
              className={`h-full transition-all duration-500 rounded-full ${
                isFull
                  ? 'bg-rose-500'
                  : accepted / course.max_seats > 0.75
                  ? 'bg-amber-500'
                  : 'bg-emerald-500'
              }`}
              style={{ width: `${Math.min(100, Math.round((accepted / course.max_seats) * 100))}%` }}
            />
          </div>
        </div>

        {/* Action Button */}
        <Link
          href={`/course01/${course.id}`}
          className={`w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all shadow-xs ${
            isFull
              ? 'bg-slate-200 text-slate-700 hover:bg-slate-300'
              : 'bg-brand-navy hover:bg-brand-navyLight text-white group-hover:shadow-md'
          }`}
        >
          <span>{t('viewDetails')}</span>
          <ArrowIcon className="w-4 h-4 transition-transform group-hover:translate-x-1 rtl:group-hover:-translate-x-1" />
        </Link>
      </div>
    </div>
  );
}
