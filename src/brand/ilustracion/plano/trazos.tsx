import type { SVGProps } from 'react';

/**
 * Vocabulario del plano (dirección Plano, sobre el concepto Encastre): grilla fina, cotas con
 * flechas, líneas de eje, anotaciones con línea de referencia, marcas de registro y la pieza con
 * muesca y lengüeta. Lo usan FondoPlano e IlustracionPlano; todo es SVG propio, sin filtros, sin
 * texto adentro, y pinta con `currentColor` (lo hereda del texto de la sección).
 *
 * Las intensidades son opacidades del trazo, no colores: así el mismo plano sirve sobre tinta,
 * crema, Brasa oscura o el velo de una foto.
 */

/** Opacidad de cada capa del plano (de la más tenue a la más marcada). */
export const TINTA_PLANO = {
  grilla: 0.07,
  grillaMayor: 0.13,
  eje: 0.28,
  cota: 0.42,
  pieza: 0.7,
  registro: 0.5,
} as const;

/** Medidas del plano en px de pantalla (FondoPlano) o en unidades del lienzo (escenas). */
export const MEDIDA_PLANO = {
  /** Cuadrícula menor y mayor (cada 4). Múltiplos de la grilla de 8 px del sistema. */
  celda: 16,
  celdaMayor: 64,
  /** Marca de registro: distancia al borde y radio. */
  registroMargen: 24,
  registroRadio: 7,
  /** Punta de flecha de las cotas. */
  flecha: 9,
  /** Muesca y lengüeta de las piezas de las escenas. */
  muesca: 18,
  /** Separación entre dos piezas encastradas (lo que se ve de la junta). */
  junta: 16,
} as const;

/** Trazo de plano: fino y del mismo grosor a cualquier escala (no se engorda al ampliar). */
export const TRAZO_PLANO = {
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
  vectorEffect: 'non-scaling-stroke',
} as const satisfies SVGProps<SVGPathElement>;

type Borde = 'muesca' | 'lengueta';

export interface FormaPieza {
  x: number;
  y: number;
  w: number;
  h: number;
  r?: number;
  /** Borde de arriba: muesca (semicírculo hacia adentro) o lengüeta (hacia afuera). */
  arriba?: Borde;
  /** Borde de abajo, ídem. Una lengüeta de abajo encastra en la muesca de la pieza de abajo. */
  abajo?: Borde;
}

/** `d` de una pieza: rectángulo redondeado con muesca o lengüeta centradas arriba y/o abajo. */
export function pieza({ x, y, w, h, r = 12, arriba, abajo }: FormaPieza): string {
  const m = MEDIDA_PLANO.muesca;
  const cx = x + w / 2;
  const arco = (hasta: number, alto: number, haciaAfuera: boolean) =>
    `A${m} ${m} 0 0 ${haciaAfuera ? 1 : 0} ${hasta} ${alto}`;
  return [
    `M${x + r} ${y}`,
    arriba ? `H${cx - m}${arco(cx + m, y, arriba === 'lengueta')}` : '',
    `H${x + w - r}A${r} ${r} 0 0 1 ${x + w} ${y + r}V${y + h - r}A${r} ${r} 0 0 1 ${x + w - r} ${y + h}`,
    abajo ? `H${cx + m}${arco(cx - m, y + h, abajo === 'lengueta')}` : '',
    `H${x + r}A${r} ${r} 0 0 1 ${x} ${y + h - r}V${y + r}A${r} ${r} 0 0 1 ${x + r} ${y}Z`,
  ].join('');
}

/** Punta de flecha abierta en (x, y) que apunta en la dirección (dx, dy) (unitaria). */
function flecha(x: number, y: number, dx: number, dy: number): string {
  const a = MEDIDA_PLANO.flecha;
  const [bx, by] = [x - dx * a, y - dy * a];
  const [px, py] = [-dy * (a / 2.4), dx * (a / 2.4)];
  return `M${bx + px} ${by + py}L${x} ${y}L${bx - px} ${by - py}`;
}

