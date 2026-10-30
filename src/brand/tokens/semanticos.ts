import { conAlfa } from '@/lib/color';
import {
  ALFA,
  COLOR,
  CURVA,
  DURACION,
  ESCALA,
  PASO,
  RADIO,
  type Material,
} from './primitivos';

/**
 * Capa 2 de 3: SEMÁNTICOS. Nombran el USO ("fondo", "acento", "línea") y apuntan a un primitivo.
 * Son los que lee la UI (bg-bg, text-fg, border-line…). Hay un juego por tema: oscuro (default),
 * claro (`<html data-theme="light">`) y papel (scope `.papel`: comandas y tickets sobre crema).
 */

/** Un valor semántico: o referencia a un primitivo (se emite como var()) o un valor con alfa. */
export interface ValorToken {
  /** Variable del primitivo al que apunta, si la hay (p. ej. `--negro-950`). */
  ref?: string;
  /** Valor final resuelto (hex o rgb con alfa): lo usan el OG, themeColor y los tests de contraste. */
  valor: string;
}

function ref<M extends Material>(material: M, tono: keyof (typeof COLOR)[M]): ValorToken {
  return { ref: `--${material}-${String(tono)}`, valor: COLOR[material][tono] as string };
}
function alfa<M extends Material>(
  material: M,
  tono: keyof (typeof COLOR)[M],
  a: number,
): ValorToken {
  return { valor: conAlfa(COLOR[material][tono] as string, a) };
}

export const TEMA_OSCURO = {
  bg: ref('negro', 950),
  surface: ref('negro', 900),
  'surface-2': ref('negro', 850),
  line: alfa('blanco', 0, ALFA.linea),
  'line-strong': alfa('blanco', 0, ALFA.lineaFuerte),
  fg: ref('blanco', 0),
  muted: ref('gris', 400),
  subtle: ref('gris', 500),
  accent: ref('brasa', 500),
  'accent-fg': ref('negro', 950),
  'accent-ink': ref('brasa', 700),
  'accent-soft': alfa('brasa', 500, ALFA.seleccion),
  danger: ref('rosa', 400),
  paper: ref('crema', 100),
  'paper-2': ref('crema', 50),
  'paper-fg': ref('negro', 950),
  'paper-muted': ref('crema', 700),
  'paper-line': alfa('negro', 950, ALFA.lineaPapel),
} as const satisfies Record<string, ValorToken>;

export type TokenColor = keyof typeof TEMA_OSCURO;

/** Tema claro: solo redefine lo que cambia. El acento se oscurece para llegar a AA sobre blanco. */
export const TEMA_CLARO = {
  bg: ref('blanco', 50),
  surface: ref('blanco', 0),
  'surface-2': ref('blanco', 100),
  line: alfa('negro', 1000, ALFA.linea),
  'line-strong': alfa('negro', 1000, ALFA.lineaFuerte),
  fg: ref('negro', 950),
  muted: ref('gris', 700),
  subtle: ref('gris', 600),
  accent: ref('brasa', 700),
  'accent-fg': ref('blanco', 0),
  'accent-ink': ref('brasa', 700),
  'accent-soft': alfa('brasa', 700, ALFA.seleccionClaro),
  danger: ref('rosa', 700),
} as const satisfies Partial<Record<TokenColor, ValorToken>>;

/**
 * Papel crema como tema con scope: dentro de `.papel` los tokens base pasan a su versión clara, así
 * los componentes compartidos (Encaje, líneas, textos) se ven bien sin variantes nuevas.
 * Los valores apuntan a otros semánticos (`--paper`…), por eso son nombres y no primitivos.
 */
export const TEMA_PAPEL = {
  bg: 'paper',
  surface: 'paper-2',
  'surface-2': 'paper-2',
  fg: 'paper-fg',
  muted: 'paper-muted',
  subtle: 'paper-muted',
  line: 'paper-line',
} as const satisfies Partial<Record<TokenColor, TokenColor>>;

/** `line-strong` de papel no tiene semántico propio en oscuro: es un alfa del negro. */
export const LINEA_FUERTE_PAPEL = alfa('negro', 950, ALFA.lineaFuertePapel);

/** Movimiento: duraciones y curvas con nombre de uso (ver brand/motion). */
export const MOVIMIENTO = {
  'ease-out': CURVA.salida,
  'ease-in-out': CURVA.entradaSalida,
  'duration-instant': DURACION[100],
  'duration-fast': DURACION[160],
  'duration-base': DURACION[280],
  'duration-slow': DURACION[520],
  'escala-toque': ESCALA.toque,
  'escala-sobrepaso': ESCALA.sobrepaso,
  'paso-pieza': PASO.pieza,
} as const;

/** Radios escalonados por jerarquía: controles < tarjetas < paneles. */
export const RADIOS = { control: RADIO.s, card: RADIO.m, panel: RADIO.l } as const;

/** Elevación mínima: un hilo de luz arriba + sombra difusa, nunca sombras pesadas. */
export const SOMBRA_ELEVADA = `0 1px 0 0 ${conAlfa(COLOR.blanco[0], ALFA.brillo)} inset, 0 8px 24px -12px ${conAlfa(COLOR.negro[1000], ALFA.sombra)}`;
