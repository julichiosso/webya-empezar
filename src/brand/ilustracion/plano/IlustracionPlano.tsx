import { useId, type CSSProperties, type ReactNode } from 'react';
import '../movimiento.css';
import {
  Anotacion,
  Clic,
  Cota,
  Eje,
  MarcasRegistro,
  Paso,
  PatronGrilla,
  PatronRayado,
  pieza,
  TINTA_PLANO,
  TRAZO_PLANO,
  type FormaPieza,
} from './trazos';

export type EscenaPlano = 'hero' | 'como-funciona' | 'cierre';

interface IlustracionPlanoProps {
  /** Escena del plano que reemplaza a la foto mientras no hay archivo. */
  escena: EscenaPlano;
  className?: string;
}

/** Escenas, en el orden en que aparecen en /empezar (para recorrerlas en /sistema y en los tests). */
export const ESCENAS_PLANO: readonly EscenaPlano[] = ['hero', 'como-funciona', 'cierre'];

/**
 * Lienzo de las escenas: 1000 × 1000 con `slice`, así cubre cualquier proporción. Lo importante
 * vive en la ZONA SEGURA del centro, que se ve entera de 9:19,5 (celular parado) a 16:9
 * (escritorio); lo de afuera (cotas largas, el fantasma de la pieza) es de yapa en pantallas anchas.
 */
export const LIENZO_PLANO = { lado: 1000, zonaSegura: { x: [290, 710], y: [220, 780] } } as const;

/**
 * Ilustración "plano" (blueprint) de una escena: el fallback de las fotos a pantalla completa
 * (SlotImagen), terminada por sí misma. Un plano técnico de piezas que encastran: cotas, ejes,
 * rayado de corte, anotaciones mudas y la pieza que encaja en Brasa (`text-plano-pieza`).
 *
 * Decorativa (`aria-hidden`), sin texto ni filtros; pinta con `currentColor` (el texto de la
 * sección). Ocupa el contenedor (`absolute inset-0` lo pone quien la usa, en `className`).
 * Movimiento: solo en `hero`, una vez, la pieza Brasa encastra (transform/opacity, clase
 * `ilus-plano-encaja`); con movimiento reducido aparece ya puesta.
 */
export function IlustracionPlano({ escena, className }: IlustracionPlanoProps) {
  const base = useId().replace(/:/g, '');
  const ids = { grilla: `plano-g-${base}`, rayado: `plano-r-${base}` };
  const Escena = ESCENAS[escena];
  return (
    <svg
      aria-hidden="true"
      focusable="false"
      data-escena-plano={escena}
      width="100%"
      height="100%"
      className={className}
    >
      <defs>
        <PatronGrilla id={ids.grilla} />
      </defs>
      <rect width="100%" height="100%" fill={`url(#${ids.grilla})`} />
      <MarcasRegistro />
      <svg
        viewBox={`0 0 ${LIENZO_PLANO.lado} ${LIENZO_PLANO.lado}`}
        preserveAspectRatio="xMidYMid slice"
        width="100%"
        height="100%"
        overflow="hidden"
      >
        <defs>
          <PatronRayado id={ids.rayado} />
        </defs>
        <Escena rayado={`url(#${ids.rayado})`} />
      </svg>
    </svg>
  );
}

/* ——— Piezas comunes de las escenas ——— */

function Pieza({
  forma,
  hueco,
  relleno,
}: {
  forma: FormaPieza;
  /** Lo que falta: punteado y más tenue. */
  hueco?: boolean;
  /** Rayado de corte (url del patrón). */
  relleno?: string;
}) {
  const d = pieza(forma);
  return (
    <>
      {relleno && <path d={d} fill={relleno} stroke="none" />}
      <path
        {...TRAZO_PLANO}
        d={d}
        strokeOpacity={hueco ? TINTA_PLANO.cota : TINTA_PLANO.pieza}
        strokeDasharray={hueco ? '6 7' : undefined}
      />
    </>
  );
}

