/**
 * Preguntas frecuentes de /empezar. Texto plano (sin JSX) para poder reutilizarlo en el JSON-LD
 * de SEO. Regla: respuestas honestas; donde no hay definición, se dice y se ofrece presupuesto.
 */
export interface Pregunta {
  pregunta: string;
  respuesta: string;
}

export const FAQ: readonly Pregunta[] = [
  {
    pregunta: '¿Cuánto cuesta?',
    // TODO: definir planes y precios; cuando existan, reemplazar esta respuesta.
    respuesta:
      'Todavía no tenemos precios cerrados, porque cada negocio necesita algo distinto. Contanos qué hacés y te armamos un presupuesto sin compromiso.',
  },
  {
    pregunta: '¿Necesito saber de tecnología?',
    respuesta:
      'No. Vos nos contás cómo trabajás y nosotros nos ocupamos de lo técnico. Si sabés usar WhatsApp, alcanza.',
  },
  {
    pregunta: '¿Puedo usar mi dominio?',
    // TODO: confirmar si se soporta dominio propio y cómo (hoy no hay producto definido).
    respuesta:
      'Es algo que definimos juntos cuando hablemos. Contanos si ya tenés un dominio propio o si querés que te ayudemos con uno.',
  },
  {
    pregunta: '¿En cuánto tiempo está?',
    // TODO: definir plazos reales de entrega.
    respuesta:
      'Depende de lo que necesite tu negocio. Cuando veamos tu caso te damos un plazo concreto, antes de que decidas nada.',
  },
];
