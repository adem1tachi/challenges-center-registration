'use client';

import React from 'react';
import Image from 'next/image';
import { Course, Registration } from '@/types';
import { useLanguage } from '@/lib/i18n/LanguageContext';
import { formatDate } from '@/lib/utils';
import { Printer, X, ShieldCheck } from 'lucide-react';

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

  const courseTitle = course.title;
  const courseLocation = course.location;
  const generationDate = new Date().toLocaleString(locale === 'ar' ? 'ar-DZ' : 'en-US', {
    dateStyle: 'medium',
    timeStyle: 'short',
  });

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 bg-ruby-950/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
      {/* Control Bar (Hidden in Print) */}
      <div className="fixed top-4 end-4 z-50 flex items-center gap-2 print:hidden bg-white/95 backdrop-blur p-2 rounded-2xl shadow-xl border border-beige-300">
        <button
          onClick={handlePrint}
          type="button"
          className="inline-flex items-center gap-2 px-4 py-2 bg-ruby-700 hover:bg-ruby-800 text-beige-50 rounded-xl text-sm font-bold shadow-md shadow-ruby-900/20 transition-all"
        >
          <Printer className="w-4 h-4 text-beige-200" />
          <span>{t('printBtn')}</span>
        </button>

        <button
          onClick={onClose}
          type="button"
          className="p-2 text-beige-600 hover:text-beige-900 hover:bg-beige-100 rounded-xl transition-colors"
          title={t('closeBtn')}
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Printable Sheet Container */}
      <div
        id="attendance-print-area"
        className="bg-white w-full max-w-4xl rounded-2xl shadow-2xl p-6 sm:p-10 my-8 text-beige-900 font-sans print:shadow-none print:m-0 print:p-4 print:max-w-none print:w-full print:rounded-none"
        dir={isRtl ? 'rtl' : 'ltr'}
      >
        {/* Printable Header */}
        <div className="border-b-2 border-ruby-950 pb-5 mb-6">
          <div className="flex items-center justify-between gap-4 mb-4">
            {/* Logos */}
            <div className="flex items-center gap-3">
              <div className="w-14 h-14 rounded-full border border-beige-300 p-1 flex items-center justify-center bg-white shadow-xs">
                <Image
                  src="/images/salon-emploi-logo.png"
                  alt="Salon de l'Emploi"
                  width={48}
                  height={48}
                  className="object-contain"
                />
              </div>

              <div className="h-8 w-px bg-beige-300" />

              <div className="h-10 w-32 flex items-center">
                <Image
                  src="/images/challenges-center-logo.png"
                  alt="Salon"
                  width={128}
                  height={40}
                  className="object-contain"
                />
              </div>
            </div>

            {/* Event & Document Label */}
            <div className="text-end">
              <span className="inline-block px-3 py-1 bg-ruby-700 text-beige-50 text-xs font-bold rounded uppercase tracking-wider mb-1">
                {t('salonBranding')}
              </span>
              <p className="text-xs text-beige-600 font-medium">
                {locale === 'ar' ? 'سجل الحضور الرسمي والتوقيعات' : 'Official Attendance & Signature Roster'}
              </p>
            </div>
          </div>

          {/* Title and Course Details */}
          <div className="bg-beige-50/70 border border-beige-300 rounded-xl p-4">
            <h1 className="text-xl sm:text-2xl font-black text-beige-900 mb-2">
              {courseTitle}
            </h1>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs text-beige-800">
              <div>
                <span className="font-semibold block text-beige-600 uppercase tracking-wider text-[10px]">
                  {t('dateAndTime')}
                </span>
                <span className="font-bold">{formatDate(course.date, locale)} ({course.time})</span>
              </div>

              <div>
                <span className="font-semibold block text-beige-600 uppercase tracking-wider text-[10px]">
                  {t('deliveryFormat')}
                </span>
                <span className="font-bold">
                  {course.delivery_mode === 'in_person' ? t('formatInPerson') : t('formatOnline')}
                </span>
              </div>

              <div>
                <span className="font-semibold block text-beige-600 uppercase tracking-wider text-[10px]">
                  {t('locationVenue')}
                </span>
                <span className="font-bold truncate block">{courseLocation}</span>
              </div>

              <div>
                <span className="font-semibold block text-beige-600 uppercase tracking-wider text-[10px]">
                  {t('acceptedParticipants')}
                </span>
                <span className="font-bold text-emerald-700">
                  {participants.length} / {course.max_seats}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Participants Table */}
        <div className="overflow-x-auto mb-6">
          <table className="w-full text-start border-collapse text-xs sm:text-sm">
            <thead>
              <tr className="bg-beige-100 text-beige-900 border-y-2 border-ruby-950 font-bold uppercase tracking-wider">
                <th className="py-2.5 px-3 text-start w-12 border-e border-beige-300">{t('colNumber')}</th>
                <th className="py-2.5 px-3 text-start border-e border-beige-300">{t('colFullName')}</th>
                <th className="py-2.5 px-3 text-start border-e border-beige-300">{t('colPhone')}</th>
                <th className="py-2.5 px-3 text-start border-e border-beige-300">{t('colEmail')}</th>
                <th className="py-2.5 px-3 text-center w-36 sm:w-44">{t('colSignature')}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-beige-200">
              {participants.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-8 text-center text-beige-500">
                    {locale === 'ar' ? 'لا يوجد مشاركون مقبولون بعد في هذه الورشة.' : 'No accepted participants yet for this course.'}
                  </td>
                </tr>
              ) : (
                participants.map((reg, index) => (
                  <tr key={reg.id} className="hover:bg-beige-50/70 print:hover:bg-transparent">
                    <td className="py-3 px-3 font-semibold text-beige-700 border-e border-beige-300 text-center">
                      {index + 1}
                    </td>
                    <td className="py-3 px-3 font-bold text-beige-900 border-e border-beige-300">
                      {reg.first_name} {reg.last_name}
                    </td>
                    <td className="py-3 px-3 font-mono text-beige-800 border-e border-beige-300 text-start" dir="ltr">
                      {reg.phone}
                    </td>
                    <td className="py-3 px-3 font-mono text-beige-700 border-e border-beige-300 text-start truncate max-w-[180px]" dir="ltr">
                      {reg.email}
                    </td>
                    {/* Manual signature box */}
                    <td className="py-3 px-3 border-beige-300 h-12 bg-beige-50/40 print:bg-white text-center align-middle">
                      <div className="w-full h-8 border border-dashed border-beige-400 rounded print:border-slate-400 flex items-center justify-center text-[10px] text-beige-400 print:text-transparent">
                        {locale === 'ar' ? 'مساحة التوقيع' : 'Signature'}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Printable Footer */}
        <div className="border-t border-beige-300 pt-4 flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] text-beige-600">
          <div>
            <span>{t('docGeneratedOn')} </span>
            <span className="font-semibold text-beige-800">{generationDate}</span>
          </div>

          <div className="flex items-center gap-1 text-beige-500">
            <ShieldCheck className="w-3.5 h-3.5 text-ruby-700" />
            <span>{locale === 'ar' ? 'وثيقة حضور رسمية معتمدة' : 'Official Certified Attendance Sheet'}</span>
          </div>

          <div>
            <span>{t('page')} 1 {t('of')} 1</span>
          </div>
        </div>
      </div>
    </div>
  );
}
