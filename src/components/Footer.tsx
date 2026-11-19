'use client';

import React from 'react';
import { useLanguage } from '@/lib/i18n/LanguageContext';
import { ExternalLink } from 'lucide-react';

export default function Footer() {
  const { locale } = useLanguage();

  return (
    <footer className="bg-slate-950 text-slate-400 border-t border-slate-800/80 py-6 text-xs transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-3">
        {/* EIC Club Copyright */}
        <p className="font-medium text-slate-400">
          © {new Date().getFullYear()} <span className="text-white font-semibold">EIC Club</span>. {locale === 'ar' ? 'جميع الحقوق محفوظة.' : 'All rights reserved.'}
        </p>

        {/* Developer Attribution */}
        <div className="flex items-center gap-1.5 text-slate-400 font-medium">
          <span>{locale === 'ar' ? 'تم التطوير بواسطة' : 'Developed by'}</span>
          <a
            href="https://adem-tachi.netlify.app/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-brand-gold hover:text-brand-goldHover font-semibold underline underline-offset-4 inline-flex items-center gap-1 transition-colors"
          >
            <span>Adem Tachi</span>
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>
      </div>
    </footer>
  );
}
