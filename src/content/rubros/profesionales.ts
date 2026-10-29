import type { Rubro } from './types';

export const rubro: Rubro = {
  id: 'profesionales',
  nombre: 'Abogados, contadores y profesionales',
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
};
