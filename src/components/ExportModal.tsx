'use client';

import React, { useState, useMemo, useRef } from 'react';
import { Course, Registration } from '@/types';
import { useLanguage } from '@/lib/i18n/LanguageContext';
import { formatDate } from '@/lib/utils';
import { exportElementToPdf } from '@/lib/pdf-export';
import {
  Download,
  FileSpreadsheet,
  FileText,
  X,
  Loader2,
  CheckCircle,
  Eye,
  Layers,
} from 'lucide-react';
import Image from 'next/image';

interface ExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  courses: Course[];
  registrations: Registration[];
  initialFormat?: 'pdf' | 'csv';
  initialCourseId?: string;
  onOpenAttendancePreview?: (course: Course, participants: Registration[]) => void;
}

export default function ExportModal({
  isOpen,
  onClose,
  courses,
  registrations,
  initialFormat = 'pdf',
  initialCourseId = 'all',
  onOpenAttendancePreview,
}: ExportModalProps) {
  const { t, locale, isRtl } = useLanguage();

  const [format, setFormat] = useState<'pdf' | 'csv'>(initialFormat);
  const [selectedCourseId, setSelectedCourseId] = useState<string>(initialCourseId);
  const [statusFilter, setStatusFilter] = useState<'accepted' | 'all'>('accepted');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  // Hidden container ref used for multi-page batch PDF export
  const batchPdfContainerRef = useRef<HTMLDivElement>(null);

  // Filter registrations matching user selection
  const matchingRegistrations = useMemo(() => {
    return registrations.filter(r => {
      if (selectedCourseId !== 'all' && r.course_id !== selectedCourseId) {
        return false;
      }
      if (statusFilter === 'accepted' && r.status !== 'accepted') {
        return false;
      }
      return true;
    });
  }, [registrations, selectedCourseId, statusFilter]);

  // Selected course object (if any)
  const selectedCourse = useMemo(() => {
    if (selectedCourseId === 'all') return null;
    return courses.find(c => c.id === selectedCourseId) || null;
  }, [courses, selectedCourseId]);

  if (!isOpen) return null;

  // Handle CSV Export
  const handleExportCSV = () => {
    if (matchingRegistrations.length === 0) return;

    setLoading(true);
    try {
      const isAll = selectedCourseId === 'all';
      const filename = isAll
        ? `Toutes_Formations_Participants_${new Date().toISOString().split('T')[0]}.csv`
        : `Participants_${(selectedCourse?.title || 'Course').replace(/[^a-zA-Z0-9\u0600-\u06FF_-]/g, '_').substring(0, 30)}_${new Date().toISOString().split('T')[0]}.csv`;

      const headers = isAll
        ? ['#', 'Formation / Course', 'Nom', 'Prénom', 'Date de Naissance', 'Université', 'Année d\'étude', 'Téléphone', 'Email', 'Statut', 'Date Inscription']
        : ['#', 'Nom', 'Prénom', 'Date de Naissance', 'Université', 'Année d\'étude', 'Téléphone', 'Email', 'Statut', 'Date Inscription'];

      const rows = matchingRegistrations.map((r, i) => {
        const course = courses.find(c => c.id === r.course_id);
        const courseName = course ? course.title : '';
        const birthDate = r.birth_date || '';
        const univ = r.university || '';
        const year = r.academic_year || '';

        if (isAll) {
          return [
            i + 1,
            `"${courseName.replace(/"/g, '""')}"`,
            `"${r.last_name.replace(/"/g, '""')}"`,
            `"${r.first_name.replace(/"/g, '""')}"`,
            `"${birthDate}"`,
            `"${univ.replace(/"/g, '""')}"`,
            `"${year.replace(/"/g, '""')}"`,
            `"${r.phone}"`,
            `"${r.email.replace(/"/g, '""')}"`,
            `"${r.status}"`,
            `"${new Date(r.created_at).toLocaleDateString()}"`,
          ];
        }
        return [
          i + 1,
          `"${r.last_name.replace(/"/g, '""')}"`,
          `"${r.first_name.replace(/"/g, '""')}"`,
          `"${birthDate}"`,
          `"${univ.replace(/"/g, '""')}"`,
          `"${year.replace(/"/g, '""')}"`,
          `"${r.phone}"`,
          `"${r.email.replace(/"/g, '""')}"`,
          `"${r.status}"`,
          `"${new Date(r.created_at).toLocaleDateString()}"`,
        ];
      });

      const csvContent = '\uFEFF' + [headers.join(','), ...rows.map(row => row.join(','))].join('\r\n');
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.setAttribute('href', url);
      link.setAttribute('download', filename);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      setSuccess(true);
      setTimeout(() => {
        setSuccess(false);
        onClose();
      }, 1200);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Handle PDF Export
  const handleExportPDF = async () => {
    if (matchingRegistrations.length === 0) return;

    // If single course, open the attendance preview or download directly
    if (selectedCourse) {
      if (onOpenAttendancePreview) {
        onClose();
        onOpenAttendancePreview(selectedCourse, matchingRegistrations);
        return;
      }
    }

    // If "All Courses" selected for PDF:
    if (batchPdfContainerRef.current) {
      setLoading(true);
      try {
        const filename = `Feuilles_Presence_Toutes_Formations_${new Date().toISOString().split('T')[0]}.pdf`;
        await exportElementToPdf(batchPdfContainerRef.current, filename);
        setSuccess(true);
        setTimeout(() => {
          setSuccess(false);
          onClose();
        }, 1200);
      } catch (err) {
        console.error('Batch PDF generation failed:', err);
      } finally {
        setLoading(false);
      }
    }
  };

  const handleDownload = () => {
    if (format === 'csv') {
      handleExportCSV();
    } else {
      handleExportPDF();
    }
  };

  // Group registrations by course for batch rendering
  const batchCoursesWithRegistrations = useMemo(() => {
    if (selectedCourseId !== 'all') {
      const course = courses.find(c => c.id === selectedCourseId);
      return course ? [{ course, regs: matchingRegistrations }] : [];
    }
    return courses
      .map(c => {
        const regs = matchingRegistrations.filter(r => r.course_id === c.id);
        return { course: c, regs };
      })
      .filter(item => item.regs.length > 0);
  }, [courses, selectedCourseId, matchingRegistrations]);

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div
        className="bg-white w-full max-w-lg rounded-2xl sm:rounded-3xl shadow-2xl border border-neutral-200 overflow-hidden my-4 sm:my-8 text-neutral-900 transition-all animate-in fade-in zoom-in-95"
        dir={isRtl ? 'rtl' : 'ltr'}
      >
        {/* Header - Compact */}
        <div className="bg-neutral-50 px-5 py-4 border-b border-neutral-200 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-ruby-700 text-white flex items-center justify-center shadow-xs">
              <Download className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-sm sm:text-base text-neutral-900">
                {locale === 'ar' ? 'إعدادات التحميل' : 'Download Settings'}
              </h3>
              <p className="text-[11px] text-neutral-500">
                {locale === 'ar' ? 'تصدير قوائم الحضور والمسجلين' : 'Export attendance and participant rosters'}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            type="button"
            className="p-1.5 text-neutral-400 hover:text-neutral-700 hover:bg-neutral-200/60 rounded-xl transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Form Body */}
        <div className="p-5 sm:p-6 space-y-4 text-xs sm:text-sm">
          {/* 1. Format Selection (PDF vs CSV) */}
          <div>
            <label className="block text-xs font-bold text-neutral-700 uppercase tracking-wider mb-2">
              {locale === 'ar' ? 'صيغة الملف:' : 'File Format:'}
            </label>
            <div className="grid grid-cols-2 gap-2.5">
              <button
                type="button"
                onClick={() => setFormat('pdf')}
                className={`flex items-center justify-center gap-2 py-3 px-3 rounded-xl border text-xs sm:text-sm font-bold transition-all ${
                  format === 'pdf'
                    ? 'bg-ruby-50 border-ruby-700 text-ruby-800 shadow-2xs'
                    : 'bg-white border-neutral-200 text-neutral-600 hover:bg-neutral-50'
                }`}
              >
                <FileText className={`w-4 h-4 ${format === 'pdf' ? 'text-ruby-700' : 'text-neutral-400'}`} />
                <span>PDF (ورقة الحضور)</span>
              </button>

              <button
                type="button"
                onClick={() => setFormat('csv')}
                className={`flex items-center justify-center gap-2 py-3 px-3 rounded-xl border text-xs sm:text-sm font-bold transition-all ${
                  format === 'csv'
                    ? 'bg-emerald-50 border-emerald-700 text-emerald-800 shadow-2xs'
                    : 'bg-white border-neutral-200 text-neutral-600 hover:bg-neutral-50'
                }`}
              >
                <FileSpreadsheet className={`w-4 h-4 ${format === 'csv' ? 'text-emerald-700' : 'text-neutral-400'}`} />
                <span>CSV (ملف إكسل)</span>
              </button>
            </div>
          </div>

          {/* 2. Course Selection Dropdown */}
          <div>
            <label className="block text-xs font-bold text-neutral-700 uppercase tracking-wider mb-1.5">
              {locale === 'ar' ? 'تحديد الدورة:' : 'Select Workshop:'}
            </label>
            <div className="relative">
              <select
                value={selectedCourseId}
                onChange={e => setSelectedCourseId(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl border border-neutral-300 bg-white text-neutral-900 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-ruby-700/20 focus:border-ruby-700"
              >
                <option value="all">
                  🌟 {locale === 'ar' ? 'جميع الدورات (تحميل الكل)' : 'All Workshops (Download All)'}
                </option>
                {courses.map(c => {
                  const regCount = registrations.filter(r => r.course_id === c.id && (statusFilter === 'all' || r.status === 'accepted')).length;
                  return (
                    <option key={c.id} value={c.id}>
                      {c.title} ({c.date} • {regCount} مسجل)
                    </option>
                  );
                })}
              </select>
            </div>
          </div>

          {/* 3. Status Filter (Accepted vs All) */}
          <div>
            <label className="block text-xs font-bold text-neutral-700 uppercase tracking-wider mb-1.5">
              {locale === 'ar' ? 'حالة المشاركين:' : 'Participant Status:'}
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setStatusFilter('accepted')}
                className={`py-2 px-3 rounded-xl border text-xs font-semibold transition-all ${
                  statusFilter === 'accepted'
                    ? 'bg-neutral-900 border-neutral-900 text-white'
                    : 'bg-white border-neutral-200 text-neutral-700 hover:bg-neutral-50'
                }`}
              >
                {locale === 'ar' ? 'المقبولون فقط (للحضور)' : 'Accepted Only'}
              </button>

              <button
                type="button"
                onClick={() => setStatusFilter('all')}
                className={`py-2 px-3 rounded-xl border text-xs font-semibold transition-all ${
                  statusFilter === 'all'
                    ? 'bg-neutral-900 border-neutral-900 text-white'
                    : 'bg-white border-neutral-200 text-neutral-700 hover:bg-neutral-50'
                }`}
              >
                {locale === 'ar' ? 'جميع الحالات' : 'All Registrations'}
              </button>
            </div>
          </div>

          {/* Summary Banner */}
          <div className="bg-neutral-50 rounded-xl p-3 border border-neutral-200 flex items-center justify-between text-xs">
            <span className="text-neutral-600">
              {locale === 'ar' ? 'إجمالي المشاركين المؤهلين:' : 'Total Matching Participants:'}
            </span>
            <span className="font-black text-ruby-700 text-sm">
              {matchingRegistrations.length} {locale === 'ar' ? 'مشارك' : 'attendees'}
            </span>
          </div>
        </div>

        {/* Footer Actions - Short & Mobile Responsive */}
        <div className="bg-neutral-50 px-5 py-3.5 border-t border-neutral-200 flex flex-wrap items-center justify-end gap-2">
          {/* Optional Preview button when PDF & single course */}
          {format === 'pdf' && selectedCourse && onOpenAttendancePreview && (
            <button
              onClick={() => {
                onClose();
                onOpenAttendancePreview(selectedCourse, matchingRegistrations);
              }}
              type="button"
              className="inline-flex items-center justify-center gap-1.5 px-3.5 py-2.5 bg-neutral-200 hover:bg-neutral-300 text-neutral-800 rounded-xl text-xs font-bold transition-colors"
            >
              <Eye className="w-4 h-4 text-neutral-600" />
              <span>{locale === 'ar' ? 'معاينة' : 'Preview'}</span>
            </button>
          )}

          <button
            onClick={onClose}
            type="button"
            className="px-4 py-2.5 text-xs font-semibold text-neutral-600 hover:text-neutral-900 rounded-xl hover:bg-neutral-100 transition-colors"
          >
            {locale === 'ar' ? 'إلغاء' : 'Cancel'}
          </button>

          <button
            onClick={handleDownload}
            disabled={loading || matchingRegistrations.length === 0}
            type="button"
            className={`inline-flex items-center justify-center gap-1.5 px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold text-white shadow-sm transition-all disabled:opacity-50 disabled:cursor-not-allowed ${
              format === 'csv'
                ? 'bg-emerald-700 hover:bg-emerald-800'
                : 'bg-ruby-700 hover:bg-ruby-800'
            }`}
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin text-white" />
                <span>{locale === 'ar' ? 'جاري التحضير...' : 'Processing...'}</span>
              </>
            ) : success ? (
              <>
                <CheckCircle className="w-4 h-4 text-emerald-300" />
                <span>{locale === 'ar' ? 'تم التحميل' : 'Downloaded'}</span>
              </>
            ) : (
              <>
                <Download className="w-4 h-4 text-white" />
                <span>
                  {format === 'csv'
                    ? (locale === 'ar' ? 'تحميل CSV' : 'Download CSV')
                    : (locale === 'ar' ? 'تحميل PDF' : 'Download PDF')}
                </span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Hidden Off-Screen Container for Generating Batch Multi-page PDF */}
      <div className="fixed -left-[9999px] top-0 pointer-events-none opacity-0">
        <div ref={batchPdfContainerRef} className="w-[800px] bg-white p-8 font-sans text-neutral-900" dir="rtl">
          {batchCoursesWithRegistrations.map(({ course, regs }, idx) => (
            <div key={course.id} className={idx > 0 ? 'mt-12 pt-8 border-t-2 border-dashed border-neutral-400' : ''}>
              {/* Batch Sheet Header */}
              <div className="border-b-2 border-neutral-900 pb-3 mb-4 flex items-center justify-between">
                <div className="w-14 h-14 flex items-center justify-center">
                  <Image src="/images/Eic logo.png" alt="EIC" width={56} height={56} className="object-contain" priority />
                </div>
                <div className="text-center flex-1">
                  <div className="text-[10px] font-bold text-neutral-600">المدرسة الوطنية العليا للإحصاء والاقتصاد التطبيقي (ENSSEA)</div>
                  <div className="text-xs font-black text-ruby-800">سجل توقيع الحضور الرسمي • Challenges Center × Club EIC</div>
                </div>
                <div className="w-24 h-12 flex items-center justify-end">
                  <Image src="/images/challenges-center-logo.png" alt="Challenges" width={96} height={38} className="object-contain" priority />
                </div>
              </div>

              {/* Course Info */}
              <div className="border border-neutral-300 rounded p-2.5 mb-3 bg-neutral-50 text-xs">
                <div className="font-bold text-neutral-900 text-sm mb-1">{course.title}</div>
                <div className="text-neutral-700 text-[11px]">
                  المؤطر: {course.instructor_name} | التاريخ: {formatDate(course.date, 'ar')} ({course.time}) | القاعة: {course.location} | المقبولون: {regs.length}
                </div>
              </div>

              {/* Table */}
              <table className="w-full border-collapse border border-neutral-400 text-xs mb-4">
                <thead>
                  <tr className="bg-neutral-100 text-neutral-900 border-b border-neutral-400 text-[11px]">
                    <th className="py-1.5 px-2 text-center w-8 border-e border-neutral-300">#</th>
                    <th className="py-1.5 px-2 text-start border-e border-neutral-300">الاسم واللقب</th>
                    <th className="py-1.5 px-2 text-start border-e border-neutral-300 w-28">الهاتف</th>
                    <th className="py-1.5 px-2 text-start border-e border-neutral-300">البريد الإلكتروني</th>
                    <th className="py-1.5 px-2 text-center w-32 border-neutral-300">التوقيع</th>
                  </tr>
                </thead>
                <tbody>
                  {regs.map((r, i) => (
                    <tr key={r.id} className="border-b border-neutral-300">
                      <td className="py-1.5 px-2 text-center border-e border-neutral-300 font-bold">{i + 1}</td>
                      <td className="py-1.5 px-2 font-bold border-e border-neutral-300">{r.first_name} {r.last_name}</td>
                      <td className="py-1.5 px-2 font-mono border-e border-neutral-300" dir="ltr">{r.phone}</td>
                      <td className="py-1.5 px-2 font-mono border-e border-neutral-300" dir="ltr">{r.email}</td>
                      <td className="py-1 px-2 border-neutral-300 h-8">
                        <div className="w-full h-6 border border-dashed border-neutral-300 rounded" />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {/* Signatures */}
              <div className="grid grid-cols-2 gap-4 text-[10px] mt-2 mb-4">
                <div className="border border-neutral-300 p-2 rounded">توقيع المؤطر: ____________________</div>
                <div className="border border-neutral-300 p-2 rounded">ختم وتأشيرة الإدارة: ______________</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
