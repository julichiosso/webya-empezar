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
  plantilla: {
    deEjemplo: true,
    ilustracion: 'comercio',
    portada: {
      tituloDeEjemplo: 'Tu tienda',
      bajada: 'Ropa, accesorios y regalos para elegir desde el celular.',
      accion: { texto: 'Ver productos', modulo: 'catalogo' },
      accionSinModulo: 'Escribinos',
      detalle: { modulo: 'pagos', texto: 'Pagás online, sin transferencias' },
    },
    secciones: [
      {
        tipo: 'lista',
        titulo: 'Productos',
        modulo: 'catalogo',
        moduloItems: 'catalogo',
        items: [
          { nombre: 'Remera de algodón', detalle: 'En varios colores' },
          { nombre: 'Taza de cerámica', detalle: 'Hecha a mano' },
          { nombre: 'Bolso de lona', detalle: 'Para todos los días' },
        ],
        detalle: { modulo: 'notificaciones', texto: 'Te avisamos cuando sale tu compra' },
      },
      {
        tipo: 'horarios',
        titulo: 'Horarios',
        filas: [
          { dias: 'Lunes a viernes', horario: 'Mañana y tarde' },
          { dias: 'Sábados', horario: 'Por la mañana' },
        ],
      },
      {
        tipo: 'contacto',
        titulo: 'Contacto',
        whatsapp: 'Escribinos por WhatsApp',
        ubicacion: 'Cómo llegar al local',
        detalle: { modulo: 'clientes', texto: 'Tus compras anteriores, a mano' },
      },
    ],
  },
};
