/**
 * De dónde viene un lead. Lista CERRADA: el cliente nunca manda texto libre acá (la API y el
 * wizard validan contra esta lista). Por defecto, Instagram (el link de la bio).
 */
export const ORIGENES = ['instagram', 'demo_gastronomia', 'demo_peluqueria', 'crear'] as const;
export type Origen = (typeof ORIGENES)[number];

export const ORIGEN_DEMO_GASTRONOMIA: Origen = 'demo_gastronomia';
export const ORIGEN_DEMO_PELUQUERIA: Origen = 'demo_peluqueria';
export const ORIGEN_CREAR: Origen = 'crear';

export function esOrigen(valor: unknown): valor is Origen {
  return typeof valor === 'string' && (ORIGENES as readonly string[]).includes(valor);
}
