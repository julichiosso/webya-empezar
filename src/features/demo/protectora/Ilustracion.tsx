import type { Especie } from '@/content/demos/protectora';

/**
 * Ilustraciones propias, vectoriales y sobrias: la silueta de un perro o de un gato sentado, en tinta
 * sobre el tono de la ficha. Sin fotos de animales reales.
 */
export function Ilustracion({
  especie,
  className,
  ojos = 'var(--pr-fondo)',
  tam,
}: {
  especie: Especie;
  className?: string;
  /** Lado en unidades, para usarla dentro de otro SVG (la imagen para redes). */
  tam?: number;
  /** Color de los ojos (el fondo). En la imagen para redes va el color fijo: ahí no hay CSS. */
  ojos?: string;
}) {
  return (
    <svg
      viewBox="0 0 120 120"
      width={tam}
      height={tam}
      aria-hidden="true"
      className={className}
      fill="currentColor"
    >
      {especie === 'perro' ? (
        <>
          {/* Orejas, cabeza, hocico, cuerpo sentado y cola. */}
          <path d="M40 24c-8 2-12 14-9 26l9-4z" />
          <path d="M76 24c8 2 12 14 9 26l-9-4z" />
          <ellipse cx="58" cy="42" rx="20" ry="18" />
          <ellipse cx="58" cy="54" rx="10" ry="7" />
          <path d="M40 58c-6 12-8 30-6 44h48c2-14 0-32-6-44z" />
          <path d="M80 92c10-2 18-10 18-20 0-3-3-4-4-1-2 8-8 13-15 14z" />
          <circle cx="51" cy="40" r="2.4" fill={ojos} />
          <circle cx="65" cy="40" r="2.4" fill={ojos} />
        </>
      ) : (
        <>
          <path d="M42 22l6 16h-10z" />
          <path d="M74 22l-6 16h10z" />
          <ellipse cx="58" cy="44" rx="19" ry="17" />
          <path d="M42 58c-6 12-8 30-6 44h44c2-14 0-32-6-44z" />
          <path d="M78 98c14 0 22-8 22-18 0-4-4-5-5-1-1 7-7 11-17 11z" />
          <circle cx="51" cy="42" r="2.2" fill={ojos} />
          <circle cx="65" cy="42" r="2.2" fill={ojos} />
        </>
      )}
    </svg>
  );
}
