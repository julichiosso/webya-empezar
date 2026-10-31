import type { Rubro } from './types';

export const rubro: Rubro = {
  id: 'gastronomia',
  nombre: 'Gastronomía',
  icono: 'cubiertos',
  descripcionCorta: 'Restaurantes, bares, cafés, rotiserías y delivery.',
  objetivos: [
    { id: 'mostrar_carta', etiqueta: 'Mostrar mi carta con QR' },
    { id: 'recibir_pedidos', etiqueta: 'Recibir pedidos online' },
    { id: 'recibir_reservas', etiqueta: 'Recibir reservas de mesa' },
    { id: 'cobrar_online', etiqueta: 'Cobrar online' },
    { id: 'que_me_contacten', etiqueta: 'Que me contacten fácil' },
  ],
  modulosSugeridos: ['carta_qr', 'pedidos', 'pagos', 'notificaciones'],
  ejemploResultado:
    'Una carta digital con código QR para tus mesas, pedidos online y aviso apenas entra uno.',
  plantilla: {
    deEjemplo: true,
    ilustracion: 'gastronomia',
    portada: {
      tituloDeEjemplo: 'Tu local',
      bajada: 'Cocina casera para comer acá o llevarte a casa.',
      accion: { texto: 'Ver la carta', modulo: 'carta_qr' },
      accionSinModulo: 'Escribinos',
      detalle: { modulo: 'pagos', texto: 'Pagás online al pedir' },
    },
    secciones: [
      {
        tipo: 'lista',
        titulo: 'Carta',
        modulo: 'carta_qr',
        moduloItems: 'pedidos',
        items: [
          { nombre: 'Milanesa napolitana', detalle: 'Con papas fritas' },
          { nombre: 'Empanadas de carne', detalle: 'Cortadas a cuchillo' },
          { nombre: 'Flan casero', detalle: 'Con dulce de leche' },
        ],
        detalle: { modulo: 'notificaciones', texto: 'Te avisamos cuando sale tu pedido' },
      },
      {
        tipo: 'horarios',
        titulo: 'Horarios',
        filas: [
          { dias: 'Martes a domingo', horario: 'Mediodía y noche' },
          { dias: 'Lunes', horario: 'Cerrado' },
        ],
      },
      {
        tipo: 'contacto',
        titulo: 'Contacto',
        whatsapp: 'Escribinos por WhatsApp',
        ubicacion: 'Cómo llegar',
      },
    ],
  },
};
