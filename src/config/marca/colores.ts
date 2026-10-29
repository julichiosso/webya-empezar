import { AA_GRANDE, AA_TEXTO, conAlfa, mezclar } from '@/lib/color';

/**
 * Colores de marca de WebYa (concepto "Encastre", ver .claude/skills/webya-brand).
 *
 * La fuente de verdad para la UI son los tokens de src/app/globals.css. Este archivo repite los
 * valores para lo que no puede leer CSS (imagen Open Graph, themeColor del navegador) y para
 * comparar paletas en /marca. src/config/marca/marca.test.ts verifica que coincidan con el CSS.
 */

/** Base oscura (default) y "papel" crema: comandas, tickets y tarjetas de pedido. */
export const BASE = {
  bg: '#0b0b0c',
  surface: '#131316',
  surface2: '#1a1a1e',
  fg: '#ffffff',
  muted: '#a1a1a6',
  subtle: '#8a8a90',
  paper: '#f4ede1',
  paperFg: '#0b0b0c',
  paperMuted: '#5e574f',
} as const;

/** Relleno del SVG original del logo (public/webya-logo.svg). Se reemplaza para pintarlo en otro color. */
export const LOGO_RELLENO_ORIGINAL = '#000000';

/** Opacidad del fondo de selección (`--accent-soft`) sobre el fondo de página. */
export const ALFA_SELECCION = 0.14;

export type PaletaId = 'brasa' | 'mostaza' | 'frambuesa';

/** Los colores que redefine una paleta en un contenedor (marca o demo personalizada). */
export interface ColoresPaleta {
  nombre: string;
  /** Relleno de CTA, foco, selección y la pieza que encaja. */
  accent: string;
  /** Texto sobre el acento (botones). */
  accentFg: string;
  /** Acento para TEXTO sobre papel crema (el acento puro no llega a AA ahí). */
  accentInk: string;
  /** Errores: tono distinto del acento para no confundirlos (y siempre con texto). */
  danger: string;
}

export interface PaletaMarca extends ColoresPaleta {
  id: PaletaId;
  /** Una frase: qué transmite. Se muestra en /marca. */
  idea: string;
}

export const PALETAS_MARCA: readonly PaletaMarca[] = [
  {
    id: 'brasa',
    nombre: 'Brasa',
    idea: 'Calor de cocina y de mostrador: lo que encaja se enciende.',
    accent: '#ff5b24',
    accentFg: '#0b0b0c',
    accentInk: '#b83a0e',
    danger: '#ff6b8a',
  },
  {
    id: 'mostaza',
    nombre: 'Mostaza',
    idea: 'Señalética y cartel de barrio: se ve de lejos y se lee al toque.',
    accent: '#ffb703',
    accentFg: '#0b0b0c',
    accentInk: '#7a5600',
    danger: '#ff6b8a',
  },
  {
    id: 'frambuesa',
    nombre: 'Frambuesa',
    idea: 'Más pop y más joven: vidriera, moda y estética.',
    accent: '#ff4f8b',
    accentFg: '#0b0b0c',
    accentInk: '#a8124a',
    danger: '#ff8a3d',
  },
];

/** Si no se elige otra, queda Brasa. */
export const PALETA_POR_DEFECTO: PaletaId = 'brasa';

export function getPaletaMarca(id: PaletaId): PaletaMarca {
  const p = PALETAS_MARCA.find((x) => x.id === id);
  if (!p) throw new Error(`Paleta desconocida: ${id}`);
  return p;
}

/** Tema claro (`<html data-theme="light">`): el acento se oscurece para llegar a AA sobre blanco. */
export const TEMA_CLARO = {
  bg: '#fafafa',
  surface: '#ffffff',
  fg: '#0b0b0c',
  muted: '#55555a',
  subtle: '#6b6b71',
  accent: '#b83a0e',
  accentFg: '#ffffff',
  danger: '#b4233f',
} as const;

/** Variables CSS que redefine una paleta (para aplicarla en un contenedor con scope). */
export function variablesDePaleta(p: ColoresPaleta): Record<string, string> {
  return {
    '--accent': p.accent,
    '--accent-fg': p.accentFg,
    '--accent-ink': p.accentInk,
    '--accent-soft': conAlfa(p.accent, ALFA_SELECCION),
    '--danger': p.danger,
  };
}

export interface Combinacion {
  nombre: string;
  texto: string;
  fondo: string;
  /** Contraste mínimo exigido: 4,5 texto normal; 3 para foco/bordes. */
  minimo: number;
}

/** Todas las combinaciones de color que usa la UI con una paleta. Cada una tiene que pasar AA. */
export function combinaciones(p: ColoresPaleta): Combinacion[] {
  const seleccion = mezclar(p.accent, BASE.bg, ALFA_SELECCION);
  return [
    { nombre: 'Acento sobre fondo', texto: p.accent, fondo: BASE.bg, minimo: AA_TEXTO },
    { nombre: 'Acento sobre tarjeta', texto: p.accent, fondo: BASE.surface2, minimo: AA_TEXTO },
    { nombre: 'Texto del botón', texto: p.accentFg, fondo: p.accent, minimo: AA_TEXTO },
    { nombre: 'Texto sobre selección', texto: BASE.fg, fondo: seleccion, minimo: AA_TEXTO },
    { nombre: 'Secundario sobre selección', texto: BASE.muted, fondo: seleccion, minimo: AA_TEXTO },
    { nombre: 'Acento sobre papel', texto: p.accentInk, fondo: BASE.paper, minimo: AA_TEXTO },
    { nombre: 'Foco sobre papel', texto: p.accentInk, fondo: BASE.paper, minimo: AA_GRANDE },
    { nombre: 'Error sobre fondo', texto: p.danger, fondo: BASE.bg, minimo: AA_TEXTO },
    { nombre: 'Error sobre tarjeta', texto: p.danger, fondo: BASE.surface2, minimo: AA_TEXTO },
  ];
}

/** Combinaciones fijas (no dependen de la paleta). */
export const COMBINACIONES_BASE: Combinacion[] = [
  { nombre: 'Texto sobre fondo', texto: BASE.fg, fondo: BASE.bg, minimo: AA_TEXTO },
  { nombre: 'Secundario sobre fondo', texto: BASE.muted, fondo: BASE.bg, minimo: AA_TEXTO },
  { nombre: 'Terciario sobre tarjeta', texto: BASE.subtle, fondo: BASE.surface2, minimo: AA_TEXTO },
  { nombre: 'Texto sobre papel', texto: BASE.paperFg, fondo: BASE.paper, minimo: AA_TEXTO },
  {
    nombre: 'Secundario sobre papel',
    texto: BASE.paperMuted,
    fondo: BASE.paper,
    minimo: AA_TEXTO,
  },
  {
    nombre: 'Claro: acento sobre fondo',
    texto: TEMA_CLARO.accent,
    fondo: TEMA_CLARO.bg,
    minimo: AA_TEXTO,
  },
  {
    nombre: 'Claro: texto del botón',
    texto: TEMA_CLARO.accentFg,
    fondo: TEMA_CLARO.accent,
    minimo: AA_TEXTO,
  },
  {
    nombre: 'Claro: error sobre fondo',
    texto: TEMA_CLARO.danger,
    fondo: TEMA_CLARO.bg,
    minimo: AA_TEXTO,
  },
  {
    nombre: 'Claro: terciario sobre fondo',
    texto: TEMA_CLARO.subtle,
    fondo: TEMA_CLARO.bg,
    minimo: AA_TEXTO,
  },
];
