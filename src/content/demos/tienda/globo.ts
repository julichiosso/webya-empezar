/**
 * El globo del comercio en el mapa del hero: un producto del catálogo de la demo de tienda (/demos/tienda),
 * con la consulta por WhatsApp. Decorativo: la demo completa está a un toque.
 */
import { RUBROS_TIENDA } from './datos';

const producto = RUBROS_TIENDA[0]?.productos[0];
const precio = (producto?.precio ?? 0).toLocaleString('es-AR', {
  style: 'currency',
  currency: 'ARS',
  maximumFractionDigits: 0,
});

export const GLOBO_TIENDA = {
  titulo: 'Catálogo',
  item: producto?.nombre ?? '',
  precio,
  boton: 'Consultar por WhatsApp',
} as const;
