import type { EstadoModulo } from '@/config/modulos';
import type { NecesidadId } from '@/config/necesidades';

export type { EstadoModulo } from '@/config/modulos';

/**
 * Catálogo de módulos que WebYa puede armar. Los rubros sugieren módulos por id.
 * Agregar un módulo nuevo = una entrada acá (nombre y explicación en lenguaje no técnico).
 */
export interface Modulo {
  nombre: string;
  /** Qué hace para el dueño del negocio, sin jerga. Se muestra en "Qué incluye". */
  descripcion: string;
  /** Estado honesto: la UI lo muestra tal cual (ver config/modulos.ts). */
  estado: EstadoModulo;
  /** Necesidades del paso "¿Qué necesitás?" que resuelve (coincide con content/necesidades.ts). */
  necesidades: readonly NecesidadId[];
}

// TODO: confirmar con el usuario los estados (propuesta de docs/plan-sprint.md §6): pedidos y
// carta_qr tienen demo funcionando; el resto queda "disponible" hasta que confirme que hoy se entregan.
export const MODULOS = {
  turnos: {
    nombre: 'Turnos y reservas',
    descripcion: 'Tus clientes eligen día y horario solos, y vos ves la agenda ordenada.',
    estado: 'disponible',
    necesidades: ['turnos'],
  },
  catalogo: {
    nombre: 'Tienda y catálogo',
    descripcion: 'Tus productos o servicios con fotos y precios, siempre actualizados.',
    estado: 'disponible',
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
    // TODO: confirmar con el usuario el medio de cobro real (en la demo el cobro es simulado).
    estado: 'disponible',
    necesidades: ['vender', 'cobrar'],
  },
  clientes: {
    nombre: 'Base de clientes',
    descripcion: 'Un lugar con todos tus clientes y su historial, en vez de mil chats.',
    estado: 'disponible',
    necesidades: ['clientes'],
  },
  notificaciones: {
    nombre: 'Avisos automáticos',
    descripcion: 'Te avisamos cuando entra algo nuevo y recordamos citas a tus clientes.',
    estado: 'disponible',
    necesidades: ['turnos', 'clientes'],
  },
} as const satisfies Record<string, Modulo>;

export type ModuloId = keyof typeof MODULOS;

export const MODULO_IDS = Object.keys(MODULOS) as ModuloId[];

export function getModulo(id: ModuloId): Modulo & { id: ModuloId } {
  return { id, ...MODULOS[id] };
}
