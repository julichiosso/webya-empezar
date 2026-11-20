import { Cierre } from '@/components/marketing/editorial/Cierre';
import { HeroPagina } from '@/components/marketing/editorial/Hero';
import { Pagina } from '@/components/marketing/editorial/Pagina';
import { SeccionCasos } from '@/components/marketing/editorial/Proyectos';
import { PROYECTOS_PAGINA as P } from '@/content/paginas';
import { metadataPagina } from '../_landing/metadata';

export const metadata = metadataPagina({
  titulo: P.seo.titulo,
  descripcion: P.seo.descripcion,
  ruta: '/proyectos',
});

/** Todos los casos: el índice con su panel (escritorio) o las tarjetas (celular), y el cierre. */
export default function PaginaProyectos() {
  return (
    <Pagina>
      <HeroPagina rotulo={P.rotulo} titulo={P.titulo} bajada={P.bajada} />
      <SeccionCasos enPagina />
      <Cierre />
    </Pagina>
  );
}
