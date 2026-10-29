import type { MetadataRoute } from 'next';
import { siteConfig } from '@/lib/site-config';

// La raíz redirige a /empezar (ver next.config.ts). /marca es interna: no se lista.
export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: `${siteConfig.url}/empezar`, changeFrequency: 'monthly', priority: 1 },
    { url: `${siteConfig.url}/demo/gastronomia`, changeFrequency: 'monthly', priority: 0.8 },
  ];
}