interface CotaProps {
  /** Extremos de la cota (horizontal si y1 = y2; vertical si x1 = x2). */
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  /** Desde dónde salen las líneas de extensión (la arista que se mide), perpendicular a la cota. */
  desde?: number;
}

/**
 * Cota: línea con flechas en las dos puntas, líneas de extensión hasta la arista que mide y, en el
 * medio, el rótulo como una pastilla vacía (sin números ni texto: es un dibujo, no un dato).
 */
export function Cota({ x1, y1, x2, y2, desde }: CotaProps) {
  const horizontal = y1 === y2;
  const largo = Math.hypot(x2 - x1, y2 - y1);
  const [dx, dy] = [(x2 - x1) / largo, (y2 - y1) / largo];
  const [mx, my] = [(x1 + x2) / 2, (y1 + y2) / 2];
  const rotulo = horizontal ? { w: 30, h: 12 } : { w: 12, h: 30 };
  const hueco = (horizontal ? rotulo.w : rotulo.h) / 2 + 6;
  const extension =
    desde === undefined
      ? ''
      : horizontal
        ? `M${x1} ${desde}V${y1 + Math.sign(y1 - desde) * 6}M${x2} ${desde}V${y2 + Math.sign(y2 - desde) * 6}`
        : `M${desde} ${y1}H${x1 + Math.sign(x1 - desde) * 6}M${desde} ${y2}H${x2 + Math.sign(x2 - desde) * 6}`;
  return (
    <g strokeOpacity={TINTA_PLANO.cota}>
      <path
        {...TRAZO_PLANO}
        d={
          `M${x1} ${y1}L${mx - dx * hueco} ${my - dy * hueco}M${mx + dx * hueco} ${my + dy * hueco}L${x2} ${y2}` +
          flecha(x1, y1, -dx, -dy) +
          flecha(x2, y2, dx, dy) +
          extension
        }
      />
      <rect
        {...TRAZO_PLANO}
        x={mx - rotulo.w / 2}
        y={my - rotulo.h / 2}
        width={rotulo.w}
        height={rotulo.h}
        rx={Math.min(rotulo.w, rotulo.h) / 2}
      />
    </g>
  );
}

/** Línea de eje (raya y punto, como en un plano técnico). */
export function Eje({ d }: { d: string }) {
  return <path {...TRAZO_PLANO} d={d} strokeOpacity={TINTA_PLANO.eje} strokeDasharray="22 6 3 6" />;
}

/**
 * Anotación: un punto sobre la pieza, una línea de referencia quebrada y dos renglones mudos (las
 * rayas hacen de texto). `lado` dice hacia dónde sale el renglón.
 */
export function Anotacion({
  x,
  y,
  hastaX,
  hastaY,
  lado = 1,
}: {
  x: number;
  y: number;
  hastaX: number;
  hastaY: number;
  lado?: 1 | -1;
}) {
  const fin = hastaX + lado * 18;
  return (
    <g strokeOpacity={TINTA_PLANO.cota}>
      <circle cx={x} cy={y} r={3.5} fill="currentColor" fillOpacity={TINTA_PLANO.cota} />
      <path
        {...TRAZO_PLANO}
        d={
          `M${x} ${y}L${hastaX} ${hastaY}H${fin}` +
          `M${fin + lado * 8} ${hastaY - 5}h${lado * 48}M${fin + lado * 8} ${hastaY + 7}h${lado * 30}`
        }
      />
    </g>
  );
}

/** Número de paso mudo: un círculo con 1, 2 o 3 puntos (secuencia real, sin texto). */
export function Paso({ cx, cy, n }: { cx: number; cy: number; n: 1 | 2 | 3 }) {
  const puntos = Array.from({ length: n }, (_, i) => cx + (i - (n - 1) / 2) * 7);
  return (
    <g strokeOpacity={TINTA_PLANO.cota}>
      <circle {...TRAZO_PLANO} cx={cx} cy={cy} r={14} />
      {puntos.map((px) => (
        <circle key={px} cx={px} cy={cy} r={2} fill="currentColor" fillOpacity={TINTA_PLANO.cota} />
      ))}
    </g>
  );
}

