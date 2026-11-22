import type { Metadata } from 'next';
import { Bento } from '@/components/marketing/editorial/Bento';
import { Cierre } from '@/components/marketing/editorial/Cierre';
import { FranjaZona } from '@/components/marketing/editorial/FranjaZona';
import { HeroInicio } from '@/components/marketing/editorial/Hero';
import { Pagina } from '@/components/marketing/editorial/Pagina';
import { Porque } from '@/components/marketing/editorial/Porque';
import { ProyectosInicio } from '@/components/marketing/editorial/Proyectos';
import { Rubros } from '@/components/marketing/editorial/Rubros';
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
 * Home, como la portada de una marca de tecnología: el lema y los sitios reales en iPhones, los productos
 * en tarjetas (nombre, una línea, demo y más info), encontrar tu rubro, los proyectos, por qué Webya y el
 * cierre. Poco texto: la gente no lee. Lo largo vive en la página de cada producto.
 */
export default function Inicio() {
  return (
    <Pagina>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: serializarLd(LD) }} />
      <HeroInicio />
      <Rubros />
      <Bento />
      <ProyectosInicio />
      <FranjaZona />
      <Porque />
      <Cierre />
    </Pagina>
  );
}
