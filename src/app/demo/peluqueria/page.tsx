import type { Metadata } from 'next';
import { BarraDemo } from '@/components/marketing/editorial/BarraDemo';
import { PAGINA_PELU } from '@/content/demos/peluqueria/ui';
import { DemoPeluqueria } from '@/features/demo/peluqueria/DemoPeluqueria';

const TITULO = PAGINA_PELU.titulo;
const DESCRIPCION = PAGINA_PELU.descripcion;

export const metadata: Metadata = {
  title: TITULO,
  description: DESCRIPCION,
  alternates: { canonical: '/demo/peluqueria' },
  openGraph: {
    type: 'website',
    locale: 'es_AR',
    siteName: PAGINA_PELU.og.sitio,
    url: '/demo/peluqueria',
    title: PAGINA_PELU.og.titulo(TITULO),
    description: DESCRIPCION,
  },
};

export default function DemoPeluqueriaPage() {
  return (
    <>
      <BarraDemo demo="turnos" />
      <main>
        <DemoPeluqueria encabezado={<h1 className="sr-only">{PAGINA_PELU.encabezado.titulo}</h1>} />
      </main>
    </>
  );
}