/** El "clic": tres rayas cortas que salen de la junta cuando la pieza asienta. */
export function Clic({ cx, cy, radio = 26 }: { cx: number; cy: number; radio?: number }) {
  const rayas = [-150, -90, -30].map((g) => {
    const a = (g * Math.PI) / 180;
    const [c, s] = [Math.cos(a), Math.sin(a)];
    return `M${cx + c * radio} ${cy + s * radio}L${cx + c * (radio + 12)} ${cy + s * (radio + 12)}`;
  });
  return <path {...TRAZO_PLANO} d={rayas.join('')} />;
}

/** Marca de registro (la cruz con círculo de las esquinas de un pliego). */
function marcaRegistro(cx: number, cy: number): string {
  const r = MEDIDA_PLANO.registroRadio;
  const l = r + 7;
  return (
    `M${cx - r} ${cy}a${r} ${r} 0 1 0 ${2 * r} 0a${r} ${r} 0 1 0 ${-2 * r} 0` +
    `M${cx - l} ${cy}H${cx + l}M${cx} ${cy - l}V${cy + l}`
  );
}

/**
 * Las cuatro marcas de registro, pegadas a las esquinas del contenedor sea cual sea su tamaño
 * (cada una vive en un <svg> anidado ubicado con porcentajes y dibuja hacia adentro).
 */
export function MarcasRegistro() {
  const m = MEDIDA_PLANO.registroMargen;
  const esquinas = [
    { x: '0', y: '0', cx: m, cy: m },
    { x: '100%', y: '0', cx: -m, cy: m },
    { x: '0', y: '100%', cx: m, cy: -m },
    { x: '100%', y: '100%', cx: -m, cy: -m },
  ];
  return (
    <g strokeOpacity={TINTA_PLANO.registro}>
      {esquinas.map((e) => (
        <svg key={`${e.x}-${e.y}`} x={e.x} y={e.y} width="1" height="1" overflow="visible">
          <path {...TRAZO_PLANO} d={marcaRegistro(e.cx, e.cy)} />
        </svg>
      ))}
    </g>
  );
}

/**
 * Cuadrícula fina: menor cada `celda` y mayor cada `celdaMayor`, como un patrón (un solo <rect>
 * pinta toda la superficie, sin importar el tamaño). `id` tiene que ser único en la página.
 */
export function PatronGrilla({ id }: { id: string }) {
  // Medio píxel corrido: la línea de 1 px cae justo sobre una fila de píxeles (nítida, sin borronear).
  const { celda, celdaMayor } = MEDIDA_PLANO;
  const menores = Array.from({ length: celdaMayor / celda - 1 }, (_, i) => (i + 1) * celda)
    .map((p) => `M${p + 0.5} 0V${celdaMayor}M0 ${p + 0.5}H${celdaMayor}`)
    .join('');
  return (
    <pattern id={id} width={celdaMayor} height={celdaMayor} patternUnits="userSpaceOnUse">
      <path d={menores} fill="none" stroke="currentColor" strokeOpacity={TINTA_PLANO.grilla} />
      <path
        d={`M${celdaMayor} 0.5H0.5V${celdaMayor}`}
        fill="none"
        stroke="currentColor"
        strokeOpacity={TINTA_PLANO.grillaMayor}
      />
    </pattern>
  );
}

/** Rayado de corte (la pieza "seccionada" del plano), como patrón. */
export function PatronRayado({ id }: { id: string }) {
  return (
    <pattern
      id={id}
      width="10"
      height="10"
      patternUnits="userSpaceOnUse"
      patternTransform="rotate(45)"
    >
      <path d="M0 0V10" fill="none" stroke="currentColor" strokeOpacity={TINTA_PLANO.eje} />
    </pattern>
  );
}
