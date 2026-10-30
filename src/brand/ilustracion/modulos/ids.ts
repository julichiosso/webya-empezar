/**
 * Artes de módulo que brand sabe dibujar (lo que aporta cada módulo a la mini web del negocio).
 * Brand define el vocabulario; `content` elige cuál usa cada módulo. Hoy los strings coinciden con
 * los ids del catálogo (`content/modulos.ts`), así que se puede pasar un id de módulo directo; un
 * test avisa si se suma un módulo sin arte.
 */
export const ARTES_MODULO = [
  'turnos',
  'catalogo',
  'carta_qr',
  'formularios',
  'pedidos',
  'pagos',
  'clientes',
  'notificaciones',
] as const;

export type ArteModulo = (typeof ARTES_MODULO)[number];

export function esArteModulo(valor: string): valor is ArteModulo {
  return (ARTES_MODULO as readonly string[]).includes(valor);
}
