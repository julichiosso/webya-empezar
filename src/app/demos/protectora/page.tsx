import type { Metadata } from 'next';
import { UI_PROTECTORA } from '@/content/demos/protectora';
import { DemoProtectora } from '@/features/demo/protectora/DemoProtectora';
import '@/brand/demos/protectora.css';

export const metadata: Metadata = {
  title: UI_PROTECTORA.titulo,
  description: UI_PROTECTORA.descripcion,
  alternates: { canonical: '/demos/protectora' },
  openGraph: {
    type: 'website',
    locale: 'es_AR',
    url: '/demos/protectora',
    title: `${UI_PROTECTORA.titulo} | Webya`,
    description: UI_PROTECTORA.descripcion,
    images: [{ url: '/opengraph-image', width: 1200, height: 630 }],
  },
};

export default function DemoProtectoraPage() {
  return <DemoProtectora />;
}
