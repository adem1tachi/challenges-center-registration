'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { Locale } from '@/types';
import { translations, TranslationKey } from './translations';

interface LanguageContextType {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  toggleLocale: () => void;
  t: (key: TranslationKey) => string;
  dir: 'rtl' | 'ltr';
  isRtl: boolean;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>('ar'); // Default to Arabic as primary event language
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const saved = localStorage.getItem('challenges_lang') as Locale | null;
    if (saved && (saved === 'ar' || saved === 'en')) {
      setLocaleState(saved);
    }
  }, []);

  useEffect(() => {
    if (!mounted) return;
    localStorage.setItem('challenges_lang', locale);
    const dir = locale === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.dir = dir;
    document.documentElement.lang = locale;
  }, [locale, mounted]);

  const setLocale = (newLoc: Locale) => {
    setLocaleState(newLoc);
  };

  const toggleLocale = () => {
    setLocaleState(prev => (prev === 'ar' ? 'en' : 'ar'));
  };

  const t = (key: TranslationKey): string => {
    const table = translations[locale] || translations.en;
    return table[key] || translations.en[key] || (key as string);
  };

  const dir = locale === 'ar' ? 'rtl' : 'ltr';
  const isRtl = locale === 'ar';

  return (
    <LanguageContext.Provider
      value={{
        locale,
        setLocale,
        toggleLocale,
        t,
        dir,
        isRtl,
      }}
    >
      <div dir={dir} className={isRtl ? 'font-arabic' : 'font-sans'}>
        {children}
      </div>
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
