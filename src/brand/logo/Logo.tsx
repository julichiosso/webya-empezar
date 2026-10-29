import type { CSSProperties } from 'react';
import { LOGO_ALTO, LOGO_ANCHO, LOGO_TRAZOS, LOGO_VIEWBOX } from './trazos';

interface LogoProps {
  className?: string;
  /**
   * Encastre: las letras entran como piezas y asientan en su lugar, una sola vez al cargar.
   * Solo transform/opacity; con reduced-motion el logo aparece entero y quieto.
   */
  armar?: boolean;
}

/**
 * Wordmark de WebYa en SVG inline (los mismos trazos que public/webya-logo.svg, uno por letra).
 * Toma el color del texto: blanco en oscuro, negro en claro. Nunca en el color de acento.
 * Es un componente de servidor: no suma JavaScript.
 */
export function Logo({ className, armar = false }: LogoProps) {
  return (
    <svg
      viewBox={LOGO_VIEWBOX}
      width={LOGO_ANCHO}
      height={LOGO_ALTO}
      role="img"
      aria-label="WebYa"
      fill="currentColor"
      fillRule="evenodd"
      clipRule="evenodd"
      className={`h-7 w-auto text-fg ${armar ? 'logo-armado' : ''} ${className ?? ''}`.trim()}
    >
      {LOGO_TRAZOS.map((t, i) => (
        <path key={t.letra} d={t.d} className="logo-pieza" style={{ '--i': i } as CSSProperties} />
      ))}
    </svg>
  );
}
