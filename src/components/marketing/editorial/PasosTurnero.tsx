'use client';

import { useEffect, useRef, useState } from 'react';
import { cn } from '@/components/ui/clases';
import { AvisoPush, PantallasTurneroApiladas, Telefono } from './Pantallas';

/** En este paso (la seña acreditada) entra el aviso al celular del dueño. */
const PASO_SENA = 2;

interface Paso {
  rotulo: string;
  titulo: string;
  texto: string;
}

const CADA_MS = 4500;

/**
 * Los pasos del turnero en una sola pantalla: la lista a un lado y el teléfono mostrando el paso activo.
 * Avanza solo mientras está a la vista (con una barrita que se llena); si la persona toca un paso, se
 * queda ahí. Con movimiento reducido no avanza solo. Sin JS se ve el primer paso.
 */
export function PasosTurnero({
  pasos,
  etiqueta,
  pantallas,
}: {
  pasos: readonly Paso[];
  etiqueta: string;
  /** Otras pantallas, una por paso (por defecto, las del turnero con el aviso de la seña). */
  pantallas?: readonly React.ReactNode[];
}) {
  const [activo, setActivo] = useState(1);
  const [tocado, setTocado] = useState(false);
  const [aLaVista, setALaVista] = useState(false);
  const caja = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = caja.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => setALaVista(Boolean(e?.isIntersecting)), {
      threshold: 0.35,
    });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const auto = aLaVista && !tocado;
  useEffect(() => {
    if (!auto || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const t = setInterval(() => setActivo((a) => (a % pasos.length) + 1), CADA_MS);
    return () => clearInterval(t);
  }, [auto, pasos.length]);

  return (
    <div
      ref={caja}
      data-steps=""
      data-paso={activo}
      className="grid gap-8 lg:grid-cols-12 lg:items-center lg:gap-6"
    >
      <ol className="space-y-1.5 lg:col-span-6">
        {pasos.map((p, i) => {
          const n = i + 1;
          const es = n === activo;
          return (
            <li key={p.rotulo}>
              <button
                type="button"
                aria-current={es ? 'step' : undefined}
                onClick={() => {
                  setActivo(n);
                  setTocado(true);
                }}
                className={cn(
                  'relative w-full overflow-hidden rounded-2xl border px-4 py-3.5 text-left transition-colors md:px-5',
                  es
                    ? 'border-ed-line-strong bg-ed-surface'
                    : 'border-transparent hover:bg-ed-surface',
                )}
              >
                <span className="e-rotulo flex gap-3 text-ed-muted">
                  <span className={cn('tabular-nums', es && 'text-ed-fg')}>
                    {String(n).padStart(2, '0')}
                  </span>
                  <span>{p.rotulo}</span>
                </span>
                <span className="mt-1 block text-[1.125rem] leading-snug font-semibold tracking-tight md:text-[1.375rem]">
                  {p.titulo}
                </span>
                {es ? (
                  <span className="e-cuerpo mt-1.5 block max-w-[46ch] text-ed-muted">
                    {p.texto}
                  </span>
                ) : null}
                {es && auto ? (
                  <span
                    key={activo}
                    aria-hidden="true"
                    className="e-progreso-paso absolute inset-x-0 bottom-0 h-0.5 bg-ed-fg"
                  />
                ) : null}
              </button>
            </li>
          );
        })}
      </ol>
      <div className="flex justify-center lg:col-span-5 lg:col-start-8">
        <div className="relative w-full max-w-[13rem] md:max-w-[16rem]">
          <Telefono etiqueta={etiqueta}>
            {pantallas ? (
              pantallas.map((p, i) => (
                <div key={i} className="e-escena absolute inset-0" data-escena={i + 1}>
                  {p}
                </div>
              ))
            ) : (
              <PantallasTurneroApiladas />
            )}
          </Telefono>
          {!pantallas && activo === PASO_SENA ? <AvisoPush key={activo} /> : null}
        </div>
      </div>
    </div>
  );
}
