import type { Metadata } from 'next';
import { Anton } from 'next/font/google';
import { PAGINA_PEDIDOS } from '@/content/demos/pedidos/ui';
import { DemoPedidos } from '@/features/demo/pedidos/DemoPedidos';
import '@/brand/demos/pedidos.css';

/** La tipografía de títulos del sistema de Micio's (solo en esta página). */
const anton = Anton({
  weight: '400',
  subsets: ['latin'],
  variable: '--font-anton',
  display: 'swap',
});

export const metadata: Metadata = {
  title: PAGINA_PEDIDOS.titulo,
  description: PAGINA_PEDIDOS.descripcion,
  alternates: { canonical: '/demos/pedidos' },
  openGraph: {
    type: 'website',
    locale: 'es_AR',
    siteName: PAGINA_PEDIDOS.og.sitio,
    url: '/demos/pedidos',
    title: PAGINA_PEDIDOS.og.titulo(PAGINA_PEDIDOS.titulo),
    description: PAGINA_PEDIDOS.descripcion,
    images: [{ url: '/opengraph-image', width: 1200, height: 630 }],
  },
};

export default function DemoPedidosPage() {
  return (
    <div className={anton.variable}>
      <DemoPedidos />
    </div>
  );
}
