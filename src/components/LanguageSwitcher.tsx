'use client';

import React from 'react';
import { useLanguage } from '@/lib/i18n/LanguageContext';
import { Globe } from 'lucide-react';

export default function LanguageSwitcher() {
  const { locale, toggleLocale } = useLanguage();

  return (
    <button
      onClick={toggleLocale}
      type="button"
      className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs sm:text-sm font-semibold rounded-full border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:border-brand-gold hover:text-brand-navy shadow-sm transition-all focus:outline-none focus:ring-2 focus:ring-brand-gold/30"
      aria-label="Toggle language"
    >
      <Globe className="w-3.5 h-3.5 text-brand-gold" />
      <span>{locale === 'ar' ? 'English' : 'العربية'}</span>
    </button>
  );
}