/**
 * La pieza que encaja: el único acento del dibujo (`text-plano-pieza` → `--accent`), relleno plano
 * muy suave + contorno. `desde` es de dónde llega si se anima (en unidades del lienzo).
 */
function PiezaBrasa({
  forma,
  desde,
  children,
}: {
  forma: FormaPieza;
  desde?: { x: number; y: number };
  children?: ReactNode;
}) {
  const d = pieza(forma);
  const estilo = desde
    ? ({ '--plano-dx': `${desde.x}px`, '--plano-dy': `${desde.y}px` } as CSSProperties)
    : undefined;
  return (
    <g className="text-plano-pieza">
      <g className={desde ? 'ilus-plano-encaja' : undefined} style={estilo}>
        <path d={d} fill="currentColor" fillOpacity={0.16} stroke="none" />
        <path {...TRAZO_PLANO} d={d} strokeWidth={1.5} />
        {children}
      </g>
    </g>
  );
}

type PropsEscena = { rayado: string };

/* ——— hero: el negocio armado en un tablero, con la última pieza entrando ——— */

function EscenaHero({ rayado }: PropsEscena) {
  // Tablero (la web del negocio) y sus módulos. La pieza B es la que encaja.
  const tablero = { x: 330, y: 250, w: 340, h: 480, r: 28 };
  const cabecera = { x: 354, y: 274, w: 292, h: 64, abajo: 'lengueta' as const };
  const moduloA = { x: 354, y: 354, w: 292, h: 128, arriba: 'muesca' as const };
  const huecoB = { x: 354, y: 498, w: 138, h: 208, arriba: 'muesca' as const };
  const moduloC = { x: 508, y: 498, w: 138, h: 208, arriba: 'muesca' as const };
  return (
    <g>
      <Eje d="M500 200V780M300 490H700" />
      <path
        {...TRAZO_PLANO}
        d={pieza(tablero)}
        strokeOpacity={TINTA_PLANO.pieza}
        strokeWidth={1.5}
      />
      <Pieza forma={cabecera} />
      <Pieza forma={moduloA} relleno={rayado} />
      <Pieza forma={moduloC} />
      {/* Renglones mudos dentro de los módulos: la "web" sin texto. */}
      <path
        {...TRAZO_PLANO}
        strokeOpacity={TINTA_PLANO.cota}
        d="M378 306h96M378 318h60M530 530h92M530 546h64M530 650h92"
      />
      {/* Fantasma: de dónde viene la pieza, con su trayectoria. */}
      <Pieza forma={{ ...huecoB, x: huecoB.x - 168, y: huecoB.y - 150 }} hueco />
      <path
        {...TRAZO_PLANO}
        strokeOpacity={TINTA_PLANO.cota}
        strokeDasharray="2 7"
        d="M262 452C300 452 360 470 400 520"
      />
      <Pieza forma={huecoB} hueco />
      <PiezaBrasa forma={huecoB} desde={{ x: -168, y: -150 }}>
        <Clic cx={huecoB.x + huecoB.w / 2} cy={huecoB.y} />
      </PiezaBrasa>
      <Cota x1={330} y1={214} x2={670} y2={214} desde={250} />
      <Cota x1={294} y1={250} x2={294} y2={730} desde={330} />
      <Cota x1={354} y1={746} x2={492} y2={746} desde={706} />
      <Anotacion x={600} y={420} hastaX={700} hastaY={360} />
      <Anotacion x={600} y={600} hastaX={720} hastaY={640} />
    </g>
  );
}

/* ——— como-funciona: tres estaciones sobre un riel (falta, llega, encaja) ——— */

