import { ESCENAS_FLUJO } from '@/content/explicativo/flujo';
import { VIDEO_PRESENTACION as T } from '@/content/explicativo/presentacion';
import {
  PantallaDatos,
  PantallaRubro,
  PantallaVista,
  TELEFONO_FLUJO,
  VIEWBOX_FLUJO,
} from './escenas-flujo';
import { IconoSvg, Telefono } from './lienzo';

/**
 * Poster del video de /empezar: las pantallas del flujo apiladas como cartas (rubro y datos atrás,
 * "Así te queda" adelante, y la burbuja de WhatsApp asomando). Es un componente de servidor: SVG
 * en el HTML, cero JS. Reusa las pantallas de las escenas pero QUIETAS: las utilidades `!` anulan
 * las animaciones `.mg` (que viven fuera de las capas de Tailwind) y esconden lo que en la escena se
 * va (`.mg-sale`), así el poster es el cuadro final de cada pantalla.
 */
export function PosterArte() {
  const { ancho, alto } = TELEFONO_FLUJO;
  return (
    <svg
      viewBox={VIEWBOX_FLUJO}
      aria-hidden="true"
      focusable="false"
      data-poster=""
      preserveAspectRatio="xMidYMid meet"
      className="h-full w-full [&_.mg]:animate-none! [&_.mg-sale]:opacity-0!"
    >
      <g transform="translate(380 46) scale(0.8)" opacity="0.4">
        <Telefono x={0} y={0} ancho={ancho} alto={alto}>
          <PantallaRubro conToque={false} />
        </Telefono>
      </g>
      <g transform="translate(236 40) scale(0.9)" opacity="0.7">
        <Telefono x={0} y={0} ancho={ancho} alto={alto}>
          <PantallaDatos />
        </Telefono>
      </g>
      <Telefono x={64} y={TELEFONO_FLUJO.y} ancho={ancho} alto={alto}>
        <PantallaVista repintar={false} />
      </Telefono>
      {/* La cuarta pantalla: la charla por WhatsApp, asomando arriba a la derecha. */}
      <g transform="translate(548 64)">
        <rect
          width="88"
          height="56"
          rx="28"
          className="fill-surface-2 stroke-line-strong"
          strokeWidth="2"
        />
        <IconoSvg nombre="chat" x={26} y={10} escala={1.5} />
      </g>
    </svg>
  );
}

/** Índice del video (las cuatro pantallas), enhebrado por un riel punteado como "Cómo funciona". */
export function IndicePresentacion() {
  return (
    <ol aria-label={T.indice} className="relative flex flex-col gap-2">
      <span
        aria-hidden="true"
        className="absolute top-3 bottom-3 left-3 -translate-x-1/2 border-l-2 border-dashed border-line-strong"
      />
      {ESCENAS_FLUJO.map((e) => (
        <li key={e.id} className="relative flex min-h-6 items-center gap-4 font-semibold">
          <span
            aria-hidden="true"
            className="size-6 shrink-0 rounded-full border-2 border-dashed border-line-strong bg-surface"
          />
          {e.capitulo}
        </li>
      ))}
    </ol>
  );
}
