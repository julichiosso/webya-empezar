import type { Metadata, Viewport } from 'next';
import { Outfit } from 'next/font/google';
import { siteConfig } from '@/lib/site-config';
import './globals.css';

const outfit = Outfit({
  subsets: ['latin'],
  variable: '--font-outfit',
  display: 'swap',
});

// Metadata base del sitio. Cada página completa lo suyo (título, canonical, Open Graph).
export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  applicationName: 'WebYa',
  title: { default: 'WebYa', template: '%s | WebYa' },
  robots: { index: true, follow: true },
  formatDetection: { telephone: false },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#0b0b0c',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es-AR" className={outfit.variable}>
      <body>{children}</body>
    </html>
  );
}
