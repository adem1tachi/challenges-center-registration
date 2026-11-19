import type { Metadata } from 'next';
import { IBM_Plex_Sans_Arabic } from 'next/font/google';
import './globals.css';
import { LanguageProvider } from '@/lib/i18n/LanguageContext';
import PublicShell from '@/components/PublicShell';

const ibmPlexArabic = IBM_Plex_Sans_Arabic({
  subsets: ['arabic', 'latin'],
  weight: ['300', '400', '500', '600', '700'],
  display: 'swap',
  variable: '--font-ibm-plex-arabic',
});

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
    <html lang="ar" dir="rtl" className={ibmPlexArabic.variable}>
      <body className={`min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans antialiased selection:bg-brand-gold selection:text-brand-navy ${ibmPlexArabic.className}`}>
        <LanguageProvider>
          <PublicShell>{children}</PublicShell>
        </LanguageProvider>
      </body>
    </html>
  );
}
