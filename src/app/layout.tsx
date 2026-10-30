import type { Metadata, Viewport } from 'next';
import { Outfit } from 'next/font/google';
import { ScriptTema } from '@/brand/tema/ScriptTema';
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
    // suppressHydrationWarning: ScriptTema puede poner data-theme en <html> antes de hidratar.
    <html lang="es-AR" className={outfit.variable} suppressHydrationWarning>
      <head>
        {/* Arriba de todo: aplica el tema guardado antes del primer pintado (el oscuro es el default). */}
        <ScriptTema />
      </head>
      <body>{children}</body>
    </html>
  );
}
