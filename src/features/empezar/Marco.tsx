import type { ReactNode, Ref } from 'react';
import { WIZARD } from '@/content/empezar/wizard';
import { MICROCOPY } from '@/content/microcopy';
import { TOTAL_PANTALLAS } from './state';

interface MarcoProps {
  /** 1, 2 o 3: la pantalla que se cuenta ("Paso 2 de 3"). */
  pantalla: number;
  /** Botón "Atrás" (o nada: el lugar queda reservado y la barra no se mueve). */
  atras?: ReactNode;
  /** Columna derecha en escritorio (vista previa en vivo, sticky). */
  aside: ReactNode;
  children: ReactNode;
  ref?: Ref<HTMLElement>;
}

/**
 * Marco del flujo de /empezar: progreso arriba, la pantalla a la izquierda y la vista previa
 * sticky a la derecha (escritorio). No tiene estado ni JS propio: lo usan igual el HTML del
 * servidor (pantalla 1, antes de descargar el wizard) y el wizard ya cargado, así el cambio de
 * uno a otro no mueve nada.
 */
export function Marco({ pantalla, atras, aside, children, ref }: MarcoProps) {
  return (
    <section
      id="wizard"
      ref={ref}
      aria-label={WIZARD.ariaSeccion}
      // Debajo de lg, el flujo mide al menos la pantalla: al pasar a una más alta ("Así te queda")
      // no empuja a la vista lo que está debajo (CLS 0 aunque la red tarde).
      className="scroll-mt-4 rounded-panel border border-line bg-surface/70 p-3 shadow-raised max-lg:min-h-svh sm:p-8 lg:p-10 lg:bajo:p-6"
    >
      <div className="lg:grid lg:grid-cols-[minmax(0,1fr)_22rem] lg:gap-12 xl:grid-cols-[minmax(0,1fr)_26rem]">
        <div className="min-w-0">
          <div className="mb-3 sm:mb-6 lg:bajo:mb-3">
            {/* En celular, en la pantalla 1 la fila no ocupa lugar: las tarjetas entran sin scroll. */}
            <div
              className={`mb-2 min-h-tap items-center justify-between ${pantalla === 1 ? 'hidden sm:flex' : 'flex'}`}
            >
              <div className="-ml-3 min-h-tap">{atras}</div>
              <p className="tabular text-small text-muted">
                {MICROCOPY.pasoDeTotal(pantalla, TOTAL_PANTALLAS)}
              </p>
            </div>
            {/* Barra de progreso: solo escala en X (transform), con transición CSS. */}
            <div
              role="progressbar"
              aria-label={WIZARD.ariaProgreso}
              aria-valuemin={1}
              aria-valuemax={TOTAL_PANTALLAS}
              aria-valuenow={pantalla}
              aria-valuetext={MICROCOPY.pasoDeTotal(pantalla, TOTAL_PANTALLAS)}
              className="h-1 overflow-hidden rounded-full bg-line"
            >
              <div
                className="h-full origin-left rounded-full bg-accent transition-transform duration-(--duration-slow) ease-(--ease-out) motion-reduce:transition-none"
                style={{ transform: `scaleX(${pantalla / TOTAL_PANTALLAS})` }}
              />
            </div>
          </div>
          {children}
        </div>
        <aside aria-hidden="true" className="hidden lg:block">
          <div className="sticky top-8">{aside}</div>
        </aside>
      </div>
    </section>
  );
}
