/**
 * Ilustraciones propias (SVG inline, grilla 96×96, trazo 2; ver skill webya-brand) que puede usar
 * un plato de ejemplo. La config solo nombra la clave; el dibujo vive en components/ilustraciones
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
