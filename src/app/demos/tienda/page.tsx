import type { Metadata } from 'next';
import { DEMO_TIENDA_UI } from '@/content/demos/tienda/datos';
import { DemoTienda } from '@/features/demo/tienda/DemoTienda';
import { metadataPagina } from '../../_landing/metadata';

export const metadata: Metadata = metadataPagina({
  titulo: DEMO_TIENDA_UI.titulo,
  descripcion: DEMO_TIENDA_UI.descripcion,
  ruta: '/demos/tienda',
});

export default function DemoTiendaPage() {
  return <DemoTienda />;
}
