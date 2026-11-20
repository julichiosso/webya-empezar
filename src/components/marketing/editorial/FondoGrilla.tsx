import { LOGO_ENCUADRE } from '@/brand/logo/LogoWebya';
import { LOGO_TRAZOS } from '@/brand/logo/trazos';
import { cn } from '@/components/ui/clases';

/**
 * Fondo vectorial de marca para las secciones claras, detrás del contenido y oculto a lectores:
 * - `logo`: el wordmark de Webya en contorno de 1 px, enorme y recortado; se dibuja trazo a trazo al
 *   entrar en pantalla.
 * - `frase`: una de las frases de Webya ("Creá. Digitalizá. Crecé.") en letra hueca gigante.
 * Negro muy tenue, sin color ni degradados. La sección que lo usa lleva `e-con-fondo`.
 */
export function FondoMarca({
  variante,
  frase,
  className,
}: {
  variante: 'logo' | 'frase';
  frase?: string;
  className?: string;
}) {
  if (variante === 'frase') {
    // Texto vectorial que ocupa justo el ancho: el tamaño sale del largo de la frase y textLength
    // termina de ajustar el espacio entre letras (la frase siempre se lee entera, sin cortes).
    const largo = Math.max(8, (frase ?? '').length);
    const tamano = Math.min(220, 1000 / (largo * 0.5));
    return (
      <svg
        viewBox={`0 0 1000 ${Math.round(tamano * 1.08)}`}
        aria-hidden="true"
        focusable="false"
        className={cn('e-fondo-frase', className)}
        preserveAspectRatio="xMidYMax meet"
      >
        <text
          x="0"
          y={Math.round(tamano * 0.86)}
          fontSize={tamano}
          textLength="1000"
          lengthAdjust="spacing"
          fill="none"
          stroke="currentColor"
          strokeWidth={1}
          vectorEffect="non-scaling-stroke"
        >
          {frase}
        </text>
      </svg>
    );
  }
  return (
    <svg
      viewBox={LOGO_ENCUADRE}
      aria-hidden="true"
      focusable="false"
      className={cn('e-fondo-logo', className)}
      fill="none"
      stroke="currentColor"
      strokeWidth={1}
      data-draw=""
    >
      {LOGO_TRAZOS.map((t, i) => (
        <path
          key={t.letra}
          d={t.d}
          className="e-trazo"
          pathLength={1}
          vectorEffect="non-scaling-stroke"
          style={{ '--i': i } as React.CSSProperties}
        />
      ))}
    </svg>
  );
}
