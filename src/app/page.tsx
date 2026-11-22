import type { Metadata } from 'next';
import { Bento } from '@/components/marketing/editorial/Bento';
import { Cierre } from '@/components/marketing/editorial/Cierre';
import { FranjaZona } from '@/components/marketing/editorial/FranjaZona';
import { Hero3D } from '@/components/marketing/home3d/Hero3D';
import { NosotrosHome } from '@/components/marketing/home3d/NosotrosHome';
import { ProductoVista } from '@/components/marketing/home3d/ProductoVista';
import { Pagina } from '@/components/marketing/editorial/Pagina';
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
 * Home: cada pantalla, una sola idea. El símbolo 3D con el lema (Creá. Digitalizá. Crecé.), qué necesita tu
 * negocio (buscador y rubros), el producto en celulares reales, los productos, los proyectos, la zona,
 * quiénes somos y el cierre. Poco texto: la gente no lee. Lo largo vive en la página de cada producto.
 */
export default function Inicio() {
  return (
    <Pagina>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: serializarLd(LD) }} />
      <Hero3D />
      <Rubros />
      <ProductoVista />
      <Bento />
      <ProyectosInicio />
      <FranjaZona />
      <NosotrosHome />
      <Cierre />
    </Pagina>
  );
}
