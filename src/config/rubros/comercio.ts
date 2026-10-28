import type { Rubro } from './types';

export const rubro: Rubro = {
  id: 'comercio',
  nombre: 'Comercio y tienda',
  icono: 'tienda',
  descripcionCorta: 'Locales, tiendas online, indumentaria, regalos y más.',
  objetivos: [
    { id: 'vender_online', etiqueta: 'Vender online' },
    { id: 'mostrar_catalogo', etiqueta: 'Mostrar mi catálogo' },
    { id: 'cobrar_online', etiqueta: 'Cobrar online' },
    { id: 'avisos_pedidos', etiqueta: 'Enterarme apenas entra un pedido' },
    { id: 'base_clientes', etiqueta: 'Tener ordenados a mis clientes' },
    { id: 'que_me_contacten', etiqueta: 'Que me contacten fácil' },
  ],
  modulosSugeridos: ['catalogo', 'pagos', 'clientes', 'notificaciones'],
  ejemploResultado:
    'Una tienda con catálogo de productos, cobro online y aviso de cada pedido nuevo.',
};
