import type { Metadata, Viewport } from 'next';
import './globals.css';
import { Noto_Kufi_Arabic } from 'next/font/google';
import { ClientToaster } from '@/components/client-toaster';
import { Providers } from './providers';

const notoKufiArabic = Noto_Kufi_Arabic({
  subsets: ['arabic'],
  display: 'swap',
  variable: '--font-noto-kufi-arabic',
});

export const viewport: Viewport = {
  themeColor: '#2B78C5',
};

export const metadata: Metadata = {
  title: 'CRMwebapp - BedArt Management Showcase',
  description: 'سیستەمی بەڕێوەبردنی کار، کۆگا، فرۆشتن و خەرجی (Showcase Mode - بێ پێویستی چوونەژوورەوە)',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'CRMwebapp',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ku" dir="rtl">
      <body className={`${notoKufiArabic.variable} font-body antialiased`}>
        <Providers>{children}</Providers>
        <ClientToaster />
      </body>
    </html>
  );
}
