import type { Metadata } from 'next';
import { DEMO_WEB_UI } from '@/content/demos/web/datos';
import { DemoWeb } from '@/features/demo/web/DemoWeb';
import { metadataPagina } from '../../_landing/metadata';

export const metadata: Metadata = metadataPagina({
  titulo: DEMO_WEB_UI.titulo,
  descripcion: DEMO_WEB_UI.descripcion,
  ruta: '/demos/web',
});

export default function DemoWebPage() {
  return <DemoWeb />;
}
