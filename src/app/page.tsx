import type { Metadata } from 'next';
import { Suspense } from 'react';
import { Bento } from '@/components/marketing/editorial/Bento';
import { Cierre } from '@/components/marketing/editorial/Cierre';
import { Encabezado, ID_PRINCIPAL } from '@/components/marketing/editorial/Encabezado';
import { Hero } from '@/components/marketing/editorial/Hero';
import { Pedidos } from '@/components/marketing/editorial/Pedidos';
import { Pie } from '@/components/marketing/editorial/Pie';
import { Proyectos } from '@/components/marketing/editorial/Proyectos';
import { Turnero } from '@/components/marketing/editorial/Turnero';
import { CTA } from '@/content/home';
import { SEO_SITIO, jsonLdNegocio, serializarLd } from '@/content/seo';
import { SeccionConfigurador } from '@/features/configurador/SeccionConfigurador';
import { siteConfig } from '@/lib/site-config';

export const metadata: Metadata = {
  title: { absolute: SEO_SITIO.tituloInicio },
  description: SEO_SITIO.descripcion,
  alternates: { canonical: '/' },
  openGraph: {
    type: 'website',
    locale: 'es_AR',
    siteName: SEO_SITIO.nombre,
    url: '/',
    title: SEO_SITIO.tituloInicio,
    description: SEO_SITIO.descripcion,
  },
  twitter: {
    card: 'summary_large_image',
    title: SEO_SITIO.tituloInicio,
    description: SEO_SITIO.descripcion,
  },
};

const LD = [
  jsonLdNegocio({
    url: siteConfig.url,
    email: siteConfig.contactEmail,
    instagram: siteConfig.instagramUrl,
    telefono: siteConfig.whatsappNumber || undefined,
  }),
];

/**
 * Home editorial. Capítulos alternando oscuro y claro: hero → qué armo (bento) → turnero (sticky) →
 * pedidos (split) → proyectos (carril) → configurador → cierre. Sin secciones de relleno: cada una
 * muestra un sistema real o lleva a armarlo. Todo de servidor salvo el configurador y el carril.
 */
export default function Inicio() {
  return (
    <>
      {LD.map((d, i) => (
        <script
          key={i}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: serializarLd(d) }}
        />
      ))}
      <Encabezado />
      <main id={ID_PRINCIPAL} tabIndex={-1} className="outline-none">
        <Hero secundario={{ href: '/demo', texto: CTA.verDemo, externo: true }} />
        {/*
          Cada capítulo en su propio límite de Suspense: React hidrata por partes y cede el hilo entre
          una y otra, en lugar de una sola tarea larga sobre toda la página (TBT).
        */}
        {[
          <Bento key="bento" numero={1} />,
          <Turnero key="turnero" numero={2} />,
          <Pedidos key="pedidos" numero={3} />,
          <Proyectos key="proyectos" numero={4} />,
          <SeccionConfigurador key="armar" numero={5} />,
          <Cierre key="cierre" />,
        ].map((seccion) => (
          <Suspense key={seccion.key}>{seccion}</Suspense>
        ))}
      </main>
      <Pie />
    </>
  );
}
