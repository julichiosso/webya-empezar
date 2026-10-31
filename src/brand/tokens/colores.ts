import { AA_GRANDE, AA_TEXTO, conAlfa, mezclar } from '@/lib/color';
import { ALFA, COLOR } from './primitivos';
import {
  SUPERFICIES,
  TEMA_CLARO as CLARO,
  TEMA_OSCURO as OSCURO,
  valorDeSuperficie,
} from './semanticos';

/**
 * Colores de marca de WebYa (concepto "Encastre", ver .claude/skills/webya-brand).
 *
 * Vista "plana" (hex resueltos) de los tokens de primitivos.ts y semanticos.ts, para lo que no puede leer
 * CSS (imagen Open Graph, themeColor del navegador) y para comparar paletas en /marca. No repite valores:
 * los toma de las capas; tokens.css se genera de las mismas capas (ver css.ts).
 */

/** Base oscura (default) y "papel" crema: comandas, tickets y tarjetas de pedido. */
export const BASE = {
  bg: OSCURO.bg.valor,
  surface: OSCURO.surface.valor,
  surface2: OSCURO['surface-2'].valor,
  fg: OSCURO.fg.valor,
  muted: OSCURO.muted.valor,
  subtle: OSCURO.subtle.valor,
  paper: OSCURO.paper.valor,
  paper2: OSCURO['paper-2'].valor,
  paperFg: OSCURO['paper-fg'].valor,
  paperMuted: OSCURO['paper-muted'].valor,
} as const;

/** Relleno del SVG original del logo (public/webya-logo.svg). Se reemplaza para pintarlo en otro color. */
export const LOGO_RELLENO_ORIGINAL = COLOR.negro[1000];

/** Opacidad del fondo de selección (`--accent-soft`) sobre el fondo de página. */
export const ALFA_SELECCION = ALFA.seleccion;

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
    accent: OSCURO.accent.valor,
    accentFg: OSCURO['accent-fg'].valor,
    accentInk: OSCURO['accent-ink'].valor,
    danger: OSCURO.danger.valor,
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
  bg: CLARO.bg.valor,
  surface: CLARO.surface.valor,
  fg: CLARO.fg.valor,
  muted: CLARO.muted.valor,
  subtle: CLARO.subtle.valor,
  accent: CLARO.accent.valor,
  accentFg: CLARO['accent-fg'].valor,
  danger: CLARO.danger.valor,
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
    {
      nombre: 'Acento sobre tarjeta de papel',
      texto: p.accentInk,
      fondo: BASE.paper2,
      minimo: AA_TEXTO,
    },
    // El botón de acento sobre papel se reconoce por su texto (que sí pasa AA); su borde no se exige.
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
    nombre: 'Secundario sobre tarjeta de papel',
    texto: BASE.paperMuted,
    fondo: BASE.paper2,
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

/* ——— Fondos de sección (dirección Plano) ——— */

export type SeccionId = 'tinta' | 'crema' | 'brasa' | 'velo';

/** Una superficie de sección, resuelta a hex (el velo, mezclado sobre la foto más clara posible). */
export interface SuperficieMedida {
  id: SeccionId;
  /** Clase de scope que la acompaña (la crema usa el `.papel` de siempre). */
  scope: string;
  fondo: string;
  /** Tarjeta o campo dentro de la sección. */
  superficie: string;
  fg: string;
  muted: string;
  /** Acento de texto o de foco sobre el fondo. */
  acento: string;
  /** Relleno del botón principal y su texto, por tema (solo cambia en la crema). */
  boton: Record<'oscuro' | 'claro', { fondo: string; texto: string }>;
  danger: string;
}

/** Peor caso del velo: la foto es blanca pura (ahí el texto claro pierde más contraste). */
export const FOTO_PEOR_CASO = COLOR.blanco[0];

const SUP = {
  tinta: SUPERFICIES['superficie-tinta'],
  brasa: SUPERFICIES['superficie-brasa'],
  velo: SUPERFICIES['superficie-velo'],
};

/** Botón de las superficies oscuras: el scope fija el acento y su texto, así no cambia con el tema. */
function botonFijo(sup: (typeof SUP)[keyof typeof SUP]) {
  const b = { fondo: valorDeSuperficie(sup.accent), texto: valorDeSuperficie(sup['accent-fg']) };
  return { oscuro: b, claro: b };
}

function oscura(id: 'tinta' | 'brasa' | 'velo', fondo: string): SuperficieMedida {
  const sup = SUP[id];
  return {
    id,
    scope: `superficie-${id}`,
    fondo,
    superficie: valorDeSuperficie(sup.surface),
    fg: valorDeSuperficie(sup.fg),
    muted: valorDeSuperficie(sup.muted),
    acento: valorDeSuperficie(sup.accent),
    boton: botonFijo(sup),
    danger: valorDeSuperficie(sup.danger),
  };
}

export const SUPERFICIES_SECCION: readonly SuperficieMedida[] = [
  oscura('tinta', OSCURO['seccion-tinta'].valor),
  {
    id: 'crema',
    scope: 'papel',
    fondo: OSCURO['seccion-crema'].valor,
    superficie: OSCURO['paper-2'].valor,
    fg: OSCURO['seccion-crema-fg'].valor,
    muted: OSCURO['seccion-crema-muted'].valor,
    acento: OSCURO['seccion-crema-acento'].valor,
    // `.papel` no toca el acento: el botón es el del tema (Brasa con texto negro; en claro, la
    // tinta de Brasa con texto blanco). El error, el del tema claro (rosa oscuro sobre crema).
    boton: {
      oscuro: { fondo: OSCURO.accent.valor, texto: OSCURO['accent-fg'].valor },
      claro: { fondo: CLARO.accent.valor, texto: CLARO['accent-fg'].valor },
    },
    danger: CLARO.danger.valor,
  },
  oscura('brasa', OSCURO['seccion-brasa'].valor),
  oscura('velo', mezclar(OSCURO['seccion-tinta'].valor, FOTO_PEOR_CASO, ALFA.velo)),
];

/**
 * Todas las combinaciones de una sección. Texto y secundario: 4,5 sobre el fondo y sobre su
 * tarjeta. Acento: como texto (4,5) en tinta, crema y brasa; sobre el velo solo como foco o relleno
 * (3:1), nunca texto de acento sobre una foto. Las secciones son material, no tema: valen igual en
 * oscuro y en claro (lo verifica marca.test.ts sobre tokens.css); solo el botón de la crema cambia.
 */
export function combinacionesSeccion(s: SuperficieMedida): Combinacion[] {
  const n = (t: string) => `${s.id}: ${t}`;
  const c = (nombre: string, texto: string, fondo: string, minimo = AA_TEXTO) => ({
    nombre: n(nombre),
    texto,
    fondo,
    minimo,
  });
  return [
    c('texto', s.fg, s.fondo),
    c('secundario', s.muted, s.fondo),
    c('texto sobre tarjeta', s.fg, s.superficie),
    c('secundario sobre tarjeta', s.muted, s.superficie),
    s.id === 'velo'
      ? c('acento (solo foco y relleno)', s.acento, s.fondo, AA_GRANDE)
      : c('acento', s.acento, s.fondo),
    c('texto del botón, oscuro', s.boton.oscuro.texto, s.boton.oscuro.fondo),
    c('texto del botón, claro', s.boton.claro.texto, s.boton.claro.fondo),
    c('error sobre tarjeta', s.danger, s.superficie),
  ];
}
