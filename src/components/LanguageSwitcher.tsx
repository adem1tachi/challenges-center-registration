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
      ? 'bg-ruby-950/40 hover:bg-ruby-900/60 text-beige-100 border-ruby-800/60 hover:border-ruby-500'
      : 'bg-white hover:bg-beige-100/70 text-beige-900 border-beige-300 hover:border-ruby-600 shadow-xs';

  return (
    <button
      onClick={toggleLocale}
      type="button"
      className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs sm:text-sm font-semibold rounded-full border backdrop-blur-xs transition-all focus:outline-none focus:ring-2 focus:ring-ruby-700/30 ${variantStyles} ${className}`}
      aria-label="Toggle language"
    >
      <Globe className="w-3.5 h-3.5 text-ruby-700" />
      <span>{locale === 'ar' ? 'English' : 'العربية'}</span>
    </button>
  );
}
