/**
 * Mensaje de venta por rubro: cambia el titular, la descripción y los 3 beneficios al elegir rubro
 * en /empezar. `listo: true` solo si el producto de ese rubro se entrega hoy (gastronomía); los demás
 * dicen "Lo armamos con vos" y no simulan nada.
 */
export interface MensajeRubro {
  titulo: string;
  descripcion: string;
  beneficios: readonly [string, string, string];
  listo: boolean;
}

export const MENSAJES_RUBRO: Readonly<Record<string, MensajeRubro>> = {
  gastronomia: {
    titulo: 'Tu carta y tus pedidos, sin líos de WhatsApp.',
    descripcion:
      'La gente escanea el QR, mira la carta en el celular y pide. Vos ves cada pedido en orden.',
    beneficios: [
      'Tu carta siempre al día, con fotos y precios.',
      'Pedidos que llegan ordenados, no mezclados en el chat.',
      'Un QR para la mesa, el mostrador y tu Instagram.',
    ],
    listo: true,
  },
  peluqueria_estetica: {
    titulo: 'Seguí cortando. El bot te toma los turnos.',
    descripcion:
      'Un bot atiende a tus clientes y reserva por vos. Vos ves la agenda ordenada y las estadísticas de tu negocio.',
    beneficios: [
      'Turnos tomados aunque tengas las manos ocupadas.',
      'La agenda del día en un solo lugar.',
      'Estadísticas con ciencia de datos e IA, para saber qué hacer.',
    ],
    listo: true,
  },
  comercio: {
    titulo: 'Tus productos a la vista, todo el día.',
    descripcion: 'Una web con tus productos y precios, y un botón directo a tu WhatsApp.',
    beneficios: [
      'Tus productos con foto y precio.',
      'Te consultan por WhatsApp con un toque.',
      'Un link para tu Instagram.',
    ],
    listo: false,
  },
  profesionales: {
    titulo: 'Que te encuentren y te consulten fácil.',
    descripcion: 'Una web con lo que hacés, cómo trabajás y un botón directo a tu WhatsApp.',
    beneficios: [
      'Tus servicios explicados sin vueltas.',
      'Consultas que llegan por WhatsApp.',
      'Tus datos y horarios en un solo lugar.',
    ],
    listo: false,
  },
  gimnasio_deportes: {
    titulo: 'Tus clases y horarios, siempre a mano.',
    descripcion: 'Una web con tus actividades, horarios y un botón directo a tu WhatsApp.',
    beneficios: [
      'Actividades y horarios claros.',
      'Te escriben para anotarse con un toque.',
      'Un link para tu Instagram.',
    ],
    listo: false,
  },
  servicios_tecnicos: {
    titulo: 'Que te pidan presupuesto sin vueltas.',
    descripcion: 'Una web con lo que arreglás, tu zona y un botón directo a tu WhatsApp.',
    beneficios: [
      'Tus trabajos y tu zona a la vista.',
      'Pedidos de presupuesto por WhatsApp.',
      'Un link para dejar en tu perfil.',
    ],
    listo: false,
  },
  otro: {
    titulo: 'Contanos tu negocio y lo armamos.',
    descripcion: 'Nos contás qué hacés y qué necesitás, y lo vemos juntos.',
    beneficios: [
      'Hablás con una persona.',
      'Lo revisás antes de publicar.',
      'Arrancás con lo que ya usás.',
    ],
    listo: false,
  },
};

export const MENSAJE_RUBRO_UI = {
  aria: 'Qué te armamos para tu rubro',
  listo: 'Disponible ahora',
  loArmamos: 'Lo armamos con vos',
} as const;
