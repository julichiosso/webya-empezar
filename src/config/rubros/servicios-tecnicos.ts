import type { Rubro } from './types';

export const rubro: Rubro = {
  id: 'servicios_tecnicos',
  nombre: 'Servicios técnicos',
  icono: 'llave',
  descripcionCorta: 'Plomería, electricidad, reparaciones, mantenimiento y oficios.',
  objetivos: [
    { id: 'pedir_presupuestos', etiqueta: 'Recibir pedidos de presupuesto' },
    { id: 'agendar_visitas', etiqueta: 'Agendar visitas' },
    { id: 'mostrar_trabajos', etiqueta: 'Mostrar mis trabajos' },
    { id: 'avisar_avance', etiqueta: 'Avisarle a mis clientes cómo va su trabajo' },
    { id: 'que_me_contacten', etiqueta: 'Que me contacten fácil' },
  ],
  modulosSugeridos: ['formularios', 'turnos', 'clientes', 'notificaciones'],
  ejemploResultado:
    'Una web con tus servicios, formulario de presupuesto, agenda de visitas y avisos a tus clientes.',
};
