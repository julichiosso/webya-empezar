import type { MetadataRoute } from 'next';
import { LANDINGS } from '@/content/landings';
import { siteConfig } from '@/lib/site-config';

// /empezar redirige a la home. /marca y /sistema son internas: no se listan.
export default function sitemap(): MetadataRoute.Sitemap {
  const u = siteConfig.url;
  return [
    { url: `${u}/`, changeFrequency: 'monthly', priority: 1 },
    ...Object.values(LANDINGS).map((l) => ({
      url: `${u}${l.ruta}`,
      changeFrequency: 'monthly' as const,
      priority: 0.9,
    })),
    { url: `${u}/demo/gastronomia`, changeFrequency: 'monthly', priority: 0.6 },
    { url: `${u}/privacidad`, changeFrequency: 'yearly', priority: 0.2 },
    { url: `${u}/terminos`, changeFrequency: 'yearly', priority: 0.2 },
  ];
}
