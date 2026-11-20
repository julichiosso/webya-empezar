import { LOGO_CORCHETES_VIEWBOX } from './LogoCorchetes';
import { LOGO_TRAZOS } from './trazos';

/**
 * El logo `<webya>` que se escribe: cada letra y cada corchete se dibujan trazo a trazo
 * (stroke-dashoffset con pathLength=1) y después se rellenan. SVG puro, sin imágenes ni JS; la
 * animación vive en editorial.css (`.carga-*`) y con movimiento reducido el logo aparece quieto.
 */
export function LogoDibujo({ className }: { className?: string }) {
  return (
    <svg
      viewBox={LOGO_CORCHETES_VIEWBOX}
      width={1205}
      height={281}
      aria-hidden="true"
      focusable="false"
      className={className}
    >
      <polyline
        className="carga-corchete"
        pathLength={1}
        points="100,58 40,135 100,212"
        style={{ '--i': 0 } as React.CSSProperties}
      />
      {LOGO_TRAZOS.map((t, i) => (
        <path
          key={t.letra}
          d={t.d}
          className="carga-letra"
          pathLength={1}
          style={{ '--i': i + 1 } as React.CSSProperties}
        />
      ))}
      <polyline
        className="carga-corchete"
        pathLength={1}
        points="1105,58 1165,135 1105,212"
        style={{ '--i': LOGO_TRAZOS.length + 1 } as React.CSSProperties}
      />
    </svg>
  );
}
