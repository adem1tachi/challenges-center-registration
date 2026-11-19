'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { useLanguage } from '@/lib/i18n/LanguageContext';
import LanguageSwitcher from './LanguageSwitcher';
import { Menu, X, BookOpen, Home } from 'lucide-react';

export default function Navbar() {
  const { t, locale } = useLanguage();
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Purely public navigation links (no admin shortcuts)
  const navLinks = [
    { href: '/', label: t('navHome'), icon: Home },
    { href: '/courses01', label: t('navCourses'), icon: BookOpen },
  ];

  return (
    <header className="sticky top-0 z-40 bg-ruby-950/95 backdrop-blur-md border-b border-ruby-900/50 shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Brand & Organizers Presentation */}
          <Link href="/" className="flex items-center gap-2.5 sm:gap-3.5 group">
            {/* Salon de l'Emploi Logo */}
            <div className="relative w-9 h-9 sm:w-10 sm:h-10 flex items-center justify-center shrink-0 transition-transform group-hover:scale-105">
              <Image
                src="/images/salon-emploi-logo.png"
                alt="Salon de l'Emploi Logo"
                width={38}
                height={38}
                className="object-contain drop-shadow-sm"
                priority
              />
            </div>

            <div className="hidden sm:block text-start leading-tight">
              <span className="block text-xs font-black tracking-tight text-white uppercase">
                Salon de l’Emploi
              </span>
              <span className="block text-[10px] text-brand-gold font-medium">
                {locale === 'ar' ? 'الصالون الوطني للتشغيل' : 'National Career Fair'}
              </span>
            </div>

            {/* Subtle Divider */}
            <div className="h-6 w-px bg-ruby-900/60" />

            {/* Challenges Center Partner Logo */}
            <div className="relative h-8 sm:h-9 w-24 sm:w-28 flex items-center justify-center shrink-0">
              <Image
                src="/images/challenges-center-logo-white.png"
                alt="Challenges Center Logo"
                width={100}
                height={32}
                className="object-contain"
                priority
              />
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-2">
            {navLinks.map(link => {
              const isActive = pathname === link.href;
              const Icon = link.icon;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
                    isActive
                      ? 'bg-ruby-700 text-beige-50 shadow-sm border border-ruby-600/40'
                      : 'text-beige-200 hover:text-white hover:bg-white/10'
                  }`}
                >
                  {Icon && <Icon className="w-4 h-4 opacity-85" />}
                  <span>{link.label}</span>
                </Link>
              );
            })}
          </nav>

          {/* Controls: Language Switcher */}
          <div className="hidden md:flex items-center gap-3">
            <LanguageSwitcher variant="dark" />
          </div>

          {/* Mobile Hamburger Button */}
          <div className="flex md:hidden items-center gap-2">
            <LanguageSwitcher variant="dark" />
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              type="button"
              className="p-2 rounded-xl text-beige-200 hover:text-white hover:bg-white/10 focus:outline-none"
              aria-label="Toggle Navigation"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-ruby-900/50 bg-ruby-950 px-4 pt-3 pb-6 space-y-2 shadow-xl animate-in slide-in-from-top-2">
          {navLinks.map(link => {
            const isActive = pathname === link.href;
            const Icon = link.icon;
            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-colors ${
                  isActive
                    ? 'bg-ruby-700 text-beige-50 font-bold'
                    : 'text-beige-200 hover:text-white hover:bg-white/10'
                }`}
              >
                {Icon && <Icon className="w-4 h-4 opacity-85" />}
                <span>{link.label}</span>
              </Link>
            );
          })}
        </div>
      )}
    </header>
  );
}
