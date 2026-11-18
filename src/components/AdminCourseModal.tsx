'use client';

import React, { useState } from 'react';
import { Course, CourseInput } from '@/types';
import { useLanguage } from '@/lib/i18n/LanguageContext';
import { X, Loader2, Sparkles, Video, MapPin } from 'lucide-react';

interface AdminCourseModalProps {
  course?: Course | null;
  onClose: () => void;
  onSaved: () => void;
}

export default function AdminCourseModal({
  course,
  onClose,
  onSaved,
}: AdminCourseModalProps) {
  const { t, locale } = useLanguage();
  const isEditing = !!course;

  const [titleEn, setTitleEn] = useState(course?.title_en || '');
  const [titleAr, setTitleAr] = useState(course?.title_ar || '');
  const [descEn, setDescEn] = useState(course?.description_en || '');
  const [descAr, setDescAr] = useState(course?.description_ar || '');
  const [category, setCategory] = useState(course?.category || 'Workshop');
  const [date, setDate] = useState(course?.date || new Date().toISOString().split('T')[0]);
  const [time, setTime] = useState(course?.time || '09:30 - 12:30');
  const [deliveryMode, setDeliveryMode] = useState<'in_person' | 'online'>(
    course?.delivery_mode || 'in_person'
  );
  const [locationEn, setLocationEn] = useState(
    course?.location_en || 'Challenges Center, Main Hall - Salon de l’Emploi, Algiers'
  );
  const [locationAr, setLocationAr] = useState(
    course?.location_ar || 'مركز تشالنجز، القاعة الرئيسية - صالون التشغيل، الجزائر'
  );
  const [meetingUrl, setMeetingUrl] = useState(course?.meeting_url || '');
  const [maxSeats, setMaxSeats] = useState(course?.max_seats || 30);
  const [isPublished, setIsPublished] = useState(course?.is_published ?? true);
  const [isFeatured, setIsFeatured] = useState(course?.is_featured ?? false);
  const [instructorName, setInstructorName] = useState(course?.instructor_name || '');
  const [instructorTitle, setInstructorTitle] = useState(course?.instructor_title || '');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const payload: CourseInput = {
        title_en: titleEn,
        title_ar: titleAr,
        description_en: descEn,
        description_ar: descAr,
        category,
        date,
        time,
        delivery_mode: deliveryMode,
        location_en: locationEn,
        location_ar: locationAr,
        meeting_url: deliveryMode === 'online' ? meetingUrl : undefined,
        max_seats: Number(maxSeats),
        is_published: isPublished,
        is_featured: isFeatured,
        instructor_name: instructorName,
        instructor_title: instructorTitle,
      };

      const res = await fetch('/api/courses01', {
        method: isEditing ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(isEditing ? { id: course.id, ...payload } : payload),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Failed to save course');
      }

      onSaved();
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
      <div className="bg-white w-full max-w-2xl rounded-2xl shadow-xl overflow-hidden my-8">
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <h2 className="text-lg font-bold text-slate-900">
            {isEditing ? t('editCourse') : t('createNewCourse')}
          </h2>
          <button
            onClick={onClose}
            type="button"
            className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[80vh] overflow-y-auto">
          {error && (
            <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-rose-700 text-sm">
              {error}
            </div>
          )}

          {/* Bilingual Titles */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Course Title (Arabic) *
              </label>
              <input
                type="text"
                required
                value={titleAr}
                onChange={e => setTitleAr(e.target.value)}
                placeholder="عنوان الدورة أو الورشة بالعربية"
                dir="rtl"
                className="w-full px-3 py-2 text-sm border border-slate-200 rounded-xl focus:ring-2 focus:ring-brand-gold/30 focus:border-brand-navy"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Course Title (English) *
              </label>
              <input
                type="text"
                required
                value={titleEn}
                onChange={e => setTitleEn(e.target.value)}
                placeholder="Course or workshop title in English"
                dir="ltr"
                className="w-full px-3 py-2 text-sm border border-slate-200 rounded-xl focus:ring-2 focus:ring-brand-gold/30 focus:border-brand-navy"
              />
            </div>
          </div>

          {/* Bilingual Descriptions */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Description (Arabic) *
              </label>
              <textarea
                required
                rows={3}
                value={descAr}
                onChange={e => setDescAr(e.target.value)}
                placeholder="الوصف الكامل للورشة وأهدافها ومحاورها..."
                dir="rtl"
                className="w-full px-3 py-2 text-sm border border-slate-200 rounded-xl focus:ring-2 focus:ring-brand-gold/30 focus:border-brand-navy"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Description (English) *
              </label>
              <textarea
                required
                rows={3}
                value={descEn}
                onChange={e => setDescEn(e.target.value)}
                placeholder="Full workshop description, goals, and key takeaways..."
                dir="ltr"
                className="w-full px-3 py-2 text-sm border border-slate-200 rounded-xl focus:ring-2 focus:ring-brand-gold/30 focus:border-brand-navy"
              />
            </div>
          </div>

          {/* Category, Date & Time */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Category
              </label>
              <input
                type="text"
                value={category}
                onChange={e => setCategory(e.target.value)}
                placeholder="e.g. Career, Software, UI/UX"
                className="w-full px-3 py-2 text-sm border border-slate-200 rounded-xl"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Date *
              </label>
              <input
                type="date"
                required
                value={date}
                onChange={e => setDate(e.target.value)}
                className="w-full px-3 py-2 text-sm border border-slate-200 rounded-xl"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Time *
              </label>
              <input
                type="text"
                required
                value={time}
                onChange={e => setTime(e.target.value)}
                placeholder="e.g. 09:30 - 12:30"
                className="w-full px-3 py-2 text-sm border border-slate-200 rounded-xl"
              />
            </div>
          </div>

          {/* Delivery Mode & Max Seats */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Delivery Mode *
              </label>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setDeliveryMode('in_person')}
                  className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold border flex items-center justify-center gap-1.5 transition-colors ${
                    deliveryMode === 'in_person'
                      ? 'bg-brand-navy text-white border-brand-navy'
                      : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  <MapPin className="w-3.5 h-3.5" />
                  <span>In-Person (حضوري)</span>
                </button>
                <button
                  type="button"
                  onClick={() => setDeliveryMode('online')}
                  className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold border flex items-center justify-center gap-1.5 transition-colors ${
                    deliveryMode === 'online'
                      ? 'bg-brand-navy text-white border-brand-navy'
                      : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  <Video className="w-3.5 h-3.5" />
                  <span>Online (عبر الإنترنت)</span>
                </button>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Available Seats (Max Capacity) *
              </label>
              <input
                type="number"
                min={1}
                required
                value={maxSeats}
                onChange={e => setMaxSeats(Number(e.target.value))}
                className="w-full px-3 py-2 text-sm border border-slate-200 rounded-xl"
              />
            </div>
          </div>

          {/* Venue Location or Online Link */}
          {deliveryMode === 'in_person' ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Location (Arabic)
                </label>
                <input
                  type="text"
                  value={locationAr}
                  onChange={e => setLocationAr(e.target.value)}
                  dir="rtl"
                  className="w-full px-3 py-2 text-sm border border-slate-200 rounded-xl"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Location (English)
                </label>
                <input
                  type="text"
                  value={locationEn}
                  onChange={e => setLocationEn(e.target.value)}
                  dir="ltr"
                  className="w-full px-3 py-2 text-sm border border-slate-200 rounded-xl"
                />
              </div>
            </div>
          ) : (
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Private Meeting URL (Sent only to accepted participants)
              </label>
              <input
                type="url"
                value={meetingUrl}
                onChange={e => setMeetingUrl(e.target.value)}
                placeholder="https://meet.challengescenter.dz/room-id"
                dir="ltr"
                className="w-full px-3 py-2 text-sm border border-slate-200 rounded-xl"
              />
            </div>
          )}

          {/* Instructor Info */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Instructor Name
              </label>
              <input
                type="text"
                value={instructorName}
                onChange={e => setInstructorName(e.target.value)}
                placeholder="Dr. Karim Benali"
                className="w-full px-3 py-2 text-sm border border-slate-200 rounded-xl"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Instructor Title / Expertise
              </label>
              <input
                type="text"
                value={instructorTitle}
                onChange={e => setInstructorTitle(e.target.value)}
                placeholder="Senior HR Consultant & Talent Director"
                className="w-full px-3 py-2 text-sm border border-slate-200 rounded-xl"
              />
            </div>
          </div>

          {/* Toggles: Published & Featured */}
          <div className="flex flex-wrap items-center gap-6 pt-2 border-t border-slate-100">
            <label className="flex items-center gap-2 text-sm font-medium text-slate-700 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={isPublished}
                onChange={e => setIsPublished(e.target.checked)}
                className="h-4 w-4 rounded border-slate-300 text-brand-navy focus:ring-brand-gold"
              />
              <span>{t('published')} (Publicly visible)</span>
            </label>

            <label className="flex items-center gap-2 text-sm font-medium text-slate-700 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={isFeatured}
                onChange={e => setIsFeatured(e.target.checked)}
                className="h-4 w-4 rounded border-slate-300 text-brand-gold focus:ring-brand-gold"
              />
              <span className="flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5 text-brand-gold" />
                <span>Featured on Homepage</span>
              </span>
            </label>
          </div>

          {/* Actions */}
          <div className="pt-4 border-t border-slate-200 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="px-4 py-2 text-sm font-semibold text-slate-600 hover:text-slate-800 transition-colors"
            >
              {t('cancel')}
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2 bg-brand-navy hover:bg-brand-navyLight text-white rounded-xl text-sm font-bold shadow-xs transition-colors flex items-center gap-2 disabled:opacity-50"
            >
              {loading && <Loader2 className="w-4 h-4 animate-spin" />}
              <span>{isEditing ? t('save') : t('create')}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
