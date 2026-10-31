'use client';

import { useSyncExternalStore } from 'react';
import { TOQUE_CLASE } from '../motion/toque';
import { aplicarTema, leerTema, suscribirTema, TEMA_POR_DEFECTO } from './tema';

interface InterruptorTemaProps {
  /**
   * Nombre del botón, fijo (no cambia con el estado: el estado lo dice `aria-pressed`). Nombra lo
   * que queda activado al presionarlo, p. ej. "Tema claro". Viene de src/content.
   */
  etiqueta: string;
  /** Solo el ícono (nav angosta): la etiqueta pasa a ser el nombre accesible. */
  soloIcono?: boolean;
  className?: string;
}

const servidor = () => TEMA_POR_DEFECTO;

/**
 * Interruptor de tema claro/oscuro: un `<button aria-pressed>` (presionado = claro). El ícono de
 * contraste gira media vuelta al cambiar (solo transform; quieto con reduced-motion) y el estado
 * activo se ve por borde + fondo + forma, no solo por color. Varios interruptores en la misma
 * página (nav y footer) quedan sincronizados.
 */
export function InterruptorTema({ etiqueta, soloIcono = false, className }: InterruptorTemaProps) {
  const tema = useSyncExternalStore(suscribirTema, leerTema, servidor);
  const claro = tema === 'light';
  return (
    <button
      type="button"
      aria-pressed={claro}
      aria-label={soloIcono ? etiqueta : undefined}
      onClick={() => aplicarTema(claro ? 'dark' : 'light')}
      className={`inline-flex min-h-tap items-center justify-center gap-2 rounded-full text-small font-medium text-fg ${
        soloIcono
          ? // Ícono neutro (nav): sin contorno ni acento. El estado lo dice la forma (el ícono gira
            // media vuelta) y la página entera, que cambia de tema.
            'size-12 hover:bg-surface-2'
          : 'border border-line px-4 hover:border-line-strong aria-pressed:border-accent aria-pressed:bg-accent-soft'
      } ${TOQUE_CLASE} ${className ?? ''}`.trim()}
    >
      <svg
        viewBox="0 0 24 24"
        width={20}
        height={20}
        aria-hidden="true"
        focusable="false"
        fill="none"
        stroke="currentColor"
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
        className={`transition-transform duration-(--duration-base) ease-(--ease-out) ${claro ? 'rotate-180' : ''}`}
      >
        <path d="M3.5 12a8.5 8.5 0 1 0 17 0a8.5 8.5 0 1 0-17 0" />
        <path d="M12 3.5a8.5 8.5 0 0 0 0 17Z" fill="currentColor" />
      </svg>
      {!soloIcono && etiqueta}
    </button>
  );
}
