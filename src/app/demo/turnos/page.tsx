import type { Metadata } from 'next';
import { PAGINA_TURNOS } from '@/content/demos/turnos/ui';
import { DemoTurnos } from '@/features/demo/turnos/DemoTurnos';
import '@/brand/demos/turnos.css';

export const metadata: Metadata = {
  title: PAGINA_TURNOS.titulo,
  description: PAGINA_TURNOS.descripcion,
  alternates: { canonical: '/demo/turnos' },
  openGraph: {
    type: 'website',
    locale: 'es_AR',
    siteName: PAGINA_TURNOS.og.sitio,
    url: '/demo/turnos',
    title: PAGINA_TURNOS.og.titulo(PAGINA_TURNOS.titulo),
    description: PAGINA_TURNOS.descripcion,
    images: [{ url: '/opengraph-image', width: 1200, height: 630 }],
  },
};

export default function DemoTurnosPage() {
  return <DemoTurnos />;
}
