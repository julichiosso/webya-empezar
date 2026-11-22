'use client';

import { useEffect, useRef, type ReactNode } from 'react';
import { ESTUDIO } from '@/content/demos/studio';
import { Cerrar } from './Iconos';

/**
 * Hoja de las demos sobre un `<dialog>` nativo (foco atrapado, Escape y fondo inerte sin librerías). En el
 * celular sube desde abajo a todo el ancho; en la compu aparece a la derecha. Se cierra con su botón
 * grande, con Escape o tocando afuera.
 */
export function HojaDemo({
  abierta,
  onCerrar,
  titulo,
  children,
}: {
  abierta: boolean;
  onCerrar: () => void;
  titulo: string;
  children: ReactNode;
}) {
  const ref = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const d = ref.current;
    if (!d) return;
    if (abierta && !d.open) d.showModal();
    if (!abierta && d.open) d.close();
  }, [abierta]);

  return (
    <dialog
      ref={ref}
      aria-label={titulo}
      onClose={onCerrar}
      onClick={(e) => {
        // Tocar el fondo (el propio dialog, fuera de la caja) cierra.
        if (e.target === ref.current) onCerrar();
      }}
      className="d-hoja tono-claro"
    >
      <div className="d-hoja-caja">
        <div className="flex items-center justify-between gap-4">
          <h2 className="text-[1.375rem] leading-tight font-semibold tracking-[-0.02em]">
            {titulo}
          </h2>
          <button
            type="button"
            onClick={onCerrar}
            className="flex min-h-12 items-center gap-2 rounded-full bg-ed-surface px-4 text-[1rem] font-medium"
          >
            <Cerrar />
            {ESTUDIO.cerrar}
          </button>
        </div>
        <div className="mt-5">{children}</div>
      </div>
    </dialog>
  );
}
