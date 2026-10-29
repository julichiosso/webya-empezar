import type { Metadata } from 'next';
import Link from 'next/link';
import { Logo } from '@/brand/logo/Logo';
import { DemoGastronomia } from '@/features/demo/gastronomia/DemoGastronomia';
import { BotonExplicativo } from '@/features/explicativo/BotonExplicativo';

const TITULO = 'Demo para gastronomía';
const DESCRIPCION =
  'Mirá cómo quedaría tu local: carta con QR, pedidos y seguimiento en vivo, con datos de ejemplo.';

export const metadata: Metadata = {
  title: TITULO,
  description: DESCRIPCION,
  alternates: { canonical: '/demo/gastronomia' },
  openGraph: {
    type: 'website',
    locale: 'es_AR',
    siteName: 'WebYa',
    url: '/demo/gastronomia',
    title: `${TITULO} | WebYa`,
    description: DESCRIPCION,
  },
};

export default function DemoGastronomiaPage() {
  return (
    <main>
      <DemoGastronomia
        encabezado={
          <>
            <Link
              href="/empezar"
              aria-label="WebYa: volver al inicio"
              className="inline-flex min-h-tap items-center"
            >
              <Logo />
            </Link>
            <h1 className="mt-6 text-title font-semibold text-balance">
              Así se vería tu local con WebYa
            </h1>
            <p className="mt-2 max-w-xl text-lead text-muted">
              Pedí algo como si fueras un cliente: elegí un plato, armalo a tu gusto y confirmá.
            </p>
            <BotonExplicativo origen="demo" className="mt-4" />
          </>
        }
      />
    </main>
  );
}
