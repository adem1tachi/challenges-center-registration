'use client';

import React, { useState } from 'react';
import { Course, CourseInput } from '@/types';
import { useLanguage } from '@/lib/i18n/LanguageContext';
import { X, Loader2, Star, Video, MapPin } from 'lucide-react';

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

  const [title, setTitle] = useState(course?.title || '');
  const [description, setDescription] = useState(course?.description || '');
  const [category, setCategory] = useState(course?.category || 'Workshop');
  const [date, setDate] = useState(course?.date || new Date().toISOString().split('T')[0]);
  const [time, setTime] = useState(course?.time || '09:30 - 12:30');
  const [deliveryMode, setDeliveryMode] = useState<'in_person' | 'online'>(
    course?.delivery_mode || 'in_person'
  );
  const [location, setLocation] = useState(course?.location || '');
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
        title: title.trim(),
        description: description.trim(),
        category: category.trim() || 'Workshop',
        date,
        time: time.trim(),
        delivery_mode: deliveryMode,
        location: deliveryMode === 'in_person' ? location.trim() : '',
        meeting_url: deliveryMode === 'online' ? meetingUrl.trim() : undefined,
        max_seats: Number(maxSeats),
        is_published: isPublished,
        is_featured: isFeatured,
        instructor_name: instructorName.trim() || undefined,
        instructor_title: instructorTitle.trim() || undefined,
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
    <div className="fixed inset-0 z-50 bg-ruby-950/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
      <div className="bg-white w-full max-w-2xl rounded-3xl border border-beige-300 shadow-2xl overflow-hidden my-8">
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-beige-300 flex items-center justify-between bg-beige-50">
          <h2 className="text-lg font-bold text-beige-900">
            {isEditing ? t('editCourse') : t('createNewCourse')}
          </h2>
          <button
            onClick={onClose}
            type="button"
            className="p-1.5 text-beige-600 hover:text-beige-950 rounded-lg transition-colors"
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

          {/* Unified Course Title */}
          <div>
            <label className="block text-xs font-semibold text-beige-800 mb-1">
              {locale === 'ar' ? 'عنوان الدورة أو الورشة *' : 'Course Title *'}
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={e => setTitle(e.target.value)}
              placeholder={
                locale === 'ar'
                  ? 'أدخل عنوان الدورة أو الورشة التدريبية...'
                  : 'Enter workshop or course title...'
              }
              className="w-full px-3 py-2 text-sm border border-beige-300 rounded-xl focus:ring-2 focus:ring-ruby-600/30 focus:border-ruby-700 transition-all text-beige-900"
            />
          </div>

          {/* Unified Course Description */}
          <div>
            <label className="block text-xs font-semibold text-beige-800 mb-1">
              {locale === 'ar' ? 'وصف الدورة أو الورشة *' : 'Course Description *'}
            </label>
            <textarea
              required
              rows={3}
              value={description}
              onChange={e => setDescription(e.target.value)}
              placeholder={
                locale === 'ar'
                  ? 'الوصف الكامل للورشة وأهدافها ومحاورها...'
                  : 'Full workshop description, goals, and key takeaways...'
              }
              className="w-full px-3 py-2 text-sm border border-beige-300 rounded-xl focus:ring-2 focus:ring-ruby-600/30 focus:border-ruby-700 transition-all text-beige-900"
            />
          </div>

          {/* Category, Date & Time */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-semibold text-beige-800 mb-1">
                {locale === 'ar' ? 'المجال / التصنيف' : 'Category'}
              </label>
              <input
                type="text"
                value={category}
                onChange={e => setCategory(e.target.value)}
                placeholder="e.g. Career, Software, UI/UX"
                className="w-full px-3 py-2 text-sm border border-beige-300 rounded-xl text-beige-900"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-beige-800 mb-1">
                {locale === 'ar' ? 'التاريخ *' : 'Date *'}
              </label>
              <input
                type="date"
                required
                value={date}
                onChange={e => setDate(e.target.value)}
                className="w-full px-3 py-2 text-sm border border-beige-300 rounded-xl text-beige-900"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-beige-800 mb-1">
                {locale === 'ar' ? 'التوقيت *' : 'Time *'}
              </label>
              <input
                type="text"
                required
                value={time}
                onChange={e => setTime(e.target.value)}
                placeholder="e.g. 09:30 - 12:30"
                className="w-full px-3 py-2 text-sm border border-beige-300 rounded-xl text-beige-900"
              />
            </div>
          </div>

          {/* Delivery Mode & Max Seats */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-beige-800 mb-1">
                {locale === 'ar' ? 'صيغة الحضور *' : 'Delivery Mode *'}
              </label>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setDeliveryMode('in_person')}
                  className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold border flex items-center justify-center gap-1.5 transition-colors ${
                    deliveryMode === 'in_person'
                      ? 'bg-ruby-700 text-white border-ruby-700 shadow-xs'
                      : 'bg-white text-beige-800 border-beige-300 hover:bg-beige-50'
                  }`}
                >
                  <MapPin className="w-3.5 h-3.5" />
                  <span>{locale === 'ar' ? 'حضوري' : 'In-Person'}</span>
                </button>
                <button
                  type="button"
                  onClick={() => setDeliveryMode('online')}
                  className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold border flex items-center justify-center gap-1.5 transition-colors ${
                    deliveryMode === 'online'
                      ? 'bg-ruby-700 text-white border-ruby-700 shadow-xs'
                      : 'bg-white text-beige-800 border-beige-300 hover:bg-beige-50'
                  }`}
                >
                  <Video className="w-3.5 h-3.5" />
                  <span>{locale === 'ar' ? 'عبر الإنترنت' : 'Online'}</span>
                </button>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-beige-800 mb-1">
                {locale === 'ar' ? 'المقاعد المتاحة (الحد الأقصى) *' : 'Available Seats (Max Capacity) *'}
              </label>
              <input
                type="number"
                min={1}
                required
                value={maxSeats}
                onChange={e => setMaxSeats(Number(e.target.value))}
                className="w-full px-3 py-2 text-sm border border-beige-300 rounded-xl text-beige-900"
              />
            </div>
          </div>

          {/* Venue Location or Online Link */}
          {deliveryMode === 'in_person' ? (
            <div>
              <label className="block text-xs font-semibold text-beige-800 mb-1">
                {locale === 'ar' ? 'المكان أو القاعة *' : 'Venue / Location *'}
              </label>
              <input
                type="text"
                required
                value={location}
                onChange={e => setLocation(e.target.value)}
                placeholder={
                  locale === 'ar'
                    ? 'مثال: قاعة المحاضرات، الطابق الثاني'
                    : 'e.g. Main Conference Hall, 2nd Floor'
                }
                className="w-full px-3 py-2 text-sm border border-beige-300 rounded-xl text-beige-900"
              />
            </div>
          ) : (
            <div>
              <label className="block text-xs font-semibold text-beige-800 mb-1">
                {locale === 'ar'
                  ? 'رابط الاجتماع الافتراضي (يُرسل للمقبولين فقط)'
                  : 'Private Meeting URL (Sent only to accepted participants)'}
              </label>
              <input
                type="url"
                value={meetingUrl}
                onChange={e => setMeetingUrl(e.target.value)}
                placeholder="https://meet.google.com/..."
                dir="ltr"
                className="w-full px-3 py-2 text-sm border border-beige-300 rounded-xl text-beige-900"
              />
            </div>
          )}

          {/* Instructor Info */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-beige-800 mb-1">
                {locale === 'ar' ? 'اسم المؤطر / المدرب' : 'Instructor Name'}
              </label>
              <input
                type="text"
                value={instructorName}
                onChange={e => setInstructorName(e.target.value)}
                placeholder="e.g. Dr. Karim Benali"
                className="w-full px-3 py-2 text-sm border border-beige-300 rounded-xl text-beige-900"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-beige-800 mb-1">
                {locale === 'ar' ? 'المسمى الوظيفي / تخصص المؤطر' : 'Instructor Title / Expertise'}
              </label>
              <input
                type="text"
                value={instructorTitle}
                onChange={e => setInstructorTitle(e.target.value)}
                placeholder="e.g. Senior HR Consultant & Talent Director"
                className="w-full px-3 py-2 text-sm border border-beige-300 rounded-xl text-beige-900"
              />
            </div>
          </div>

          {/* Toggles: Published & Featured */}
          <div className="flex flex-wrap items-center gap-6 pt-2 border-t border-beige-200">
            <label className="flex items-center gap-2 text-sm font-medium text-beige-800 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={isPublished}
                onChange={e => setIsPublished(e.target.checked)}
                className="h-4 w-4 rounded border-beige-300 text-ruby-700 focus:ring-ruby-600"
              />
              <span>{t('published')} ({locale === 'ar' ? 'مرئية في الكتالوج' : 'Publicly visible'})</span>
            </label>

            <label className="flex items-center gap-2 text-sm font-medium text-beige-800 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={isFeatured}
                onChange={e => setIsFeatured(e.target.checked)}
                className="h-4 w-4 rounded border-beige-300 text-ruby-700 focus:ring-ruby-600"
              />
              <span className="flex items-center gap-1">
                <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                <span>{locale === 'ar' ? 'ورشة مميزة في الواجهة الرئيسية' : 'Featured on Homepage'}</span>
              </span>
            </label>
          </div>

          {/* Actions */}
          <div className="pt-4 border-t border-beige-300 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="px-4 py-2 text-sm font-semibold text-beige-700 hover:text-beige-950 transition-colors"
            >
              {t('cancel')}
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2 bg-ruby-700 hover:bg-ruby-800 text-white rounded-xl text-sm font-bold shadow-xs transition-colors flex items-center gap-2 disabled:opacity-50"
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
