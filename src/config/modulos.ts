/**
 * Catálogo de módulos que WebYa puede armar. Los rubros sugieren módulos por id.
 * Agregar un módulo nuevo = una entrada acá (nombre y explicación en lenguaje no técnico).
 */
export interface Modulo {
  nombre: string;
  /** Qué hace para el dueño del negocio, sin jerga. Se muestra en "Qué incluye". */
  descripcion: string;
}

export const MODULOS = {
  turnos: {
    nombre: 'Turnos y reservas',
    descripcion: 'Tus clientes eligen día y horario solos, y vos ves la agenda ordenada.',
  },
  catalogo: {
    nombre: 'Catálogo',
    descripcion: 'Tus productos o servicios con fotos y precios, siempre actualizados.',
  },
  carta_qr: {
    nombre: 'Carta con QR',
    descripcion: 'Tu carta digital: la gente escanea un código QR y la ve en el celular.',
  },
  formularios: {
    nombre: 'Formularios',
    descripcion: 'Consultas, presupuestos o inscripciones que te llegan prolijas y completas.',
  },
  pagos: {
    nombre: 'Pagos online',
    descripcion: 'Cobrá señas, cuotas o ventas sin coordinar transferencias a mano.',
  },
  clientes: {
    nombre: 'Base de clientes',
    descripcion: 'Un lugar con todos tus clientes y su historial, en vez de mil chats.',
  },
  notificaciones: {
    nombre: 'Avisos automáticos',
    descripcion: 'Te avisamos cuando entra algo nuevo y recordamos citas a tus clientes.',
  },
} as const satisfies Record<string, Modulo>;

export type ModuloId = keyof typeof MODULOS;

export const MODULO_IDS = Object.keys(MODULOS) as ModuloId[];

export function getModulo(id: ModuloId): Modulo & { id: ModuloId } {
  return { id, ...MODULOS[id] };
}
