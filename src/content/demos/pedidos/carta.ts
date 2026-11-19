/**
 * Carta de la demo de pedidos: las pizzas son las de la carta real de Micio's Pizzería (DEMO_SPEC del
 * sistema, 2026-11-19). Bebidas, postres y TODOS los precios son de ejemplo: la pantalla lo dice.
 */

export type Tamanio = 'xl' | 'media_xl' | 'clasica' | 'media_clasica' | 'unico';
export type SeccionId = 'pizzas' | 'bebidas' | 'postres';

export interface Producto {
  id: string;
  seccion: SeccionId;
  nombre: string;
  descripcion?: string;
  /** Precio en pesos por tamaño (entero, sin centavos). Sin tamaños: solo `unico`. */
  precios: Partial<Record<Tamanio, number>>;
  destacado?: boolean;
  /** Variante del dibujo de reemplazo (no hay fotos en la demo). */
  dibujo: number;
}

export const SECCIONES: readonly { id: SeccionId; nombre: string }[] = [
  { id: 'pizzas', nombre: 'Pizzas' },
  { id: 'bebidas', nombre: 'Bebidas' },
  { id: 'postres', nombre: 'Postres' },
];

export const TAMANIOS: Readonly<Record<Tamanio, string>> = {
  xl: 'XL',
  media_xl: '1/2 XL',
  clasica: 'Clásica',
  media_clasica: 'Clásica 1/2',
  unico: 'Único',
};

/** Los tamaños que llevan otra mitad (mitad y mitad). */
export const ES_MITAD: Readonly<Record<Tamanio, boolean>> = {
  xl: false,
  media_xl: true,
  clasica: false,
  media_clasica: true,
  unico: false,
};

const clasica = { xl: 14000, media_xl: 8000, clasica: 10000, media_clasica: 6000 };
const especial = { xl: 16000, media_xl: 9000, clasica: 11500, media_clasica: 7000 };

const pizza = (
  id: string,
  nombre: string,
  dibujo: number,
  precios = clasica,
  destacado = false,
): Producto => ({ id, seccion: 'pizzas', nombre, precios, dibujo, destacado });

export const PRODUCTOS: readonly Producto[] = [
  pizza('muzzarella', 'Muzzarella', 0, clasica, true),
  pizza('napolitana', 'Napolitana', 1, clasica, true),
  pizza('fugazeta', 'Fugazeta', 2),
  pizza('especial', 'Especial', 3),
  pizza('champinones', 'Champiñones', 4),
  pizza('anchoas', 'Anchoas', 5),
  pizza('palmitos', 'Palmitos', 1),
  pizza('pepperoni', 'Pepperoni', 3),
  pizza('roquefort', 'Roquefort', 2),
  pizza('mediterranea', 'Mediterránea', 4),
  pizza('anana', 'Ananá y J. Crudo', 5, especial),
  pizza('rucula', 'Rúcula y J. Crudo', 4, especial, true),
  pizza('bbq', 'BBQ Pulled Pork', 3, especial),
  pizza('chicken', 'Chicken Ranch', 0, especial),
  pizza('onion', 'Onion C&B', 2, especial),
  {
    id: 'gaseosa',
    seccion: 'bebidas',
    nombre: 'Gaseosa 1,5 L',
    precios: { unico: 3500 },
    dibujo: 0,
  },
  { id: 'agua', seccion: 'bebidas', nombre: 'Agua sin gas', precios: { unico: 2000 }, dibujo: 1 },
  { id: 'cerveza', seccion: 'bebidas', nombre: 'Cerveza 1 L', precios: { unico: 5000 }, dibujo: 2 },
  { id: 'flan', seccion: 'postres', nombre: 'Flan casero', precios: { unico: 4000 }, dibujo: 0 },
  { id: 'brownie', seccion: 'postres', nombre: 'Brownie', precios: { unico: 4500 }, dibujo: 1 },
  { id: 'tiramisu', seccion: 'postres', nombre: 'Tiramisú', precios: { unico: 5000 }, dibujo: 2 },
];

/** Pedidos con los que arranca la noche de la demo (nombres de ejemplo): llenan franjas para ver el salto. */
export interface PedidoSemilla {
  franja: string;
  cantidad: number;
}

export const OCUPACION_INICIAL: readonly PedidoSemilla[] = [
  { franja: '20:00', cantidad: 6 },
  { franja: '20:15', cantidad: 7 },
  { franja: '20:30', cantidad: 5 },
  { franja: '20:45', cantidad: 7 },
  { franja: '21:00', cantidad: 6 },
  { franja: '21:15', cantidad: 3 },
  { franja: '21:30', cantidad: 1 },
];

export const FRANJAS_PAUSADAS: readonly string[] = ['22:00'];

export const NOMBRES_EJEMPLO: readonly string[] = [
  'Lucía M.',
  'Martín G.',
  'Sofía R.',
  'Tomás B.',
  'Valentina P.',
  'Juan C.',
  'Camila F.',
  'Nicolás A.',
];

/** La noche de la demo: viernes a las 20:40, abierto de 20:00 a 23:00, 7 pedidos por franja. */
export const NOCHE_DEMO = {
  dia: 'Viernes',
  hora: '20:40',
  apertura: '20:00',
  cierre: '23:00',
  capacidad: 7,
} as const;
