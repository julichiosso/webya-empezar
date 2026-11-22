/**
 * Surcos de campo: líneas finas en perspectiva que salen de la base del símbolo hacia el frente, como un
 * lote arado visto desde la banquina. Se dibujan al cargar y "crecen" con el scroll (CSS, con `--p`); en
 * "Crecé" brotan marcas cortas en el único acento del hero. Monocromo y en SVG: cero JS.
 */
const LINEAS = 17;
const FUGA = { x: 500, y: 0 };

/** Puntos donde brota algo, a lo largo de cada surco (fijos: el dibujo no cambia entre visitas). */
const BROTES = [
  [2, 0.62],
  [4, 0.8],
  [5, 0.45],
  [7, 0.7],
  [9, 0.9],
  [10, 0.55],
  [12, 0.75],
  [13, 0.5],
  [15, 0.85],
] as const;

const finDe = (i: number) => -700 + (2400 / (LINEAS - 1)) * i;

export function Surcos({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 1000 300"
      preserveAspectRatio="none"
      aria-hidden="true"
      focusable="false"
      className={className}
      data-draw=""
      // El script de movimiento le pone .in antes de hidratar (está en la primera pantalla).
      suppressHydrationWarning
    >
      <g className="h3d-surcos-lineas">
        {Array.from({ length: LINEAS }, (_, i) => (
          <path
            key={i}
            d={`M${FUGA.x} ${FUGA.y} L${finDe(i)} 300`}
            pathLength={1}
            vectorEffect="non-scaling-stroke"
            style={{ transitionDelay: `${Math.abs(i - (LINEAS - 1) / 2) * 45}ms` }}
          />
        ))}
      </g>
      <g className="h3d-brotes">
        {BROTES.map(([i, t]) => {
          const x = FUGA.x + (finDe(i) - FUGA.x) * t;
          const y = FUGA.y + 300 * t;
          const alto = 10 + t * 16;
          return (
            <path
              key={`${i}-${t}`}
              d={`M${x} ${y}v${-alto}M${x} ${y - alto * 0.5}q${alto * 0.3} ${-alto * 0.05} ${alto * 0.42} ${-alto * 0.42}`}
              vectorEffect="non-scaling-stroke"
            />
          );
        })}
      </g>
    </svg>
  );
}
