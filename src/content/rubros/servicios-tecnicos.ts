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
  plantilla: {
    deEjemplo: true,
    ilustracion: 'servicios_tecnicos',
    portada: {
      tituloDeEjemplo: 'Tu servicio técnico',
      bajada: 'Plomería, electricidad y arreglos en tu casa o tu negocio.',
      accion: { texto: 'Pedir presupuesto', modulo: 'formularios' },
      accionSinModulo: 'Escribinos',
      detalle: { modulo: 'notificaciones', texto: 'Te contamos cómo va el trabajo' },
    },
    secciones: [
      {
        tipo: 'lista',
        titulo: 'Servicios',
        items: [
          { nombre: 'Destapaciones', detalle: 'Cocina y baño' },
          { nombre: 'Electricidad', detalle: 'Tableros y enchufes' },
          { nombre: 'Arreglos generales', detalle: 'En casas y comercios' },
        ],
      },
      {
        tipo: 'formulario',
        titulo: 'Presupuesto',
        modulo: 'formularios',
        campos: ['Tu nombre', 'Qué hay que arreglar'],
        accion: 'Enviar pedido',
      },
      {
        tipo: 'agenda',
        titulo: 'Visitas',
        modulo: 'turnos',
        dias: ['Lun', 'Mar', 'Mié', 'Jue'],
        franjas: ['Mañana', 'Tarde'],
      },
      {
        tipo: 'horarios',
        titulo: 'Horarios',
        filas: [{ dias: 'Lunes a sábado', horario: 'Mañana y tarde' }],
      },
      {
        tipo: 'contacto',
        titulo: 'Contacto',
        whatsapp: 'Escribinos por WhatsApp',
        ubicacion: 'Zona de trabajo',
        detalle: { modulo: 'clientes', texto: 'Tus trabajos anteriores, a mano' },
      },
    ],
  },
};
