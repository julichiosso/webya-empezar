import type { Metadata } from 'next';
import Link from 'next/link';
import { Logo } from '@/brand/logo/Logo';
import { PAGINA_PELU } from '@/content/demos/peluqueria/ui';
import { DemoPeluqueria } from '@/features/demo/peluqueria/DemoPeluqueria';

const TITULO = PAGINA_PELU.titulo;
const DESCRIPCION = PAGINA_PELU.descripcion;

export const metadata: Metadata = {
  title: TITULO,
  description: DESCRIPCION,
  alternates: { canonical: '/demo/peluqueria' },
  openGraph: {
    type: 'website',
    locale: 'es_AR',
    siteName: PAGINA_PELU.og.sitio,
    url: '/demo/peluqueria',
    title: PAGINA_PELU.og.titulo(TITULO),
    description: DESCRIPCION,
  },
};

export default function DemoPeluqueriaPage() {
  return (
    <main>
      <DemoPeluqueria
        encabezado={
          <>
            <Link
              href="/empezar"
              aria-label={PAGINA_PELU.ariaLogo}
              className="inline-flex min-h-tap items-center"
            >
              <Logo />
            </Link>
            <h1 className="mt-6 text-title font-semibold text-balance">
              {PAGINA_PELU.encabezado.titulo}
            </h1>
            <p className="mt-2 max-w-xl text-lead text-muted">{PAGINA_PELU.encabezado.bajada}</p>
          </>
        }
      />
    </main>
  );
}
