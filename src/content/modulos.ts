import type { EstadoModulo } from '@/config/modulos';
import type { NecesidadId } from '@/config/necesidades';

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
  /** Necesidades del paso "¿Qué necesitás?" que resuelve (coincide con content/necesidades.ts). */
  necesidades: readonly NecesidadId[];
}

// Solo se ofrecen como `disponible` los módulos que hoy se entregan. El resto va como `proximamente`:
// se ve, pero no se puede activar. Cuando un módulo se entrega, pasa a `disponible`. Turnos: el bot de
// peluquerías. Tienda y catálogo: verificado en el sitio de Joyería Petrucci (content/clientes.ts).
export const MODULOS = {
  turnos: {
    nombre: 'Bot de turnos',
    descripcion:
      'Un bot toma los turnos, vos ves la agenda ordenada y las estadísticas de tu negocio. Listo para peluquerías y barberías; otro rubro, lo armamos con vos.',
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
    estado: 'disponible',
    necesidades: ['carta'],
  },
  formularios: {
    nombre: 'Formularios',
    descripcion: 'Consultas, presupuestos o inscripciones que te llegan prolijas y completas.',
    estado: 'proximamente',
    necesidades: ['clientes'],
  },
  pedidos: {
    nombre: 'Pedidos online',
    descripcion: 'Tus clientes piden desde el celular y vos los ves llegar, en orden.',
    estado: 'disponible',
    necesidades: ['vender', 'carta'],
  },
  pagos: {
    nombre: 'Pagos online',
    descripcion: 'Cobrá señas, cuotas o ventas sin coordinar transferencias a mano.',
    estado: 'proximamente',
    necesidades: ['vender', 'cobrar'],
  },
  clientes: {
    nombre: 'Base de clientes',
    descripcion: 'Un lugar con todos tus clientes y su historial, en vez de mil chats.',
    estado: 'proximamente',
    necesidades: ['clientes'],
  },
  notificaciones: {
    nombre: 'Avisos automáticos',
    descripcion: 'Te avisamos cuando entra algo nuevo y recordamos citas a tus clientes.',
    estado: 'proximamente',
    necesidades: ['turnos', 'clientes'],
  },
} as const satisfies Record<string, Modulo>;

export type ModuloId = keyof typeof MODULOS;

export const MODULO_IDS = Object.keys(MODULOS) as ModuloId[];

export function getModulo(id: ModuloId): Modulo & { id: ModuloId } {
  return { id, ...MODULOS[id] };
}
