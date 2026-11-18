'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useLanguage } from '@/lib/i18n/LanguageContext';
import { ShieldCheck, Calendar, MapPin, ExternalLink, Heart } from 'lucide-react';

export default function Footer() {
  const { t, locale } = useLanguage();

  return (
    <footer className="bg-slate-900 text-slate-300 border-t border-slate-800 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          {/* Col 1: Brand & Logos */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-white p-1 flex items-center justify-center shadow-xs">
                <Image
                  src="/images/salon-emploi-logo.png"
                  alt="Salon de l'Emploi"
                  width={36}
                  height={36}
                  className="object-contain"
                />
              </div>
              <div className="h-6 w-px bg-slate-700" />
              <div className="h-8 w-28 bg-white/95 rounded px-1.5 py-0.5 flex items-center">
                <Image
                  src="/images/challenges-center-logo.png"
                  alt="Challenges Center"
                  width={110}
                  height={30}
                  className="object-contain"
                />
              </div>
            </div>

            <p className="text-sm text-slate-400 leading-relaxed">
              {t('footerAboutText')}
            </p>

            <div className="flex items-center gap-2 text-xs text-brand-gold font-medium">
              <ShieldCheck className="w-4 h-4" />
              <span>{locale === 'ar' ? 'معتمد ومطابق للقانون 18-07' : 'Compliant with Algerian Law 18-07'}</span>
            </div>
          </div>

          {/* Col 2: Navigation Links */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-white mb-4">
              {t('footerQuickLinks')}
            </h3>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link href="/" className="hover:text-brand-gold transition-colors">
                  {t('navHome')}
                </Link>
              </li>
              <li>
                <Link href="/courses01" className="hover:text-brand-gold transition-colors">
                  {t('navCourses')}
                </Link>
              </li>
              <li>
                <Link href="/admin01" className="hover:text-brand-gold transition-colors">
                  {t('navAdmin')}
                </Link>
              </li>
              <li>
                <Link href="/register01" className="hover:text-brand-gold transition-colors">
                  {t('navRegistrations')}
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Event & Institution Info */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-white mb-4">
              {t('footerEventInfo')}
            </h3>
            <ul className="space-y-3 text-sm text-slate-400">
              <li className="flex items-start gap-2.5">
                <Calendar className="w-4 h-4 text-brand-gold shrink-0 mt-0.5" />
                <span>{locale === 'ar' ? 'فعاليات صالون التشغيل 2026' : 'Salon de l’Emploi 2026 Edition'}</span>
              </li>
              <li className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-brand-gold shrink-0 mt-0.5" />
                <span>{locale === 'ar' ? 'الجزائر العاصمة، الجزائر' : 'Algiers, Algeria'}</span>
              </li>
              <li className="text-xs text-slate-500 pt-1">
                {locale === 'ar'
                  ? 'منصة دائمة لتنظيم وتسجيل ورشات ودورات مركز تشالنجز.'
                  : 'Permanent registration and catalog platform for Challenges Center.'}
              </li>
            </ul>
          </div>

          {/* Col 4: Legal & Compliance */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-white mb-4">
              {t('footerLegal')}
            </h3>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link href="/privacy01" className="hover:text-brand-gold transition-colors">
                  {locale === 'ar' ? 'سياسة الخصوصية وحماية المعطيات' : 'Privacy Policy & Data Protection'}
                </Link>
              </li>
              <li>
                <Link href="/terms01" className="hover:text-brand-gold transition-colors">
                  {locale === 'ar' ? 'الشروط والأحكام العامة' : 'Terms & Conditions of Participation'}
                </Link>
              </li>
              <li className="text-xs text-slate-400 pt-1 leading-relaxed">
                {locale === 'ar'
                  ? 'حماية البيانات الشخصية مكفولة بموجب القانون رقم 18-07 المؤرخ في 10 يونيو 2018.'
                  : 'Personal data protection guaranteed under Algerian Law No. 18-07.'}
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar: Copyright & Developer Credit */}
        <div className="mt-12 pt-8 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
          <p>{t('allRightsReserved')}</p>

          {/* Mandatory Developer Attribution */}
          <div className="flex items-center gap-1.5 text-slate-400 font-medium hover:text-white transition-colors">
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
      </div>
    </footer>
  );
}
