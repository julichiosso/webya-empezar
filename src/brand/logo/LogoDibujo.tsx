import { LOGO_ALTO_ENCUADRE, LOGO_ANCHO_ENCUADRE, LOGO_ENCUADRE } from './LogoWebya';
import { LOGO_TRAZOS } from './trazos';

/**
 * El logo de Webya que se escribe: cada letra se dibuja trazo a trazo
 * (stroke-dashoffset con pathLength=1) y después se rellenan. SVG puro, sin imágenes ni JS; la
 * animación vive en editorial.css (`.carga-*`) y con movimiento reducido el logo aparece quieto.
 */
export function LogoDibujo({ className }: { className?: string }) {
  return (
    <svg
      viewBox={LOGO_ENCUADRE}
      width={LOGO_ANCHO_ENCUADRE}
      height={LOGO_ALTO_ENCUADRE}
      aria-hidden="true"
      focusable="false"
      className={className}
    >
      {LOGO_TRAZOS.map((t, i) => (
        <path
          key={t.letra}
          d={t.d}
          className="carga-letra"
          pathLength={1}
          style={{ '--i': i } as React.CSSProperties}
        />
      ))}
    </svg>
  );
}
