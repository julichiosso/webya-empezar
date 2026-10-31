import type { Rubro } from './types';

export const rubro: Rubro = {
  id: 'gimnasio_deportes',
  nombre: 'Gimnasio y deportes',
  icono: 'pesa',
  descripcionCorta: 'Gimnasios, clubes, estudios de entrenamiento y escuelas.',
  objetivos: [
    { id: 'recibir_inscripciones', etiqueta: 'Recibir inscripciones' },
    { id: 'reservar_clases', etiqueta: 'Reservar clases o turnos' },
    { id: 'cobrar_cuotas', etiqueta: 'Cobrar cuotas online' },
    { id: 'mostrar_actividades', etiqueta: 'Mostrar horarios y actividades' },
    { id: 'que_me_contacten', etiqueta: 'Que me contacten fácil' },
  ],
  modulosSugeridos: ['turnos', 'formularios', 'pagos', 'clientes', 'notificaciones'],
  ejemploResultado:
    'Una web con tus actividades y horarios, inscripción online, reserva de clases y cobro de cuotas.',
  plantilla: {
    deEjemplo: true,
    ilustracion: 'gimnasio_deportes',
    portada: {
      tituloDeEjemplo: 'Tu gimnasio',
      bajada: 'Entrená a tu ritmo, con clases para cada nivel.',
      accion: { texto: 'Reservar clase', modulo: 'turnos' },
      accionSinModulo: 'Escribinos',
      detalle: { modulo: 'pagos', texto: 'Pagás la cuota online' },
    },
    secciones: [
      {
        tipo: 'lista',
        titulo: 'Actividades',
        items: [
          { nombre: 'Funcional', detalle: 'En grupos reducidos' },
          { nombre: 'Musculación', detalle: 'Con seguimiento' },
          { nombre: 'Yoga', detalle: 'Respiración y movilidad' },
        ],
      },
      {
        tipo: 'agenda',
        titulo: 'Clases',
        modulo: 'turnos',
        dias: ['Lun', 'Mar', 'Mié', 'Jue'],
        franjas: ['Mañana', 'Tarde', 'Noche'],
        detalle: { modulo: 'notificaciones', texto: 'Te avisamos si cambia una clase' },
      },
      {
        tipo: 'formulario',
        titulo: 'Inscripción',
        modulo: 'formularios',
        campos: ['Tu nombre', 'Qué querés hacer'],
        accion: 'Inscribirme',
      },
      {
        tipo: 'horarios',
        titulo: 'Horarios',
        filas: [
          { dias: 'Lunes a viernes', horario: 'De mañana a noche' },
          { dias: 'Sábados', horario: 'Por la mañana' },
        ],
      },
      {
        tipo: 'contacto',
        titulo: 'Contacto',
        whatsapp: 'Escribinos por WhatsApp',
        ubicacion: 'Cómo llegar',
        detalle: { modulo: 'clientes', texto: 'Tus clases y cuotas, a mano' },
      },
    ],
  },
};
