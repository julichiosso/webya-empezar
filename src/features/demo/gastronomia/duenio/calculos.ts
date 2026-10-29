import { PANEL } from '@/content/demos/gastronomia/ui/panel';
import { sumar, type Centavos } from '@/domain/pedidos/dinero';
import { esFinal } from '@/domain/pedidos/estados';
import type { EstadoPedido, Pedido } from '@/domain/pedidos/types';

/** `75000 ms` → `01:15`; desde una hora: `1 h 05 min`. Para el contador de cada pedido. */
export function transcurrido(desdeIso: string, ahora: number): string {
  const segundos = Math.max(0, Math.floor((ahora - Date.parse(desdeIso)) / 1000));
  const min = Math.floor(segundos / 60);
  if (min >= 60)
    return PANEL.horasYMinutos(Math.floor(min / 60), String(min % 60).padStart(2, '0'));
  return `${String(min).padStart(2, '0')}:${String(segundos % 60).padStart(2, '0')}`;
}

/** Minutos enteros entre que entró el pedido y su último evento (para los terminados). */
export function minutosTotales(p: Pick<Pedido, 'creadoEn' | 'eventos'>): number {
  const fin = p.eventos.at(-1)?.en ?? p.creadoEn;
  return Math.max(0, Math.round((Date.parse(fin) - Date.parse(p.creadoEn)) / 60_000));
}

export interface ResumenDia {
  pedidos: number;
  enCurso: number;
  entregados: number;
  cancelados: number;
  /** Suma de los pedidos no cancelados. */
  ventas: Centavos;
}

/** Resumen calculado SOLO con los pedidos de la demo: nada inventado. */
export function resumenDelDia(pedidos: readonly Pedido[]): ResumenDia {
  const validos = pedidos.filter((p) => p.estado !== 'cancelado');
  return {
    pedidos: validos.length,
    enCurso: validos.filter((p) => !esFinal(p.estado)).length,
    entregados: validos.filter((p) => p.estado === 'entregado').length,
    cancelados: pedidos.length - validos.length,
    ventas: sumar(...validos.map((p) => p.totales.total)),
  };
}

/** Columnas del tablero del dueño, en orden. Los terminados (entregados y cancelados) van juntos. */
export const COLUMNAS: readonly { id: string; titulo: string; estados: readonly EstadoPedido[] }[] =
  [
    { id: 'nuevos', titulo: PANEL.columnas.nuevos, estados: ['recibido'] },
    { id: 'preparando', titulo: PANEL.columnas.preparando, estados: ['en_preparacion'] },
    { id: 'listos', titulo: PANEL.columnas.listos, estados: ['listo'] },
    { id: 'terminados', titulo: PANEL.columnas.terminados, estados: ['entregado', 'cancelado'] },
  ];

/** Cuántos terminados se muestran (los más recientes): el tablero no crece sin límite. */
export const TERMINADOS_VISIBLES = 6;

/**
 * ¿Pasó "recién" (hace menos de `ventanaMs`)? Se usa para anunciar y hacer sonar solo lo nuevo,
 * no lo que se restaura del almacenamiento al recargar.
 */
export function esReciente(iso: string, ahora: number, ventanaMs = 10_000): boolean {
  return ahora - Date.parse(iso) < ventanaMs;
}

/** Cómo lo recibe, en corto: "Mesa 4", "Retira", "Delivery". */
export function detalleModalidad(p: Pick<Pedido, 'modalidad' | 'mesa'>): string {
  if (p.modalidad === 'mesa') return PANEL.modalidad.mesa(p.mesa ?? '').trim();
  return p.modalidad === 'retiro' ? PANEL.modalidad.retiro : PANEL.modalidad.delivery;
}
