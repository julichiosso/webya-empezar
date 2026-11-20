import type { Metadata } from 'next';
import { Cierre } from '@/components/marketing/editorial/Cierre';
import { Pagina } from '@/components/marketing/editorial/Pagina';
import { HeroZona, SeccionMapaZona } from '@/components/marketing/editorial/Zona';
import { ZONA as Z } from '@/content/paginas';
import { jsonLdNegocio, serializarLd } from '@/content/seo';
import { siteConfig } from '@/lib/site-config';
import { metadataPagina } from '../_landing/metadata';

const base = metadataPagina({
  titulo: Z.seo.titulo,
  descripcion: Z.seo.descripcion,
  ruta: '/zona',
});

export const metadata: Metadata = {
  ...base,
  // El título ya lleva la marca adelante: sin la plantilla "| Webya".
  title: { absolute: Z.seo.titulo },
  // La imagen para compartir es la del mapa (app/zona/opengraph-image.tsx).
  openGraph: {
    ...base.openGraph,
    images: [{ url: '/zona/opengraph-image', width: 1200, height: 630, alt: Z.seo.descripcion }],
  },
  twitter: { ...base.twitter, images: ['/zona/opengraph-image'] },
};

const LD = jsonLdNegocio({
  url: siteConfig.url,
  email: siteConfig.contactEmail,
  instagram: siteConfig.instagramUrl,
  telefono: siteConfig.whatsappNumber || undefined,
});

/**
 * San Francisco y San Jorge: una sola página para la zona (sin páginas por localidad, que serían contenido
 * duplicado). Hero con las dos ciudades, el mapa real conectado con las listas y el cierre de contacto.
 */
export default function PaginaZona() {
  return (
    <Pagina>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: serializarLd(LD) }} />
      <HeroZona />
      <SeccionMapaZona />
      <Cierre />
    </Pagina>
  );
}
