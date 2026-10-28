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
};
