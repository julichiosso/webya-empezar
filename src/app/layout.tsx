import type { Metadata, Viewport } from 'next';
import { Outfit } from 'next/font/google';
import { BASE } from '@/brand/tokens/colores';
import { SEO_SITIO } from '@/content/seo';
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
  applicationName: SEO_SITIO.nombre,
  title: { default: SEO_SITIO.nombre, template: SEO_SITIO.plantillaTitulo },
  robots: { index: true, follow: true },
  formatDetection: { telephone: false },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: BASE.bg,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es-AR" className={outfit.variable}>
      <body>{children}</body>
    </html>
  );
}
