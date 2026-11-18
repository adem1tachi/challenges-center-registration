import type { Metadata } from 'next';
import './globals.css';
import { LanguageProvider } from '@/lib/i18n/LanguageContext';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export const metadata: Metadata = {
  title: 'Challenges Center | Salon de l’Emploi 2026',
  description:
    'Official course and workshop registration platform for Challenges Center at Salon de l’Emploi.',
  keywords: [
    'Challenges Center',
    'Salon de l’Emploi',
    'Formations Algérie',
    'Workshops',
    'Courses Registration',
    'Web Development',
    'Career Readiness',
  ],
  authors: [{ name: 'Adem Tachi', url: 'https://adem-tachi.netlify.app/' }],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ar" dir="rtl">
      <body className="min-h-screen bg-slate-50 text-slate-900 flex flex-col antialiased selection:bg-brand-gold selection:text-brand-navy">
        <LanguageProvider>
          <Navbar />
          <main className="flex-1">{children}</main>
          <Footer />
        </LanguageProvider>
      </body>
    </html>
  );
}
