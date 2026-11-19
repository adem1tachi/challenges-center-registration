'use client';

import React from 'react';
import { useLanguage } from '@/lib/i18n/LanguageContext';
import { Globe } from 'lucide-react';

interface LanguageSwitcherProps {
  variant?: 'dark' | 'light';
  className?: string;
}

export default function LanguageSwitcher({
  variant = 'dark',
  className = '',
}: LanguageSwitcherProps) {
  const { locale, toggleLocale } = useLanguage();

  const variantStyles =
    variant === 'dark'
      ? 'bg-white/10 hover:bg-white/15 text-white border-white/20 hover:border-brand-gold'
      : 'bg-white hover:bg-slate-50 text-slate-700 border-slate-200 hover:border-brand-gold shadow-xs';

  return (
    <button
      onClick={toggleLocale}
      type="button"
      className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs sm:text-sm font-semibold rounded-full border backdrop-blur-xs transition-all focus:outline-none focus:ring-2 focus:ring-brand-gold/30 ${variantStyles} ${className}`}
      aria-label="Toggle language"
    >
      <Globe className="w-3.5 h-3.5 text-brand-gold" />
      <span>{locale === 'ar' ? 'English' : 'العربية'}</span>
    </button>
  );
}
