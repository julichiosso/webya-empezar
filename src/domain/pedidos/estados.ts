import type { EstadoPedido, Pedido } from './types';

/**
 * Máquina de estados del pedido. Las transiciones válidas están TODAS acá, explícitas; cualquier
 * otra tira TransicionInvalidaError. La usan igual la demo y el backend.
 *
 *   recibido ──▶ en_preparacion ──▶ listo ──▶ entregado
 *       │               │
 *       └──────┬────────┘
 *              ▼
 *          cancelado            (entregado y cancelado son finales)
 */
export const TRANSICIONES: Readonly<Record<EstadoPedido, readonly EstadoPedido[]>> = {
  recibido: ['en_preparacion', 'cancelado'],
  en_preparacion: ['listo', 'cancelado'],
  listo: ['entregado'],
  entregado: [],
  cancelado: [],
};

/** El "camino feliz": lo que hace el botón "Avanzar" del panel. */
const SIGUIENTE: Readonly<Partial<Record<EstadoPedido, EstadoPedido>>> = {
  recibido: 'en_preparacion',
  en_preparacion: 'listo',
  listo: 'entregado',
};

export class TransicionInvalidaError extends Error {
  constructor(
    readonly desde: EstadoPedido,
    readonly hacia: EstadoPedido,
  ) {
    super(`Transición inválida: ${desde} → ${hacia}`);
    this.name = 'TransicionInvalidaError';
  }
}

export function puedeTransicionar(desde: EstadoPedido, hacia: EstadoPedido): boolean {
  return TRANSICIONES[desde].includes(hacia);
}

export function esFinal(estado: EstadoPedido): boolean {
  return TRANSICIONES[estado].length === 0;
}

/** Próximo estado del camino feliz, o null si ya no se puede avanzar. */
export function siguienteEstado(estado: EstadoPedido): EstadoPedido | null {
  return SIGUIENTE[estado] ?? null;
}

/** Devuelve un pedido NUEVO con el estado cambiado y el evento registrado (no muta el original). */
export function transicionar(pedido: Pedido, hacia: EstadoPedido, ahora: Date): Pedido {
  if (!puedeTransicionar(pedido.estado, hacia)) {
    throw new TransicionInvalidaError(pedido.estado, hacia);
  }
  return {
    ...pedido,
    estado: hacia,
    eventos: [...pedido.eventos, { estado: hacia, en: ahora.toISOString() }],
  };
}

/** Avanza por el camino feliz. Tira error si el pedido ya terminó. */
export function avanzar(pedido: Pedido, ahora: Date): Pedido {
  const hacia = siguienteEstado(pedido.estado);
  if (!hacia) throw new TransicionInvalidaError(pedido.estado, pedido.estado);
  return transicionar(pedido, hacia, ahora);
}

/** Cómo se nombra cada estado según quién mira. */
export const ETIQUETA_ESTADO: Readonly<
  Record<EstadoPedido, { cliente: string; duenio: string; accion: string | null }>
> = {
  recibido: { cliente: 'Recibido', duenio: 'Nuevo', accion: 'Empezar a preparar' },
  en_preparacion: { cliente: 'En preparación', duenio: 'Preparando', accion: 'Marcar como listo' },
  listo: { cliente: 'Listo', duenio: 'Listo', accion: 'Marcar como entregado' },
  entregado: { cliente: 'Entregado', duenio: 'Entregado', accion: null },
  cancelado: { cliente: 'Cancelado', duenio: 'Cancelado', accion: null },
};

/** Pasos que ve el cliente en el seguimiento (cancelado no es un paso: se muestra aparte). */
export const PASOS_SEGUIMIENTO: readonly EstadoPedido[] = [
  'recibido',
  'en_preparacion',
  'listo',
  'entregado',
];
