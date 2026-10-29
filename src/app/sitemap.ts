import type { MetadataRoute } from 'next';
import { siteConfig } from '@/lib/site-config';

// Hoy el sitio es una sola página: la raíz redirige a /empezar (ver next.config.ts).
export default function sitemap(): MetadataRoute.Sitemap {
  return [{ url: `${siteConfig.url}/empezar`, changeFrequency: 'monthly', priority: 1 }];
}
