import type { ReactNode } from 'react';
import { GRILLA_DIBUJO, TRAZO } from '../grilla';
import { ESTADOS_DIBUJOS } from './estados';
import type { DibujoId } from './ids';
import { PLATOS } from './platos';

/** Todos los dibujos en grilla 96 (platos de ejemplo + estados). TypeScript exige uno por id. */
const DIBUJOS: Record<DibujoId, ReactNode> = { ...PLATOS, ...ESTADOS_DIBUJOS };

interface IlustracionProps {
  id: DibujoId;
  /** Lado en px. */
  size?: number;
  className?: string;
  /**
   * Si el dibujo comunica algo por sí solo (p. ej. un estado sin texto al lado). El texto viene de
   * `src/content`. Sin `title` es decorativo y se oculta a lectores de pantalla.
   */
  title?: string;
}

export function Ilustracion({ id, size = 64, className, title }: IlustracionProps) {
  return (
    <svg
      viewBox={GRILLA_DIBUJO.viewBox}
      width={size}
      height={size}
      {...TRAZO}
      strokeWidth={GRILLA_DIBUJO.trazo}
      role={title ? 'img' : undefined}
      aria-hidden={title ? undefined : true}
      aria-label={title}
      focusable="false"
      className={className}
    >
      {title ? <title>{title}</title> : null}
      {DIBUJOS[id]}
    </svg>
  );
}
