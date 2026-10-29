import type { Metadata } from 'next';
import Link from 'next/link';
import { Logo } from '@/brand/logo/Logo';
import { DemoGastronomia } from '@/features/demo/gastronomia/DemoGastronomia';
import { PAGINA_DEMO } from '@/content/demos/gastronomia/ui/pagina';
import { BotonExplicativo } from '@/features/explicativo/BotonExplicativo';

const TITULO = PAGINA_DEMO.titulo;
const DESCRIPCION = PAGINA_DEMO.descripcion;

export const metadata: Metadata = {
  title: TITULO,
  description: DESCRIPCION,
  alternates: { canonical: '/demo/gastronomia' },
  openGraph: {
    type: 'website',
    locale: 'es_AR',
    siteName: PAGINA_DEMO.og.sitio,
    url: '/demo/gastronomia',
    title: PAGINA_DEMO.og.titulo(TITULO),
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
              aria-label={PAGINA_DEMO.ariaLogo}
              className="inline-flex min-h-tap items-center"
            >
              <Logo />
            </Link>
            <h1 className="mt-6 text-title font-semibold text-balance">
              {PAGINA_DEMO.encabezado.titulo}
            </h1>
            <p className="mt-2 max-w-xl text-lead text-muted">{PAGINA_DEMO.encabezado.bajada}</p>
            <BotonExplicativo origen="demo" className="mt-4" />
          </>
        }
      />
    </main>
  );
}
