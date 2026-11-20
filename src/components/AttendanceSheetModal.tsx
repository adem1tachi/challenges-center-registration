'use client';

import React, { useRef, useState } from 'react';
import Image from 'next/image';
import { Course, Registration } from '@/types';
import { useLanguage } from '@/lib/i18n/LanguageContext';
import { formatDate } from '@/lib/utils';
import { Download, Printer, X, Loader2, CheckCircle } from 'lucide-react';
import { exportElementToPdf } from '@/lib/pdf-export';

interface AttendanceSheetModalProps {
  course: Course;
  participants: Registration[];
  onClose: () => void;
}

export default function AttendanceSheetModal({
  course,
  participants,
  onClose,
}: AttendanceSheetModalProps) {
  const { t, locale, isRtl } = useLanguage();
  const printAreaRef = useRef<HTMLDivElement>(null);
  const [downloading, setDownloading] = useState(false);
  const [downloadSuccess, setDownloadSuccess] = useState(false);

  const courseTitle = course.title;
  const courseLocation = course.location;
  const generationDate = new Date().toLocaleString(locale === 'ar' ? 'ar-DZ' : 'fr-FR', {
    dateStyle: 'medium',
    timeStyle: 'short',
  });

  const handleDownloadPdf = async () => {
    if (!printAreaRef.current || downloading) return;
    setDownloading(true);
    setDownloadSuccess(false);

    try {
      const safeTitle = courseTitle
        .replace(/[^a-zA-Z0-9\u0600-\u06FF_-]/g, '_')
        .substring(0, 35);
      const filename = `Feuille_Presence_${safeTitle}_${course.date}.pdf`;
      await exportElementToPdf(printAreaRef.current, filename);
      setDownloadSuccess(true);
      setTimeout(() => setDownloadSuccess(false), 3000);
    } catch (err) {
      console.error('Failed to export PDF:', err);
      // Fallback to native print dialog
      window.print();
    } finally {
      setDownloading(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-2 sm:p-4 md:p-6 overflow-y-auto">
      {/* Control Bar - Responsive & Compact */}
      <div className="fixed top-3 inset-x-3 sm:inset-x-auto sm:end-4 z-50 flex items-center justify-between sm:justify-end gap-2 print:hidden bg-white/95 backdrop-blur px-3 py-2 rounded-2xl shadow-xl border border-neutral-200">
        <div className="flex items-center gap-2">
          {/* Direct PDF Download Button */}
          <button
            onClick={handleDownloadPdf}
            disabled={downloading}
            type="button"
            className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-ruby-700 hover:bg-ruby-800 disabled:opacity-60 text-white rounded-xl text-xs sm:text-sm font-bold shadow-sm transition-all"
          >
            {downloading ? (
              <Loader2 className="w-4 h-4 animate-spin text-white" />
            ) : downloadSuccess ? (
              <CheckCircle className="w-4 h-4 text-emerald-300" />
            ) : (
              <Download className="w-4 h-4 text-white" />
            )}
            <span>{downloading ? (locale === 'ar' ? 'جاري التحميل...' : 'Downloading...') : t('printBtn')}</span>
          </button>

          {/* Quick Print Button */}
          <button
            onClick={handlePrint}
            type="button"
            className="inline-flex items-center gap-1.5 px-3 py-2 bg-neutral-100 hover:bg-neutral-200 text-neutral-800 rounded-xl text-xs sm:text-sm font-semibold transition-colors"
            title={locale === 'ar' ? 'طباعة مباشرة' : 'Direct Print'}
          >
            <Printer className="w-4 h-4 text-neutral-600" />
            <span className="hidden sm:inline">{t('quickPrint')}</span>
          </button>
        </div>

        <button
          onClick={onClose}
          type="button"
          className="p-2 text-neutral-500 hover:text-neutral-900 hover:bg-neutral-100 rounded-xl transition-colors"
          title={t('closeBtn')}
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Printable Sheet Container */}
      <div className="w-full max-w-4xl my-14 sm:my-10 overflow-x-auto">
        <div
          ref={printAreaRef}
          id="attendance-print-area"
          className="bg-white mx-auto w-full min-w-[720px] max-w-[850px] shadow-2xl p-6 sm:p-10 text-neutral-900 font-sans print:shadow-none print:m-0 print:p-6 print:max-w-none print:w-full print:rounded-none"
          dir={isRtl ? 'rtl' : 'ltr'}
        >
          {/* Formal Official Header */}
          <div className="border-b-2 border-neutral-900 pb-4 mb-5">
            <div className="flex items-center justify-between gap-4">
              {/* EIC Club Logo */}
              <div className="w-16 h-16 flex items-center justify-center shrink-0">
                <Image
                  src="/images/Eic logo.png"
                  alt="EIC Club"
                  width={64}
                  height={64}
                  className="object-contain max-h-16 w-auto"
                  priority
                />
              </div>

              {/* Institutional Headings */}
              <div className="text-center flex-1 px-2">
                <div className="text-[11px] font-bold text-neutral-600 tracking-wider uppercase mb-0.5">
                  الجمهورية الجزائرية الديمقراطية الشعبية
                </div>
                <div className="text-[11px] font-bold text-neutral-700">
                  المدرسة الوطنية العليا للإحصاء والاقتصاد التطبيقي (ENSSEA)
                </div>
                <div className="text-xs font-black text-ruby-800 mt-1">
                  شراكة تدريبية: Challenges Center × Club EIC
                </div>
                <div className="text-sm sm:text-base font-black text-neutral-900 uppercase tracking-wide mt-0.5">
                  سجل توقيع الحضور الرسمي • Feuille d&apos;Émargement
                </div>
              </div>

              {/* Challenges Center Logo */}
              <div className="w-28 h-14 flex items-center justify-end shrink-0">
                <Image
                  src="/images/challenges-center-logo.png"
                  alt="Challenges Center"
                  width={112}
                  height={44}
                  className="object-contain max-h-14 w-auto"
                  priority
                />
              </div>
            </div>
          </div>

          {/* Workshop Metadata Box - Clean, Formal & Minimalist */}
          <div className="border border-neutral-300 rounded-lg p-3.5 mb-5 bg-neutral-50/60 text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2">
              <div className="col-span-full">
                <span className="font-bold text-neutral-600 inline-block me-2">الدورة / Formation :</span>
                <span className="font-black text-sm text-neutral-900">{courseTitle}</span>
              </div>

              <div>
                <span className="font-bold text-neutral-600 inline-block me-2">المؤطر / Formateur :</span>
                <span className="font-bold text-neutral-800">{course.instructor_name || '—'}</span>
              </div>

              <div>
                <span className="font-bold text-neutral-600 inline-block me-2">التاريخ والتوقيت :</span>
                <span className="font-bold text-neutral-800">
                  {formatDate(course.date, locale)} | {course.time}
                </span>
              </div>

              <div>
                <span className="font-bold text-neutral-600 inline-block me-2">الصيغة والقاعة :</span>
                <span className="font-bold text-neutral-800">
                  {course.delivery_mode === 'in_person' ? 'حضوري' : 'عبر الإنترنت'} — {courseLocation}
                </span>
              </div>

              <div>
                <span className="font-bold text-neutral-600 inline-block me-2">عدد المقبولين :</span>
                <span className="font-black text-neutral-900">
                  {participants.length} مشارك (من أصل {course.max_seats} مقعد)
                </span>
              </div>
            </div>
          </div>

          {/* Formal Attendance Roster Table */}
          <div className="mb-6">
            <table className="w-full text-start border-collapse border border-neutral-400 text-xs">
              <thead>
                <tr className="bg-neutral-100 text-neutral-900 font-bold border-b border-neutral-400 text-[11px]">
                  <th className="py-2 px-2 text-center w-10 border-e border-neutral-300">#</th>
                  <th className="py-2 px-3 text-start border-e border-neutral-300">الاسم واللقب / Nom & Prénom</th>
                  <th className="py-2 px-3 text-start border-e border-neutral-300 w-32">الهاتف / Tél</th>
                  <th className="py-2 px-3 text-start border-e border-neutral-300">البريد الإلكتروني / Email</th>
                  <th className="py-2 px-3 text-center w-36 border-neutral-300">التوقيع / Émargement</th>
                </tr>
              </thead>
              <tbody>
                {participants.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="py-8 text-center text-neutral-500 font-medium">
                      {locale === 'ar'
                        ? 'لا يوجد مشاركون مقبولون مسجلون في هذه الدورة حتى الآن.'
                        : 'Aucun participant accepté pour le moment dans cette formation.'}
                    </td>
                  </tr>
                ) : (
                  participants.map((reg, index) => (
                    <tr key={reg.id} className="border-b border-neutral-300">
                      <td className="py-2.5 px-2 font-bold text-neutral-700 text-center border-e border-neutral-300">
                        {index + 1}
                      </td>
                      <td className="py-2.5 px-3 font-bold text-neutral-900 border-e border-neutral-300">
                        {reg.first_name} {reg.last_name}
                      </td>
                      <td className="py-2.5 px-3 font-mono text-neutral-800 border-e border-neutral-300" dir="ltr">
                        {reg.phone}
                      </td>
                      <td className="py-2.5 px-3 font-mono text-neutral-700 border-e border-neutral-300 truncate max-w-[190px]" dir="ltr">
                        {reg.email}
                      </td>
                      {/* Manual Physical Signature Box */}
                      <td className="py-1 px-2 text-center align-middle h-10 border-neutral-300 bg-neutral-50/30">
                        <div className="w-full h-8 border border-dashed border-neutral-300 rounded flex items-center justify-center text-[9px] text-neutral-400 print:text-transparent">
                          {locale === 'ar' ? 'توقيع' : 'Émargement'}
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Official Signatures & Administrative Stamp Section */}
          <div className="grid grid-cols-2 gap-6 my-6 pt-2 text-xs">
            <div className="border border-neutral-300 rounded-lg p-3 min-h-[95px] flex flex-col justify-between">
              <span className="font-bold text-neutral-800 text-[11px] block">
                توقيع المؤطر / المدرب (Signature du Formateur) :
              </span>
              <div className="text-[10px] text-neutral-400 text-end">التوقيع : __________________</div>
            </div>

            <div className="border border-neutral-300 rounded-lg p-3 min-h-[95px] flex flex-col justify-between">
              <span className="font-bold text-neutral-800 text-[11px] block">
                ختم وتأشيرة الإدارة (Visa & Cachet de l&apos;Administration) :
              </span>
              <div className="text-[10px] text-neutral-400 text-end">الختم والتاريخ : ______________</div>
            </div>
          </div>

          {/* Formal Official Footer */}
          <div className="border-t border-neutral-300 pt-3 flex items-center justify-between text-[10px] text-neutral-500">
            <div>
              <span>تاريخ استخراج الوثيقة: </span>
              <span className="font-bold text-neutral-700">{generationDate}</span>
            </div>

            <div className="font-bold text-neutral-700">
              وثيقة حضور رسمية صادرة عن مركز تشالنجز بالتعاون مع Club EIC
            </div>

            <div>
              <span>صفحة 1 من 1</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
