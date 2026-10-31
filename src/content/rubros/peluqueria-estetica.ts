import type { Rubro } from './types';

export const rubro: Rubro = {
  id: 'peluqueria_estetica',
  nombre: 'Peluquería y estética',
  icono: 'tijera',
  descripcionCorta: 'Peluquerías, barberías, uñas, spa y centros de estética.',
  objetivos: [
    { id: 'recibir_turnos', etiqueta: 'Recibir turnos online' },
    { id: 'mostrar_trabajos', etiqueta: 'Mostrar mis trabajos' },
    { id: 'cobrar_senas', etiqueta: 'Cobrar señas para reservar' },
    { id: 'recordar_turnos', etiqueta: 'Recordarle el turno a mis clientes' },
    { id: 'vender_productos', etiqueta: 'Vender productos' },
    { id: 'que_me_contacten', etiqueta: 'Que me contacten fácil' },
  ],
  modulosSugeridos: ['turnos', 'catalogo', 'pagos', 'clientes', 'notificaciones'],
  ejemploResultado:
    'Una web con tus servicios y trabajos, agenda de turnos online y recordatorios automáticos.',
  plantilla: {
    deEjemplo: true,
    ilustracion: 'peluqueria_estetica',
    portada: {
      tituloDeEjemplo: 'Tu peluquería',
      bajada: 'Cortes, color y peinados. Sacá tu turno cuando quieras.',
      accion: { texto: 'Reservar turno', modulo: 'turnos' },
      accionSinModulo: 'Escribinos',
      detalle: { modulo: 'pagos', texto: 'Dejás la seña online' },
    },
    secciones: [
      {
        tipo: 'lista',
        titulo: 'Servicios',
        items: [
          { nombre: 'Corte y peinado', detalle: 'Con lavado' },
          { nombre: 'Color y mechas', detalle: 'Te asesoramos antes' },
          { nombre: 'Manos y pies', detalle: 'Esmaltado semipermanente' },
        ],
      },
      {
        tipo: 'agenda',
        titulo: 'Turnos',
        modulo: 'turnos',
        dias: ['Mar', 'Mié', 'Jue', 'Vie'],
        franjas: ['Mañana', 'Tarde'],
        detalle: { modulo: 'notificaciones', texto: 'Te recordamos el turno' },
      },
      {
        tipo: 'lista',
        titulo: 'Productos',
        modulo: 'catalogo',
        moduloItems: 'catalogo',
        items: [
          { nombre: 'Shampoo sólido', detalle: 'Para todo tipo de pelo' },
          { nombre: 'Aceite para puntas', detalle: 'Con argán' },
        ],
      },
      {
        tipo: 'horarios',
        titulo: 'Horarios',
        filas: [{ dias: 'Martes a sábado', horario: 'Mañana y tarde' }],
      },
      {
        tipo: 'contacto',
        titulo: 'Contacto',
        whatsapp: 'Escribinos por WhatsApp',
        ubicacion: 'Cómo llegar',
        detalle: { modulo: 'clientes', texto: 'Tu historial de turnos, a mano' },
      },
    ],
  },
};
