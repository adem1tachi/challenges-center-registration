'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Course } from '@/types';
import { useLanguage } from '@/lib/i18n/LanguageContext';
import { formatDate } from '@/lib/utils';
import {
  Calendar,
  Clock,
  MapPin,
  Video,
  Users,
  User,
  ArrowRight,
  ArrowLeft,
  Star,
  ExternalLink,
  AlertCircle,
  Layers,
  CheckCircle2,
  Circle,
} from 'lucide-react';

interface ConcurrentCourseGroupProps {
  date: string;
  time: string;
  courses: Course[];
}

export default function ConcurrentCourseGroup({
  date,
  time,
  courses,
}: ConcurrentCourseGroupProps) {
  const { t, locale, isRtl } = useLanguage();
  const [selectedCourseId, setSelectedCourseId] = useState<string | null>(null);

  const ArrowIcon = isRtl ? ArrowLeft : ArrowRight;

  const selectedCourse = courses.find(c => c.id === selectedCourseId) || null;

  return (
    <div className="relative bg-white rounded-3xl border-2 border-ruby-200/90 hover:border-ruby-400/80 shadow-xs hover:shadow-md transition-all duration-300 overflow-hidden flex flex-col">
      {/* Decorative top accent line */}
      <div className="h-1.5 bg-gradient-to-r from-ruby-700 via-amber-500 to-ruby-700" />

      {/* Shared Frame Header */}
      <div className="bg-gradient-to-r from-ruby-50/70 via-beige-100/70 to-ruby-50/50 p-4 sm:p-6 border-b border-beige-300/80">
        <div className="flex flex-wrap items-center justify-between gap-3">
          {/* Date & Time Slot Badges */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white text-beige-900 border border-beige-300/80 text-xs font-bold shadow-2xs">
              <Calendar className="w-3.5 h-3.5 text-ruby-600" />
              <span>{formatDate(date, locale)}</span>
            </span>

            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white text-ruby-700 border border-beige-300/80 text-xs font-mono font-bold shadow-2xs">
              <Clock className="w-3.5 h-3.5 text-ruby-600" />
              <span dir="ltr">{time}</span>
            </span>
          </div>

          {/* Concurrent Badge */}
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-ruby-100 text-ruby-800 border border-ruby-200/80 shadow-2xs">
            <Layers className="w-3.5 h-3.5 text-ruby-700" />
            <span>
              {courses.length} {locale === 'ar' ? 'ورشات متزامنة في نفس التوقيت' : 'Concurrent Workshops'}
            </span>
          </span>
        </div>

        {/* Prominent Required Note Banner: Only one course can be chosen */}
        <div className="mt-4 p-4 rounded-2xl bg-amber-50/95 border-2 border-amber-300/90 text-amber-950 flex items-start gap-3.5 shadow-2xs">
          <div className="w-9 h-9 rounded-xl bg-amber-500 text-white flex items-center justify-center shrink-0 shadow-xs mt-0.5">
            <AlertCircle className="w-5 h-5" />
          </div>

          <div className="space-y-1 flex-1">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs sm:text-sm font-black text-amber-950">
                {t('concurrentSlotNoticeTitle')}
              </span>
              <span className="text-[10px] font-bold uppercase tracking-wider bg-amber-200 text-amber-900 px-2 py-0.5 rounded-md">
                {locale === 'ar' ? 'تزامن التوقيت' : 'Simultaneous Time'}
              </span>
            </div>
            <p className="text-xs sm:text-sm text-amber-900 font-medium leading-relaxed">
              {t('concurrentSlotNoticeDesc')}
            </p>
          </div>
        </div>
      </div>

      {/* Courses Grid Inside the Shared Frame */}
      <div
        className={`p-4 sm:p-6 bg-beige-50/40 grid gap-4 sm:gap-6 ${
          courses.length === 2
            ? 'grid-cols-1 md:grid-cols-2'
            : courses.length >= 3
            ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3'
            : 'grid-cols-1'
        }`}
      >
        {courses.map((course, index) => {
          const isSelected = selectedCourseId === course.id;
          const accepted = course.accepted_count ?? 0;
          const isOnline = course.delivery_mode === 'online';
          const seatsLeft = Math.max(0, course.max_seats - accepted);
          const isFull = !isOnline && seatsLeft <= 0;

          return (
            <div
              key={course.id}
              onClick={() => setSelectedCourseId(course.id)}
              className={`group relative bg-white rounded-2xl p-5 border-2 transition-all duration-200 flex flex-col justify-between cursor-pointer ${
                isSelected
                  ? 'border-ruby-700 ring-4 ring-ruby-600/15 shadow-md -translate-y-0.5'
                  : 'border-beige-300 hover:border-ruby-500/50 hover:shadow-sm'
              }`}
            >
              {/* Featured highlight bar */}
              {course.is_featured && (
                <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-ruby-700 via-ruby-600 to-brand-gold rounded-t-2xl z-10" />
              )}

              <div>
                {/* Header: Option / Radio indicator + Badges */}
                <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
                  {/* Radio Choice Indicator */}
                  <div
                    className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold transition-colors ${
                      isSelected
                        ? 'bg-ruby-700 text-white shadow-2xs'
                        : 'bg-beige-100 text-beige-800 border border-beige-200 group-hover:bg-beige-200'
                    }`}
                  >
                    {isSelected ? (
                      <>
                        <CheckCircle2 className="w-3.5 h-3.5 text-white" />
                        <span>{t('selectedWorkshop')}</span>
                      </>
                    ) : (
                      <>
                        <Circle className="w-3 h-3 text-beige-500" />
                        <span>
                          {t('optionNumber')} {index + 1}
                        </span>
                      </>
                    )}
                  </div>

                  {/* Delivery mode */}
                  <span
                    className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold ${
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
                </div>

                {/* Category & Status row */}
                <div className="flex flex-wrap items-center gap-2 mb-2">
                  <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-ruby-50 text-ruby-700 border border-ruby-100">
                    {course.category}
                  </span>

                  {course.is_featured && (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-amber-50 text-amber-800 border border-amber-200">
                      <Star className="w-3 h-3 text-amber-500 fill-amber-500" />
                      <span>{locale === 'ar' ? 'مميزة' : 'Featured'}</span>
                    </span>
                  )}

                  {!isOnline &&
                    (isFull ? (
                      <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-rose-100 text-rose-800 border border-rose-200">
                        {t('fullyBooked')}
                      </span>
                    ) : (
                      <span className="px-2 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-100 text-emerald-800 border border-emerald-200">
                        {seatsLeft} {t('seatsLeft')}
                      </span>
                    ))}
                </div>

                {/* Title */}
                <h3 className="text-base sm:text-lg font-bold text-beige-900 group-hover:text-ruby-700 transition-colors line-clamp-2 mb-2 leading-snug">
                  {course.title}
                </h3>

                {/* Description */}
                <p className="text-xs sm:text-sm text-beige-700 line-clamp-2 leading-relaxed mb-4">
                  {course.description}
                </p>

                {/* Instructor & Location info */}
                <div className="space-y-1.5 text-xs text-beige-700 pt-3 border-t border-beige-200">
                  {course.instructor_name && (
                    <div className="flex items-center gap-1.5">
                      <User className="w-3.5 h-3.5 text-ruby-600 shrink-0" />
                      <span className="font-semibold text-beige-900 truncate">
                        {course.instructor_name}
                      </span>
                      {course.instructor_title && (
                        <span className="text-beige-500 truncate text-[11px]">
                          • {course.instructor_title}
                        </span>
                      )}
                    </div>
                  )}

                  <div className="flex items-center gap-1.5 text-beige-600 truncate">
                    {isOnline ? (
                      <Video className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                    ) : (
                      <MapPin className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    )}
                    <span className="truncate">{course.location}</span>
                  </div>
                </div>
              </div>

              {/* Bottom Card Actions & Capacity */}
              <div className="pt-4 mt-3 border-t border-beige-200/80 space-y-3">
                {/* Capacity or Meeting link */}
                {!isOnline ? (
                  <div className="space-y-1">
                    <div className="flex items-center justify-between text-[11px] text-beige-700">
                      <span className="flex items-center gap-1 font-medium">
                        <Users className="w-3 h-3 text-beige-500" />
                        <span>{t('capacity')}</span>
                      </span>
                      <span className="font-bold text-beige-900 font-mono">
                        {accepted} / {course.max_seats}
                      </span>
                    </div>
                    <div className="w-full h-1.5 bg-beige-200 rounded-full overflow-hidden">
                      <div
                        className={`h-full transition-all duration-500 rounded-full ${
                          isFull
                            ? 'bg-rose-500'
                            : accepted / course.max_seats > 0.75
                            ? 'bg-amber-500'
                            : 'bg-ruby-600'
                        }`}
                        style={{
                          width: `${Math.min(
                            100,
                            Math.round((accepted / course.max_seats) * 100)
                          )}%`,
                        }}
                      />
                    </div>
                  </div>
                ) : course.meeting_url ? (
                  <a
                    href={course.meeting_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={e => e.stopPropagation()}
                    className="w-full inline-flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-50 text-blue-700 border border-blue-200 hover:bg-blue-100 text-xs font-semibold transition-colors"
                  >
                    <Video className="w-3 h-3 text-blue-600" />
                    <span>Google Meet</span>
                    <ExternalLink className="w-3 h-3 text-blue-500" />
                  </a>
                ) : null}

                {/* Direct Action Link */}
                <Link
                  href={`/course01/${course.id}`}
                  onClick={e => e.stopPropagation()}
                  className={`w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all shadow-xs ${
                    isSelected
                      ? 'bg-ruby-700 hover:bg-ruby-800 text-white shadow-sm'
                      : isFull
                      ? 'bg-beige-200 text-beige-700 hover:bg-beige-300'
                      : 'bg-beige-100 hover:bg-ruby-50 hover:text-ruby-700 text-beige-900 border border-beige-300 hover:border-ruby-300'
                  }`}
                >
                  <span>
                    {isSelected ? t('proceedToRegister') : t('viewDetails')}
                  </span>
                  <ArrowIcon className="w-4 h-4 transition-transform group-hover:translate-x-1 rtl:group-hover:-translate-x-1" />
                </Link>
              </div>
            </div>
          );
        })}
      </div>

      {/* Frame Bottom Confirmation Bar (When a course is selected) */}
      {selectedCourse && (
        <div className="p-4 sm:p-5 bg-gradient-to-r from-ruby-50 via-white to-ruby-50 border-t border-ruby-200/90 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs sm:text-sm animate-in fade-in duration-200">
          <div className="flex items-center gap-2 text-beige-900 w-full sm:w-auto">
            <span className="font-bold text-ruby-700 shrink-0">
              {t('selectedForThisSlot')}
            </span>
            <span className="font-black text-beige-900 line-clamp-1">
              {selectedCourse.title}
            </span>
          </div>

          <Link
            href={`/course01/${selectedCourse.id}`}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold bg-ruby-700 hover:bg-ruby-800 text-white shadow-xs transition-colors shrink-0"
          >
            <span>{t('confirmAndRegisterNow')}</span>
            <ArrowIcon className="w-4 h-4" />
          </Link>
        </div>
      )}
    </div>
  );
}