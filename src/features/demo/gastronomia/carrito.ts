import { calcularTotales, subtotalItem } from '@/domain/pedidos/totales';
import { resolverLinea, type LineaEntrada } from '@/domain/pedidos/schemas';
import type { Centavos } from '@/domain/pedidos/dinero';
import type { ItemPedido, Menu, Modalidad } from '@/domain/pedidos/types';

/**
 * Carrito de la demo: lógica pura (sin React). Guarda lo mismo que manda un cliente real (ids y
 * cantidades, nunca precios); los precios se resuelven contra la carta con el mismo código que
 * usará el servidor (`resolverLinea`).
 */
export interface LineaCarrito extends LineaEntrada {
  /** Identifica la combinación plato + opciones + nota: dos iguales se suman en una línea. */
  clave: string;
}

export type Carrito = readonly LineaCarrito[];

export const CARRITO_VACIO: Carrito = [];

/** Tope por línea (igual que el límite del servidor). */
export const CANTIDAD_MAXIMA = 20;

export function claveLinea(linea: LineaEntrada): string {
  const opciones = linea.modificadores
    .map((m) => `${m.grupoId}:${m.opcionId}`)
    .sort()
    .join(',');
  return `${linea.productoId}|${opciones}|${(linea.nota ?? '').trim()}`;
}

/** Suma una línea; si ya había una igual, acumula la cantidad (con tope). */
export function agregar(carrito: Carrito, linea: LineaEntrada): Carrito {
  const clave = claveLinea(linea);
  const existente = carrito.find((l) => l.clave === clave);
  if (existente) {
    return carrito.map((l) =>
      l.clave === clave
        ? { ...l, cantidad: Math.min(CANTIDAD_MAXIMA, l.cantidad + linea.cantidad) }
        : l,
    );
  }
  return [...carrito, { ...linea, cantidad: Math.min(CANTIDAD_MAXIMA, linea.cantidad), clave }];
}

/** Cambia la cantidad; 0 o menos quita la línea. */
export function cambiarCantidad(carrito: Carrito, clave: string, cantidad: number): Carrito {
  if (cantidad <= 0) return carrito.filter((l) => l.clave !== clave);
  return carrito.map((l) =>
    l.clave === clave ? { ...l, cantidad: Math.min(CANTIDAD_MAXIMA, cantidad) } : l,
  );
}

export function cantidadTotal(carrito: Carrito): number {
  return carrito.reduce((t, l) => t + l.cantidad, 0);
}

export interface LineaResuelta {
  clave: string;
  item: ItemPedido;
  subtotal: Centavos;
}

/**
 * Líneas con nombre y precio de la carta. Las que ya no existen (p. ej. se cambió el tipo de cocina
 * con el carrito lleno) se descartan.
 */
export function resolverCarrito(menu: Menu, carrito: Carrito): LineaResuelta[] {
  return carrito.flatMap((l) => {
    const r = resolverLinea(menu, l);
    return r.ok ? [{ clave: l.clave, item: r.item, subtotal: subtotalItem(r.item) }] : [];
  });
}

export function totalesCarrito(
  menu: Menu,
  carrito: Carrito,
  opciones: { propinaPorcentaje: number; modalidad: Modalidad; costoEnvio: Centavos },
) {
  return calcularTotales(
    resolverCarrito(menu, carrito).map((l) => l.item),
    opciones,
  );
}
