import { cn } from './clases';

interface SpinnerProps {
  /** Lado en px (grilla 24, trazo del set de íconos). */
  tamanio?: number;
  /**
   * Si comunica algo por sí solo ("Cargando…"), se anuncia como estado. Si acompaña a un control que
   * ya anuncia su estado (aria-busy), queda decorativo.
   */
  etiqueta?: string;
  className?: string;
}

/**
 * Indicador de carga mínimo: un arco que gira (solo transform). Con movimiento reducido queda
 * quieto; la información no se pierde porque el estado lo anuncia el control (aria-busy) o la
 * etiqueta. TODO(ilustracion): si `src/brand/ilustracion` publica su spinner, este pasa a usarlo.
 */
export function Spinner({ tamanio = 22, etiqueta, className }: SpinnerProps) {
  const svg = (
    <svg
      viewBox="0 0 24 24"
      width={tamanio}
      height={tamanio}
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      aria-hidden="true"
      focusable="false"
      data-spinner=""
      className={cn('motion-safe:animate-spin', !etiqueta && className)}
    >
      <circle cx="12" cy="12" r="9" strokeOpacity={0.25} />
      <path d="M21 12a9 9 0 0 0-9-9" />
    </svg>
  );
  if (!etiqueta) return svg;
  return (
    <span role="status" className={cn('inline-flex', className)}>
      {svg}
      <span className="sr-only">{etiqueta}</span>
    </span>
  );
}
