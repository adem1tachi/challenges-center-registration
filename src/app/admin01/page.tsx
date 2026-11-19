'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Course } from '@/types';
import { useLanguage } from '@/lib/i18n/LanguageContext';
import { formatDate } from '@/lib/utils';
import AdminLayout from '@/components/admin/AdminLayout';
import AdminCourseModal from '@/components/AdminCourseModal';
import {
  Plus,
  Edit2,
  Trash2,
  Eye,
  EyeOff,
  Users,
  Calendar,
  Clock,
  MapPin,
  Video,
  Layers,
  Sparkles,
  BarChart3,
  ExternalLink,
  RefreshCw,
  FolderOpen,
} from 'lucide-react';

export default function AdminCoursesPage() {
  const { t, locale } = useLanguage();

  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // Modal states
  const [modalOpen, setModalOpen] = useState(false);
  const [editingCourse, setEditingCourse] = useState<Course | null>(null);

  const fetchCourses = async () => {
    try {
      setRefreshing(true);
      const res = await fetch('/api/courses01?all=true');
      const data = await res.json();
      if (data.success) {
        setCourses(data.courses || []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  const handleTogglePublish = async (course: Course) => {
    try {
      await fetch('/api/courses01', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: course.id, action: 'toggle_publish' }),
      });
      fetchCourses();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteCourse = async (course: Course) => {
    const courseTitle = course.title;
    if (!window.confirm(`${t('confirmDeleteCourse')}\n\n"${courseTitle}"`)) {
      return;
    }

    try {
      await fetch(`/api/courses01?id=${course.id}`, { method: 'DELETE' });
      fetchCourses();
    } catch (err) {
      console.error(err);
    }
  };

  // Compute metrics
  const totalCourses = courses.length;
  const totalCapacity = courses.reduce((sum, c) => sum + (c.max_seats || 0), 0);
  const totalAccepted = courses.reduce((sum, c) => sum + (c.accepted_count || 0), 0);
  const totalRegistered = courses.reduce((sum, c) => sum + (c.total_registered || 0), 0);
  const fillPercentage = totalCapacity > 0 ? Math.round((totalAccepted / totalCapacity) * 100) : 0;

  const headerActions = (
    <>
      <button
        onClick={fetchCourses}
        type="button"
        className="p-2.5 bg-white border border-slate-200 rounded-xl text-slate-600 hover:text-brand-navy shadow-xs transition-colors"
        title={locale === 'ar' ? 'تحديث البيانات' : 'Refresh'}
      >
        <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
      </button>

      <button
        onClick={() => {
          setEditingCourse(null);
          setModalOpen(true);
        }}
        type="button"
        className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold bg-brand-navy text-white hover:bg-brand-navyLight shadow-xs transition-colors"
      >
        <Plus className="w-4 h-4 text-brand-gold" />
        <span>{t('createNewCourse')}</span>
      </button>
    </>
  );

  return (
    <AdminLayout
      title={locale === 'ar' ? 'إدارة الورشات التدريبية' : 'Workshops Management'}
      subtitle={locale === 'ar' ? 'نشر وتعديل الورشات، متابعة الحضور، وتحديث بيانات القاعات' : 'Manage workshops, schedules, venues, and availability'}
      actions={headerActions}
    >
      <div className="space-y-6">
        {/* Metrics Row */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
            <div className="flex items-center justify-between text-slate-500 mb-2">
              <span className="text-xs font-bold uppercase tracking-wider">{t('totalCourses')}</span>
              <Layers className="w-4 h-4 text-brand-gold" />
            </div>
            <div className="text-2xl sm:text-3xl font-black text-slate-900">{totalCourses}</div>
            <span className="text-[11px] text-slate-400 mt-1 block">
              {courses.filter(c => c.is_published).length} {t('published')}
            </span>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
            <div className="flex items-center justify-between text-slate-500 mb-2">
              <span className="text-xs font-bold uppercase tracking-wider">{t('totalRegistrations')}</span>
              <Users className="w-4 h-4 text-brand-gold" />
            </div>
            <div className="text-2xl sm:text-3xl font-black text-slate-900">{totalRegistered}</div>
            <span className="text-[11px] text-slate-400 mt-1 block">
              {locale === 'ar' ? 'إجمالي الطلبات' : 'Total applications'}
            </span>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
            <div className="flex items-center justify-between text-slate-500 mb-2">
              <span className="text-xs font-bold uppercase tracking-wider">{t('acceptedParticipants')}</span>
              <BarChart3 className="w-4 h-4 text-emerald-600" />
            </div>
            <div className="text-2xl sm:text-3xl font-black text-emerald-700">{totalAccepted}</div>
            <span className="text-[11px] text-slate-400 mt-1 block">
              {locale === 'ar' ? `من إجمالي ${totalCapacity} مقعد` : `out of ${totalCapacity} seats`}
            </span>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
            <div className="flex items-center justify-between text-slate-500 mb-2">
              <span className="text-xs font-bold uppercase tracking-wider">{t('fillRate')}</span>
              <Sparkles className="w-4 h-4 text-amber-500" />
            </div>
            <div className="text-2xl sm:text-3xl font-black text-slate-900">{fillPercentage}%</div>
            <div className="w-full h-1.5 bg-slate-100 rounded-full mt-2 overflow-hidden">
              <div className="h-full bg-brand-gold rounded-full" style={{ width: `${fillPercentage}%` }} />
            </div>
          </div>
        </div>

        {/* Courses Management Container */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
          {/* DESKTOP VIEW: Structured Clean Data Table */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full text-start border-collapse text-xs sm:text-sm">
              <thead>
                <tr className="bg-slate-50/80 border-b border-slate-200 text-slate-600 font-bold uppercase tracking-wider text-[11px]">
                  <th className="py-3.5 px-4 text-start">{locale === 'ar' ? 'الدورة / الورشة' : 'Course'}</th>
                  <th className="py-3.5 px-4 text-start">{locale === 'ar' ? 'التاريخ والتوقيت' : 'Date & Time'}</th>
                  <th className="py-3.5 px-4 text-start">{locale === 'ar' ? 'الصيغة والمكان' : 'Delivery & Venue'}</th>
                  <th className="py-3.5 px-4 text-center">{locale === 'ar' ? 'المقاعد والمقبولون' : 'Seats'}</th>
                  <th className="py-3.5 px-4 text-center">{locale === 'ar' ? 'الحالة' : 'Status'}</th>
                  <th className="py-3.5 px-4 text-end">{locale === 'ar' ? 'الإجراءات' : 'Actions'}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {loading ? (
                  <tr>
                    <td colSpan={6} className="py-12 text-center text-slate-400">
                      <RefreshCw className="w-5 h-5 animate-spin mx-auto mb-2 text-slate-400" />
                      <span>{locale === 'ar' ? 'جاري تحميل الورشات...' : 'Loading courses...'}</span>
                    </td>
                  </tr>
                ) : courses.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-16 text-center text-slate-400">
                      <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-3 text-slate-400">
                        <FolderOpen className="w-6 h-6" />
                      </div>
                      <p className="text-sm font-semibold text-slate-700 mb-1">
                        {locale === 'ar' ? 'لا توجد ورشات مضافة حالياً' : 'No courses available yet'}
                      </p>
                      <p className="text-xs text-slate-400 mb-4 max-w-sm mx-auto">
                        {locale === 'ar'
                          ? 'ابدأ بنشر ورشاتك ودوراتك التدريبية لتظهر للزوار في الكتالوج العام.'
                          : 'Create your first workshop to make it visible to participants.'}
                      </p>
                      <button
                        onClick={() => {
                          setEditingCourse(null);
                          setModalOpen(true);
                        }}
                        type="button"
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold bg-brand-navy text-white hover:bg-brand-navyLight transition-colors"
                      >
                        <Plus className="w-4 h-4 text-brand-gold" />
                        <span>{t('createNewCourse')}</span>
                      </button>
                    </td>
                  </tr>
                ) : (
                  courses.map(course => {
                    const title = course.title;
                    const accepted = course.accepted_count ?? 0;
                    const isOnline = course.delivery_mode === 'online';

                    return (
                      <tr key={course.id} className="hover:bg-slate-50/70 transition-colors">
                        {/* Title & Category */}
                        <td className="py-4 px-4 max-w-xs">
                          <div className="font-bold text-slate-900 line-clamp-1">{title}</div>
                          <div className="flex items-center gap-1.5 mt-0.5">
                            <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-slate-100 text-slate-600">
                              {course.category}
                            </span>
                            {course.is_featured && (
                              <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded bg-amber-100 text-amber-800">
                                {locale === 'ar' ? 'مميزة' : 'Featured'}
                              </span>
                            )}
                          </div>
                        </td>

                        {/* Date & Time */}
                        <td className="py-4 px-4 text-slate-700 whitespace-nowrap">
                          <div className="font-medium">{formatDate(course.date, locale)}</div>
                          <div className="text-xs text-slate-400">{course.time}</div>
                        </td>

                        {/* Delivery Mode & Venue */}
                        <td className="py-4 px-4 text-slate-700 max-w-xs">
                          <span
                            className={`inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-full ${
                              isOnline
                                ? 'bg-blue-50 text-blue-700 border border-blue-200'
                                : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            }`}
                          >
                            {isOnline ? <Video className="w-3 h-3" /> : <MapPin className="w-3 h-3" />}
                            <span>{isOnline ? t('filterOnline') : t('filterInPerson')}</span>
                          </span>
                          <div className="text-xs text-slate-500 mt-1 truncate">
                            {course.location}
                          </div>
                        </td>

                        {/* Capacity */}
                        <td className="py-4 px-4 text-center">
                          <span className="font-bold text-slate-900">{accepted}</span>
                          <span className="text-slate-400"> / {course.max_seats}</span>
                          <div className="w-20 mx-auto h-1.5 bg-slate-100 rounded-full mt-1 overflow-hidden">
                            <div
                              className="h-full bg-brand-navy rounded-full"
                              style={{
                                width: `${Math.min(100, (accepted / course.max_seats) * 100)}%`,
                              }}
                            />
                          </div>
                        </td>

                        {/* Published Toggle */}
                        <td className="py-4 px-4 text-center">
                          <button
                            onClick={() => handleTogglePublish(course)}
                            type="button"
                            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold transition-all ${
                              course.is_published
                                ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200'
                                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                            }`}
                          >
                            {course.is_published ? (
                              <>
                                <Eye className="w-3.5 h-3.5" />
                                <span>{t('published')}</span>
                              </>
                            ) : (
                              <>
                                <EyeOff className="w-3.5 h-3.5" />
                                <span>{t('draft')}</span>
                              </>
                            )}
                          </button>
                        </td>

                        {/* Actions */}
                        <td className="py-4 px-4 text-end">
                          <div className="flex items-center justify-end gap-1.5">
                            <Link
                              href={`/register01?courseId=${course.id}`}
                              className="p-1.5 text-slate-500 hover:text-brand-navy hover:bg-slate-100 rounded-lg transition-colors"
                              title={t('manageParticipants')}
                            >
                              <Users className="w-4 h-4" />
                            </Link>

                            <Link
                              href={`/course01/${course.id}`}
                              target="_blank"
                              className="p-1.5 text-slate-500 hover:text-brand-navy hover:bg-slate-100 rounded-lg transition-colors"
                              title="View Public Page"
                            >
                              <ExternalLink className="w-4 h-4" />
                            </Link>

                            <button
                              onClick={() => {
                                setEditingCourse(course);
                                setModalOpen(true);
                              }}
                              type="button"
                              className="p-1.5 text-slate-500 hover:text-brand-navy hover:bg-slate-100 rounded-lg transition-colors"
                              title={t('editCourse')}
                            >
                              <Edit2 className="w-4 h-4" />
                            </button>

                            <button
                              onClick={() => handleDeleteCourse(course)}
                              type="button"
                              className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                              title={t('deleteCourse')}
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>

          {/* MOBILE VIEW: Compact Clean Cards */}
          <div className="block md:hidden divide-y divide-slate-100">
            {loading ? (
              <div className="p-6 text-center text-slate-400 text-xs">Loading...</div>
            ) : courses.length === 0 ? (
              <div className="p-8 text-center text-slate-400 text-xs">
                {locale === 'ar' ? 'لا توجد ورشات مضافة حالياً.' : 'No courses available.'}
              </div>
            ) : (
              courses.map(course => {
                const title = course.title;
                const accepted = course.accepted_count ?? 0;
                const isOnline = course.delivery_mode === 'online';

                return (
                  <div key={course.id} className="p-4 space-y-3">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <div className="flex items-center gap-1.5 mb-1">
                          <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-slate-100 text-slate-700">
                            {course.category}
                          </span>
                          {course.is_featured && (
                            <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded bg-amber-100 text-amber-800">
                              Featured
                            </span>
                          )}
                        </div>
                        <h4 className="font-bold text-sm text-slate-900 leading-snug">{title}</h4>
                      </div>

                      <button
                        onClick={() => handleTogglePublish(course)}
                        type="button"
                        className={`shrink-0 px-2.5 py-1 rounded-full text-[10px] font-bold ${
                          course.is_published
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-slate-100 text-slate-600'
                        }`}
                      >
                        {course.is_published ? t('published') : t('draft')}
                      </button>
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-xs text-slate-500">
                      <div className="flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5 text-brand-gold shrink-0" />
                        <span>{formatDate(course.date, locale)}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5 text-brand-gold shrink-0" />
                        <span>{course.time}</span>
                      </div>
                      <div className="flex items-center gap-1.5 col-span-2">
                        {isOnline ? (
                          <Video className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                        ) : (
                          <MapPin className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                        )}
                        <span className="truncate">
                          {course.location}
                        </span>
                      </div>
                    </div>

                    <div className="pt-2 border-t border-slate-100 flex items-center justify-between gap-2">
                      <span className="text-xs font-semibold text-slate-700">
                        {t('acceptedParticipants')}: {accepted}/{course.max_seats}
                      </span>

                      <div className="flex items-center gap-1">
                        <Link
                          href={`/register01?courseId=${course.id}`}
                          className="px-2.5 py-1 text-xs font-semibold text-brand-navy bg-slate-100 rounded-lg"
                        >
                          {t('manageParticipants')}
                        </Link>

                        <button
                          onClick={() => {
                            setEditingCourse(course);
                            setModalOpen(true);
                          }}
                          type="button"
                          className="p-1.5 text-slate-600 hover:text-brand-navy rounded-lg"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>

                        <button
                          onClick={() => handleDeleteCourse(course)}
                          type="button"
                          className="p-1.5 text-rose-600 hover:bg-rose-50 rounded-lg"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>

      {/* Admin Course Modal */}
      {modalOpen && (
        <AdminCourseModal
          course={editingCourse}
          onClose={() => setModalOpen(false)}
          onSaved={() => {
            setModalOpen(false);
            fetchCourses();
          }}
        />
      )}
    </AdminLayout>
  );
}
