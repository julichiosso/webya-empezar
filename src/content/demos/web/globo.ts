/**
 * El globo del consultorio en el mapa del hero: la portada de la página de ejemplo de la demo web
 * (/demos/web). Decorativo: la demo completa está a un toque.
 */
import { RUBROS_WEB } from './datos';

const consultorio = RUBROS_WEB[0];

export const GLOBO_WEB = {
  encabezado: `${consultorio?.negocio.nombre ?? ''}. ${consultorio?.negocio.actividad ?? ''}`,
  titulo: consultorio?.hero.titulo ?? '',
  boton: 'Pedí turno por WhatsApp',
} as const;
