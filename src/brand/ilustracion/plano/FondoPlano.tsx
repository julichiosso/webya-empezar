import { useId } from 'react';
import { Anotacion, Cota, MarcasRegistro, MEDIDA_PLANO, PatronGrilla } from './trazos';

interface FondoPlanoProps {
  /** `grilla`: cuadrícula fina; `cotas`: grilla + cotas, anotaciones y marcas de registro. */
  variante?: 'grilla' | 'cotas';
  className?: string;
}

const M = MEDIDA_PLANO.celdaMayor;

/**
 * Fondo "blueprint" de las secciones (dirección Plano; contrato en docs/plano-contrato.md).
 * Decorativo y quieto: SVG propio, sin filtros, que pinta con `currentColor` a baja opacidad (lo
 * hereda del texto de la sección: crema sobre tinta, negro sobre crema). Ocupa todo el contenedor
 * (`absolute inset-0`): el padre tiene que ser `relative` y el contenido ir por encima.
 *
 * Las cotas miden celdas mayores de la grilla (64 px), así caen sobre sus líneas; las marcas de
 * registro quedan pegadas a las cuatro esquinas a cualquier tamaño.
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
          <MarcasRegistro />
          {/* Arriba a la izquierda: el ancho y el alto de un módulo de 3 × 2 celdas. */}
          <Cota x1={M} y1={M - 24} x2={4 * M} y2={M - 24} desde={M} />
          <Cota x1={M - 24} y1={M} x2={M - 24} y2={3 * M} desde={M} />
          <path
            d={`M${M} ${M}H${4 * M}V${3 * M}H${M}Z`}
            fill="none"
            stroke="currentColor"
            strokeOpacity={0.22}
            strokeDasharray="4 5"
          />
          {/* Abajo a la derecha: una anotación que sale de un cruce de la grilla. */}
          <svg x="100%" y="100%" width="1" height="1" overflow="visible">
            <Anotacion x={-3 * M} y={-2 * M} hastaX={-2 * M + 8} hastaY={-M - 24} />
          </svg>
        </>
      )}
    </svg>
  );
}
