/**
 * El asistente de Webya: la carita flotante y el chat que se abre al tocarla. Responde con lo que el
 * sitio ya dice (productos, zona, cómo se cotiza) y, para lo demás, te pasa con Julián por WhatsApp con
 * tu pregunta ya escrita. No promete plazos, precios ni funciones que no estén en el sitio.
 */
export const ASISTENTE = {
  nombre: 'Asistente de Webya',
  estado: 'Te respondo al toque',
  abrir: 'Abrir el asistente de Webya',
  cerrar: 'Cerrar el asistente',
  /** Frases que aparecen al pasar el mouse por la carita (compu). */
  frases: [
    '¿Te buscan en Google y no te encuentran?',
    'Turnos, pedidos y ventas, aunque estés cerrado.',
    'Contame tu negocio y te digo qué te sirve.',
  ],
  invitacion: 'Preguntame lo que quieras',
  saludo: '¡Hola! Soy el asistente de Webya. Contame qué le pasa a tu negocio o tocá una pregunta.',
  rapidas: [
    '¿Qué hacen?',
    '¿Cuánto sale?',
    'Me reservan y no vienen',
    'Quiero vender por internet',
    '¿Dónde atienden?',
    'Quiero hablar con una persona',
  ],
  escribiendo: 'El asistente está escribiendo',
  campo: 'Escribí tu pregunta',
  placeholder: 'Ej.: los viernes no doy abasto con los pedidos',
  enviar: 'Enviar',
  te: 'Vos',
  /** Respuestas fijas para las preguntas de siempre. */
  queHacen:
    'Armamos sistemas para negocios: turnos con seña, pedidos online, tiendas, catálogos y páginas web. Todo se maneja desde el celular.',
  zona: 'Atendemos en San Jorge, San Francisco y la zona, en persona o por WhatsApp.',
  verZona: 'Ver la zona',
  persona: 'Dale, te paso con Julián. Tu mensaje ya va escrito.',
  creo: 'Esto te puede servir:',
  noEntendi:
    'No estoy seguro de haberte entendido. ¿Te paso con Julián? Le llega tu pregunta tal cual.',
  ver: 'Ver más',
  verDemo: 'Ver demo',
  armar: 'Armá tu sistema',
  whatsapp: 'Seguir por WhatsApp',
  mail: 'Seguir por mail',
  /** El mensaje que llega a WhatsApp, con lo que la persona preguntó. */
  mensaje: (pregunta: string) =>
    pregunta
      ? `Hola, vengo de webya.dev. Le pregunté al asistente: "${pregunta}"`
      : 'Hola, vengo de webya.dev. Quiero hablar sobre un sistema para mi negocio.',
  /** Palabras que llevan a cada respuesta fija (sin tildes ni mayúsculas). */
  claves: {
    queHacen: [
      'que hacen',
      'que hacés',
      'servicios',
      'productos',
      'que ofrecen',
      'que venden',
      'a que se dedican',
    ],
    zona: ['donde', 'zona', 'atienden', 'ciudad', 'san jorge', 'san francisco', 'estan ubicados'],
    persona: ['persona', 'humano', 'hablar con', 'llamar', 'whatsapp', 'contacto', 'julian'],
  },
} as const;
