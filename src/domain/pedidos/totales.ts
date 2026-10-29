import { multiplicar, porcentaje, sumar, type Centavos } from './dinero';
import type { ItemPedido, Modalidad, Totales } from './types';

/** Propinas que se ofrecen (porcentaje entero). 0 = sin propina, la opción por defecto. */
export const PROPINAS = [0, 10, 15] as const;
export type Propina = (typeof PROPINAS)[number];

/** Subtotal de una línea: (plato + modificadores) × cantidad. */
export function subtotalItem(item: Pick<ItemPedido, 'precioUnitario' | 'cantidad'>): Centavos {
  return multiplicar(item.precioUnitario, item.cantidad);
}

/**
 * Totales del pedido. La propina se calcula sobre el subtotal (no sobre el envío) y el envío solo
 * se cobra en delivery. Todo en centavos, con una sola regla de redondeo (`porcentaje`).
 */
export function calcularTotales(
  items: Pick<ItemPedido, 'precioUnitario' | 'cantidad'>[],
  opciones: { propinaPorcentaje: number; modalidad: Modalidad; costoEnvio: Centavos },
): Totales {
  const subtotal = sumar(...items.map(subtotalItem));
  const propina = porcentaje(subtotal, opciones.propinaPorcentaje);
  const envio = opciones.modalidad === 'delivery' ? opciones.costoEnvio : 0;
  return { subtotal, propina, envio, total: sumar(subtotal, propina, envio) };
}
