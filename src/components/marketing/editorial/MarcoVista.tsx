'use client';

import type { ReactNode } from 'react';
import { Escalado } from '@/components/patterns/Escalado';
import { Telefono } from './Pantallas';

export type VistaDispositivo = 'movil' | 'escritorio';

/**
 * Marco de la vista previa de las demos de web y tienda (escritorio): el celular, con el contenido
 * dibujado a 375 px y escalado, o una ventana de navegador con el contenido a 1280 px. Plano: bordes
 * de 1 px, sin sombras. La barra de la ventana muestra el dominio de ejemplo.
 */
export function MarcoVista({
  vista,
  dominio,
  children,
}: {
  vista: VistaDispositivo;
  dominio: string;
  children: ReactNode;
}) {
  if (vista === 'movil') {
    return (
      <Telefono className="d-tel shrink-0" decorativo={false}>
        <Escalado>{children}</Escalado>
      </Telefono>
    );
  }
  return (
    <div className="d-ventana flex w-full flex-col overflow-hidden rounded-2xl border border-ed-line-strong bg-ed-bg">
      <div className="flex h-9 shrink-0 items-center gap-3 border-b border-ed-line px-3">
        <span aria-hidden="true" className="flex gap-1.5">
          <span className="size-2.5 rounded-full border border-ed-line-strong" />
          <span className="size-2.5 rounded-full border border-ed-line-strong" />
          <span className="size-2.5 rounded-full border border-ed-line-strong" />
        </span>
        <span className="mx-auto rounded-md border border-ed-line px-3 py-0.5 text-[0.6875rem] text-ed-muted">
          {dominio}
        </span>
        <span aria-hidden="true" className="w-13" />
      </div>
      <div className="relative min-h-0 flex-1">
        <Escalado ancho={1280}>{children}</Escalado>
      </div>
    </div>
  );
}

/** Selector Celular / Computadora (solo escritorio: en el celular la vista previa ya es el celular). */
export function SelectorVista({
  vista,
  onVista,
  etiqueta,
  celular,
  computadora,
}: {
  vista: VistaDispositivo;
  onVista: (v: VistaDispositivo) => void;
  etiqueta: string;
  celular: string;
  computadora: string;
}) {
  const boton = (v: VistaDispositivo, texto: string) => (
    <button
      type="button"
      aria-pressed={vista === v}
      onClick={() => onVista(v)}
      className="min-h-10 flex-1 rounded-full px-4 text-[0.8125rem] font-semibold text-ed-muted aria-pressed:bg-ed-fg aria-pressed:text-ed-bg"
    >
      {texto}
    </button>
  );
  return (
    <div role="group" aria-label={etiqueta}>
      <p className="e-rotulo mb-2 text-ed-muted">{etiqueta}</p>
      <div className="flex gap-1 rounded-full border border-ed-line-strong p-1">
        {boton('movil', celular)}
        {boton('escritorio', computadora)}
      </div>
    </div>
  );
}
