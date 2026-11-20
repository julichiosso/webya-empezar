import type { MetadataRoute } from 'next';
import { EDITORIAL } from '@/brand/tokens/colores';
import { FRASES } from '@/content/home';
import { SEO_SITIO } from '@/content/seo';

/** Manifiesto web: nombre, colores e íconos cuando se agrega Webya a la pantalla de inicio. */
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: SEO_SITIO.nombre,
    short_name: SEO_SITIO.nombre,
    description: `${FRASES.lema} ${SEO_SITIO.descripcion}`,
    start_url: '/',
    display: 'browser',
    background_color: EDITORIAL.tinta,
    theme_color: EDITORIAL.tinta,
    lang: 'es-AR',
    icons: [
      { src: '/icon.svg', type: 'image/svg+xml', sizes: 'any' },
      { src: '/apple-icon', type: 'image/png', sizes: '180x180' },
    ],
  };
}
