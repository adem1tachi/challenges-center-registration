'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useLanguage } from '@/lib/i18n/LanguageContext';
import LanguageSwitcher from '@/components/LanguageSwitcher';
import {
  Layers,
  Users,
  LogOut,
  Menu,
  X,
  ShieldCheck,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';

interface AdminLayoutProps {
  children: React.ReactNode;
  title?: string;
  subtitle?: string;
  actions?: React.ReactNode;
}

export default function AdminLayout({
  children,
  title,
  subtitle,
  actions,
}: AdminLayoutProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { t, locale, isRtl } = useLanguage();
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await fetch('/api/auth01/logout', { method: 'POST' });
      router.push('/login01');
      router.refresh();
    } catch (err) {
      console.error(err);
    }
  };

  const navItems = [
    {
      href: '/admin01',
      label: locale === 'ar' ? 'إدارة الدورات والورشات' : 'Courses & Workshops',
      icon: Layers,
      active: pathname === '/admin01',
    },
    {
      href: '/register01',
      label: locale === 'ar' ? 'طلبات التسجيل والمشاركين' : 'Registration Requests',
      icon: Users,
      active: pathname === '/register01',
    },
  ];

  const ChevronIcon = isRtl ? ChevronLeft : ChevronRight;

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col lg:flex-row text-slate-900">
      {/* =====================================================================
          MOBILE TOP BAR (Visible only on mobile / small screens)
          ===================================================================== */}
      <header className="lg:hidden sticky top-0 z-30 bg-white border-b border-slate-200 px-4 py-3 flex items-center justify-between shadow-xs">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setMobileSidebarOpen(!mobileSidebarOpen)}
            type="button"
            className="p-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors"
            aria-label="Toggle Navigation"
          >
            {mobileSidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold px-2.5 py-1 rounded-lg bg-brand-navy text-brand-gold">
              {locale === 'ar' ? 'لوحة الإدارة' : 'Admin'}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <LanguageSwitcher variant="light" />
        </div>
      </header>

      {/* =====================================================================
          SIDEBAR (Desktop Fixed + Mobile Overlay Drawer)
          ===================================================================== */}
      {/* Mobile Backdrop */}
      {mobileSidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-slate-900/50 backdrop-blur-xs lg:hidden"
          onClick={() => setMobileSidebarOpen(false)}
        />
      )}

      <aside
        className={`fixed inset-y-0 start-0 z-50 w-72 bg-brand-navyDark text-white flex flex-col justify-between transition-transform duration-300 ease-in-out border-e border-slate-800 lg:static lg:translate-x-0 ${
          mobileSidebarOpen
            ? 'translate-x-0'
            : isRtl
            ? 'translate-x-full lg:translate-x-0'
            : '-translate-x-full lg:translate-x-0'
        }`}
      >
        {/* Top: Admin Identity */}
        <div>
          <div className="p-6 border-b border-white/10 flex items-center justify-between">
            <Link
              href="/admin01"
              className="flex items-center gap-3 group"
              onClick={() => setMobileSidebarOpen(false)}
            >
              <div className="w-9 h-9 rounded-xl bg-brand-gold/15 border border-brand-gold/25 flex items-center justify-center text-brand-gold">
                <ShieldCheck className="w-5 h-5 text-brand-gold" />
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-bold tracking-wide text-brand-gold">
                  {locale === 'ar' ? 'لوحة التحكم' : 'Admin Portal'}
                </span>
                <span className="text-[11px] text-slate-400">
                  {locale === 'ar' ? 'إدارة المنصة' : 'Management'}
                </span>
              </div>
            </Link>

            <button
              onClick={() => setMobileSidebarOpen(false)}
              className="lg:hidden p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation Links */}
          <div className="px-4 py-6 space-y-1.5">
            <div className="px-3 pb-2 text-[11px] font-bold uppercase tracking-wider text-slate-400">
              {locale === 'ar' ? 'إدارة النظام' : 'Management'}
            </div>

            {navItems.map(item => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileSidebarOpen(false)}
                  className={`flex items-center justify-between px-3.5 py-3 rounded-xl text-sm font-medium transition-all ${
                    item.active
                      ? 'bg-brand-gold text-brand-navy font-bold shadow-sm'
                      : 'text-slate-300 hover:text-white hover:bg-white/10'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className={`w-4 h-4 ${item.active ? 'text-brand-navy' : 'text-slate-400'}`} />
                    <span>{item.label}</span>
                  </div>
                  {item.active && <ChevronIcon className="w-4 h-4" />}
                </Link>
              );
            })}
          </div>
        </div>

        {/* Bottom: Status, Language & Logout */}
        <div className="p-4 border-t border-white/10 space-y-3 bg-black/20">
          <div className="flex items-center justify-between px-2 text-xs">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-slate-300 font-medium">
                {locale === 'ar' ? 'المسؤول متصل' : 'Admin Online'}
              </span>
            </div>
            <div className="text-slate-300">
              <LanguageSwitcher />
            </div>
          </div>

          <button
            onClick={handleLogout}
            type="button"
            className="w-full flex items-center justify-center gap-2 px-3.5 py-2.5 rounded-xl text-xs font-semibold text-rose-300 hover:text-white hover:bg-rose-500/20 border border-rose-500/30 transition-colors"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>{locale === 'ar' ? 'تسجيل الخروج' : 'Log Out'}</span>
          </button>
        </div>
      </aside>

      {/* =====================================================================
          MAIN CONTENT VIEW
          ===================================================================== */}
      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        {(title || actions) && (
          <div className="bg-white border-b border-slate-200 px-6 sm:px-8 py-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                {title && (
                  <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
                    {title}
                  </h1>
                )}
                {subtitle && (
                  <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
                    {subtitle}
                  </p>
                )}
              </div>
              {actions && <div className="flex items-center gap-2.5">{actions}</div>}
            </div>
          </div>
        )}

        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full">
          {children}
        </main>
      </div>
    </div>
  );
}
