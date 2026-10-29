/**
 * Estado honesto de cada módulo del catálogo (ver docs/plan-sprint.md §6). La UI lo muestra tal cual:
 * `proximamente` no se puede tildar como si existiera y `a_medida` lleva al camino libre.
 */
export const ESTADOS_MODULO = ['disponible', 'en_demo', 'proximamente', 'a_medida'] as const;
export type EstadoModulo = (typeof ESTADOS_MODULO)[number];

export function esEstadoModulo(valor: unknown): valor is EstadoModulo {
  return typeof valor === 'string' && (ESTADOS_MODULO as readonly string[]).includes(valor);
}
