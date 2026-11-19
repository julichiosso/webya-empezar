import { CabezaSeccion } from '@/components/marketing/editorial/CabezaSeccion';
import { CONFIGURADOR } from '@/content/configurador';
import type { TipoId } from '@/content/servicios';
import { Configurador } from './Configurador';

/**
 * Capítulo "Armá tu sistema". El encabezado es de servidor; el configurador es la única isla de
 * React interactiva de la página (se hidrata con el HTML ya pintado: no mueve nada).
 */
export function SeccionConfigurador({
  numero = 7,
  inicial,
}: {
  numero?: number;
  inicial?: TipoId;
}) {
  return (
    <section
      id={CONFIGURADOR.id}
      className="tono-oscuro e-seccion e-seccion-viva scroll-mt-16"
      aria-labelledby="titulo-armar"
    >
      <div className="e-wrap">
        <CabezaSeccion
          numero={numero}
          rotulo={CONFIGURADOR.rotulo}
          titulo={CONFIGURADOR.titulo}
          bajada={CONFIGURADOR.bajada}
          idTitulo="titulo-armar"
        />
        <div className="mt-14 md:mt-20">
          <Configurador inicial={inicial} />
        </div>
      </div>
    </section>
  );
}
