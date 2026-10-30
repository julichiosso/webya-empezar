import type { CSSProperties } from 'react';
import { CURVA, DURACION, ESCALA, PASO } from '../tokens/primitivos';

/**
 * Presets de movimiento de WebYa: lenguaje "Encastre" (la pieza llega, se pasa apenas y asienta).
 * Los valores salen de los tokens (src/brand/tokens/primitivos.ts → tokens.css); acá se exponen en
 * los tres formatos que piden los componentes: clases de Tailwind, estilos en línea (CSS) y
 * transiciones de la librería `motion` (segundos y curvas numéricas).
 *
 * Reglas (src/brand/BRAND.md, "Movimiento", y PRESUPUESTO abajo):
 * - Solo transform/opacity. Excepción: stroke-dashoffset en trazos chicos (íconos ≤ 24 px) y en el
 *   logo que "se escribe", una sola vez.
 * - Todo tiene equivalente estático con prefers-reduced-motion (motion.css lo resuelve en CSS;
 *   `segunMovimiento` en JS).
 * - Nada en loop sobre algo interactivo; lo que corre en loop se pausa fuera de pantalla.
 */

const ms = (v: string) => Number.parseFloat(v);

/** Duraciones con nombre de uso, en ms. */
export const DURACIONES_MS = {
  /** Feedback de toque (< 100 ms se siente inmediato). */
  instantaneo: ms(DURACION[100]),
  /** Cambios chicos: una pista, un hover que aparece. */
  rapido: ms(DURACION[160]),
  /** El snap de una pieza, el "clic" de seleccionar, una hoja que sube. */
  base: ms(DURACION[280]),
  /** Entradas compuestas (logo que se arma, hero). */
  lento: ms(DURACION[520]),
} as const;

export type NombreDuracion = keyof typeof DURACIONES_MS;

/** Las mismas duraciones como variables CSS (para `style` o CSS crudo). */
export const DURACIONES_CSS: Record<NombreDuracion, string> = {
  instantaneo: 'var(--duration-instant)',
  rapido: 'var(--duration-fast)',
  base: 'var(--duration-base)',
  lento: 'var(--duration-slow)',
};

/** `cubic-bezier(a, b, c, d)` → [a, b, c, d] (formato de la librería motion). */
function bezier(css: string): [number, number, number, number] {
  const n = (css.match(/-?\d*\.?\d+/g) ?? []).map(Number);
  if (n.length !== 4) throw new Error(`Curva inválida: ${css}`);
  return n as [number, number, number, number];
}

/** Curvas: `salida` para casi todo (entra rápido, frena suave); `entradaSalida` para trazos. */
export const CURVAS = {
  salida: bezier(CURVA.salida),
  entradaSalida: bezier(CURVA.entradaSalida),
} as const;

export const CURVAS_CSS = {
  salida: 'var(--ease-out)',
  entradaSalida: 'var(--ease-in-out)',
} as const;

/**
 * Toque: UNA escala para todo lo que se aprieta (botones, tarjetas, chips, filas de la carta).
 * Las clases usan el token `--escala-toque`, así que cambiarla es cambiar un solo valor.
 */
export const TOQUE = {
  escala: Number(ESCALA.toque),
  /** Control que se toca directamente (`<button>`, `<a>`). */
  clase:
    'transition-transform duration-(--duration-instant) ease-(--ease-out) active:scale-(--escala-toque)',
  /** Contenido de un `<label class="group">` con el input oculto (chips, tarjetas elegibles). */
  claseGrupo:
    'transition-transform duration-(--duration-instant) ease-(--ease-out) group-active:scale-(--escala-toque)',
  /** Para componentes `m.*` de motion. */
  whileTap: { scale: Number(ESCALA.toque) },
} as const;

/** Paso entre piezas escalonadas, en ms. */
export const PASO_PIEZA_MS = ms(PASO.pieza);

/**
 * Orden de una pieza en una entrada escalonada: `style={pieza(i)}` + la clase `pieza-escalonada`
 * (o cualquier animación que use `calc(var(--i) * …)`). Reemplaza los `pieza()` duplicados.
 */
export function pieza(i: number): CSSProperties {
  return { '--i': i } as CSSProperties;
}

