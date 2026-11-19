'use client';

import React from 'react';
import { useLanguage } from '@/lib/i18n/LanguageContext';
import { ExternalLink } from 'lucide-react';

export default function Footer() {
  const { locale } = useLanguage();

  // Set to false or delete this block to remove the humor text
  const SHOW_EASTER_EGG = true;

  return (
    <footer className="bg-ruby-950 text-beige-400 border-t border-ruby-900/50 py-6 text-xs transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-3">
        {/* EIC Club Copyright */}
        <p className="font-medium text-beige-300">
          © {new Date().getFullYear()} <span className="text-white font-semibold">EIC Club</span>. {locale === 'ar' ? 'جميع الحقوق محفوظة.' : 'All rights reserved.'}
        </p>

        {/* --- OPTIONAL JOKE TAG (Easy to remove) --- */}
        {SHOW_EASTER_EGG && (
          <span className="text-xs sm:text-sm text-beige-100 font-mono font-bold tracking-wide select-none">
            Still better than your IT guy.
          </span>
        )}

        {/* Developer Attribution */}
        <div className="flex items-center gap-1.5 text-beige-300 font-medium">
          <span>{locale === 'ar' ? 'تم التطوير بواسطة' : 'Developed by'}</span>
          <a
            href="https://adem-tachi.netlify.app/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-brand-gold hover:text-beige-100 font-semibold underline underline-offset-4 inline-flex items-center gap-1 transition-colors"
          >
            <span>Adem Tachi</span>
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>
      </div>
    </footer>
  );
}
