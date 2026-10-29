/**
 * Contraste WCAG 2.x entre colores hex (#rrggbb). Lo usan los tests de marca y la página /marca
 * para reportar cada combinación con el número real, no a ojo.
 */

/** Umbrales WCAG AA: texto normal 4,5:1; texto grande y elementos no textuales (bordes, foco) 3:1. */
export const AA_TEXTO = 4.5;
export const AA_GRANDE = 3;

function canales(hex: string): [number, number, number] {
  const m = /^#([0-9a-f]{6})$/i.exec(hex);
  if (!m?.[1]) throw new Error(`Color inválido: ${hex}`);
  const n = parseInt(m[1], 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
}

function luminancia(hex: string): number {
  const [r, g, b] = canales(hex).map((c) => {
    const v = c / 255;
    return v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4;
  }) as [number, number, number];
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

/** Relación de contraste entre dos colores (1 a 21). */
export function contraste(a: string, b: string): number {
  const [x, y] = [luminancia(a), luminancia(b)];
  return (Math.max(x, y) + 0.05) / (Math.min(x, y) + 0.05);
}

/** Color resultante de pintar `color` con opacidad `alfa` sobre `fondo` (ambos opacos). */
export function mezclar(color: string, fondo: string, alfa: number): string {
  const c = canales(color);
  const f = canales(fondo);
  return `#${c
    .map((v, i) => Math.round(v * alfa + (f[i] ?? 0) * (1 - alfa)))
    .map((v) => v.toString(16).padStart(2, '0'))
    .join('')}`;
}

/** `#ff5b24` + 0.14 → `rgb(255 91 36 / 0.14)` (mismo formato que usa globals.css). */
export function conAlfa(hex: string, alfa: number): string {
  return `rgb(${canales(hex).join(' ')} / ${alfa})`;
}
