import { Cierre } from '@/components/marketing/editorial/Cierre';
import { HeroPagina } from '@/components/marketing/editorial/Hero';
import { NosotrosPagina } from '@/components/marketing/editorial/Nosotros';
import { Pagina } from '@/components/marketing/editorial/Pagina';
import { NOSOTROS as N } from '@/content/paginas';
import { metadataPagina } from '../_landing/metadata';

export const metadata = metadataPagina({
  titulo: N.seo.titulo,
  descripcion: N.seo.descripcion,
  ruta: '/nosotros',
});

/** Quiénes somos: Julián, cómo trabajamos, los proyectos y el contacto. */
export default function PaginaNosotros() {
  return (
    <Pagina>
      <HeroPagina rotulo={N.rotulo} titulo={N.titulo} />
      <NosotrosPagina />
      <Cierre />
    </Pagina>
  );
}
