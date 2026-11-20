import { LogoDibujo } from '@/brand/logo/LogoDibujo';
import { FRASES } from '@/content/home';
import { MICROCOPY } from '@/content/microcopy';

/**
 * Pantalla de carga: fondo negro, el logo que se escribe y, después, el lema. Arranca invisible y aparece recién a los
 * ~450 ms (CSS): si la página llega antes, ni se ve y no hay parpadeo.
 *
 * - `inicial`: la de la primera carga, en el layout. El script de movimiento le pone `.listo` a <html>
 *   cuando el documento terminó de llegar, y desaparece. Sin JS no se muestra nunca (noscript).
 * - Sin `inicial`: la de las navegaciones lentas (app/loading.tsx), mientras llega la página nueva.
 */
export function Carga({ inicial = false }: { inicial?: boolean }) {
  return (
    <div
      className={inicial ? 'carga carga-inicial' : 'carga'}
      role={inicial ? undefined : 'status'}
      aria-label={inicial ? undefined : MICROCOPY.cargando}
      aria-hidden={inicial || undefined}
    >
      <div className="grid justify-items-center">
        <LogoDibujo className="carga-logo" />
        {/* El lema aparece cuando el logo terminó de escribirse. */}
        <p className="carga-lema" aria-hidden="true">
          {FRASES.lema}
        </p>
      </div>
    </div>
  );
}
