'use client';

import React, { useEffect, useState, useMemo } from 'react';
import { Course, DeliveryMode } from '@/types';
import { useLanguage } from '@/lib/i18n/LanguageContext';
import CourseCard from '@/components/CourseCard';
import { Search, MapPin, Video, Filter, BookOpen } from 'lucide-react';

export default function CoursesPage() {
  const { t, locale } = useLanguage();
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);

  // Filters state
  const [search, setSearch] = useState('');
  const [modeFilter, setModeFilter] = useState<'all' | DeliveryMode>('all');
  const [categoryFilter, setCategoryFilter] = useState('all');

  useEffect(() => {
    fetch('/api/courses01')
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setCourses(data.courses || []);
        }
      })
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  // Unique categories list
  const categories = useMemo(() => {
    const set = new Set<string>();
    courses.forEach(c => {
      if (c.category) set.add(c.category);
    });
    return Array.from(set);
  }, [courses]);

  // Filtered courses
  const filteredCourses = useMemo(() => {
    return courses.filter(course => {
      // Mode filter
      if (modeFilter !== 'all' && course.delivery_mode !== modeFilter) {
        return false;
      }

      // Category filter
      if (categoryFilter !== 'all' && course.category !== categoryFilter) {
        return false;
      }

      // Search query
      if (search.trim()) {
        const q = search.toLowerCase().trim();
        const title = (course.title || '').toLowerCase();
        const desc = (course.description || '').toLowerCase();
        const instructor = (course.instructor_name || '').toLowerCase();
        return title.includes(q) || desc.includes(q) || instructor.includes(q);
      }

      return true;
    });
  }, [courses, modeFilter, categoryFilter, search, locale]);

  return (
    <div className="flex-1 w-full max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-6 flex flex-col bg-beige-50">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-beige-900 tracking-tight">
          {t('coursesPageTitle')}
        </h1>
        <p className="text-xs sm:text-sm text-beige-700 mt-1">
          {t('coursesPageSubtitle')}
        </p>
      </div>

      {/* Search and Filters Bar */}
      <div className="bg-white p-4 sm:p-5 rounded-2xl border border-beige-300/90 shadow-xs space-y-4">
        <div className="flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
          {/* Search Input */}
          <div className="relative flex-1">
            <div className="absolute inset-y-0 start-0 ps-3.5 flex items-center pointer-events-none text-beige-500">
              <Search className="w-4 h-4" />
            </div>
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder={t('searchPlaceholder')}
              className="w-full ps-10 pe-4 py-2.5 rounded-xl border border-beige-300 bg-beige-50/50 text-beige-900 text-sm placeholder:text-beige-500 focus:outline-none focus:ring-2 focus:ring-ruby-600/30 focus:border-ruby-700 transition-all"
            />
          </div>

          {/* Delivery Mode Tabs */}
          <div className="flex items-center p-1 bg-beige-100 rounded-xl shrink-0 border border-beige-200">
            <button
              onClick={() => setModeFilter('all')}
              type="button"
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
                modeFilter === 'all'
                  ? 'bg-ruby-700 text-white shadow-xs'
                  : 'text-beige-700 hover:text-beige-900'
              }`}
            >
              {t('filterAll')}
            </button>
            <button
              onClick={() => setModeFilter('in_person')}
              type="button"
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all ${
                modeFilter === 'in_person'
                  ? 'bg-ruby-700 text-white shadow-xs'
                  : 'text-beige-700 hover:text-beige-900'
              }`}
            >
              <MapPin className="w-3.5 h-3.5 text-emerald-600" />
              <span>{t('filterInPerson')}</span>
            </button>
            <button
              onClick={() => setModeFilter('online')}
              type="button"
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all ${
                modeFilter === 'online'
                  ? 'bg-ruby-700 text-white shadow-xs'
                  : 'text-beige-700 hover:text-beige-900'
              }`}
            >
              <Video className="w-3.5 h-3.5 text-blue-600" />
              <span>{t('filterOnline')}</span>
            </button>
          </div>
        </div>

        {/* Categories Chips */}
        {categories.length > 0 && (
          <div className="flex items-center gap-2 overflow-x-auto pt-2 pb-1 text-xs">
            <span className="text-beige-600 font-semibold uppercase tracking-wider shrink-0 me-1">
              <Filter className="w-3 h-3 inline me-1" />
              {locale === 'ar' ? 'التصنيف:' : 'Category:'}
            </span>
            <button
              onClick={() => setCategoryFilter('all')}
              type="button"
              className={`px-3 py-1 rounded-full font-medium transition-colors shrink-0 ${
                categoryFilter === 'all'
                  ? 'bg-ruby-700 text-white shadow-xs'
                  : 'bg-beige-100 text-beige-800 hover:bg-beige-200'
              }`}
            >
              {t('filterAll')}
            </button>
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setCategoryFilter(cat)}
                type="button"
                className={`px-3 py-1 rounded-full font-medium transition-colors shrink-0 ${
                  categoryFilter === cat
                    ? 'bg-ruby-700 text-white shadow-xs'
                    : 'bg-beige-100 text-beige-800 hover:bg-beige-200'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Courses List */}
      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3, 4].map(i => (
            <div
              key={i}
              className="h-44 bg-beige-200/60 rounded-2xl animate-pulse border border-beige-300/80"
            />
          ))}
        </div>
      ) : filteredCourses.length === 0 ? (
        <div className="flex-1 min-h-[320px] flex flex-col items-center justify-center text-center py-12 px-4 bg-white rounded-2xl border border-beige-300 shadow-xs">
          <BookOpen className="w-10 h-10 text-beige-400 mx-auto mb-3" />
          <h3 className="text-lg font-bold text-beige-900 mb-1">
            {t('noCoursesFound')}
          </h3>
          <p className="text-xs text-beige-700 max-w-sm mx-auto">
            {locale === 'ar'
              ? 'يرجى تجربة كلمات بحث أخرى أو تغيير خيارات التصفية الحالية.'
              : 'Try adjusting your search query or reset the filters above.'}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredCourses.map(course => (
            <CourseCard key={course.id} course={course} />
          ))}
        </div>
      )}
    </div>
  );
}
