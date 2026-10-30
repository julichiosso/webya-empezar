/**
 * Plantilla del sistema de ilustración de WebYa: una grilla para íconos, otra para dibujos y el
 * lenguaje "Encastre" (muesca, hueco punteado, la pieza que encaja en acento). Todo el arte de
 * `src/brand/ilustracion` se dibuja con estas medidas; `iconos/icons.test.ts` las verifica.
 * Explicación con ejemplos en `LEEME.md`.
 */

/** Íconos: 24 × 24, trazo 1,5, extremos y uniones redondos, sin relleno. */
export const GRILLA_ICONO = {
  lado: 24,
  viewBox: '0 0 24 24',
  trazo: 1.5,
  /** Zona viva: ninguna coordenada sale de [2, 22] (el trazo no se corta contra el borde). */
  zona: [2, 22],
  /** Radios de esquina: 1 en piezas chicas (< 8), 2 en las grandes. */
  radio: { chico: 1, grande: 2 },
  /** Radio de la muesca (el semicírculo del ticket colgado del riel). */
  muesca: 1.5,
} as const;

/** Dibujos (platos, estados): 96 × 96, trazo 2, como máximo dos tonos planos. */
export const GRILLA_DIBUJO = {
  lado: 96,
  viewBox: '0 0 96 96',
  trazo: 2,
  /** Zona viva: [8, 88]. */
  zona: [8, 88],
  radio: { chico: 2, grande: 6 },
  /** Radio de la muesca: 6 en piezas grandes (lado ≥ 40), 3 en las chicas. */
  muesca: { grande: 6, chica: 3 },
  /** Hueco punteado: 4 de trazo y 5 de aire (con extremos redondos se ve como puntos largos). */
  punteado: '4 5',
} as const;

/** Atributos comunes de todo SVG del sistema: el color sale siempre del texto (`currentColor`). */
export const TRAZO = {
  fill: 'none',
  stroke: 'currentColor',
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
} as const;

/**
 * Los tres estados del Encastre, como clases de tokens (nunca colores sueltos):
 * - `hueco`: lo que falta, punteado y en gris de línea.
 * - `pieza`: lo que encaja, en el acento (Brasa). Nunca al revés.
 * - `aviso`: solo para el dibujo de error (rosa frío, distinto del acento).
 */
export const ENCASTRE = {
  hueco: 'stroke-hueco-borde',
  pieza: 'fill-pieza-encajada',
  piezaTrazo: 'stroke-pieza-encajada',
  aviso: 'stroke-danger',
} as const;

/** Las variables CSS que usan las clases de arriba (el test verifica que existan en tokens.css). */
export const TOKENS_USADOS = ['--hueco-borde', '--pieza-encajada', '--danger'] as const;

// ——— Formas base (devuelven el `d` de un <path>) ———

/** Redondea a un decimal: la grilla no usa más precisión que 0,1. */
export const r1 = (n: number) => Math.round(n * 10) / 10;

export const circulo = (cx: number, cy: number, r: number) =>
  `M${cx - r} ${cy}a${r} ${r} 0 1 0 ${2 * r} 0a${r} ${r} 0 1 0 ${-2 * r} 0`;

export const rectangulo = (x: number, y: number, w: number, h: number, r: number) =>
  `M${x + r} ${y}h${w - 2 * r}a${r} ${r} 0 0 1 ${r} ${r}v${h - 2 * r}a${r} ${r} 0 0 1 ${-r} ${r}` +
  `h${-(w - 2 * r)}a${r} ${r} 0 0 1 ${-r} ${-r}v${-(h - 2 * r)}a${r} ${r} 0 0 1 ${r} ${-r}Z`;

/**
 * La muesca: un rectángulo redondeado con un semicírculo hacia adentro en el centro del borde de
 * arriba (el ticket colgado del riel; es la misma forma que la clase `.encastre` de CSS).
 */
export const conMuesca = (x: number, y: number, w: number, h: number, r: number, m: number) => {
  const lado = (w - 2 * m) / 2 - r;
  return (
    `M${x + r} ${y}h${lado}a${m} ${m} 0 0 0 ${2 * m} 0h${lado}a${r} ${r} 0 0 1 ${r} ${r}` +
    `v${h - 2 * r}a${r} ${r} 0 0 1 ${-r} ${r}h${-(w - 2 * r)}a${r} ${r} 0 0 1 ${-r} ${-r}` +
    `v${-(h - 2 * r)}a${r} ${r} 0 0 1 ${r} ${-r}Z`
  );
};

/**
 * Hueco punteado en un ícono: el círculo partido en `n` arcos. Se dibuja con trazos reales (no con
 * `stroke-dasharray`) para que el "dibujado" de `Icon draw` siga funcionando.
 */
export const circuloPunteado = (cx: number, cy: number, r: number, n = 8, lleno = 0.6) => {
  const paso = (2 * Math.PI) / n;
  return Array.from({ length: n }, (_, i) => {
    const a = i * paso - Math.PI / 2 + (paso * (1 - lleno)) / 2;
    const b = a + paso * lleno;
    const p = (t: number) => `${r1(cx + r * Math.cos(t))} ${r1(cy + r * Math.sin(t))}`;
    return `M${p(a)}A${r} ${r} 0 0 1 ${p(b)}`;
  });
};
