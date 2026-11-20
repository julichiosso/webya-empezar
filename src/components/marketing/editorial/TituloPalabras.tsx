import type { CSSProperties, ElementType } from 'react';

interface Props {
  /** Una línea por elemento: cada una se parte en palabras que suben desde su máscara. */
  lineas: readonly string[];
  as?: ElementType;
  className?: string;
  /** En el hero la animación arranca al cargar (es el LCP); en el resto, al entrar en pantalla. */
  alCargar?: boolean;
  id?: string;
}

/**
 * Titular animado por palabras. El texto completo va en aria-label del encabezado y las piezas
 * quedan ocultas a lectores de pantalla (así no se lee palabra por palabra).
 */
export function TituloPalabras({ lineas, as: Tag = 'h2', className, alCargar = false, id }: Props) {
  let i = 0;
  return (
    <Tag
      id={id}
      className={`${className ?? ''} ${alCargar ? 'e-hero-palabras' : ''}`}
      aria-label={lineas.join(' ')}
      data-words={alCargar ? undefined : ''}
    >
      {lineas.map((linea, n) => (
        <span key={linea} className="block" aria-hidden="true">
          {/* Espacio entre líneas: en el texto de la página no se pegan ("pedidos,tus"). */}
          {n > 0 ? ' ' : null}
          {linea.split(' ').map((palabra, j, todas) => (
            <span key={`${palabra}-${j}`}>
              <span className="e-palabra">
                <span style={{ '--i': i++ } as CSSProperties}>{palabra}</span>
              </span>
              {j < todas.length - 1 ? ' ' : null}
            </span>
          ))}
        </span>
      ))}
    </Tag>
  );
}
