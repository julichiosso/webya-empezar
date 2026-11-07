import type { ReactNode, Ref } from 'react';
import { cn } from '@/components/ui/clases';
import { WIZARD } from '@/content/empezar/wizard';
import { MICROCOPY } from '@/content/microcopy';
import { TOTAL_PANTALLAS } from './state';

interface MarcoProps {
  /** 1, 2 o 3: la pantalla que se cuenta ("Paso 2 de 3"). */
  pantalla: number;
  /** Botón "Atrás" (o nada: el lugar queda reservado y la barra no se mueve). */
  atras?: ReactNode;
  /** Titular del hero: se ve en la primera pantalla; después, solo para lectores de pantalla. */
  encabezado?: ReactNode;
  /** Columna derecha en escritorio (vista previa en vivo, sticky). */
  aside: ReactNode;
  /** La columna derecha también se ve en celular, debajo de la pantalla (la vitrina del hero). */
  asideEnCelular?: boolean;
  children: ReactNode;
  ref?: Ref<HTMLElement>;
}

/**
 * Marco del flujo de /empezar: el hero entero. A la izquierda el titular y la pantalla; a la derecha,
 * en escritorio, el celular con el sitio. No tiene estado ni JS propio: lo usan igual el HTML del
 * servidor (pantalla 1, antes de descargar el wizard) y el wizard ya cargado, así el cambio de uno a
 * otro no mueve nada.
 */
export function Marco({
  pantalla,
  atras,
  encabezado,
  aside,
  asideEnCelular = false,
  children,
  ref,
}: MarcoProps) {
  return (
    <section
      id="wizard"
      ref={ref}
      aria-label={WIZARD.ariaSeccion}
      // Debajo de lg, el flujo mide al menos la pantalla: al pasar a una más alta ("Así te queda")
      // no empuja a la vista lo que está debajo (CLS 0 aunque la red tarde).
      className="scroll-mt-16 max-lg:min-h-svh"
    >
      <div className="lg:grid lg:grid-cols-[minmax(0,1fr)_22rem] lg:gap-12 xl:grid-cols-[minmax(0,1fr)_24rem] xl:gap-20">
        <div className="min-w-0">
          {encabezado && <div className={pantalla === 1 ? undefined : 'sr-only'}>{encabezado}</div>}
          {/* En la primera pantalla no hay "Paso 1 de 3": la barra aparece al avanzar. */}
          {pantalla > 1 && (
            <div className="mb-4 sm:mb-6">
              <div className="mb-2 flex min-h-tap items-center justify-between">
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
          )}
          {children}
        </div>
        <aside
          aria-hidden="true"
          className={cn('lg:block', asideEnCelular ? 'mt-10 lg:mt-0' : 'hidden')}
        >
          <div className="sticky top-24">{aside}</div>
        </aside>
      </div>
    </section>
  );
}
