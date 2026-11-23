import type { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google';
import { ViewTransition } from 'react';
import { preload } from 'react-dom';
import { FUENTE_PRECARGADA } from '@/brand/tipografia/fuente';
import { Carga } from '@/components/marketing/Carga';
import { Medicion } from '@/components/marketing/Medicion';
import { EDITORIAL } from '@/brand/tokens/colores';
import { SEO_SITIO } from '@/content/seo';
import { ESTILO_SIN_JS, SCRIPT_MOVIMIENTO } from '@/lib/motion/script';
import { siteConfig } from '@/lib/site-config';
import './globals.css';

// Una sola familia (variable, con tamaño óptico): UI, titulares y cifras. Inter es la pariente libre más
// cercana a la letra de Apple: neutra, precisa y muy legible en pantallas chicas.
const inter = Inter({
  subsets: ['latin'],
  axes: ['opsz'],
  variable: '--font-texto',
  display: 'swap',
});

// Metadata base del sitio. Cada página completa lo suyo (título, canonical, Open Graph).
export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  applicationName: SEO_SITIO.nombre,
  title: { default: SEO_SITIO.tituloInicio, template: SEO_SITIO.plantillaTitulo },
  description: SEO_SITIO.descripcion,
  robots: { index: true, follow: true },
  formatDetection: { telephone: false },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: EDITORIAL.tinta,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  // Una sola etiqueta <link rel=preload> en el <head> (ver brand/tipografia/fuente.ts). Solo en el
  // build de producción (webpack): en `next dev` Turbopack nombra distinto el archivo (daría 404)
  // y ya inyecta su propio preload.
  if (process.env.NODE_ENV === 'production') {
    preload(FUENTE_PRECARGADA, { as: 'font', type: 'font/woff2', crossOrigin: 'anonymous' });
  }
  return (
    // suppressHydrationWarning: el script de movimiento le pone la clase .mo a <html> antes de hidratar.
    <html lang="es-AR" className={inter.variable} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: SCRIPT_MOVIMIENTO }} />
      </head>
      <body>
        {/* Pantalla de carga: solo se ve si el documento tarda más de ~450 ms en llegar. */}
        <Carga inicial />
        <noscript>
          <style>{ESTILO_SIN_JS}</style>
        </noscript>
        {/* Navegaciones entre páginas con View Transitions donde el navegador las soporte. */}
        <ViewTransition>{children}</ViewTransition>
        {/* Embudo propio: un sendBeacon a /api/eventos por página vista y por paso (sin cookies). */}
        <Medicion />
      </body>
    </html>
  );
}
