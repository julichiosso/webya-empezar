'use client';

import { useEffect, useRef, useState, type ReactNode } from 'react';
import { ESTUDIO } from '@/content/demos/studio';
import { track } from '@/lib/analytics';

export interface PasoAsistente {
  id: string;
  titulo: string;
  ayuda?: string;
  contenido: ReactNode;
}

/**
 * Asistente "Te voy guiando": una pregunta por pantalla, título grande, "Paso 2 de 5" y una barra de
 * avance. Abajo, fijos y grandes: Atrás y Siguiente; arriba, Saltar (todo es opcional). En el celular ocupa
 * toda la pantalla; en la compu, una caja centrada con la vista previa al costado (la pone la demo).
 */
export function Asistente({
  demo,
  pasos,
  onTerminar,
  vista,
}: {
  demo: string;
  pasos: readonly PasoAsistente[];
  onTerminar: () => void;
  /** Vista previa en vivo, al costado en la compu. */
  vista?: ReactNode;
}) {
  const [i, setI] = useState(0);
  const titulo = useRef<HTMLHeadingElement>(null);
  const paso = pasos[i]!;
  const ultimo = i === pasos.length - 1;

  // Cada paso nuevo lleva el foco a su título: los lectores de pantalla lo anuncian.
  useEffect(() => {
    titulo.current?.focus();
  }, [i]);

  const avanzar = (accion: 'siguiente' | 'saltar') => {
    track('demo_asistente', { demo, paso: i + 1, accion: ultimo ? 'fin' : accion });
    if (ultimo) onTerminar();
    else setI(i + 1);
  };

  return (
    <section
      aria-label={ESTUDIO.asistente.aria}
      className="tono-claro fixed inset-x-0 top-14 bottom-0 z-30 flex bg-ed-bg lg:static lg:inset-auto lg:min-h-[calc(100svh-3.5rem)]"
    >
      <div className="flex min-w-0 flex-1 flex-col lg:mx-auto lg:max-w-xl lg:py-10">
        <div className="flex items-center justify-between gap-3 px-4 pt-4 lg:px-0">
          <p className="text-[1rem] font-semibold text-ed-muted tabular-nums">
            {ESTUDIO.asistente.paso(i + 1, pasos.length)}
          </p>
          <button
            type="button"
            onClick={() => {
              track('demo_asistente', { demo, paso: i + 1, accion: 'saltar' });
              onTerminar();
            }}
            className="min-h-12 rounded-full px-4 text-[1rem] font-medium underline underline-offset-4"
          >
            {ESTUDIO.asistente.saltarTodo}
          </button>
        </div>
        <div
          aria-hidden="true"
          className="mx-4 mt-2 h-1.5 overflow-hidden rounded-full bg-ed-surface lg:mx-0"
        >
          <div
            className="h-full rounded-full bg-ed-fg transition-[width] duration-500"
            style={{ width: `${((i + 1) / pasos.length) * 100}%` }}
          />
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto px-4 pt-6 pb-6 lg:px-0">
          <h2
            ref={titulo}
            tabIndex={-1}
            className="text-[1.875rem] leading-tight font-semibold tracking-[-0.03em] outline-none md:text-[2.25rem]"
          >
            {paso.titulo}
          </h2>
          {paso.ayuda ? <p className="mt-2 text-[1.125rem] text-ed-muted">{paso.ayuda}</p> : null}
          <div key={paso.id} className="mt-6">
            {paso.contenido}
          </div>
        </div>

        <div className="grid shrink-0 grid-cols-[auto_1fr] gap-2.5 border-t border-ed-line bg-ed-bg px-4 pt-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] lg:border-0 lg:px-0">
          <button
            type="button"
            disabled={i === 0}
            onClick={() => setI(i - 1)}
            className="min-h-14 rounded-full border border-ed-line-strong px-6 text-[1.0625rem] font-semibold disabled:opacity-35"
          >
            {ESTUDIO.asistente.atras}
          </button>
          <button
            type="button"
            onClick={() => avanzar('siguiente')}
            className="min-h-14 rounded-full bg-ed-fg px-6 text-[1.125rem] font-semibold text-ed-bg"
          >
            {ultimo ? ESTUDIO.asistente.listo : ESTUDIO.asistente.siguiente}
          </button>
        </div>
      </div>
      {vista ? (
        <div className="hidden w-[min(42vw,34rem)] shrink-0 items-center justify-center bg-ed-surface p-8 lg:flex">
          {vista}
        </div>
      ) : null}
    </section>
  );
}
