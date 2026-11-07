/** Textos de /crear (el editor del sitio) y de /ver (el borrador que se comparte). */
export const CREAR = {
  meta: {
    titulo: 'Armá el sitio de tu negocio',
    descripcion:
      'Cargá el nombre, tus servicios y tus precios, y mirá tu sitio al instante. Te llevás un link para compartir. Sin crear ninguna cuenta.',
  },
  ariaLogo: 'WebYa: volver al inicio',
  titulo: 'Armá tu sitio. Lo ves mientras lo escribís.',
  bajada: 'Sin cuenta y sin dejar tus datos. Te llevás un link para mandarle a quien quieras.',
  campos: {
    rubro: { etiqueta: 'Tu rubro' },
    nombre: { etiqueta: 'Nombre del negocio', placeholder: 'Ej: Lo de Tito' },
    bajada: {
      etiqueta: 'Qué hacés, en una línea',
      placeholder: 'Ej: Cortes y barba, sin vueltas.',
    },
    ciudad: { etiqueta: 'Dónde estás', placeholder: 'Ej: Rosario, centro' },
    horario: { etiqueta: 'Días y horarios', placeholder: 'Ej: Martes a sábado, mañana y tarde' },
    whatsapp: {
      etiqueta: 'WhatsApp del negocio',
      placeholder: 'Ej: 11 2345 6789',
      ayuda: 'Es adonde te escriben tus clientes desde el sitio.',
      invalido: 'Revisá el número: tiene que ser de Argentina, por ejemplo 11 2345 6789.',
    },
  },
  colores: { leyenda: 'Colores', opcion: (nombre: string) => `Colores ${nombre}` },
  items: {
    leyenda: 'Lo que ofrecés',
    ayuda: 'Hasta ocho. Con precio si querés mostrarlo.',
    nombre: (n: number) => `Nombre ${n}`,
    precio: (n: number) => `Precio ${n}`,
    placeholderNombre: 'Ej: Corte y barba',
    placeholderPrecio: 'Precio',
    quitar: (nombre: string) => `Quitar ${nombre || 'este renglón'}`,
    sumar: 'Sumar otro',
  },
  vistas: { aria: 'Qué ver', editar: 'Editar', ver: 'Ver mi sitio' },
  guardadoLocal: 'Se guarda solo en este navegador.',
  compartir: {
    titulo: 'Tu link',
    bajada:
      'Mandáselo a tu socio o abrilo en tu celular. Es un borrador: no está publicado todavía.',
    copiar: 'Copiar link',
    copiado: 'Link copiado',
    abrir: 'Abrir',
    whatsapp: 'Mandarlo por WhatsApp',
    mensaje: (nombre: string, url: string) => `Mirá cómo quedaría ${nombre}: ${url}`,
    ariaQr: 'Código QR para abrir este borrador en tu celular',
    verQr: 'Ver el código QR',
  },
  publicar: {
    titulo: '¿Te gusta? Lo publicamos con vos.',
    bajada: 'Te escribimos por WhatsApp para ponerlo online, con tu dominio si tenés uno.',
    cta: 'Quiero publicarlo',
    enviando: 'Guardando…',
    faltaWhatsapp: 'Dejanos tu WhatsApp arriba y seguimos por ahí.',
    faltaNombre: 'Ponele un nombre a tu negocio y seguimos.',
    listo: 'Listo, ya nos llegó. Te escribimos por WhatsApp para publicarlo.',
    escribirnos: 'Escribirnos ahora',
    mensaje: (nombre: string, url: string) =>
      `¡Hola, WebYa! Armé el sitio de ${nombre} y quiero publicarlo: ${url}`,
    errores: {
      limite: 'Recibimos muchos envíos desde tu conexión. Probá de nuevo en unos minutos.',
      otro: 'No pudimos guardarlo. Probá de nuevo en un momento.',
      validacion: 'Revisá el nombre y el WhatsApp.',
    },
    privacidad: 'Usamos tu WhatsApp solo para hablar de tu negocio.',
    verPrivacidad: 'Leer la política de privacidad',
  },
} as const;

export const VER = {
  meta: {
    titulo: 'Borrador de un sitio',
    descripcion: 'Un borrador armado en WebYa.',
  },
  banner: {
    texto: 'Borrador armado en WebYa. Todavía no está publicado y nadie revisó estos datos.',
    editar: 'Editarlo',
    crear: 'Armar el mío',
  },
  cargando: 'Abriendo el borrador…',
  vacio: {
    titulo: 'Este link no trae un borrador',
    texto:
      'Puede que se haya cortado al copiarlo. Pedile a quien te lo pasó que lo mande de nuevo, o armá el tuyo.',
    cta: 'Armar mi sitio',
  },
} as const;
