import { circuloPunteado, GRILLA_ICONO, TRAZO } from './grilla';
import './movimiento.css';

interface CargandoProps {
  /** Lado en px (dibujado en la grilla 24, como los íconos). */
  size?: number;
  className?: string;
  /**
   * Si el spinner está solo y tiene que anunciarse (el texto viene de `src/content`). Dentro de un
   * botón con `aria-busy` no hace falta: queda decorativo.
   */
  title?: string;
}

/** El hueco del spinner: el círculo de los íconos partido en 8 tramos. */
const HUECO = circuloPunteado(12, 12, 8.5, 8, 0.5);

/**
 * Spinner del sistema, en lenguaje Encastre: un hueco punteado y una pieza (un cuarto de vuelta)
 * que lo recorre de a cuartos y en cada uno "hace clic" (se pasa 2° y asienta). Solo rota
 * (transform). Con movimiento reducido queda quieto, con la pieza puesta arriba a la derecha.
 * Hereda el color del texto (`currentColor`), así que sirve sobre el acento y sobre papel.
 */
export function Cargando({ size = GRILLA_ICONO.lado, className, title }: CargandoProps) {
  return (
    <svg
      viewBox={GRILLA_ICONO.viewBox}
      width={size}
      height={size}
      {...TRAZO}
      strokeWidth={GRILLA_ICONO.trazo}
      role={title ? 'img' : undefined}
      aria-hidden={title ? undefined : true}
      aria-label={title}
      focusable="false"
      className={className}
      data-cargando=""
    >
      {title ? <title>{title}</title> : null}
      <g opacity=".4">
        {HUECO.map((d) => (
          <path key={d} d={d} />
        ))}
      </g>
      {/* La pieza: un trazo más grueso que el hueco, como una pieza que llena su lugar. */}
      <path className="ilus-giro" d="M12 3.5a8.5 8.5 0 0 1 8.5 8.5" strokeWidth={2.5} />
    </svg>
  );
}
