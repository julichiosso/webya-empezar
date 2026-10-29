/** Los cuatro pasos del wizard de /empezar: rubro, módulos, datos y confirmación. */

/** Paso 1: elegir el rubro. Los rubros (nombre, descripción) viven en content/rubros. */
export const PASO_RUBRO = {
  titulo: '¿Qué vas a crear?',
  bajada: 'Elegí el rubro que más se parezca a tu negocio y mirá cómo se va armando.',
  leyendaRubros: 'Rubro de tu negocio',
  rubroOtro: {
    etiqueta: '¿A qué se dedica tu negocio?',
    placeholder: 'Ej: floristería, veterinaria…',
  },
  /** Entrada a la demo cuando el rubro elegido tiene una. */
  demo: {
    titulo: 'Mirá cómo quedaría',
    bajada: 'Probá la demo: la carta con QR y los pedidos, del lado del cliente y del dueño.',
  },
  siguiente: 'Siguiente',
} as const;

/** Paso 2: activar módulos. Los módulos (nombre, descripción) viven en content/modulos. */
export const PASO_MODULOS = {
  titulo: '¿Qué querés activar?',
  bajada:
    'Activá solo lo que tu negocio necesita. Lo que sugerimos para tu rubro ya viene marcado.',
  leyendaModulos: 'Módulos para tu negocio',
  /** Estado debajo de la lista (se anuncia a lectores de pantalla). */
  sinModulos: 'Activá al menos un módulo para seguir.',
  activaste: (cantidad: number) =>
    `Activaste ${cantidad} ${cantidad === 1 ? 'módulo' : 'módulos'}.`,
  /** Objetivos del rubro (opcionales). */
  objetivos: {
    leyenda: '¿Para qué lo querés?',
    opcional: '(opcional)',
  },
  siguiente: 'Siguiente',
} as const;

/** Paso 3: datos de contacto. */
export const PASO_DATOS = {
  titulo: 'Contanos de tu negocio',
  bajada: 'Con esto armamos tu negocio y te escribimos para ponerlo online.',
  campos: {
    nombreNegocio: { etiqueta: 'Nombre de tu negocio' },
    nombre: { etiqueta: 'Tu nombre' },
    whatsapp: {
      etiqueta: 'Tu WhatsApp',
      placeholder: '11 2345 6789',
      ayuda: 'Te escribimos por acá. No hace falta el 15 ni el +54.',
    },
    email: { etiqueta: 'Email' },
    mensaje: { etiqueta: '¿Algo más que quieras contarnos?' },
  },
  /** Etiqueta del campo trampa para bots (invisible para personas). */
  honeypot: 'No completes este campo',
  /** Error general del envío, según la causa. */
  erroresEnvio: {
    limite:
      'Enviaste varios formularios seguidos. Esperá unos minutos y probá de nuevo, o escribinos por WhatsApp.',
    servidor: 'No pudimos guardar tus datos. Probá de nuevo en un momento.',
    red: 'Parece que no hay conexión. Revisá tu internet y probá de nuevo.',
    validacion: 'Revisá los campos marcados y probá de nuevo.',
  },
  /** Salida por WhatsApp si el envío falla. */
  whatsappRespaldo: 'Escribinos por WhatsApp',
  enviar: 'Enviar',
  enviando: 'Enviando…',
  privacidad: 'Usamos tus datos solo para contactarte por tu proyecto y no los compartimos con nadie.',
  /** Visible hasta que exista la política de privacidad. */
  todoPrivacidad: 'TODO: enlazar la política de privacidad.',
} as const;

/** Paso 4: confirmación. */
export const PASO_LISTO = {
  titulo: 'Tu negocio está listo para armarse',
  /** "Gracias, {nombre}. Para {rubro}, estas son las piezas que activaste:" (el rubro va en negrita). */
  gracias: {
    antes: 'Gracias, ',
    trasNombre: '. Para ',
    trasRubro: ', estas son las piezas que activaste:',
  },
  ariaPiezas: 'Las piezas de tu negocio',
  // TODO: definir plazos de entrega y precios; no se prometen hasta tenerlos.
  /** Aviso honesto: hoy la entrega es manual, la hacemos nosotros. */
  avisoEntrega:
    'Lo armamos nosotros: no tenés que configurar nada. Cuando lo tengamos listo, lo ponemos online juntos.',
  whatsapp: 'Hablar por WhatsApp',
  contacto: 'Te escribimos en menos de 24 hs para ponerlo online.',
  /** Visible solo fuera de producción, mientras falte el número. */
  todoWhatsapp: 'TODO: configurar NEXT_PUBLIC_WHATSAPP_NUMBER en .env.local.',
  reiniciar: 'Cargar otro negocio',
} as const;
