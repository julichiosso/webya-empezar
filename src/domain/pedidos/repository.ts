import { transicionar } from './estados';
import type { BorradorPedido, EstadoPedido, Modalidad, Pedido } from './types';

/**
 * Contrato de persistencia de pedidos. Toda operación va acotada a un tenant: un tenant nunca ve
 * ni toca pedidos de otro. Implementaciones: memoria (demo y tests); Supabase en la etapa del
 * backend real (tablas en supabase/migrations).
 */
export interface PedidoRepository {
  /** Guarda el pedido en estado `recibido` con el próximo número del tenant (1, 2, 3…). */
  crear(borrador: BorradorPedido): Promise<Pedido>;
  obtener(tenantId: string, id: string): Promise<Pedido | null>;
  /** Más nuevos primero. */
  listar(
    tenantId: string,
    filtro?: { estado?: EstadoPedido; modalidad?: Modalidad },
  ): Promise<Pedido[]>;
  /** Aplica la máquina de estados (tira TransicionInvalidaError si no corresponde). */
  cambiarEstado(tenantId: string, id: string, hacia: EstadoPedido): Promise<Pedido>;
}

export class PedidoNoEncontradoError extends Error {
  constructor(readonly id: string) {
    super(`Pedido no encontrado: ${id}`);
    this.name = 'PedidoNoEncontradoError';
  }
}

interface OpcionesMemoria {
  ahora?: () => Date;
  nuevoId?: () => string;
  /** Pedidos iniciales (p. ej. restaurados de la demo). Los contadores siguen desde el mayor número. */
  iniciales?: Pedido[];
}

/** Implementación en memoria. Copia al entrar y al salir: nadie puede mutar el estado guardado. */
export function crearPedidoRepositoryMemoria(opciones: OpcionesMemoria = {}): PedidoRepository {
  const ahora = opciones.ahora ?? (() => new Date());
  const nuevoId = opciones.nuevoId ?? (() => crypto.randomUUID());
  const pedidos = new Map<string, Pedido>();
  const contadores = new Map<string, number>();
  const copia = (p: Pedido): Pedido => structuredClone(p);

  for (const p of opciones.iniciales ?? []) {
    pedidos.set(p.id, copia(p));
    contadores.set(p.tenantId, Math.max(contadores.get(p.tenantId) ?? 0, p.numero));
  }

  const delTenant = (tenantId: string, id: string) => {
    const p = pedidos.get(id);
    // Un pedido de otro tenant es, para este tenant, inexistente.
    return p && p.tenantId === tenantId ? p : null;
  };

  return {
    async crear(borrador) {
      const numero = (contadores.get(borrador.tenantId) ?? 0) + 1;
      contadores.set(borrador.tenantId, numero);
      const en = ahora().toISOString();
      const pedido: Pedido = {
        ...copia(borrador as Pedido),
        id: nuevoId(),
        numero,
        estado: 'recibido',
        eventos: [{ estado: 'recibido', en }],
        creadoEn: en,
      };
      pedidos.set(pedido.id, pedido);
      return copia(pedido);
    },

    async obtener(tenantId, id) {
      const p = delTenant(tenantId, id);
      return p ? copia(p) : null;
    },

    async listar(tenantId, filtro = {}) {
      return [...pedidos.values()]
        .filter(
          (p) =>
            p.tenantId === tenantId &&
            (!filtro.estado || p.estado === filtro.estado) &&
            (!filtro.modalidad || p.modalidad === filtro.modalidad),
        )
        .sort((a, b) => b.numero - a.numero)
        .map(copia);
    },

    async cambiarEstado(tenantId, id, hacia) {
      const p = delTenant(tenantId, id);
      if (!p) throw new PedidoNoEncontradoError(id);
      const actualizado = transicionar(p, hacia, ahora());
      pedidos.set(id, actualizado);
      return copia(actualizado);
    },
  };
}
