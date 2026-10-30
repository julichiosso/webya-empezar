/**
 * Ilustraciones propias (SVG inline, grilla 96×96, trazo 2; ver skill webya-brand) que puede usar
 * un plato de ejemplo. El contenido solo nombra la clave; el dibujo vive en `platos.tsx`
 * y TypeScript exige que exista uno por clave.
 */
export const ILUSTRACIONES = [
  'carne',
  'pollo',
  'chorizo',
  'empanada',
  'queso',
  'papas',
  'ensalada',
  'agua',
  'gaseosa',
  'vino',
  'cerveza',
  'flan',
  'helado',
  'pizza',
  'faina',
  'cafe',
  'medialuna',
  'alfajor',
  'torta',
  'tostado',
  'jugo',
] as const;

export type IlustracionId = (typeof ILUSTRACIONES)[number];

export function esIlustracion(valor: string): valor is IlustracionId {
  return (ILUSTRACIONES as readonly string[]).includes(valor);
}

/**
 * Estados con personalidad (lenguaje Encastre, misma grilla 96): lo que falta es un hueco
 * punteado; lo que encaja, la pieza en acento. Ids nuevos, aparte de los platos: una pantalla
 * elige cuál mostrar, el texto que lo acompaña vive en `src/content`.
 */
export const ESTADOS = ['vacio', 'sin-resultados', 'no-encontrado', 'error', 'cargando'] as const;

export type EstadoId = (typeof ESTADOS)[number];

/** Todos los dibujos del sistema (platos + estados), para recorrerlos (p. ej. la vitrina /sistema). */
export const DIBUJO_IDS = [...ILUSTRACIONES, ...ESTADOS] as const;

export type DibujoId = (typeof DIBUJO_IDS)[number];

export function esDibujo(valor: string): valor is DibujoId {
  return (DIBUJO_IDS as readonly string[]).includes(valor);
}
