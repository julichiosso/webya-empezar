import type { Centavos } from './dinero';

/**
 * Modelo del módulo Pedidos. Mismo contrato para la demo (en el navegador) y para el backend
 * real (tablas de supabase/migrations, etapa g). Todo monto es Centavos (entero).
 */

// --- Carta --------------------------------------------------------------------------------------

export interface OpcionModificador {
  id: string;
  nombre: string;
  /** Lo que suma al precio del plato (0 = sin cargo, p. ej. "sin cebolla"). Nunca negativo. */
  precio: Centavos;
}

export interface GrupoModificador {
  id: string;
  nombre: string;
  /** `unico`: se elige una opción (radio). `multiple`: varias (checkbox). */
  tipo: 'unico' | 'multiple';
  /** Solo para `unico`: hay que elegir una sí o sí (p. ej. punto de cocción). */
  obligatorio: boolean;
  opciones: OpcionModificador[];
}

export interface Producto {
  id: string;
  categoriaId: string;
  nombre: string;
  descripcion: string;
  precio: Centavos;
  /** Clave de la ilustración SVG propia (components/ilustraciones). */
  ilustracion: string;
  modificadores: GrupoModificador[];
}

export interface Categoria {
  id: string;
  nombre: string;
}

export interface Menu {
  categorias: Categoria[];
  productos: Producto[];
}

// --- Pedido -------------------------------------------------------------------------------------

export const MODALIDADES = ['retiro', 'delivery', 'mesa'] as const;
export type Modalidad = (typeof MODALIDADES)[number];

export const MEDIOS_PAGO = ['efectivo', 'mercado_pago'] as const;
export type MedioPago = (typeof MEDIOS_PAGO)[number];

export const ESTADOS_PEDIDO = [
  'recibido',
  'en_preparacion',
  'listo',
  'entregado',
  'cancelado',
] as const;
export type EstadoPedido = (typeof ESTADOS_PEDIDO)[number];

/** Ítem ya resuelto contra la carta: nombres y precios congelados al momento del pedido. */
export interface ItemPedido {
  productoId: string;
  nombre: string;
  cantidad: number;
  /** Precio del plato + modificadores elegidos, por unidad. */
  precioUnitario: Centavos;
  modificadores: { grupoId: string; opcionId: string; nombre: string; precio: Centavos }[];
  nota: string | null;
}

export interface Totales {
  subtotal: Centavos;
  propina: Centavos;
  envio: Centavos;
  total: Centavos;
}

export interface EventoPedido {
  estado: EstadoPedido;
  /** ISO 8601. */
  en: string;
}

export interface Pedido {
  id: string;
  tenantId: string;
  localId: string;
  /** Incremental por tenant, desde 1. Es el número que ve la gente ("Pedido #42"). */
  numero: number;
  estado: EstadoPedido;
  modalidad: Modalidad;
  cliente: { nombre: string };
  /** Solo en mesa. */
  mesa: string | null;
  /** Solo en delivery. */
  direccion: string | null;
  medioPago: MedioPago;
  /** Porcentaje de propina elegido (0, 10 o 15). */
  propinaPorcentaje: number;
  items: ItemPedido[];
  totales: Totales;
  /** Historial de estados, el primero es `recibido`. */
  eventos: EventoPedido[];
  creadoEn: string;
}

/** Lo que arma el servidor antes de guardar: el repositorio pone id, número y eventos. */
export type BorradorPedido = Omit<Pedido, 'id' | 'numero' | 'estado' | 'eventos' | 'creadoEn'>;
