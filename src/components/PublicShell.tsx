'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import Navbar from './Navbar';
import Footer from './Footer';

interface PublicShellProps {
  children: React.ReactNode;
}

export default function PublicShell({ children }: PublicShellProps) {
  const pathname = usePathname();

  // If in admin dashboard routes or login page, do NOT render public Navbar or Footer!
  const hidePublicBars =
    pathname.startsWith('/admin01') ||
    pathname.startsWith('/register01') ||
    pathname.startsWith('/login01');

  if (hidePublicBars) {
    return <div className="min-h-screen flex flex-col">{children}</div>;
  }

  return (
    <div className="min-h-screen flex flex-col justify-between bg-slate-50">
      <Navbar />
      <main className="flex-1 flex flex-col w-full">{children}</main>
      <Footer />
    </div>
  );
}
