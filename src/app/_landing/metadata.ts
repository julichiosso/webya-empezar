import type { Metadata } from 'next';
import { SEO_SITIO } from '@/content/seo';

/**
 * Metadata completa de una página del sitio: título con la plantilla, descripción, canonical relativo
 * (se resuelve contra metadataBase = https://webya.dev) y Open Graph/Twitter con la imagen de la home.
 */
export function metadataPagina({
  titulo,
  descripcion,
  ruta,
}: {
  titulo: string;
  descripcion: string;
  ruta: string;
}): Metadata {
  const conMarca = SEO_SITIO.tituloConMarca(titulo);
  return {
    title: titulo,
    description: descripcion,
    alternates: { canonical: ruta },
    openGraph: {
      type: 'website',
      locale: 'es_AR',
      siteName: SEO_SITIO.nombre,
      url: ruta,
      title: conMarca,
      description: descripcion,
      // Al definir openGraph acá se pierde la imagen heredada de app/opengraph-image: se repite.
      images: [{ url: '/opengraph-image', width: 1200, height: 630, alt: SEO_SITIO.og.alt }],
    },
    twitter: {
      card: 'summary_large_image',
      title: conMarca,
      description: descripcion,
      images: ['/opengraph-image'],
    },
  };
}
