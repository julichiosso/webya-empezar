import type { Metadata } from 'next';
import Link from 'next/link';
import { Logo } from '@/brand/logo/Logo';
import { CREAR } from '@/content/crear';
import { SEO_SITIO } from '@/content/seo';
import { EditorSitio } from '@/features/empezar/crear/EditorSitio';

export const metadata: Metadata = {
  title: CREAR.meta.titulo,
  description: CREAR.meta.descripcion,
  alternates: { canonical: '/crear' },
  openGraph: {
    type: 'website',
    locale: 'es_AR',
    siteName: SEO_SITIO.nombre,
    url: '/crear',
    title: SEO_SITIO.tituloConMarca(CREAR.meta.titulo),
    description: CREAR.meta.descripcion,
  },
};

export default function CrearPage() {
  return (
    <main>
      <EditorSitio
        encabezado={
          <>
            <Link
              href="/empezar"
              aria-label={CREAR.ariaLogo}
              className="inline-flex min-h-tap items-center"
            >
              <Logo />
            </Link>
            <h1 className="mt-6 text-title font-semibold text-balance">{CREAR.titulo}</h1>
            <p className="mt-2 max-w-xl text-lead text-muted">{CREAR.bajada}</p>
          </>
        }
      />
    </main>
  );
}
