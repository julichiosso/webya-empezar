import { useId } from 'react';
import { Anotacion, Cota, MarcasRegistro, MEDIDA_PLANO, PatronGrilla } from './trazos';

interface FondoPlanoProps {
  /** `grilla`: cuadrícula fina; `cotas`: grilla + cotas, anotaciones y marcas de registro. */
  variante?: 'grilla' | 'cotas';
  className?: string;
}

const M = MEDIDA_PLANO.celdaMayor;
/** Distancia de las cotas al borde: dentro de un margen de 32 px (lo que deja libre cualquier sección). */
const BORDE = 24;

/**
 * Fondo "blueprint" de las secciones (dirección Plano; contrato en docs/plano-contrato.md).
 * Decorativo y quieto: SVG propio, sin filtros, que pinta con `currentColor` a baja opacidad (lo
 * hereda del texto de la sección: crema sobre tinta, negro sobre crema). Ocupa todo el contenedor
 * (`absolute inset-0`): el padre tiene que ser `relative` y el contenido ir por encima.
 *
 * Las cotas, la anotación y las marcas de registro viven SOLO en los márgenes, nunca sobre el texto:
 * - debajo de `sm` (celular) no hay margen libre: queda solo la grilla;
 * - desde `sm`, las marcas de registro en las cuatro esquinas (a 24 px del borde, dentro del aire
 *   de arriba y de abajo de la sección);
 * - desde `xl` (≥ 1280 px, con al menos 72 px de margen lateral libre), una cota vertical pegada al
 *   borde izquierdo (a la altura de la segunda y tercera celda), y en la franja de abajo una cota
 *   horizontal a la izquierda y una anotación a la derecha. Requisito para quien la use: 40 px de
 *   aire abajo del contenido (arriba alcanza con lo que ocupan las marcas de registro).
 * Los grupos se esconden por CSS (clases de Tailwind sobre `<g>`), así que no hay JS ni medición.
 */
export function FondoPlano({ variante = 'grilla', className }: FondoPlanoProps) {
  const id = `plano-grilla-${useId().replace(/:/g, '')}`;
  return (
    <svg
      aria-hidden="true"
      focusable="false"
      data-plano={variante}
      width="100%"
      height="100%"
      className={`pointer-events-none absolute inset-0 h-full w-full ${className ?? ''}`.trim()}
    >
      <defs>
        <PatronGrilla id={id} />
      </defs>
      <rect width="100%" height="100%" fill={`url(#${id})`} />
      {variante === 'cotas' && (
        <>
          <g data-plano-capa="registro" className="hidden sm:inline">
            <MarcasRegistro />
          </g>
          <g data-plano-capa="cotas" className="hidden xl:inline">
            {/* Borde izquierdo: el alto de un módulo de dos celdas, medido desde la grilla. */}
            <Cota x1={BORDE} y1={2 * M} x2={BORDE} y2={4 * M} desde={BORDE + 24} />
            {/* Borde de abajo, a la izquierda: el ancho de tres celdas, después de la marca de registro. */}
            <svg x="0" y="100%" width="1" height="1" overflow="visible">
              <Cota x1={2 * M} y1={-BORDE} x2={5 * M} y2={-BORDE} desde={-BORDE - 12} />
            </svg>
            {/* Abajo a la derecha: una anotación que sale de un cruce de la grilla, en la franja libre. */}
            <svg x="100%" y="100%" width="1" height="1" overflow="visible">
              <Anotacion x={-3 * M} y={-BORDE} hastaX={-3 * M + 16} hastaY={-BORDE - 8} />
            </svg>
          </g>
        </>
      )}
    </svg>
  );
}