function EscenaComoFunciona({ rayado }: PropsEscena) {
  const alto = 150;
  const ancho = 110;
  const riel = 640;
  const centros = [345, 500, 655] as const;
  const forma = (cx: number, y: number): FormaPieza => ({
    x: cx - ancho / 2,
    y,
    w: ancho,
    h: alto,
    arriba: 'muesca',
  });
  const marcas = Array.from({ length: 21 }, (_, i) => 160 + i * 34)
    .map((x, i) => `M${x} ${riel}v${i % 5 === 0 ? 14 : 7}`)
    .join('');
  return (
    <g>
      <Eje d={centros.map((c) => `M${c} 300V720`).join('')} />
      {/* Riel con regla. */}
      <path {...TRAZO_PLANO} strokeOpacity={TINTA_PLANO.pieza} d={`M150 ${riel}H850`} />
      <path {...TRAZO_PLANO} strokeOpacity={TINTA_PLANO.cota} d={marcas} />
      {/* 1: falta (hueco). */}
      <Pieza forma={forma(centros[0], riel - alto)} hueco />
      {/* 2: llega (la pieza arriba de su hueco, con la flecha de bajada y cuánto le falta). */}
      <Pieza forma={forma(centros[1], riel - alto)} hueco />
      <Pieza forma={forma(centros[1], riel - alto - 96)} relleno={rayado} />
      <path
        {...TRAZO_PLANO}
        strokeOpacity={TINTA_PLANO.cota}
        d={`M${centros[1]} 330V372M${centros[1] - 7} 364L${centros[1]} 372L${centros[1] + 7} 364`}
      />
      <Cota
        x1={centros[1] + 78}
        y1={riel - alto - 96}
        x2={centros[1] + 78}
        y2={riel - alto}
        desde={centros[1] + ancho / 2}
      />
      {/* 3: encaja (Brasa, con el clic). */}
      <PiezaBrasa forma={forma(centros[2], riel - alto)}>
        <Clic cx={centros[2]} cy={riel - alto} />
      </PiezaBrasa>
      {/* Pasos y cadena de cotas: la misma distancia entre estaciones. */}
      <Paso cx={centros[0]} cy={286} n={1} />
      <Paso cx={centros[1]} cy={286} n={2} />
      <Paso cx={centros[2]} cy={286} n={3} />
      <Cota x1={centros[0]} y1={700} x2={centros[1]} y2={700} desde={riel + 16} />
      <Cota x1={centros[1]} y1={700} x2={centros[2]} y2={700} desde={riel + 16} />
      <Anotacion x={centros[2] + 30} y={riel - 40} hastaX={centros[2] + 110} hastaY={riel - 110} />
    </g>
  );
}

/* ——— cierre: el conjunto completo, la última pieza asentada ——— */

function EscenaCierre({ rayado }: PropsEscena) {
  const j = 16;
  const p1 = { x: 330, y: 270, w: 200, h: 180, abajo: 'lengueta' as const };
  const p2 = { x: 530 + j, y: 270, w: 124, h: 180, abajo: 'lengueta' as const };
  const p3 = { x: 330, y: 450 + j, w: 200, h: 264, arriba: 'muesca' as const };
  const p4 = { x: 530 + j, y: 450 + j, w: 124, h: 264, arriba: 'muesca' as const };
  return (
    <g>
      <Eje d="M500 230V770M290 458H710" />
      <Pieza forma={p1} relleno={rayado} />
      <Pieza forma={p2} />
      <Pieza forma={p3} />
      <path
        {...TRAZO_PLANO}
        strokeOpacity={TINTA_PLANO.cota}
        d="M356 520h120M356 536h84M356 552h104M356 664h60"
      />
      <PiezaBrasa forma={p4}>
        <Clic cx={p4.x + p4.w / 2} cy={p4.y} />
      </PiezaBrasa>
      <Cota x1={330} y1={232} x2={670} y2={232} desde={270} />
      <Cota x1={712} y1={270} x2={712} y2={730} desde={670} />
      <Cota x1={290} y1={270} x2={290} y2={450} desde={330} />
      <Cota x1={290} y1={466} x2={290} y2={730} desde={330} />
      <Anotacion x={430} y={360} hastaX={250} hastaY={330} lado={-1} />
      <Anotacion x={610} y={600} hastaX={760} hastaY={560} />
    </g>
  );
}

const ESCENAS: Record<EscenaPlano, (p: PropsEscena) => ReactNode> = {
  hero: EscenaHero,
  'como-funciona': EscenaComoFunciona,
  cierre: EscenaCierre,
};
