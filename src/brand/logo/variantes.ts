/**
 * Variantes del logo de WebYa (ver src/brand/BRAND.md, sección Logo). SIN imports a propósito: lo
 * usan Logo.tsx, src/app/apple-icon.tsx y también scripts/exportar-marca.mjs (Node puro, sin alias
 * ni bundler). Los trazos llegan por parámetro desde trazos.ts, que es la única fuente del dibujo.
 *
 * - completa: el wordmark de public/webya-logo.svg, tal cual (5 trazos).
 * - compacta: solo la "w" del wordmark (monograma para favicon, avatar y app icons). No es un
 *   isotipo nuevo: es la primera letra, con el mismo trazo.
 * - monocromo: el wordmark en una sola tinta plana que hereda del contenedor (papel, impresión,
 *   sellos). Nunca en Brasa.
 */

export const VARIANTES_LOGO = ['completa', 'compacta', 'monocromo'] as const;
export type VarianteLogo = (typeof VARIANTES_LOGO)[number];

export interface TrazoLogo {
  letra: string;
  d: string;
}

export interface Caja {
  x: number;
  y: number;
  ancho: number;
  alto: number;
}

/** Caja que ocupa un trazo (los del logo son solo M/L/Z absolutos: pares x y). */
export function cajaDe(d: string): Caja {
  const n = (d.match(/-?\d+(?:\.\d+)?/g) ?? []).map(Number);
  const xs = n.filter((_, i) => i % 2 === 0);
  const ys = n.filter((_, i) => i % 2 === 1);
  const x = Math.min(...xs);
  const y = Math.min(...ys);
  return { x, y, ancho: Math.max(...xs) - x, alto: Math.max(...ys) - y };
}

const r3 = (v: number) => Math.round(v * 1000) / 1000;

/**
 * Viewbox cuadrado centrado en la "w" (variante compacta): el lado es el ancho de la letra, así el
 * monograma llena el cuadro de lado a lado y queda centrado en alto.
 */
export function viewBoxCompacta(w: TrazoLogo): string {
  const c = cajaDe(w.d);
  const lado = c.ancho;
  const y = c.y + c.alto / 2 - lado / 2;
  return `${r3(c.x)} ${r3(y)} ${r3(lado)} ${r3(lado)}`;
}

/**
 * Zona de respeto: media altura de la "x" del wordmark (el alto de la "w") alrededor del logo.
 * Nada (texto, bordes, otro logo) entra en ese margen.
 */
export function zonaDeRespeto(w: TrazoLogo): number {
  return r3(cajaDe(w.d).alto / 2);
}

/** `translate(…) scale(…)` que centra la caja en un cuadro de `lado`, ocupando `ocupacion` del ancho. */
export function centrar(caja: Caja, lado: number, ocupacion: number): string {
  const s = (lado * ocupacion) / caja.ancho;
  const tx = lado / 2 - (caja.x + caja.ancho / 2) * s;
  const ty = lado / 2 - (caja.y + caja.alto / 2) * s;
  return `translate(${r3(tx)} ${r3(ty)}) scale(${r3(s)})`;
}

export interface OpcionesTeja {
  /** Lado del cuadro, en px. */
  lado: number;
  /** Fondo de la teja (hex resuelto: el SVG va suelto, sin CSS). */
  fondo: string;
  /** Tinta de la "w" (hex resuelto). */
  tinta: string;
  /** Radio de las esquinas, en px (0 = cuadrada; el avatar lo recorta Instagram en círculo). */
  radio: number;
  /** Qué parte del ancho ocupa la "w" (0 a 1). */
  ocupacion: number;
}

/**
 * La variante compacta en una teja (favicon, app icon, avatar): fondo plano y la "w" centrada.
 * Devuelve el SVG como texto (lo escriben el export y el favicon; lo embebe el apple-icon).
 */
export function svgTejaCompacta(w: TrazoLogo, o: OpcionesTeja): string {
  const fondo =
    o.radio > 0
      ? `<rect width="${o.lado}" height="${o.lado}" rx="${o.radio}" fill="${o.fondo}"/>`
      : `<rect width="${o.lado}" height="${o.lado}" fill="${o.fondo}"/>`;
  return (
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${o.lado} ${o.lado}" width="${o.lado}" height="${o.lado}">` +
    fondo +
    `<path transform="${centrar(cajaDe(w.d), o.lado, o.ocupacion)}" d="${w.d}" fill="${o.tinta}" fill-rule="evenodd"/>` +
    `</svg>`
  );
}

/** El wordmark completo en una tinta (hex), con su viewBox original. Para exportar (monocromo). */
export function svgWordmark(trazos: readonly TrazoLogo[], viewBox: string, tinta: string): string {
  const paths = trazos.map((t) => `<path d="${t.d}"/>`).join('');
  return (
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${viewBox}" role="img" aria-label="WebYa">` +
    `<g fill="${tinta}" fill-rule="evenodd" clip-rule="evenodd">${paths}</g></svg>`
  );
}

/**
 * Teja del favicon y los app icons: un solo juego de proporciones para que todos se vean iguales.
 * `ocupacion` 0,62: la "w" respira dentro del cuadro redondeado aunque el sistema lo recorte.
 */
export const TEJA = { radioRelativo: 0.25, ocupacion: 0.62 } as const;

/**
 * Tamaños mínimos (px de ALTO del SVG en pantalla). La completa a 20 px mide ~87 px de ancho y su
 * "x" queda en ~11 px: debajo de eso, usar la compacta. La compacta, nunca menos que el favicon.
 */
export const TAMANIO_MINIMO = { completa: 20, compacta: 16 } as const;
