import { Cierre } from '@/components/marketing/editorial/Cierre';
import { HeroPagina } from '@/components/marketing/editorial/Hero';
import { Pagina } from '@/components/marketing/editorial/Pagina';
import { ProyectosGrilla } from '@/components/marketing/editorial/Proyectos';
import { PROYECTOS_PAGINA as P } from '@/content/paginas';
import { metadataPagina } from '../_landing/metadata';

export const metadata = metadataPagina({
  titulo: P.seo.titulo,
  descripcion: P.seo.descripcion,
  ruta: '/proyectos',
});

/** Todos los proyectos, en grilla visible: problema, qué armamos, qué ve el cliente y el link. */
export default function PaginaProyectos() {
  return (
    <Pagina>
      <HeroPagina rotulo={P.rotulo} titulo={P.titulo} bajada={P.bajada} />
      <ProyectosGrilla />
      <Cierre />
    </Pagina>
  );
}
