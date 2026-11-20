import { Pagina } from '@/components/marketing/editorial/Pagina';
import { ARMAR } from '@/content/paginas';
import { SeccionConfigurador } from '@/features/configurador/SeccionConfigurador';
import { metadataPagina } from '../_landing/metadata';

export const metadata = metadataPagina({
  titulo: ARMAR.seo.titulo,
  descripcion: ARMAR.seo.descripcion,
  ruta: '/armar',
});

/**
 * "Armá tu sistema": el configurador como página propia. La preselección llega por `?tipo=` (la lee el
 * cliente, así la página sigue siendo estática). Sin la barra de atajos: el configurador tiene la suya.
 */
export default function PaginaArmar() {
  return (
    <Pagina barra={false}>
      <SeccionConfigurador />
    </Pagina>
  );
}
