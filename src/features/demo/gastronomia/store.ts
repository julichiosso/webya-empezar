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
import { avanzar, esFinal, transicionar } from '@/domain/pedidos/estados';
import { pedidoDesdeBorrador } from '@/domain/pedidos/repository';
import { armarPedido, type EntradaPedido, type LineaEntrada } from '@/domain/pedidos/schemas';
import type { Pedido } from '@/domain/pedidos/types';
import { track } from '@/lib/analytics';
import { agregar, cambiarCantidad, CARRITO_VACIO, type Carrito } from './carrito';

/**
 * Estado de la demo de Gastronomía, compartido por la carta (cliente) y el panel (dueño).
 * Store externo chico (useSyncExternalStore): la carta y el panel pueden vivir en árboles
 * distintos y ver lo mismo; `sincronizacion.ts` lo replica entre pestañas. Las reglas de negocio
 * NO están acá: se usan las del dominio (armarPedido, pedidoDesdeBorrador, máquina de estados),
 * igual que hará el servidor.
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

/** Tope de pedidos guardados: al pasarlo se descartan los terminados más viejos. */
export const MAXIMO_PEDIDOS = 60;

let estado: EstadoDemo = ESTADO_INICIAL_DEMO;
const oyentes = new Set<() => void>();
/** Se enteran solo de los cambios hechos EN ESTA pestaña (para guardarlos y difundirlos). */
const cambiosLocales = new Set<(e: EstadoDemo) => void>();

function publicar(nuevo: EstadoDemo, origen: 'local' | 'remoto' = 'local') {
  estado = nuevo;
  for (const o of oyentes) o();
  if (origen === 'local') for (const c of cambiosLocales) c(nuevo);
}

function suscribir(oyente: () => void) {
  oyentes.add(oyente);
  return () => oyentes.delete(oyente);
}

const leer = () => estado;
const leerServidor = () => ESTADO_INICIAL_DEMO;

export function useDemo(): EstadoDemo {
  return useSyncExternalStore(suscribir, leer, leerServidor);
}

export function getEstadoDemo(): EstadoDemo {
  return estado;
}

/** Para la sincronización: avisa cada cambio local. Devuelve la función para desuscribirse. */
export function alCambiarLocalmente(fn: (e: EstadoDemo) => void): () => void {
  cambiosLocales.add(fn);
  return () => cambiosLocales.delete(fn);
}

/** Aplica un estado que llegó de otra pestaña o del almacenamiento (ya saneado). No se re-difunde. */
export function aplicarEstadoRemoto(nuevo: EstadoDemo) {
  publicar(nuevo, 'remoto');
}

/** Solo para tests: vuelve al estado inicial sin difundir nada. */
export function reiniciarStoreDemo(inicial: EstadoDemo = ESTADO_INICIAL_DEMO) {
  publicar(inicial, 'remoto');
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

/** Agrega respetando el tope: si sobra, salen primero los terminados más viejos. */
function conNuevo(pedidos: Pedido[], nuevo: Pedido): Pedido[] {
  const todos = [...pedidos, nuevo];
  let sobran = todos.length - MAXIMO_PEDIDOS;
  if (sobran <= 0) return todos;
  return todos.filter((p) => {
    if (sobran > 0 && esFinal(p.estado)) {
      sobran--;
      return false;
    }
    return true;
  });
}

/** Arma y guarda un pedido con la MISMA validación que uno real. */
function crearPedido(
  entrada: EntradaPedido,
  opciones: { ahora?: Date; id?: string },
): ResultadoConfirmar {
  const cocina = getCocina(estado.cocinaId);
  const r = armarPedido(cocina.menu, entrada, {
    tenantId: TENANT_DEMO,
    localId: LOCAL_DEMO,
    costoEnvio: cocina.costoEnvio,
  });
  if (!r.ok) return r;
  const pedido = pedidoDesdeBorrador(r.borrador, {
    id: opciones.id ?? crypto.randomUUID(),
    numero: siguienteNumero(estado.pedidos),
    ahora: opciones.ahora ?? new Date(),
  });
  return { ok: true, pedido };
}

/**
 * Confirma el carrito como pedido. Si la validación falla, devuelve los errores y no toca nada.
 */
export function confirmarPedido(
  datos: DatosCheckout,
  opciones: { ahora?: Date; id?: string } = {},
): ResultadoConfirmar {
  const items = estado.carrito.map((l) => ({
    productoId: l.productoId,
    cantidad: l.cantidad,
    modificadores: l.modificadores,
    nota: l.nota,
  }));
  const r = crearPedido({ ...datos, items }, opciones);
  if (!r.ok) return r;
  publicar({
    ...estado,
    pedidos: conNuevo(estado.pedidos, r.pedido),
    carrito: CARRITO_VACIO,
    seguimientoId: r.pedido.id,
  });
  track('demo_pedido_creado', {
    demo: RUBRO_DEMO,
    modalidad: r.pedido.modalidad,
    items: r.pedido.items.reduce((t, i) => t + i.cantidad, 0),
    medioPago: r.pedido.medioPago,
  });
  return r;
}

/**
 * "Simular un pedido" del panel: otro cliente pide algo de la carta de ejemplo (en rotación).
 * No toca el carrito ni el seguimiento de quien está probando la carta.
 */
export function simularPedido(opciones: { ahora?: Date; id?: string } = {}): Pedido | null {
  const ejemplos = getCocina(estado.cocinaId).pedidosEjemplo;
  const entrada = ejemplos[estado.pedidos.length % ejemplos.length];
  if (!entrada) return null;
  const r = crearPedido(entrada, opciones);
  if (!r.ok) return null;
  publicar({ ...estado, pedidos: conNuevo(estado.pedidos, r.pedido) });
  return r.pedido;
}

function reemplazar(actualizado: Pedido) {
  publicar({
    ...estado,
    pedidos: estado.pedidos.map((p) => (p.id === actualizado.id ? actualizado : p)),
  });
  track('demo_estado_avanzado', { demo: RUBRO_DEMO, estado: actualizado.estado });
}

/** El dueño avanza el pedido por el camino feliz (máquina de estados del dominio). */
export function avanzarPedido(id: string, ahora: Date = new Date()) {
  const p = estado.pedidos.find((x) => x.id === id);
  if (p) reemplazar(avanzar(p, ahora));
}

export function cancelarPedido(id: string, ahora: Date = new Date()) {
  const p = estado.pedidos.find((x) => x.id === id);
  if (p) reemplazar(transicionar(p, 'cancelado', ahora));
}

/** El cliente cierra el seguimiento y vuelve a la carta (el pedido sigue existiendo para el dueño). */
export function cerrarSeguimiento() {
  publicar({ ...estado, seguimientoId: null });
}

/** Borra pedidos y carrito (mantiene la personalización: nombre, paleta y cocina). */
export function reiniciarDemo() {
  publicar({ ...estado, pedidos: [], carrito: CARRITO_VACIO, seguimientoId: null });
}
