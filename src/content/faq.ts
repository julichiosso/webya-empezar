import { PENDIENTES } from '@/content/pendientes';

/**
 * Preguntas frecuentes de /empezar. Texto plano (sin JSX) para poder reutilizarlo en el JSON-LD
 * de SEO. Regla: respuestas honestas; no se promete nada que el producto todavía no cumpla.
 * Donde no hay definición, se dice y se ofrece presupuesto sin compromiso.
 */
export interface Pregunta {
  pregunta: string;
  respuesta: string;
  /**
   * Pendiente visible (empieza con "TODO:") que va debajo de la respuesta. No va al JSON-LD: es para
   * que se vea en la página lo que falta definir.
   */
  todo?: string;
}

export const FAQ: readonly Pregunta[] = [
  {
    pregunta: '¿Ya puedo crear mi negocio?',
    // TODO: cuando exista la plataforma de autoservicio, actualizar esta respuesta.
    respuesta:
      'Elegís lo que necesitás y lo armamos nosotros con vos: todavía no hay plataforma de autoservicio.',
  },
  {
    pregunta: '¿Cuánto cuesta?',
    // TODO: definir planes y precios; cuando existan, reemplazar esta respuesta.
    respuesta:
      'Todavía no hay precios cerrados. Contanos qué necesitás y te armamos un presupuesto sin compromiso.',
  },
  {
    pregunta: '¿Necesito saber de tecnología?',
    respuesta: 'No. Elegís lo que necesitás y nosotros nos ocupamos de lo técnico.',
  },
  {
    pregunta: '¿Puedo usar mi dominio?',
    // TODO: confirmar si se soporta dominio propio y cómo (hoy no hay producto definido).
    respuesta: 'Lo definimos juntos cuando hablemos. Contanos si ya tenés uno.',
  },
  {
    pregunta: '¿En cuánto tiempo está?',
    respuesta:
      'Te escribimos por WhatsApp; el plazo de armado te lo damos cuando veamos tu caso.',
    todo: `${PENDIENTES.plazoRespuesta} ${PENDIENTES.plazoEntrega}`,
  },
];
