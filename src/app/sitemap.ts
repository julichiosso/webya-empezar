import type { MetadataRoute } from 'next';
import { LANDINGS } from '@/content/landings';
import { siteConfig } from '@/lib/site-config';

/** Todas las páginas públicas. Las demos van con prioridad baja: son para probar, no para buscar. */
export default function sitemap(): MetadataRoute.Sitemap {
  const u = siteConfig.url;
  const pagina = (
    ruta: string,
    priority: number,
    changeFrequency: 'monthly' | 'yearly' = 'monthly',
  ) => ({
    url: `${u}${ruta}`,
    changeFrequency,
    priority,
  });
  return [
    pagina('/', 1),
    ...Object.values(LANDINGS).map((l) => pagina(l.ruta, 0.9)),
    pagina('/proyectos', 0.8),
    pagina('/armar', 0.8),
    pagina('/nosotros', 0.7),
    pagina('/zona', 0.7),
    pagina('/demos', 0.6),
    pagina('/demos/pedidos', 0.5),
    pagina('/demos/turnos', 0.5),
    pagina('/demos/web', 0.5),
    pagina('/demos/tienda', 0.5),
    pagina('/privacidad', 0.2, 'yearly'),
    pagina('/terminos', 0.2, 'yearly'),
  ];
}
