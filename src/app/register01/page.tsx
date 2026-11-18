'use client';

import React, { useEffect, useState, useMemo, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Course, Registration, RegistrationStatus } from '@/types';
import { useLanguage } from '@/lib/i18n/LanguageContext';
import { formatDate } from '@/lib/utils';
import AttendanceSheetModal from '@/components/AttendanceSheetModal';
import ParticipantDetailsModal from '@/components/ParticipantDetailsModal';
import {
  Users,
  Search,
  Filter,
  Download,
  Printer,
  ChevronDown,
  CheckCircle2,
  XCircle,
  HelpCircle,
  Clock,
  ArrowRight,
  ArrowLeft,
  RefreshCw,
  Eye,
  FileSpreadsheet,
} from 'lucide-react';

function RegistrationManagementContent() {
  const { t, locale, isRtl } = useLanguage();
  const searchParams = useSearchParams();

  const [courses, setCourses] = useState<Course[]>([]);
  const [registrations, setRegistrations] = useState<Registration[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // Filters
  const [selectedCourseId, setSelectedCourseId] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Modals
  const [attendanceModalCourse, setAttendanceModalCourse] = useState<Course | null>(null);
  const [selectedParticipant, setSelectedParticipant] = useState<Registration | null>(null);

  // Sync courseId from URL query param if present
  useEffect(() => {
    const paramCourseId = searchParams.get('courseId');
    if (paramCourseId) {
      setSelectedCourseId(paramCourseId);
    }
  }, [searchParams]);

  const fetchData = async () => {
    try {
      setRefreshing(true);
      const [coursesRes, regsRes] = await Promise.all([
        fetch('/api/courses01?all=true'),
        fetch('/api/register01'),
      ]);

      const coursesData = await coursesRes.json();
      const regsData = await regsRes.json();

      if (coursesData.success) {
        setCourses(coursesData.courses || []);
      }
      if (regsData.success) {
        setRegistrations(regsData.registrations || []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Update status handler
  const handleUpdateStatus = async (
    id: string,
    status: RegistrationStatus,
    notes?: string
  ) => {
    try {
      const res = await fetch('/api/register01', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status, notes }),
      });
      const data = await res.json();
      if (data.success) {
        // Update local state
        setRegistrations(prev =>
          prev.map(r => (r.id === id ? { ...r, status, notes: notes ?? r.notes } : r))
        );
        if (selectedParticipant && selectedParticipant.id === id) {
          setSelectedParticipant(prev => (prev ? { ...prev, status, notes: notes ?? prev.notes } : null));
        }
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Selected course details
  const activeCourse = useMemo(() => {
    if (selectedCourseId === 'all') return null;
    return courses.find(c => c.id === selectedCourseId) || null;
  }, [courses, selectedCourseId]);

  // Filtered registrations
  const filteredRegistrations = useMemo(() => {
    return registrations.filter(reg => {
      if (selectedCourseId !== 'all' && reg.course_id !== selectedCourseId) {
        return false;
      }
      if (selectedStatus !== 'all' && reg.status !== selectedStatus) {
        return false;
      }
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const fullName = `${reg.first_name} ${reg.last_name}`.toLowerCase();
        const email = reg.email.toLowerCase();
        const phone = reg.phone;
        return fullName.includes(q) || email.includes(q) || phone.includes(q);
      }
      return true;
    });
  }, [registrations, selectedCourseId, selectedStatus, searchQuery]);

  // Accepted participants for the active course (for CSV and PDF)
  const acceptedForActiveCourse = useMemo(() => {
    if (selectedCourseId === 'all') {
      return registrations.filter(r => r.status === 'accepted');
    }
    return registrations.filter(
      r => r.course_id === selectedCourseId && r.status === 'accepted'
    );
  }, [registrations, selectedCourseId]);

  // Export CSV Handler (Requirement 3.3)
  const handleExportCSV = () => {
    if (acceptedForActiveCourse.length === 0) {
      alert(locale === 'ar' ? 'لا يوجد مشاركون مقبولون للتصدير.' : 'No accepted participants to export.');
      return;
    }

    const courseName = activeCourse
      ? locale === 'ar'
        ? activeCourse.title_ar
        : activeCourse.title_en
      : 'All_Courses';

    // CSV Headers
    const headers = ['#', 'First Name', 'Last Name', 'Phone Number', 'Email Address', 'Status', 'Registration Date', 'Law 18-07 Consent'];

    // Rows
    const rows = acceptedForActiveCourse.map((r, i) => [
      i + 1,
      `"${r.first_name.replace(/"/g, '""')}"`,
      `"${r.last_name.replace(/"/g, '""')}"`,
      `"${r.phone}"`,
      `"${r.email.replace(/"/g, '""')}"`,
      `"${r.status}"`,
      `"${new Date(r.created_at).toLocaleDateString()}"`,
      `"Verified (${new Date(r.consent_timestamp).toISOString()})"`,
    ]);

    // UTF-8 BOM (\uFEFF) to guarantee Arabic characters display properly in Excel!
    const csvContent =
      '\uFEFF' + [headers.join(','), ...rows.map(row => row.join(','))].join('\r\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    const safeCourseName = courseName.replace(/[^a-zA-Z0-9\u0600-\u06FF_-]/g, '_');
    link.setAttribute('href', url);
    link.setAttribute(
      'download',
      `Accepted_Participants_${safeCourseName}_${new Date().toISOString().split('T')[0]}.csv`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const statusBadge = (status: RegistrationStatus) => {
    switch (status) {
      case 'accepted':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
            <CheckCircle2 className="w-3 h-3" />
            <span>{t('statusAccepted')}</span>
          </span>
        );
      case 'rejected':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-rose-100 text-rose-800 border border-rose-200">
            <XCircle className="w-3 h-3" />
            <span>{t('statusRejected')}</span>
          </span>
        );
      case 'no_response':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-100 text-amber-800 border border-amber-200">
            <HelpCircle className="w-3 h-3" />
            <span>{t('statusNoResponse')}</span>
          </span>
        );
      case 'new':
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-100 text-blue-800 border border-blue-200">
            <Clock className="w-3 h-3" />
            <span>{t('statusNew')}</span>
          </span>
        );
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14 space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-brand-navy text-white mb-2">
            <Users className="w-3.5 h-3.5 text-brand-gold" />
            <span>{locale === 'ar' ? 'سجل المشاركين والتسجيلات' : 'Registrations & Attendance'}</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            {t('regMgmtTitle')}
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            {t('regMgmtSubtitle')}
          </p>
        </div>

        {/* Global Actions */}
        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={fetchData}
            type="button"
            className="p-2.5 bg-white border border-slate-200 rounded-xl text-slate-600 hover:text-brand-navy shadow-xs transition-colors"
            title="Refresh"
          >
            <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
          </button>

          {/* Export to CSV Button (Requirement 3.3) */}
          <button
            onClick={handleExportCSV}
            type="button"
            disabled={acceptedForActiveCourse.length === 0}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold bg-emerald-700 hover:bg-emerald-800 text-white shadow-xs transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <FileSpreadsheet className="w-4 h-4" />
            <span>{t('exportCsv')} ({acceptedForActiveCourse.length})</span>
          </button>

          {/* Generate Attendance Sheet PDF Button (Requirement 3.4) */}
          <button
            onClick={() => {
              if (activeCourse) {
                setAttendanceModalCourse(activeCourse);
              } else if (courses.length > 0) {
                setAttendanceModalCourse(courses[0]);
              }
            }}
            type="button"
            disabled={courses.length === 0}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold bg-brand-navy hover:bg-brand-navyLight text-white shadow-xs transition-colors"
          >
            <Printer className="w-4 h-4 text-brand-gold" />
            <span>{t('printAttendance')}</span>
          </button>
        </div>
      </div>

      {/* Course Specific Stats Banner (if a course is selected) */}
      {activeCourse && (
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-brand-gold block">
              {locale === 'ar' ? 'الورشة المحددة حالياً' : 'Active Course Filter'}
            </span>
            <h3 className="text-lg font-bold text-slate-900 mt-0.5">
              {locale === 'ar' ? activeCourse.title_ar : activeCourse.title_en}
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              {formatDate(activeCourse.date, locale)} • {activeCourse.time} •{' '}
              {locale === 'ar' ? activeCourse.location_ar : activeCourse.location_en}
            </p>
          </div>

          <div className="flex items-center gap-6 shrink-0 bg-slate-50 px-5 py-3 rounded-xl border border-slate-200/80">
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-400 block">
                {t('capacity')}
              </span>
              <span className="text-base font-black text-slate-900">
                {activeCourse.max_seats}
              </span>
            </div>

            <div className="h-7 w-px bg-slate-200" />

            <div>
              <span className="text-[10px] uppercase font-bold text-slate-400 block">
                {t('statusAccepted')}
              </span>
              <span className="text-base font-black text-emerald-700">
                {acceptedForActiveCourse.length}
              </span>
            </div>

            <div className="h-7 w-px bg-slate-200" />

            <div>
              <span className="text-[10px] uppercase font-bold text-slate-400 block">
                {t('seatsAvailable')}
              </span>
              <span className="text-base font-black text-brand-navy">
                {Math.max(0, activeCourse.max_seats - acceptedForActiveCourse.length)}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Filters and Search Bar */}
      <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-xs space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {/* Search Input */}
          <div className="relative">
            <div className="absolute inset-y-0 start-0 ps-3.5 flex items-center pointer-events-none text-slate-400">
              <Search className="w-4 h-4" />
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder={t('searchParticipants')}
              className="w-full ps-10 pe-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50/50 text-slate-900 text-xs sm:text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-gold/40 focus:border-brand-navy"
            />
          </div>

          {/* Filter by Course */}
          <div>
            <select
              value={selectedCourseId}
              onChange={e => setSelectedCourseId(e.target.value)}
              className="w-full px-3 py-2.5 rounded-xl border border-slate-200 bg-slate-50/50 text-slate-800 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-brand-gold/40 focus:border-brand-navy"
            >
              <option value="all">
                {locale === 'ar' ? 'جميع الورشات والدورات' : 'All Courses & Workshops'}
              </option>
              {courses.map(c => (
                <option key={c.id} value={c.id}>
                  {locale === 'ar' ? c.title_ar : c.title_en}
                </option>
              ))}
            </select>
          </div>

          {/* Filter by Status */}
          <div>
            <select
              value={selectedStatus}
              onChange={e => setSelectedStatus(e.target.value)}
              className="w-full px-3 py-2.5 rounded-xl border border-slate-200 bg-slate-50/50 text-slate-800 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-brand-gold/40 focus:border-brand-navy"
            >
              <option value="all">{locale === 'ar' ? 'جميع الحالات' : 'All Statuses'}</option>
              <option value="new">{t('statusNew')}</option>
              <option value="accepted">{t('statusAccepted')}</option>
              <option value="rejected">{t('statusRejected')}</option>
              <option value="no_response">{t('statusNoResponse')}</option>
            </select>
          </div>
        </div>

        <div className="flex items-center justify-between text-xs text-slate-500 pt-1 border-t border-slate-100">
          <span>
            {locale === 'ar'
              ? `عرض ${filteredRegistrations.length} من إجمالي ${registrations.length} تسجيل`
              : `Showing ${filteredRegistrations.length} of ${registrations.length} registrations`}
          </span>

          {(selectedCourseId !== 'all' || selectedStatus !== 'all' || searchQuery) && (
            <button
              onClick={() => {
                setSelectedCourseId('all');
                setSelectedStatus('all');
                setSearchQuery('');
              }}
              type="button"
              className="text-brand-navy hover:underline font-semibold"
            >
              {locale === 'ar' ? 'إعادة ضبط التصفية' : 'Reset filters'}
            </button>
          )}
        </div>
      </div>

      {/* Registrations View Container */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        {/* DESKTOP TABLE */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full text-start border-collapse text-xs sm:text-sm">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold uppercase tracking-wider text-[11px]">
                <th className="py-3 px-4 text-start">Participant</th>
                <th className="py-3 px-4 text-start">Course</th>
                <th className="py-3 px-4 text-start">Phone</th>
                <th className="py-3 px-4 text-start">Email</th>
                <th className="py-3 px-4 text-center">Status</th>
                <th className="py-3 px-4 text-end">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-slate-400">
                    Loading registrations...
                  </td>
                </tr>
              ) : filteredRegistrations.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-slate-400">
                    {t('emptyRegistrations')}
                  </td>
                </tr>
              ) : (
                filteredRegistrations.map(reg => {
                  const courseTitle = reg.course
                    ? locale === 'ar'
                      ? reg.course.title_ar
                      : reg.course.title_en
                    : 'Unknown Course';

                  return (
                    <tr
                      key={reg.id}
                      className="hover:bg-slate-50/80 transition-colors group cursor-pointer"
                      onClick={() => setSelectedParticipant(reg)}
                    >
                      {/* Name */}
                      <td className="py-3.5 px-4">
                        <div className="font-bold text-slate-900">
                          {reg.first_name} {reg.last_name}
                        </div>
                        <div className="text-[10px] text-slate-400 font-mono">
                          {formatDate(reg.created_at, locale)}
                        </div>
                      </td>

                      {/* Course */}
                      <td className="py-3.5 px-4 max-w-xs">
                        <div className="text-xs font-medium text-slate-800 line-clamp-1">
                          {courseTitle}
                        </div>
                      </td>

                      {/* Phone */}
                      <td className="py-3.5 px-4 text-slate-700 font-mono text-xs whitespace-nowrap" dir="ltr">
                        {reg.phone}
                      </td>

                      {/* Email */}
                      <td className="py-3.5 px-4 text-slate-600 font-mono text-xs max-w-[180px] truncate" dir="ltr">
                        {reg.email}
                      </td>

                      {/* Status */}
                      <td
                        className="py-3.5 px-4 text-center"
                        onClick={e => e.stopPropagation()}
                      >
                        <select
                          value={reg.status}
                          onChange={e =>
                            handleUpdateStatus(reg.id, e.target.value as RegistrationStatus)
                          }
                          className="px-2.5 py-1 text-xs font-bold rounded-lg border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-brand-gold/30 cursor-pointer"
                        >
                          <option value="new">{t('statusNew')}</option>
                          <option value="accepted">{t('statusAccepted')}</option>
                          <option value="rejected">{t('statusRejected')}</option>
                          <option value="no_response">{t('statusNoResponse')}</option>
                        </select>
                      </td>

                      {/* Actions */}
                      <td
                        className="py-3.5 px-4 text-end"
                        onClick={e => e.stopPropagation()}
                      >
                        <button
                          onClick={() => setSelectedParticipant(reg)}
                          type="button"
                          className="p-1.5 text-slate-500 hover:text-brand-navy hover:bg-slate-100 rounded-lg transition-colors"
                          title={t('participantDetails')}
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* MOBILE VIEW: Cards */}
        <div className="block md:hidden divide-y divide-slate-100">
          {loading ? (
            <div className="p-6 text-center text-slate-400 text-xs">Loading registrations...</div>
          ) : filteredRegistrations.length === 0 ? (
            <div className="p-8 text-center text-slate-400 text-xs">{t('emptyRegistrations')}</div>
          ) : (
            filteredRegistrations.map(reg => {
              const courseTitle = reg.course
                ? locale === 'ar'
                  ? reg.course.title_ar
                  : reg.course.title_en
                : 'Unknown Course';

              return (
                <div
                  key={reg.id}
                  onClick={() => setSelectedParticipant(reg)}
                  className="p-4 space-y-2.5 cursor-pointer active:bg-slate-50 transition-colors"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h4 className="font-bold text-sm text-slate-900">
                        {reg.first_name} {reg.last_name}
                      </h4>
                      <p className="text-xs text-brand-navy font-medium line-clamp-1 mt-0.5">
                        {courseTitle}
                      </p>
                    </div>

                    <div onClick={e => e.stopPropagation()}>
                      {statusBadge(reg.status)}
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-500 font-mono" dir="ltr">
                    <span>{reg.phone}</span>
                    <span>•</span>
                    <span className="truncate max-w-[200px]">{reg.email}</span>
                  </div>

                  {/* Status quick changer on mobile */}
                  <div
                    className="pt-2 border-t border-slate-100 flex items-center justify-between gap-2"
                    onClick={e => e.stopPropagation()}
                  >
                    <span className="text-[11px] text-slate-400">
                      {formatDate(reg.created_at, locale)}
                    </span>

                    <select
                      value={reg.status}
                      onChange={e =>
                        handleUpdateStatus(reg.id, e.target.value as RegistrationStatus)
                      }
                      className="px-2.5 py-1 text-xs font-bold rounded-lg border border-slate-200 bg-white"
                    >
                      <option value="new">{t('statusNew')}</option>
                      <option value="accepted">{t('statusAccepted')}</option>
                      <option value="rejected">{t('statusRejected')}</option>
                      <option value="no_response">{t('statusNoResponse')}</option>
                    </select>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Attendance Sheet Print Modal */}
      {attendanceModalCourse && (
        <AttendanceSheetModal
          course={attendanceModalCourse}
          participants={registrations.filter(
            r => r.course_id === attendanceModalCourse.id && r.status === 'accepted'
          )}
          onClose={() => setAttendanceModalCourse(null)}
        />
      )}

      {/* Participant Details Modal */}
      {selectedParticipant && (
        <ParticipantDetailsModal
          registration={selectedParticipant}
          onClose={() => setSelectedParticipant(null)}
          onStatusChanged={handleUpdateStatus}
        />
      )}
    </div>
  );
}

export default function RegistrationManagementPage() {
  return (
    <Suspense
      fallback={
        <div className="max-w-7xl mx-auto px-4 py-16 space-y-6">
          <div className="h-8 w-64 bg-slate-200 rounded animate-pulse" />
          <div className="h-64 bg-slate-100 rounded-2xl animate-pulse" />
        </div>
      }
    >
      <RegistrationManagementContent />
    </Suspense>
  );
}
