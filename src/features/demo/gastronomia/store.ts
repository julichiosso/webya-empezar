'use client';

import { useSyncExternalStore } from 'react';
import {
  COCINA_POR_DEFECTO,
  getCocina,
  LOCAL_DEMO,
  PALETA_DEMO_POR_DEFECTO,
  RUBRO_DEMO,
  TENANT_DEMO,
  type CocinaId,
} from '@/config/demos/gastronomia';
import { pedidoDesdeBorrador } from '@/domain/pedidos/repository';
import { armarPedido, type EntradaPedido, type LineaEntrada } from '@/domain/pedidos/schemas';
import type { Pedido } from '@/domain/pedidos/types';
import { track } from '@/lib/analytics';
import { agregar, cambiarCantidad, CARRITO_VACIO, type Carrito } from './carrito';

/**
 * Estado de la demo de Gastronomía, compartido por la carta (cliente) y el panel (dueño).
 * Store externo chico (useSyncExternalStore): la carta y el panel pueden vivir en árboles
 * distintos y ver lo mismo. Las reglas de negocio NO están acá: se usan las del dominio
 * (armarPedido, pedidoDesdeBorrador, máquina de estados), igual que hará el servidor.
 */
export interface EstadoDemo {
  cocinaId: CocinaId;
  /** null = el nombre por defecto de la cocina ("Tu pizzería"). */
  nombreLocal: string | null;
  paletaId: string;
  carrito: Carrito;
  /** Todos los pedidos de la demo, en orden de llegada. */
  pedidos: Pedido[];
  /** El pedido que sigue el cliente en su pantalla (el último que confirmó). */
  seguimientoId: string | null;
}

export const ESTADO_INICIAL_DEMO: EstadoDemo = {
  cocinaId: COCINA_POR_DEFECTO,
  nombreLocal: null,
  paletaId: PALETA_DEMO_POR_DEFECTO,
  carrito: CARRITO_VACIO,
  pedidos: [],
  seguimientoId: null,
};

let estado: EstadoDemo = ESTADO_INICIAL_DEMO;
const oyentes = new Set<() => void>();

function publicar(nuevo: EstadoDemo) {
  estado = nuevo;
  for (const o of oyentes) o();
}

function suscribir(oyente: () => void) {
  oyentes.add(oyente);
  return () => oyentes.delete(oyente);
}

const leer = () => estado;
const leerServidor = () => ESTADO_INICIAL_DEMO;

/** Lee el estado (o una parte, con un selector que devuelva algo estable). */
export function useDemo(): EstadoDemo {
  return useSyncExternalStore(suscribir, leer, leerServidor);
}

export function getEstadoDemo(): EstadoDemo {
  return estado;
}

/** Solo para tests: vuelve al estado inicial. */
export function reiniciarStoreDemo(inicial: EstadoDemo = ESTADO_INICIAL_DEMO) {
  publicar(inicial);
}

// --- Carrito ------------------------------------------------------------------------------------

export function agregarAlCarrito(linea: LineaEntrada) {
  publicar({ ...estado, carrito: agregar(estado.carrito, linea) });
}

export function cambiarCantidadCarrito(clave: string, cantidad: number) {
  publicar({ ...estado, carrito: cambiarCantidad(estado.carrito, clave, cantidad) });
}

// --- Pedidos ------------------------------------------------------------------------------------

export type DatosCheckout = Omit<EntradaPedido, 'items'>;

export type ResultadoConfirmar = { ok: true; pedido: Pedido } | { ok: false; errores: string[] };

/** Siguiente número de pedido del tenant de la demo (1, 2, 3…). */
function siguienteNumero(pedidos: Pedido[]): number {
  return pedidos.reduce((max, p) => Math.max(max, p.numero), 0) + 1;
}

/**
 * Confirma el carrito como pedido. Pasa por la MISMA validación que un pedido real (armarPedido):
 * si algo no cierra, devuelve los errores y no toca nada.
 */
export function confirmarPedido(
  datos: DatosCheckout,
  opciones: { ahora?: Date; id?: string } = {},
): ResultadoConfirmar {
  const cocina = getCocina(estado.cocinaId);
  const items = estado.carrito.map((l) => ({
    productoId: l.productoId,
    cantidad: l.cantidad,
    modificadores: l.modificadores,
    nota: l.nota,
  }));
  const r = armarPedido(
    cocina.menu,
    { ...datos, items },
    { tenantId: TENANT_DEMO, localId: LOCAL_DEMO, costoEnvio: cocina.costoEnvio },
  );
  if (!r.ok) return r;

  const pedido = pedidoDesdeBorrador(r.borrador, {
    id: opciones.id ?? crypto.randomUUID(),
    numero: siguienteNumero(estado.pedidos),
    ahora: opciones.ahora ?? new Date(),
  });
  publicar({
    ...estado,
    pedidos: [...estado.pedidos, pedido],
    carrito: CARRITO_VACIO,
    seguimientoId: pedido.id,
  });
  track('demo_pedido_creado', {
    demo: RUBRO_DEMO,
    modalidad: pedido.modalidad,
    items: pedido.items.reduce((t, i) => t + i.cantidad, 0),
    medioPago: pedido.medioPago,
  });
  return { ok: true, pedido };
}

/** El cliente cierra el seguimiento y vuelve a la carta (el pedido sigue existiendo para el dueño). */
export function cerrarSeguimiento() {
  publicar({ ...estado, seguimientoId: null });
}
