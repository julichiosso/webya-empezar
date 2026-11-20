import type { Metadata } from 'next';
import { Bento } from '@/components/marketing/editorial/Bento';
import { Cierre } from '@/components/marketing/editorial/Cierre';
import { HeroInicio } from '@/components/marketing/editorial/Hero';
import { Manifiesto } from '@/components/marketing/editorial/Manifiesto';
import { NosotrosInicio } from '@/components/marketing/editorial/Nosotros';
import { Pagina } from '@/components/marketing/editorial/Pagina';
import { ProyectosInicio } from '@/components/marketing/editorial/Proyectos';
import { SEO_SITIO, jsonLdNegocio, serializarLd } from '@/content/seo';
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

const LD = jsonLdNegocio({
  url: siteConfig.url,
  email: siteConfig.contactEmail,
  instagram: siteConfig.instagramUrl,
  telefono: siteConfig.whatsappNumber || undefined,
});

/**
 * Home hub: en la primera pantalla, la marca, qué armamos, el buscador, las dos acciones, los rubros y
 * dónde atendemos. Después, qué hacemos (Creá, Digitalizá, Crecé), el bento que lleva a cada producto, los proyectos reales, quiénes somos y el
 * cierre. Lo largo (cada
 * producto, el configurador, la zona) vive en su propia página.
 */
export default function Inicio() {
  return (
    <Pagina>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: serializarLd(LD) }} />
      <HeroInicio />
      <Manifiesto />
      <Bento />
      <ProyectosInicio />
      <NosotrosInicio />
      <Cierre />
    </Pagina>
  );
}
