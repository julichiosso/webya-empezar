import type { Especie, Tamano } from '@/content/demos/protectora';

/** Variante estable por animal: el mismo id dibuja siempre el mismo perro o gato. */
function varianteDe(semilla = ''): 0 | 1 | 2 {
  let h = 0;
  for (const c of semilla) h = (h * 31 + c.charCodeAt(0)) >>> 0;
  return (h % 3) as 0 | 1 | 2;
}

/** Chicos más bajitos y grandes más altos, siempre apoyados abajo. */
const ESCALA: Record<Tamano, number> = { chico: 0.8, mediano: 0.92, grande: 1 };

/**
 * Ilustraciones propias, vectoriales y sobrias, en tinta sobre el tono de la ficha. Tres perros (orejas
 * caídas, orejas paradas, con mancha) y tres gatos (liso, rayado, con collar), y la altura según el tamaño:
 * cada ficha se ve distinta. Sin fotos de animales reales.
 */
export function Ilustracion({
  especie,
  className,
  ojos = 'var(--pr-fondo)',
  tam,
  semilla,
  tamano,
}: {
  especie: Especie;
  className?: string;
  /** Lado en unidades, para usarla dentro de otro SVG (la imagen para redes). */
  tam?: number;
  /** Color de los ojos y detalles (el fondo). En la imagen para redes va el color fijo: ahí no hay CSS. */
  ojos?: string;
  /** Id del animal: elige la variante. */
  semilla?: string;
  tamano?: Tamano;
}) {
  const v = varianteDe(semilla);
  const k = tamano ? ESCALA[tamano] : 1;
  return (
    <svg
      viewBox="0 0 120 120"
      width={tam}
      height={tam}
      aria-hidden="true"
      className={className}
      fill="currentColor"
    >
      <g transform={`translate(${60 * (1 - k)} ${104 * (1 - k)}) scale(${k})`}>
        {especie === 'perro' ? <Perro v={v} ojos={ojos} /> : <Gato v={v} ojos={ojos} />}
      </g>
    </svg>
  );
}

function Perro({ v, ojos }: { v: 0 | 1 | 2; ojos: string }) {
  return (
    <>
      {v === 1 ? (
        // Orejas paradas y hocico largo.
        <>
          <path d="M44 32 30 12l22 10z" />
          <path d="M72 32l14-20-22 10z" />
        </>
      ) : (
        // Orejas caídas (más largas en la variante con mancha).
        <>
          <path d={v === 2 ? 'M40 24c-10 2-14 20-10 34l10-6z' : 'M40 24c-8 2-12 14-9 26l9-4z'} />
          <path d={v === 2 ? 'M76 24c10 2 14 20 10 34l-10-6z' : 'M76 24c8 2 12 14 9 26l-9-4z'} />
        </>
      )}
      <ellipse cx="58" cy="42" rx="20" ry="18" />
      <ellipse cx="58" cy={v === 1 ? 58 : 54} rx={v === 1 ? 12 : 10} ry={v === 1 ? 10 : 7} />
      {v === 1 ? <ellipse cx="58" cy="53" rx="4.5" ry="3.2" fill={ojos} opacity="0.6" /> : null}
      <path d="M40 58c-6 12-8 30-6 44h48c2-14 0-32-6-44z" />
      <path d="M80 92c10-2 18-10 18-20 0-3-3-4-4-1-2 8-8 13-15 14z" />
      {v === 2 ? <ellipse cx="66" cy="38" rx="8" ry="7" fill={ojos} opacity="0.35" /> : null}
      <circle cx="51" cy="40" r="2.4" fill={ojos} />
      <circle cx="65" cy="40" r="2.4" fill={ojos} />
    </>
  );
}

function Gato({ v, ojos }: { v: 0 | 1 | 2; ojos: string }) {
  return (
    <>
      <path d="M42 22l6 16h-10z" />
      <path d="M74 22l-6 16h10z" />
      <ellipse cx="58" cy="44" rx="19" ry="17" />
      <path d="M42 58c-6 12-8 30-6 44h44c2-14 0-32-6-44z" />
      <path
        d={
          v === 2
            ? 'M80 100c16-2 22-14 18-26-1-4-5-3-5 1 1 10-4 16-14 17z'
            : 'M78 98c14 0 22-8 22-18 0-4-4-5-5-1-1 7-7 11-17 11z'
        }
      />
      {v === 1 ? (
        // Rayas.
        <g fill="none" stroke={ojos} strokeWidth="2.4" strokeLinecap="round" opacity="0.5">
          <path d="M46 72h8M44 82h10M46 92h8M64 72h8M64 82h10M64 92h8M52 30l2 6M64 30l-2 6" />
        </g>
      ) : null}
      {v === 2 ? (
        // Collar con medallita.
        <>
          <path d="M44 59h28" stroke={ojos} strokeWidth="4" strokeLinecap="round" />
          <circle cx="58" cy="64" r="3.2" fill={ojos} />
        </>
      ) : null}
      <circle cx="51" cy="42" r="2.2" fill={ojos} />
      <circle cx="65" cy="42" r="2.2" fill={ojos} />
    </>
  );
}
