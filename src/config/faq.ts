/**
 * Preguntas frecuentes de /empezar. Texto plano (sin JSX) para poder reutilizarlo en el JSON-LD
 * de SEO. Regla: respuestas honestas; no se promete nada que el producto todavía no cumpla.
 * Donde no hay definición, se dice y se ofrece presupuesto sin compromiso.
 */
export interface Pregunta {
  pregunta: string;
  respuesta: string;
}

export const FAQ: readonly Pregunta[] = [
  {
    pregunta: '¿Ya puedo crear mi negocio?',
    // TODO: cuando exista la plataforma de autoservicio, actualizar esta respuesta.
    respuesta:
      'Elegís tu rubro y los módulos que necesitás, y el armado lo hacemos nosotros con vos. Todavía no hay una plataforma de autoservicio: por eso, después de completar el formulario, te escribimos para ponerlo online.',
  },
  {
    pregunta: '¿Cuánto cuesta?',
    // TODO: definir planes y precios; cuando existan, reemplazar esta respuesta.
    respuesta:
      'Todavía no tenemos precios cerrados, porque cada negocio activa cosas distintas. Contanos qué necesitás y te armamos un presupuesto sin compromiso.',
  },
  {
    pregunta: '¿Necesito saber de tecnología?',
    respuesta:
      'No. Elegís lo que necesitás y nosotros nos ocupamos de lo técnico. Si sabés usar WhatsApp, alcanza.',
  },
  {
    pregunta: '¿Puedo usar mi dominio?',
    // TODO: confirmar si se soporta dominio propio y cómo (hoy no hay producto definido).
    respuesta:
      'Es algo que definimos juntos cuando hablemos. Contanos si ya tenés un dominio propio o si querés que te ayudemos con uno.',
  },
  {
    pregunta: '¿En cuánto tiempo está?',
    // TODO: definir plazos reales de entrega. Lo único comprometido hoy es el primer contacto.
    respuesta:
      'Te escribimos en menos de 24 hs para ponerlo online. El plazo de armado depende de lo que actives: cuando veamos tu caso te damos uno concreto, antes de que decidas nada.',
  },
];
