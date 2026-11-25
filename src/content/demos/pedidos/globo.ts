/**
 * El globo de la pizzería en el mapa del hero: un pedido para retirar, con un producto y precio de la carta
 * de la demo de pedidos (/demos/pedidos). Decorativo: la demo completa está a un toque.
 */
import { PRODUCTOS, TAMANIOS } from './carta';
import { pesos } from './ui';

const pizza = PRODUCTOS[0];

export const GLOBO_PEDIDOS = {
  titulo: 'Pedido para retirar',
  item: `${pizza?.nombre ?? ''} ${TAMANIOS.xl}`,
  precio: pesos(pizza?.precios.xl ?? 0),
  detalle: 'Retiro a las 21:30',
  boton: 'Confirmar pedido',
} as const;
