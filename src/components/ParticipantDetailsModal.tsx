'use client';

import React, { useState } from 'react';
import { Registration, RegistrationStatus } from '@/types';
import { useLanguage } from '@/lib/i18n/LanguageContext';
import { formatDate } from '@/lib/utils';
import { X, ShieldCheck, Mail, Phone, Calendar, Clock, Loader2, Save, GraduationCap, BookOpen } from 'lucide-react';

interface ParticipantDetailsModalProps {
  registration: Registration;
  onClose: () => void;
  onStatusChanged: (id: string, status: RegistrationStatus, notes?: string) => Promise<void>;
}

export default function ParticipantDetailsModal({
  registration,
  onClose,
  onStatusChanged,
}: ParticipantDetailsModalProps) {
  const { t, locale } = useLanguage();

  const [status, setStatus] = useState<RegistrationStatus>(registration.status);
  const [notes, setNotes] = useState(registration.notes || '');
  const [saving, setSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const courseTitle = registration.course
    ? registration.course.title
    : 'Unknown Course';

  const handleSave = async () => {
    setSaving(true);
    setSavedSuccess(false);
    try {
      await onStatusChanged(registration.id, status, notes);
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 2500);
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  const statusOptions: { value: RegistrationStatus; label: string; color: string }[] = [
    { value: 'new', label: t('statusNew'), color: 'bg-blue-100 text-blue-800 border-blue-200' },
    { value: 'accepted', label: t('statusAccepted'), color: 'bg-emerald-100 text-emerald-800 border-emerald-200' },
    { value: 'rejected', label: t('statusRejected'), color: 'bg-rose-100 text-rose-800 border-rose-200' },
    { value: 'no_response', label: t('statusNoResponse'), color: 'bg-amber-100 text-amber-800 border-amber-200' },
  ];

  return (
    <div className="fixed inset-0 z-50 bg-ruby-950/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
      <div className="bg-white w-full max-w-lg rounded-2xl border border-beige-300 shadow-xl overflow-hidden my-8">
        {/* Header */}
        <div className="px-6 py-4 border-b border-beige-300 flex items-center justify-between bg-beige-100/70">
          <div>
            <h2 className="text-base font-bold text-beige-900">
              {t('participantDetails')}
            </h2>
            <p className="text-xs text-beige-600 font-mono">
              {registration.id}
            </p>
          </div>
          <button
            onClick={onClose}
            type="button"
            className="p-1.5 text-beige-500 hover:text-beige-800 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-5">
          {/* Participant Info Banner */}
          <div className="bg-beige-50/70 border border-beige-300 rounded-xl p-4">
            <h3 className="text-lg font-bold text-beige-900">
              {registration.first_name} {registration.last_name}
            </h3>
            <p className="text-xs text-ruby-700 font-bold mt-0.5 mb-3">
              {courseTitle}
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-beige-800">
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-ruby-700 shrink-0" />
                <a href={`tel:${registration.phone}`} className="font-mono hover:underline" dir="ltr">
                  {registration.phone}
                </a>
              </div>

              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-ruby-700 shrink-0" />
                <a href={`mailto:${registration.email}`} className="font-mono hover:underline truncate" dir="ltr">
                  {registration.email}
                </a>
              </div>

              {registration.birth_date && (
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-ruby-700 shrink-0" />
                  <span>
                    {locale === 'ar' ? 'تاريخ الميلاد:' : 'DOB:'} <span className="font-mono">{registration.birth_date}</span>
                  </span>
                </div>
              )}

              {registration.university && (
                <div className="flex items-center gap-2 sm:col-span-2">
                  <GraduationCap className="w-4 h-4 text-ruby-700 shrink-0" />
                  <span className="truncate" title={registration.university}>
                    {locale === 'ar' ? 'الجامعة:' : 'University:'} <strong>{registration.university}</strong>
                  </span>
                </div>
              )}

              {registration.academic_year && (
                <div className="flex items-center gap-2">
                  <BookOpen className="w-4 h-4 text-ruby-700 shrink-0" />
                  <span>
                    {locale === 'ar' ? 'السنة الدراسية:' : 'Year:'} <strong>{registration.academic_year}</strong>
                  </span>
                </div>
              )}

              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-beige-500 shrink-0" />
                <span>{t('registeredOn')}: {formatDate(registration.created_at, locale)}</span>
              </div>

              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-beige-500 shrink-0" />
                <span className="truncate">
                  {new Date(registration.created_at).toLocaleTimeString(locale === 'ar' ? 'ar-DZ' : 'en-US', {
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </span>
              </div>
            </div>
          </div>

          {/* Legal Compliance Check Info */}
          <div className="p-3.5 bg-emerald-50/70 border border-emerald-200/80 rounded-xl text-xs space-y-1 text-emerald-900">
            <div className="flex items-center gap-1.5 font-bold">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>{locale === 'ar' ? 'بيانات الامتثال القانوني الموثقة:' : 'Verified Legal Consent Records:'}</span>
            </div>
            <p className="text-emerald-800">
              • {locale === 'ar' ? 'الموافقة على سياسة الخصوصية والشروط العامة: نعم' : 'Privacy policy & terms consent: Verified'}
            </p>
            <p className="text-emerald-800">
              • {locale === 'ar' ? 'الموافقة على القانون 18-07 لحماية المعطيات الشخصية: نعم' : 'Algerian Law 18-07 consent: Verified'}
            </p>
            <p className="text-emerald-700 text-[11px] font-mono">
              {locale === 'ar' ? 'البصمة الزمنية للموافقة:' : 'Consent Timestamp:'}{' '}
              {new Date(registration.consent_timestamp).toISOString()}
            </p>
          </div>

          {/* Status Selection */}
          <div>
            <label className="block text-xs font-bold text-beige-900 uppercase tracking-wider mb-2">
              {locale === 'ar' ? 'تحديث حالة التسجيل:' : 'Update Registration Status:'}
            </label>
            <div className="grid grid-cols-2 gap-2">
              {statusOptions.map(opt => (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => setStatus(opt.value)}
                  className={`py-2 px-3 rounded-xl text-xs font-bold border transition-all text-center ${
                    status === opt.value
                      ? `${opt.color} ring-2 ring-ruby-700/30 shadow-xs`
                      : 'bg-white text-beige-800 border-beige-300 hover:bg-beige-100'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          {/* Staff Notes */}
          <div>
            <label className="block text-xs font-bold text-beige-900 uppercase tracking-wider mb-1.5">
              {t('notes')}
            </label>
            <textarea
              rows={3}
              value={notes}
              onChange={e => setNotes(e.target.value)}
              placeholder={locale === 'ar' ? 'مثال: تم الاتصال بالمشارك وتأكيد حضوره...' : 'e.g. Phone confirmed, candidate attends morning session...'}
              className="w-full px-3 py-2 text-xs sm:text-sm border border-beige-300 bg-beige-50/30 text-beige-900 placeholder:text-beige-400 rounded-xl focus:ring-2 focus:ring-ruby-700/20 focus:border-ruby-700"
            />
          </div>

          {savedSuccess && (
            <p className="text-xs text-emerald-600 font-semibold text-center animate-fade-in">
              {t('statusUpdatedMsg')}
            </p>
          )}

          {/* Actions */}
          <div className="pt-3 border-t border-beige-200 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs sm:text-sm font-semibold text-beige-700 hover:text-beige-900"
            >
              {t('closeBtn')}
            </button>
            <button
              type="button"
              onClick={handleSave}
              disabled={saving}
              className="px-5 py-2 bg-ruby-700 hover:bg-ruby-800 text-beige-50 rounded-xl text-xs sm:text-sm font-bold shadow-xs shadow-ruby-900/15 transition-colors flex items-center gap-1.5 disabled:opacity-50"
            >
              {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
              <span>{t('saveNotes')}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
