import { CONFIGURADOR } from '@/content/configurador';
import type { TipoId } from '@/content/servicios';
import { Configurador } from './Configurador';

/**
 * Capítulo "Armá tu sistema". El encabezado es de servidor; el configurador es la única isla de
 * React interactiva de la página (se hidrata con el HTML ya pintado: no mueve nada).
 */
export function SeccionConfigurador({ inicial }: { inicial?: TipoId }) {
  return (
    <section
      id={CONFIGURADOR.id}
      className="tono-oscuro e-seccion-viva pt-8 pb-12 md:pt-14 md:pb-20"
      aria-labelledby="titulo-armar"
    >
      <div className="e-wrap">
        <p className="e-rotulo text-ed-muted">{CONFIGURADOR.rotulo}</p>
        <h1 id="titulo-armar" className="e-h2 mt-4 max-w-[22ch]">
          {CONFIGURADOR.titulo}
        </h1>
        <p className="e-lead mt-4 max-w-[52ch] text-ed-muted">{CONFIGURADOR.bajada}</p>
        <div className="mt-8 md:mt-12">
          <Configurador inicial={inicial} />
        </div>
      </div>
    </section>
  );
}
