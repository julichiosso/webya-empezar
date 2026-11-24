import type { Metadata } from 'next';
import { Cierre } from '@/components/marketing/editorial/Cierre';
import { FranjaZona } from '@/components/marketing/editorial/FranjaZona';
import { NosotrosHome } from '@/components/marketing/home3d/NosotrosHome';
import { ProductoVista } from '@/components/marketing/home3d/ProductoVista';
import { Pagina } from '@/components/marketing/editorial/Pagina';
import { Rubros } from '@/components/marketing/editorial/Rubros';
import { Confian } from '@/components/marketing/inicio/Confian';
import { HeroCalle } from '@/components/marketing/inicio/HeroCalle';
import { Servicios } from '@/components/marketing/inicio/Servicios';
import { Trabajos } from '@/components/marketing/inicio/Trabajos';
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
 * Home: cada pantalla, una sola idea. La calle que se hace de noche (tu negocio sigue abierto), los
 * clientes que pasan en la cinta, los últimos trabajos, qué hacemos (los productos con fotos), qué
 * necesita tu negocio (buscador y rubros), el producto en celulares reales, la zona, quiénes somos y el cierre. Poco texto: la gente
 * no lee. Lo largo vive en la página de cada producto.
 */
export default function Inicio() {
  return (
    <Pagina headerEncima>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: serializarLd(LD) }} />
      <HeroCalle />
      <Confian />
      <Trabajos />
      <Servicios />
      <Rubros />
      <ProductoVista />
      <FranjaZona />
      <NosotrosHome />
      <Cierre />
    </Pagina>
  );
}