/** Demora de la pieza `i`, en segundos (para `transition.delay` de motion). */
export function demoraPieza(i: number, pasoMs = PASO_PIEZA_MS): number {
  return (i * pasoMs) / 1000;
}

/**
 * Snap del Encastre: llega, se pasa ~2 % (escala de sobrepaso) y asienta, en la duración base.
 * En CSS es la clase `snap` (motion.css); para motion, `SNAP.motion` (keyframes + tiempos).
 */
export const SNAP = {
  sobrepaso: Number(ESCALA.sobrepaso),
  duracionMs: DURACIONES_MS.base,
  /** Desde dónde llega la pieza (px hacia arriba): cae en su lugar. */
  desdePx: -12,
  motion: {
    initial: { opacity: 0, y: -12, scale: 1 },
    animate: { opacity: [0, 1, 1], y: [-12, 0, 0], scale: [1, Number(ESCALA.sobrepaso), 1] },
    transition: {
      duration: DURACIONES_MS.base / 1000,
      ease: CURVAS.salida,
      times: [0, 0.7, 1],
    },
  },
} as const;

/** Transición de motion con una duración del sistema y la curva de salida. */
export function transicion(nombre: NombreDuracion, demora = 0) {
  return { duration: DURACIONES_MS[nombre] / 1000, ease: CURVAS.salida, delay: demora };
}

/**
 * Resortes: SOLO para seleccionar (tarjetas, el check que encaja) y para el progreso. Son los
 * valores que ya usan el wizard y la barra de progreso.
 */
export const RESORTE = {
  seleccion: { type: 'spring', stiffness: 360, damping: 20 },
  progreso: { type: 'spring', stiffness: 160, damping: 26 },
} as const;

/**
 * Equivalente estático: con movimiento reducido, la transición dura 0 (el estado final aparece
 * igual, sin perder información). `reducido` sale de `useReducedMotion()` de motion.
 */
export function segunMovimiento<T extends object>(
  reducido: boolean | null | undefined,
  t: T,
): T | { duration: 0 } {
  return reducido ? { duration: 0 } : t;
}

/** Media query del movimiento reducido (para matchMedia o CSS-in-JS). */
export const MOVIMIENTO_REDUCIDO = '(prefers-reduced-motion: reduce)';

/**
 * Presupuesto de animación (obligatorio; lo mide qa-rendimiento). Si un "wow" no entra, se
 * simplifica: gana la performance.
 */
export const PRESUPUESTO = {
  /** Lo único que se anima. `translate`/`scale`/`rotate` son las propiedades sueltas de transform. */
  propiedades: ['transform', 'translate', 'scale', 'rotate', 'opacity'],
  /**
   * Única excepción: el trazo que se dibuja (y el relleno que aparece después, en el logo), en
   * íconos chicos o en el logo, una sola vez. Son propiedades de pintado, no de composición.
   */
  excepcion: {
    propiedades: ['stroke-dashoffset', 'fill-opacity'],
    ladoMaximoIconoPx: 24,
    veces: 1,
  },
  /** Piezas de una entrada escalonada y lo que puede durar la entrada completa. */
  maxPiezas: 8,
  entradaMaximaMs: 1200,
  /** 60 fps con CPU ×4 (Android de gama media). */
  fps: 60,
  cpuThrottling: 4,
  /** JS inicial de la ruta (gzip) y layout shift. */
  jsInicialKb: 150,
  cls: 0.05,
} as const;

/** Cuánto dura una entrada escalonada de `piezas` (la última empieza tarde y dura `duracionMs`). */
export function duracionEntrada(
  piezas: number,
  duracionMs: number = DURACIONES_MS.lento,
  pasoMs = PASO_PIEZA_MS,
): number {
  return Math.max(0, piezas - 1) * pasoMs + duracionMs;
}

/** ¿La entrada entra en el presupuesto? (piezas y duración total). */
export function entraEnPresupuesto(
  piezas: number,
  duracionMs: number = DURACIONES_MS.lento,
  pasoMs = PASO_PIEZA_MS,
): boolean {
  return (
    piezas <= PRESUPUESTO.maxPiezas &&
    duracionEntrada(piezas, duracionMs, pasoMs) <= PRESUPUESTO.entradaMaximaMs
  );
}
