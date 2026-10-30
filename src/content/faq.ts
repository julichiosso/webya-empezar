import { PENDIENTES } from '@/content/pendientes';

/**
 * Preguntas frecuentes de /empezar. Texto plano (sin JSX) para poder reutilizarlo en el JSON-LD
 * de SEO. Regla: respuestas honestas; no se promete nada que el producto todavía no cumpla.
 * Cada objeción se responde de frente (skill webya-copy-comercial → "Objeciones"). Donde no hay
 * definición, se dice, se ofrece presupuesto sin compromiso y el pendiente queda en `todo`.
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
    pregunta: '¿Necesito saber de tecnología?',
    respuesta:
      'No. Vos nos contás cómo funciona tu negocio y nosotros nos ocupamos de lo técnico, con vos.',
  },
  {
    pregunta: '¿Cuánto cuesta?',
    respuesta:
      'Depende de lo que actives. Contanos qué necesitás y te armamos un presupuesto sin compromiso.',
    todo: PENDIENTES.precios,
  },
  {
    pregunta: '¿Y si no me gusta?',
    respuesta:
      'Antes de decidir, probás la demo. Y antes de publicar, lo revisás y lo ajustamos con vos.',
  },
  {
    pregunta: '¿Puedo usar mi dominio?',
    respuesta: 'Contanos si ya tenés uno y lo vemos cuando hablemos.',
    todo: PENDIENTES.dominio,
  },
  {
    pregunta: '¿Cuánto tardan?',
    respuesta:
      'Depende de lo que actives: el plazo te lo decimos en el presupuesto. Primero te escribimos por WhatsApp.',
    todo: `${PENDIENTES.plazoEntrega} ${PENDIENTES.plazoRespuesta}`,
  },
  {
    pregunta: '¿Qué pasa con mis datos?',
    respuesta: 'Los usamos solo para contactarte por tu proyecto. No los compartimos con nadie.',
    todo: PENDIENTES.privacidad,
  },
  {
    pregunta: '¿Y si lo que necesito no está?',
    respuesta:
      'Contanos qué te falta en el paso "Otra cosa". Lo vemos con vos y, si se puede hacer, lo armamos a medida.',
  },
  {
    pregunta: '¿Ya puedo armarlo por mi cuenta?',
    // TODO: cuando exista la plataforma de autoservicio, actualizar esta respuesta.
    respuesta: 'Todavía no. Elegís lo que necesitás acá y lo armamos nosotros, con vos.',
  },
];
