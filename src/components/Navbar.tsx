'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import { useLanguage } from '@/lib/i18n/LanguageContext';
import LanguageSwitcher from './LanguageSwitcher';
import { Menu, X, Shield, BookOpen, Users, LogOut, LogIn } from 'lucide-react';

export default function Navbar() {
  const { t, isRtl } = useLanguage();
  const pathname = usePathname();
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);

  useEffect(() => {
    // Check admin session status
    fetch('/api/auth01/logout')
      .then(res => res.json())
      .then(data => {
        setIsAdminLoggedIn(!!data.authenticated);
      })
      .catch(() => {});
  }, [pathname]);

  const handleLogout = async () => {
    try {
      await fetch('/api/auth01/logout', { method: 'POST' });
      setIsAdminLoggedIn(false);
      router.push('/login01');
      router.refresh();
    } catch (err) {
      console.error(err);
    }
  };

  const navLinks = [
    { href: '/', label: t('navHome'), icon: null },
    { href: '/courses01', label: t('navCourses'), icon: BookOpen },
    { href: '/admin01', label: t('navAdmin'), icon: Shield, adminOnly: true },
    { href: '/register01', label: t('navRegistrations'), icon: Users, adminOnly: true },
  ];

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Brand & Dual Logos */}
          <Link href="/" className="flex items-center gap-3 group">
            {/* Salon de l'Emploi Logo */}
            <div className="relative w-12 h-12 rounded-full overflow-hidden border border-slate-200 shadow-xs p-0.5 bg-white flex items-center justify-center transition-transform group-hover:scale-105">
              <Image
                src="/images/salon-emploi-logo.png"
                alt="Salon de l'Emploi Logo"
                width={48}
                height={48}
                className="object-contain"
                priority
              />
            </div>

            <div className="h-7 w-px bg-slate-200" />

            {/* Challenges Center Logo */}
            <div className="relative h-10 w-28 sm:w-32 flex items-center">
              <Image
                src="/images/challenges-center-logo.png"
                alt="Challenges Center Logo"
                width={128}
                height={42}
                className="object-contain"
                priority
              />
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1 lg:gap-2">
            {navLinks.map(link => {
              const isActive = pathname === link.href;
              const Icon = link.icon;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`inline-flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-brand-navy text-white shadow-xs'
                      : 'text-slate-700 hover:text-brand-navy hover:bg-slate-100/80'
                  }`}
                >
                  {Icon && <Icon className="w-4 h-4 opacity-80" />}
                  <span>{link.label}</span>
                </Link>
              );
            })}
          </nav>

          {/* Controls: Language & Auth */}
          <div className="hidden md:flex items-center gap-3">
            <LanguageSwitcher />

            {isAdminLoggedIn ? (
              <button
                onClick={handleLogout}
                type="button"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200 transition-colors"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>{t('navLogout')}</span>
              </button>
            ) : (
              <Link
                href="/login01"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg text-brand-navy bg-slate-100 hover:bg-slate-200 border border-slate-200 transition-colors"
              >
                <LogIn className="w-3.5 h-3.5" />
                <span>{t('navLogin')}</span>
              </Link>
            )}
          </div>

          {/* Mobile Hamburger Button */}
          <div className="flex md:hidden items-center gap-2">
            <LanguageSwitcher />
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              type="button"
              className="p-2 rounded-lg text-slate-700 hover:text-brand-navy hover:bg-slate-100 focus:outline-none"
              aria-label="Toggle Navigation"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-200 bg-white px-4 pt-3 pb-6 space-y-2 shadow-lg animate-in slide-in-from-top-2">
          {navLinks.map(link => {
            const isActive = pathname === link.href;
            const Icon = link.icon;
            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-brand-navy text-white'
                    : 'text-slate-700 hover:bg-slate-100'
                }`}
              >
                {Icon && <Icon className="w-4 h-4 opacity-80" />}
                <span>{link.label}</span>
              </Link>
            );
          })}

          <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
            {isAdminLoggedIn ? (
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  handleLogout();
                }}
                className="w-full flex items-center justify-center gap-2 py-2 text-sm font-semibold rounded-lg text-rose-700 bg-rose-50 border border-rose-200"
              >
                <LogOut className="w-4 h-4" />
                <span>{t('navLogout')}</span>
              </button>
            ) : (
              <Link
                href="/login01"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full flex items-center justify-center gap-2 py-2 text-sm font-semibold rounded-lg text-brand-navy bg-slate-100 border border-slate-200"
              >
                <LogIn className="w-4 h-4" />
                <span>{t('navLogin')}</span>
              </Link>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
