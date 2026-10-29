import type { Rubro } from './types';

// "Otro" siempre va último en el índice. En el wizard muestra un campo de texto para el rubro.
export const rubro: Rubro = {
  id: 'otro',
  nombre: 'Otro',
  icono: 'mas',
  descripcionCorta: 'Tu rubro no está en la lista: contanos y lo armamos a medida.',
  objetivos: [
    { id: 'que_me_contacten', etiqueta: 'Que me contacten fácil' },
    { id: 'mostrar_negocio', etiqueta: 'Mostrar mi negocio' },
    { id: 'recibir_turnos', etiqueta: 'Recibir turnos online' },
    { id: 'vender_online', etiqueta: 'Vender online' },
    { id: 'recibir_consultas', etiqueta: 'Recibir consultas ordenadas' },
    { id: 'cobrar_online', etiqueta: 'Cobrar online' },
  ],
  modulosSugeridos: ['formularios', 'clientes', 'notificaciones'],
  ejemploResultado:
    'Armamos algo a medida de lo que nos cuentes. Para arrancar: una web con formulario de contacto y avisos.',
};
