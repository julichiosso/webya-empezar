import type { Metadata } from 'next';
import { Suspense } from 'react';
import { Cierre } from '@/components/marketing/editorial/Cierre';
import { Encabezado, ID_PRINCIPAL } from '@/components/marketing/editorial/Encabezado';
import { Hero } from '@/components/marketing/editorial/Hero';
import { Pie } from '@/components/marketing/editorial/Pie';
import { Preguntas } from '@/components/marketing/editorial/Preguntas';
import { Proceso } from '@/components/marketing/editorial/Proceso';
import { Proyectos } from '@/components/marketing/editorial/Proyectos';
import { CTA } from '@/content/home';
import type { Landing } from '@/content/landings';
import { SEO_SITIO, jsonLdFaq, jsonLdServicio, serializarLd } from '@/content/seo';
import { getServicio } from '@/content/servicios';
import { SeccionConfigurador } from '@/features/configurador/SeccionConfigurador';
import { siteConfig } from '@/lib/site-config';

/** Metadata completa de una página de servicio (la imagen OG la hereda de la home). */
export function metadataLanding(l: Landing): Metadata {
  const titulo = SEO_SITIO.tituloConMarca(l.seo.titulo);
  return {
    title: l.seo.titulo,
    description: l.seo.descripcion,
    alternates: { canonical: l.ruta },
    openGraph: {
      type: 'website',
      locale: 'es_AR',
      siteName: SEO_SITIO.nombre,
      url: l.ruta,
      title: titulo,
      description: l.seo.descripcion,
      // Al definir openGraph acá se pierde la imagen heredada de app/opengraph-image: se repite.
      images: [{ url: '/opengraph-image', width: 1200, height: 630, alt: SEO_SITIO.og.alt }],
    },
    twitter: {
      card: 'summary_large_image',
      title: titulo,
      description: l.seo.descripcion,
      images: ['/opengraph-image'],
    },
  };
}

/**
 * Plantilla de las páginas por servicio: mismo sistema y mismos componentes que la home, con el hero,
 * el bloque central, los proyectos y el configurador enfocados en un solo servicio.
 */
export function LandingServicio({
  landing,
  children,
}: {
  landing: Landing;
  children: React.ReactNode;
}) {
  const servicio = getServicio(landing.tipo)!;
  const ld = [
    jsonLdServicio(siteConfig.url, servicio, landing.nombre),
    jsonLdFaq(landing.preguntas),
  ];
  return (
    <>
      {ld.map((d, i) => (
        <script
          key={i}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: serializarLd(d) }}
        />
      ))}
      <Encabezado />
      <main id={ID_PRINCIPAL} tabIndex={-1} className="outline-none">
        <Hero
          rotulo={landing.hero.rotulo}
          titulo={landing.hero.titulo}
          bajada={landing.hero.bajada}
          armar={landing.tipo}
          secundario={{ href: '#proyectos', texto: CTA.proyectos }}
        />
        {/* Hidratación por partes (ver app/page.tsx). */}
        {[
          <Suspense key="bloque">{children}</Suspense>,
          <Proyectos key="proyectos" numero={2} filtro={(p) => p.tipo === landing.tipo} />,
          <Proceso key="proceso" numero={3} />,
          <SeccionConfigurador key="armar" numero={4} inicial={landing.tipo} />,
          <Preguntas key="preguntas" numero={5} preguntas={landing.preguntas} />,
          <Cierre key="cierre" />,
        ].map((seccion) => (
          <Suspense key={seccion.key}>{seccion}</Suspense>
        ))}
      </main>
      <Pie />
    </>
  );
}
