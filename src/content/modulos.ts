import type { EstadoModulo } from '@/config/modulos';
import type { NecesidadId } from '@/config/necesidades';
import { PENDIENTES } from '@/content/pendientes';

export type { EstadoModulo } from '@/config/modulos';

/**
 * Catálogo de módulos que WebYa puede armar. Los rubros sugieren módulos por id.
 * Agregar un módulo nuevo = una entrada acá (nombre y explicación en lenguaje no técnico).
 * La etiqueta y la explicación de cada estado viven en content/estados-modulo.ts.
 */
export interface Modulo {
  nombre: string;
  /** Qué hace para el dueño del negocio, sin jerga. Se muestra en "Qué incluye". */
  descripcion: string;
  /** Estado honesto: la UI lo muestra tal cual (ver config/modulos.ts). */
  estado: EstadoModulo;
  /**
   * Aclaración visible junto al estado, cuando hace falta: lo que todavía no está confirmado (con
   * "TODO:") o un límite de la demo. Se muestra tal cual, al lado de la etiqueta del estado.
   */
  notaEstado?: string;
  /** Necesidades del paso "¿Qué necesitás?" que resuelve (coincide con content/necesidades.ts). */
  necesidades: readonly NecesidadId[];
}

// Estados confirmados por el usuario (2026-10-29, docs/plan-sprint.md §6): pedidos y carta_qr tienen demo
// funcionando; el resto queda "disponible" con su TODO visible hasta que confirme que hoy se entrega.
export const MODULOS = {
  turnos: {
    nombre: 'Turnos y reservas',
    descripcion: 'Tus clientes eligen día y horario solos, y vos ves la agenda ordenada.',
    estado: 'disponible',
    notaEstado: PENDIENTES.moduloSinConfirmar,
    necesidades: ['turnos'],
  },
  catalogo: {
    nombre: 'Tienda y catálogo',
    descripcion: 'Tus productos o servicios con fotos y precios, siempre actualizados.',
    estado: 'disponible',
    notaEstado: PENDIENTES.moduloSinConfirmar,
    necesidades: ['vender'],
  },
  carta_qr: {
    nombre: 'Carta con QR',
    descripcion: 'Tu carta digital: la gente escanea un código QR y la ve en el celular.',
    estado: 'en_demo',
    necesidades: ['carta'],
  },
  formularios: {
    nombre: 'Formularios',
    descripcion: 'Consultas, presupuestos o inscripciones que te llegan prolijas y completas.',
    estado: 'disponible',
    notaEstado: PENDIENTES.moduloSinConfirmar,
    necesidades: ['clientes'],
  },
  pedidos: {
    nombre: 'Pedidos online',
    descripcion: 'Tus clientes piden desde el celular y vos los ves llegar, en orden.',
    estado: 'en_demo',
    necesidades: ['vender', 'carta'],
  },
  pagos: {
    nombre: 'Pagos online',
    descripcion: 'Cobrá señas, cuotas o ventas sin coordinar transferencias a mano.',
    estado: 'disponible',
    notaEstado: `En la demo el cobro es simulado. ${PENDIENTES.moduloSinConfirmar} Falta definir el medio de cobro real.`,
    necesidades: ['vender', 'cobrar'],
  },
  clientes: {
    nombre: 'Base de clientes',
    descripcion: 'Un lugar con todos tus clientes y su historial, en vez de mil chats.',
    estado: 'disponible',
    notaEstado: PENDIENTES.moduloSinConfirmar,
    necesidades: ['clientes'],
  },
  notificaciones: {
    nombre: 'Avisos automáticos',
    descripcion: 'Te avisamos cuando entra algo nuevo y recordamos citas a tus clientes.',
    estado: 'disponible',
    notaEstado: PENDIENTES.moduloSinConfirmar,
    necesidades: ['turnos', 'clientes'],
  },
} as const satisfies Record<string, Modulo>;

export type ModuloId = keyof typeof MODULOS;

export const MODULO_IDS = Object.keys(MODULOS) as ModuloId[];

export function getModulo(id: ModuloId): Modulo & { id: ModuloId } {
  return { id, ...MODULOS[id] };
}

/** Una aclaración pendiente y los módulos que la comparten. */
export interface NotaPendiente {
  nota: string;
  nombres: string[];
}

/**
 * Agrupa las `notaEstado` por texto: el mismo TODO se muestra una vez, con los módulos a los que
 * aplica, en vez de repetirse en cada tarjeta. Orden del catálogo.
 */
export function notasPendientes(ids: readonly ModuloId[] = MODULO_IDS): NotaPendiente[] {
  const porNota = new Map<string, string[]>();
  for (const id of ids) {
    const { notaEstado, nombre } = getModulo(id);
    if (notaEstado) porNota.set(notaEstado, [...(porNota.get(notaEstado) ?? []), nombre]);
  }
  return [...porNota].map(([nota, nombres]) => ({ nota, nombres }));
}
