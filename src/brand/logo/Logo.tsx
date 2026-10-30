import type { CSSProperties } from 'react';
import { LOGO_ALTO, LOGO_ANCHO, LOGO_TRAZOS, LOGO_VIEWBOX } from './trazos';
import { cajaDe, viewBoxCompacta, type VarianteLogo } from './variantes';

export type { VarianteLogo } from './variantes';

interface LogoProps {
  className?: string;
  /**
   * - `completa` (por defecto): el wordmark, en el color del texto del tema (blanco en oscuro,
   *   negro en claro).
   * - `compacta`: solo la "w" (monograma) para lugares chicos: favicon, avatar, barra angosta.
   * - `monocromo`: el wordmark en una tinta plana que hereda `currentColor` del contenedor (papel,
   *   impresión). No fija color propio.
   */
  variante?: VarianteLogo;
  /**
   * Encastre: las letras entran como piezas y asientan en su lugar, una sola vez al cargar.
   * Solo transform/opacity; con reduced-motion el logo aparece entero y quieto.
   */
  armar?: boolean;
  /**
   * El logo "se escribe": el trazo se dibuja (stroke-dashoffset, excepción documentada del
   * presupuesto) y después se rellena, una sola vez. Necesita src/brand/motion/motion.css; sin esa
   * hoja (o con reduced-motion) se ve entero y quieto. Si llegan `armar` y `escribir`, gana `armar`.
   */
  escribir?: boolean;
  /** Si va al lado del nombre escrito: se oculta a lectores de pantalla para no repetirlo. */
  decorativo?: boolean;
}

const W = LOGO_TRAZOS[0];
const VIEWBOX_COMPACTA = viewBoxCompacta(W);
const LADO_COMPACTA = cajaDe(W.d).ancho;

/**
 * Wordmark de WebYa en SVG inline (los mismos trazos que public/webya-logo.svg, uno por letra).
 * Nunca en el color de acento. Es un componente de servidor: no suma JavaScript.
 */
export function Logo({
  className,
  variante = 'completa',
  armar = false,
  escribir = false,
  decorativo = false,
}: LogoProps) {
  const compacta = variante === 'compacta';
  const trazos = compacta ? [W] : LOGO_TRAZOS;
  const animacion = armar ? 'logo-armado' : escribir ? 'logo-escrito' : '';
  const color = variante === 'monocromo' ? '' : 'text-fg';
  return (
    <svg
      viewBox={compacta ? VIEWBOX_COMPACTA : LOGO_VIEWBOX}
      width={compacta ? LADO_COMPACTA : LOGO_ANCHO}
      height={compacta ? LADO_COMPACTA : LOGO_ALTO}
      role={decorativo ? undefined : 'img'}
      aria-label={decorativo ? undefined : 'WebYa'}
      aria-hidden={decorativo || undefined}
      focusable="false"
      data-variante={variante}
      fill="currentColor"
      fillRule="evenodd"
      clipRule="evenodd"
      className={`h-7 w-auto ${color} ${animacion} ${className ?? ''}`.replace(/\s+/g, ' ').trim()}
    >
      {trazos.map((t, i) => (
        <path
          key={t.letra}
          d={t.d}
          pathLength={animacion === 'logo-escrito' ? 1 : undefined}
          className="logo-pieza"
          style={{ '--i': i } as CSSProperties}
        />
      ))}
    </svg>
  );
}
