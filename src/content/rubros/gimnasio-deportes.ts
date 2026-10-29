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
};
