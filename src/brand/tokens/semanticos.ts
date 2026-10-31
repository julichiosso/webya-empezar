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

/**
 * Fondos de sección de la dirección Plano (secciones a pantalla completa; contrato en
 * docs/plano-contrato.md). Son MATERIALES, no tema: una sección de tinta es oscura y una de crema es
 * clara con el sitio en oscuro o en claro, por eso el tema claro no los redefine. Lo que sí cambia
 * con el tema son los semánticos base (`--fg`, `--accent`…): para que un componente común se vea
 * bien adentro, la sección lleva su scope (`.superficie-tinta`, `.superficie-brasa`,
 * `.superficie-velo`; la crema usa el `.papel` de siempre). Ver SUPERFICIES abajo.
 * Cada combinación se mide en colores.ts (COMBINACIONES_SECCION) y marca.test.ts.
 */
export const SECCIONES = {
  'seccion-tinta': ref('tinta', 950),
  'seccion-tinta-fg': ref('crema', 50),
  'seccion-tinta-muted': ref('tinta', 400),
  'seccion-tinta-linea': alfa('crema', 50, ALFA.lineaSeccion),
  'seccion-tinta-acento': ref('brasa', 500),
  'seccion-crema': ref('crema', 100),
  // Los mismos valores que `.papel` (paper-fg, paper-muted, paper-line): una sección crema ES papel.
  'seccion-crema-fg': ref('negro', 950),
  'seccion-crema-muted': ref('crema', 700),
  'seccion-crema-linea': alfa('negro', 950, ALFA.lineaPapel),
  /** Sobre crema el acento de TEXTO es la tinta de Brasa (el 500 da 2,66:1). El relleno sigue en 500. */
  'seccion-crema-acento': ref('brasa', 700),
  'seccion-brasa': ref('brasa', 950),
  'seccion-brasa-fg': ref('crema', 50),
  'seccion-brasa-muted': ref('brasa', 200),
  'seccion-brasa-linea': alfa('crema', 50, ALFA.lineaSeccion),
  'seccion-brasa-acento': ref('brasa', 500),
  /** Velo plano (sin degradé) sobre la foto: el contraste se mide con la foto más clara posible. */
  'velo-imagen': alfa('tinta', 950, ALFA.velo),
  'velo-imagen-fg': ref('crema', 50),
  'velo-imagen-muted': ref('crema', 300),
  /** Solo relleno de CTA y foco (3:1 sobre el peor caso); nunca texto de acento sobre una foto. */
  'velo-imagen-acento': ref('brasa', 500),
} as const satisfies Record<string, ValorToken>;

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
  ...SECCIONES,
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

/**
 * Superficies oscuras con scope (dirección Plano): dentro de `.superficie-tinta`, `.superficie-brasa`
 * o `.superficie-velo` los semánticos base pasan a los de esa sección, con el sitio en oscuro O en
 * claro (si no, en claro el acento sería `--brasa-700`, que no llega a AA sobre tinta). Así un botón,
 * un campo o el foco se ven bien adentro sin variantes nuevas. La sección crema usa `.papel`.
 * Un string apunta a otro semántico; un ValorToken, a un primitivo o a un alfa.
 */
type Superficie = Partial<Record<TokenColor, TokenColor | ValorToken>>;

const BASE_OSCURA = {
  'accent-fg': ref('negro', 950),
  'accent-soft': alfa('brasa', 500, ALFA.seleccion),
  'accent-ink': ref('brasa', 700),
  danger: ref('rosa', 400),
} as const satisfies Superficie;

export const SUPERFICIES = {
  'superficie-tinta': {
    ...BASE_OSCURA,
    bg: 'seccion-tinta',
    surface: ref('tinta', 900),
    'surface-2': ref('tinta', 900),
    fg: 'seccion-tinta-fg',
    muted: 'seccion-tinta-muted',
    subtle: 'seccion-tinta-muted',
    line: 'seccion-tinta-linea',
    'line-strong': alfa('crema', 50, ALFA.lineaFuerteSeccion),
    accent: 'seccion-tinta-acento',
  },
  // Plana a propósito: adentro las piezas se separan con línea, no con otra superficie.
  'superficie-brasa': {
    ...BASE_OSCURA,
    bg: 'seccion-brasa',
    surface: 'seccion-brasa',
    'surface-2': 'seccion-brasa',
    fg: 'seccion-brasa-fg',
    muted: 'seccion-brasa-muted',
    subtle: 'seccion-brasa-muted',
    line: 'seccion-brasa-linea',
    'line-strong': alfa('crema', 50, ALFA.lineaFuerteSeccion),
    accent: 'seccion-brasa-acento',
  },
  // Sobre la foto: lo que necesita fondo propio (un formulario, un error) va en superficie de tinta.
  'superficie-velo': {
    ...BASE_OSCURA,
    bg: 'velo-imagen',
    surface: 'seccion-tinta',
    'surface-2': 'seccion-tinta',
    fg: 'velo-imagen-fg',
    muted: 'velo-imagen-muted',
    subtle: 'velo-imagen-muted',
    line: 'seccion-tinta-linea',
    'line-strong': alfa('crema', 50, ALFA.lineaFuerteSeccion),
    accent: 'velo-imagen-acento',
  },
} as const satisfies Record<string, Superficie>;

export type SuperficieId = keyof typeof SUPERFICIES;

/** Resuelve un valor de superficie a su color final (para los tests de contraste). */
export function valorDeSuperficie(v: TokenColor | ValorToken): string {
  return typeof v === 'string' ? TEMA_OSCURO[v].valor : v.valor;
}

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
