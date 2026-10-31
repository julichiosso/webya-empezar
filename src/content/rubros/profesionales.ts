import type { Rubro } from './types';

export const rubro: Rubro = {
  id: 'profesionales',
  nombre: 'Abogados, contadores y profesionales',
  nombreCorto: 'Profesionales',
  icono: 'portafolio',
  descripcionCorta: 'Estudios y consultorios que atienden por consulta o reunión.',
  objetivos: [
    { id: 'recibir_consultas', etiqueta: 'Recibir consultas ordenadas' },
    { id: 'agendar_reuniones', etiqueta: 'Agendar reuniones' },
    { id: 'mostrar_servicios', etiqueta: 'Mostrar mis servicios y experiencia' },
    { id: 'cobrar_honorarios', etiqueta: 'Cobrar consultas online' },
    { id: 'base_clientes', etiqueta: 'Tener ordenados a mis clientes' },
  ],
  modulosSugeridos: ['formularios', 'turnos', 'pagos', 'clientes'],
  ejemploResultado:
    'Una web profesional con tus áreas de trabajo, formulario de consulta y agenda de reuniones.',
  plantilla: {
    deEjemplo: true,
    ilustracion: 'profesionales',
    portada: {
      tituloDeEjemplo: 'Tu estudio',
      bajada: 'Asesoramiento claro para personas y empresas.',
      accion: { texto: 'Hacer una consulta', modulo: 'formularios' },
      accionSinModulo: 'Escribinos',
      detalle: { modulo: 'pagos', texto: 'Pagás la consulta online' },
    },
    secciones: [
      {
        tipo: 'lista',
        titulo: 'Áreas de trabajo',
        items: [
          { nombre: 'Consultas laborales', detalle: 'Para empleados y empresas' },
          { nombre: 'Impuestos y monotributo', detalle: 'Altas y declaraciones' },
          { nombre: 'Contratos', detalle: 'Alquileres y sociedades' },
        ],
      },
      {
        tipo: 'formulario',
        titulo: 'Tu consulta',
        modulo: 'formularios',
        campos: ['Tu nombre', 'Contanos tu caso'],
        accion: 'Enviar consulta',
      },
      {
        tipo: 'agenda',
        titulo: 'Reuniones',
        modulo: 'turnos',
        dias: ['Lun', 'Mar', 'Mié', 'Jue'],
        franjas: ['Mañana', 'Tarde'],
        detalle: { modulo: 'clientes', texto: 'Tu historial de consultas, a mano' },
      },
      {
        tipo: 'horarios',
        titulo: 'Horarios',
        filas: [{ dias: 'Lunes a viernes', horario: 'Mañana y tarde' }],
      },
      {
        tipo: 'contacto',
        titulo: 'Contacto',
        whatsapp: 'Escribinos por WhatsApp',
        ubicacion: 'Cómo llegar al estudio',
      },
    ],
  },
};
