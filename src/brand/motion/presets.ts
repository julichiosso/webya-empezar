import type { CSSProperties } from 'react';
import { CURVA, DESPLAZAMIENTO, DURACION, ESCALA, PASO } from '../tokens/primitivos';
import { TOQUE_CLASE, TOQUE_CLASE_GRUPO } from './toque';

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
  clase: TOQUE_CLASE,
  /** Contenido de un `<label class="group">` con el input oculto (chips, tarjetas elegibles). */
  claseGrupo: TOQUE_CLASE_GRUPO,
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

/* ——— Kinetic type: la palabra que encastra (dirección Plano) ——— */

/** Paso entre palabras de un titular, en ms (un poco más corto que el de las piezas). */
export const PASO_PALABRA_MS = ms(PASO.palabra);

/**
 * Titular que se arma palabra por palabra: cada palabra llega desplazada (alternando desde abajo y
 * desde arriba, como las letras del logo que se arma) y apenas achicada, se pasa un poco (`asiento`
 * y el sobrepaso del snap) y asienta. Una sola vez. Valores desde los tokens (`--paso-palabra`,
 * `--escala-palabra`, `--desplazamiento-palabra`, `--asiento-palabra`, `--duration-slow`,
 * `--ease-out`).
 *
 * Dos formas de usarlo, con la misma coreografía:
 * - CSS, sin JS (la recomendada para el titular del hero: corre antes de hidratar):
 *   `<span className={ENCASTRE_PALABRA.clase} style={estiloPalabra(i)}>palabra</span>{' '}`
 * - motion: `<m.span {...encastrePalabra(i, useReducedMotion())}>palabra</m.span>{' '}`
 *
 * Pasado el tope (`maxPalabras`), las palabras entran junto con la última del tope: un titular largo
 * nunca tarda más que `duracionTitulo(maxPalabras)`.
 */
export const ENCASTRE_PALABRA = {
  clase: 'palabra-encastre',
  duracionMs: DURACIONES_MS.lento,
  pasoMs: PASO_PALABRA_MS,
  escalaInicial: Number(ESCALA.palabra),
  sobrepaso: Number(ESCALA.sobrepaso),
  desplazamientoEm: Number.parseFloat(DESPLAZAMIENTO.palabra),
  asientoEm: Number.parseFloat(DESPLAZAMIENTO.asiento),
  /** Momentos del recorrido: llega (0), se pasa (0,62) y asienta (1). Los mismos que motion.css. */
  tiempos: [0, 0.62, 1],
  maxPalabras: PRESUPUESTO.maxPiezas,
} as const;

/** Desde dónde llega la palabra `i`: las pares desde abajo (1), las impares desde arriba (-1). */
export function ladoPalabra(i: number): 1 | -1 {
  return i % 2 === 0 ? 1 : -1;
}

/** Orden efectivo de la palabra `i` (las que pasan el tope entran con la última del tope). */
export function ordenPalabra(i: number): number {
  return Math.min(Math.max(0, i), ENCASTRE_PALABRA.maxPalabras - 1);
}

/** Estilo de la versión CSS: `--i` (orden) y `--lado`, para la clase `palabra-encastre`. */
export function estiloPalabra(i: number): CSSProperties {
  return { '--i': ordenPalabra(i), '--lado': ladoPalabra(i) } as CSSProperties;
}

/**
 * Props de motion para la palabra `i` (`<m.span {...encastrePalabra(i, reducido)}>`). Con movimiento
 * reducido la palabra aparece en su lugar, sin transición (versión estática equivalente).
 */
export function encastrePalabra(i: number, reducido?: boolean | null) {
  const e = ENCASTRE_PALABRA;
  if (reducido) {
    return {
      initial: false as const,
      animate: { opacity: 1, y: '0em', scale: 1 },
      transition: { duration: 0 },
    };
  }
  const lado = ladoPalabra(i);
  const desde = `${lado * e.desplazamientoEm}em`;
  return {
    initial: { opacity: 0, y: desde, scale: e.escalaInicial },
    animate: {
      opacity: [0, 1, 1],
      y: [desde, `${-lado * e.asientoEm}em`, '0em'],
      scale: [e.escalaInicial, e.sobrepaso, 1],
    },
    transition: {
      duration: e.duracionMs / 1000,
      ease: CURVAS.salida,
      times: [...e.tiempos],
      delay: (ordenPalabra(i) * e.pasoMs) / 1000,
    },
  };
}

/** Cuánto tarda en armarse un titular de `palabras` palabras, en ms (respeta el tope). */
export function duracionTitulo(palabras: number): number {
  const n = Math.min(Math.max(0, palabras), ENCASTRE_PALABRA.maxPalabras);
  return duracionEntrada(n, ENCASTRE_PALABRA.duracionMs, ENCASTRE_PALABRA.pasoMs);
}
