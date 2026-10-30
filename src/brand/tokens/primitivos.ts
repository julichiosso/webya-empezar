/**
 * Capa 1 de 3: PRIMITIVOS. Valores crudos con nombre de material ("negro 950", "brasa 500"), nunca de uso.
 * Ningún componente los lee: pasan por los semánticos (semanticos.ts) y de ahí a los de componente
 * (componentes.ts). El CSS se genera con `pnpm tokens` (ver css.ts y tokens.css.test.ts).
 */

export const COLOR = {
  /** 1000 es negro puro: solo para sombras (con alfa). */
  negro: { 1000: '#000000', 950: '#0b0b0c', 900: '#131316', 850: '#1a1a1e' },
  gris: { 400: '#a1a1a6', 500: '#8a8a90', 600: '#6b6b71', 700: '#55555a' },
  blanco: { 0: '#ffffff', 50: '#fafafa', 100: '#f2f2f3' },
  crema: { 50: '#fbf8f2', 100: '#f4ede1', 700: '#5e574f' },
  /** Acento "Brasa": 500 es el relleno; 700 es la tinta (texto sobre papel y acento del tema claro). */
  brasa: { 500: '#ff5b24', 700: '#b83a0e' },
  /** Error en rosa frío: no se confunde con Brasa. */
  rosa: { 400: '#ff6b8a', 700: '#b4233f' },
} as const;

export type Material = keyof typeof COLOR;

/** Opacidades con nombre (líneas, selección, brillo de la elevación). */
export const ALFA = {
  linea: 0.1,
  lineaFuerte: 0.2,
  seleccion: 0.14,
  seleccionClaro: 0.1,
  lineaPapel: 0.14,
  lineaFuertePapel: 0.32,
  brillo: 0.04,
  sombra: 0.5,
} as const;

/**
 * Grilla de 8 px. En Tailwind (base 4 px) equivale a usar los pasos pares: p-2 = 8 px, p-4 = 16 px…
 * Los pasos impares (4 px) quedan para ajustes ópticos chicos. Estos tokens nombran los ritmos grandes.
 */
export const ESPACIO = {
  '1x': '0.5rem',
  '2x': '1rem',
  '3x': '1.5rem',
  '4x': '2rem',
  '6x': '3rem',
  '8x': '4rem',
  '12x': '6rem',
  '16x': '8rem',
} as const;

export const DURACION = { 100: '100ms', 160: '160ms', 280: '280ms', 520: '520ms' } as const;

/**
 * Escalas del movimiento Encastre: UNA sola escala de toque para todo lo que se aprieta (antes
 * había 0.96, 0.97, 0.98 y 0.99 sueltos) y el sobrepaso del snap (la pieza se pasa ~2 % y asienta).
 */
export const ESCALA = { toque: '0.98', sobrepaso: '1.02' } as const;

/** Paso entre piezas que entran escalonadas (logo, chips, tablero): pieza(i) × paso. */
export const PASO = { pieza: '70ms' } as const;

export const CURVA = {
  salida: 'cubic-bezier(0.22, 1, 0.36, 1)',
  entradaSalida: 'cubic-bezier(0.65, 0, 0.35, 1)',
} as const;

export const RADIO = { s: '0.75rem', m: '1rem', l: '1.5rem' } as const;

export const FUENTE_SANS =
  "var(--font-outfit), system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif";

/** Escala tipográfica fluida: [tamaño, interlineado, tracking]. Cuerpo ≥ 16 px (evita zoom de iOS). */
export const TIPO = {
  display: ['clamp(2.5rem, 1.7rem + 4.2vw, 4.75rem)', '1', '-0.045em'],
  title: ['clamp(1.75rem, 1.35rem + 2vw, 2.75rem)', '1.05', '-0.035em'],
  heading: ['1.375rem', '1.2', '-0.02em'],
  lead: ['1.1875rem', '1.5', null],
  body: ['1rem', '1.55', null],
  small: ['0.875rem', '1.45', null],
  // Hero de escritorio: título y línea gris en UNA línea cada uno (lo mide e2e/layout.spec.ts).
  hero: ['clamp(2.25rem, 0.2rem + 3.4vw, 3rem)', '1.05', '-0.04em'],
  'hero-sub': ['clamp(1.125rem, 0.3rem + 1.9vw, 1.625rem)', '1.2', '-0.02em'],
} as const satisfies Record<string, readonly [string, string, string | null]>;
