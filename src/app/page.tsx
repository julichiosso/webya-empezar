import type { Metadata } from 'next';
import { Suspense } from 'react';
import { Bento } from '@/components/marketing/editorial/Bento';
import { Cierre } from '@/components/marketing/editorial/Cierre';
import { Encabezado, ID_PRINCIPAL } from '@/components/marketing/editorial/Encabezado';
import { Hechos } from '@/components/marketing/editorial/Hechos';
import { Hero } from '@/components/marketing/editorial/Hero';
import { Marquesina } from '@/components/marketing/editorial/Marquesina';
import { Pedidos } from '@/components/marketing/editorial/Pedidos';
import { Pie } from '@/components/marketing/editorial/Pie';
import { Preguntas } from '@/components/marketing/editorial/Preguntas';
import { Proceso } from '@/components/marketing/editorial/Proceso';
import { Proyectos } from '@/components/marketing/editorial/Proyectos';
import { RubrosIndice } from '@/components/marketing/editorial/RubrosIndice';
import { Turnero } from '@/components/marketing/editorial/Turnero';
import { FAQ_HOME } from '@/content/home';
import { SEO_SITIO, jsonLdFaq, jsonLdNegocio, serializarLd } from '@/content/seo';
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
  jsonLdFaq(FAQ_HOME),
];

/**
 * Home editorial. Capítulos alternando oscuro y claro: hero → rubros → qué armo (bento) → turnero
 * (sticky) → pedidos (split) → cita y cifras → proyectos (carril) → índice de rubros → cómo trabajo
 * → configurador → preguntas → cierre. Todo de servidor salvo el configurador y los controles del carril.
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
        <Hero />
        {/*
          Cada capítulo en su propio límite de Suspense: React hidrata por partes y cede el hilo entre
          una y otra, en lugar de una sola tarea larga sobre toda la página (TBT).
        */}
        {[
          <Marquesina key="marquesina" />,
          <Bento key="bento" numero={1} />,
          <Turnero key="turnero" numero={2} />,
          <Pedidos key="pedidos" numero={3} />,
          <Hechos key="hechos" />,
          <Proyectos key="proyectos" numero={4} />,
          <RubrosIndice key="rubros" numero={5} />,
          <Proceso key="proceso" numero={6} />,
          <SeccionConfigurador key="armar" numero={7} />,
          <Preguntas key="preguntas" numero={8} preguntas={FAQ_HOME} />,
          <Cierre key="cierre" />,
        ].map((seccion) => (
          <Suspense key={seccion.key}>{seccion}</Suspense>
        ))}
      </main>
      <Pie />
    </>
  );
}
