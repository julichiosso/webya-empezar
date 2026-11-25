/**
 * Copy de la home (/) y de las piezas compartidas (header, menú, barra del celular, cierre, pie).
 * Voz de empresa en plural ("armamos", "escribinos"), voseo, frases cortas, sin humo ni cifras.
 * Tres verbos fijos para tres acciones: "Armá tu sistema" (configurador), "Ver demo" (demos) y
 * "Escribinos" (WhatsApp). Si una idea ya se dijo en la página, no se repite.
 */

export const MARCA = {
  nombre: 'Webya',
  fundador: 'Julián Chiosso',
  ciudad: 'San Jorge, Santa Fe',
  zona: 'Atención en San Jorge, San Francisco y alrededores',
  inicio: 'Webya, inicio',
} as const;

export const CTA = {
  armar: 'Armá tu sistema',
  verDemo: 'Ver demo',
  escribinos: 'Escribinos',
  /** Se suma al nombre accesible de los links que abren otra pestaña (no se ve). */
  pestana: ', se abre en otra pestaña',
} as const;

/** A dónde lleva cada CTA (una sola fuente para todo el sitio). */
export const RUTAS = {
  armar: '/armar',
  armarTipo: (tipo: string) => `/armar?tipo=${tipo}`,
  armarCaso: (tipo: string, rubro: string) => `/armar?tipo=${tipo}&rubro=${rubro}`,
  demos: '/demos',
  /** Abre la demo con el asistente para personalizarla. */
  conGuia: (href: string) => `${href}?guia=si`,
  proyectos: '/proyectos',
  nosotros: '/nosotros',
  zona: '/zona',
} as const;

export const HEADER = {
  saltar: 'Saltar al contenido',
  navegacion: 'Principal',
  links: [
    { href: '/turnero', texto: 'Turnero' },
    { href: '/pedidos', texto: 'Pedidos' },
    { href: '/tienda', texto: 'Tienda' },
    { href: '/web', texto: 'Web' },
    { href: '/campo', texto: 'Campo' },
    { href: '/proyectos', texto: 'Proyectos' },
  ],
  demos: 'Demos',
  menu: {
    abrir: 'Menú',
    cerrar: 'Cerrar',
    abrirAria: 'Abrir el menú',
    cerrarAria: 'Cerrar el menú',
    productos: 'Qué armamos',
    webya: 'Más',
    buscar: '¿Qué necesitás?',
    probar: 'Probalo gratis',
    probarTexto: 'Demos en vivo, sin registrarte.',
    links: [
      { href: '/turnero', texto: 'Turnero con seña', detalle: 'Reservas con seña. Sin faltazos.' },
      { href: '/pedidos', texto: 'Pedidos online', detalle: 'La cocina, en orden.' },
      { href: '/tienda', texto: 'Tienda y catálogo', detalle: 'Vendé aunque esté cerrado.' },
      { href: '/web', texto: 'Página web', detalle: 'Que te encuentren en Google.' },
    ],
    otros: [
      { href: '/campo', texto: 'Campo y agro' },
      { href: '/protectoras', texto: 'Protectoras y entidades' },
      { href: '/demos', texto: 'Demos' },
      { href: '/proyectos', texto: 'Proyectos' },
      { href: '/nosotros', texto: 'Quiénes somos' },
      { href: '/zona', texto: 'Zona de atención' },
    ],
  },
} as const;

/** La línea de marca de Webya, tal cual se publica en Instagram: tres palabras, una por línea. */
export const LEMA = ['Creá.', 'Digitalizá.', 'Crecé.'] as const;

export const HERO = {
  /** Arriba del titular, como el nombre de un producto. */
  ceja: 'Software para tu negocio',
  /** El lema es el H1: cada palabra entra en secuencia y queda fija. */
  titulo: LEMA,
  /** Una sola línea: qué armamos. La gente no lee; esto sí. */
  bajada: 'Turnos, pedidos y ventas online. Todo desde tu celular.',
  verDemos: 'Ver demos',
  /** El celular apila el lema (una palabra por línea); la compu lo muestra en una. */
  rubros: 'Elegí tu rubro y probalo',
  /** Lo que aparece en cada fila al pasar el mouse. */
  probar: 'Ver demo',
  /** Nombre accesible de cada rubro (el link abre la demo en otra pestaña). */
  rubroAria: (rubro: string, sistema: string) =>
    `${rubro}: ver demo de ${sistema.toLowerCase()}, se abre en otra pestaña`,
  /** Prueba al toque, en la primera pantalla: los negocios que ya lo usan. */
  confianza: 'Ya lo usan',
  y: 'y',
  /** Dónde atendemos: con el mini mapa, lleva a /zona. */
  zona: {
    rotulo: 'Dónde atendemos',
    atendemos: 'Atendemos en',
    detalle: 'En persona o por WhatsApp.',
    ver: 'Ver el mapa',
    aria: (localidades: number | string) =>
      `Atendemos en San Jorge, San Francisco y ${localidades} localidades de la zona, en persona o por WhatsApp. Ver el mapa de zonas.`,
  },
} as const;

/**
 * Hero "El pueblo": el lema, una línea con qué hacemos y para quién, dos acciones y, abajo, el plano de un
 * pueblo visto desde arriba (damero con la plaza al medio). Cinco terrenos son negocios: al tocar uno se
 * abre un globo con la mini demo de su sistema. Los negocios son rubros de ejemplo, no clientes.
 */
export const HERO_MAPA = {
  lema: LEMA,
  bajada:
    'Turnos con seña, pedidos y tiendas online para negocios de San Francisco, San Jorge y la zona.',
  armar: 'Armá tu sistema',
  demos: 'Probá las demos',
  /** De dónde somos y cómo se presupuesta (TRUST_CLAIMS: zona, precio a medida). */
  confianza: 'Somos de San Jorge. Te pasamos el presupuesto por WhatsApp, sin compromiso.',
  pista: 'Tocá un negocio y mirá cómo funciona',
  plano: 'Plano de un pueblo con negocios de ejemplo. Tocá uno para ver su sistema funcionando.',
  plaza: 'Plaza',
  /** Nombre accesible del globo abierto. */
  globo: (rubro: string, sistema: string) => `${rubro}: ${sistema}`,
  /** Cada terreno con su rubro, el sistema que muestra y a dónde lleva. */
  negocios: [
    {
      id: 'peluqueria',
      rubro: 'Peluquería',
      sistema: 'Turnos con seña',
      href: '/demos/turnos',
      ver: 'Probá la demo de turnos',
    },
    {
      id: 'pizzeria',
      rubro: 'Pizzería',
      sistema: 'Pedidos online',
      href: '/demos/pedidos',
      ver: 'Probá la demo de pedidos',
    },
    {
      id: 'tu',
      rubro: 'Tu negocio',
      sistema: 'Lo armamos con vos',
      href: '/armar',
      ver: 'Armá tu sistema',
    },
    {
      id: 'comercio',
      rubro: 'Comercio',
      sistema: 'Tienda online',
      href: '/demos/tienda',
      ver: 'Probá la demo de tienda',
    },
    {
      id: 'consultorio',
      rubro: 'Consultorio',
      sistema: 'Página web',
      href: '/demos/web',
      ver: 'Probá la demo de página web',
    },
  ],
  /** El globo de tu negocio: no es una demo, es la invitación. */
  tuNegocio: {
    titulo: 'Acá va el tuyo',
    texto: 'Elegís qué necesitás y lo armamos con vos.',
  },
} as const;

/** "Confían en Webya": los logos de los clientes, sobre el horizonte del pueblo. */
export const CONFIAN = {
  id: 'confian',
  rotulo: 'Confían en Webya',
  logos: [
    { id: 'micios', nombre: "Micio's Pizzería", src: '/confian/micios.svg', ancho: 907, alto: 381 },
    {
      id: 'petrucci',
      nombre: 'Joyería Petrucci',
      src: '/confian/petrucci.svg',
      ancho: 240,
      alto: 275,
    },
    {
      id: 'fonosanjorge',
      nombre: 'Fono San Jorge',
      src: '/confian/fonosanjorge.svg',
      ancho: 764,
      alto: 102,
    },
    {
      id: 'abelardo',
      nombre: 'Abelardo Pizzería',
      src: '/confian/abelardo.webp',
      ancho: 362,
      alto: 360,
    },
    {
      id: 'carribar',
      nombre: 'Carribar Las Maris',
      src: '/confian/carribar.webp',
      ancho: 150,
      alto: 150,
      redondo: true,
    },
  ],
} as const;

/** "Últimos trabajos": tarjetas grandes con la escena de cada caso, qué armamos y el rubro. */
export const TRABAJOS = {
  id: 'trabajos',
  titulo: 'Últimos trabajos',
  bajada: 'Diseñamos y construimos sistemas que ya son parte del día a día de negocios reales.',
  verTodos: 'Ver todos los proyectos',
  /** Qué armamos, en la línea chica de arriba del nombre, cuando el nombre del sistema no alcanza. */
  que: { canina: 'Turnero con seña por Mercado Pago' },
  /** La línea chica de cada trabajo: qué armamos y para qué rubro. */
  meta: (sistema: string, rubro: string) => `${sistema} para ${rubro.toLowerCase()}`,
} as const;

/**
 * "Qué hacemos": los cuatro productos en tarjetas grandes que se apilan al bajar, cada una con una foto
 * comercial (Unsplash, ver ASSETS_LICENSES.md), qué resuelve en una línea y el link a su página.
 */
export const SERVICIOS_HOME = {
  id: 'servicios',
  titulo: 'Software que trabaja mientras atendés.',
  armar: 'Armá tu sistema',
  conoce: 'Conocé más',
  items: [
    {
      id: 'web',
      titulo: 'Página web',
      texto: 'Tu negocio en Google, con tu dirección propia y WhatsApp a un toque.',
      href: '/web',
      foto: { src: '/servicios/web.webp', alt: 'Equipo trabajando junto en una laptop.' },
    },
    {
      id: 'tienda',
      titulo: 'Tienda online',
      texto: 'Tu catálogo con fotos y precios. Lo cargás desde el celular y te piden por WhatsApp.',
      href: '/tienda',
      foto: {
        src: '/servicios/tienda.webp',
        alt: 'Dueña de un negocio revisa un pedido en el celular, rodeada de cajas listas para enviar.',
      },
    },
    {
      id: 'pedidos',
      titulo: 'Pedidos online',
      texto: 'Pedidos con hora de retiro y la comanda que sale sola. Sin teléfono sonando.',
      href: '/pedidos',
      foto: { src: '/servicios/pedidos.webp', alt: 'Pizzero preparando una pizza en la cocina.' },
    },
    {
      id: 'turnos',
      titulo: 'Turnero con seña',
      texto: 'Reservan y pagan la seña con Mercado Pago. El turno queda asegurado.',
      href: '/turnero',
      foto: { src: '/servicios/turnos.webp', alt: 'Peluquera atendiendo a una clienta sonriente.' },
    },
  ],
} as const;

/** Header: dos píldoras, "Escribinos" y "Menú" (el menú se arma desde HEADER.menu, como el pie). */
export const HEADER_3D = {
  escribinos: 'Escribinos',
  menu: 'Menú',
  menuAria: 'Abrir el menú',
  cerrar: 'Cerrar',
  cerrarAria: 'Cerrar el menú',
  buscar: '¿Qué necesitás?',
} as const;

/** "¿Qué necesita tu negocio?": el buscador grande y los rubros, en una sola pantalla. */
export const NECESITA = {
  id: 'necesita',
  titulo: '¿Qué necesita tu negocio?',
  bajada: 'Contanos con tus palabras o elegí tu rubro.',
} as const;

/** El producto a la vista: los celulares con trabajos reales suben al scrollear. */
export const PRODUCTO_VISTA = {
  id: 'en-uso',
  rotulo: 'En uso',
  titulo: ['Sistemas reales.', 'En el celular de tus clientes.'],
  bajada: 'Pizzería, joyería y estética. Funcionando hoy.',
} as const;

/** Quiénes somos, en la home: una pantalla. */
export const NOSOTROS_HOME = {
  id: 'quienes-somos',
  rotulo: 'Quiénes somos',
  titulo: ['Te atiende', 'quien lo programa.'],
  texto:
    'Webya nace en San Jorge. Fundada por Julián Chiosso, Técnico Universitario en Programación (UTN).',
  ver: 'Conocenos',
} as const;

/** El aviso de ejemplo sobre el celular del medio del hero (muestra la función, no un pedido real). */
export const ESCAPARATE_AVISO = {
  app: 'Pedidos',
  cuando: 'ahora',
  titulo: 'Nuevo pedido',
  texto: 'Para retirar, con su horario',
} as const;

/**
 * "Elegí tu rubro": cada rubro con su ejemplo y la demo que le corresponde. No es solo para pizzerías:
 * cada negocio se reconoce en su línea.
 */
export const RUBROS_HOME = [
  {
    id: 'gastronomia',
    nombre: 'Gastronomía',
    ejemplo: 'Pizzerías, hamburgueserías, heladerías y cafés',
    sistema: 'Pedidos online',
    href: '/demos/pedidos',
  },
  {
    id: 'estetica',
    nombre: 'Peluquería y estética',
    ejemplo: 'Peluquerías, barberías, uñas y estética',
    sistema: 'Turnos con seña',
    href: '/demos/turnos',
  },
  {
    id: 'salud',
    nombre: 'Salud',
    ejemplo: 'Consultorios, kinesiología, psicología y nutrición',
    sistema: 'Turnos online',
    href: '/demos/turnos',
  },
  {
    id: 'comercio',
    nombre: 'Comercios y tiendas',
    ejemplo: 'Ropa, joyería, regalería y kioscos',
    sistema: 'Tienda online',
    href: '/demos/tienda',
  },
  {
    id: 'campo',
    nombre: 'Campo y agro',
    ejemplo: 'Agronomías, acopios, veterinarias y contratistas',
    sistema: 'Sistemas para el campo',
    href: '/campo',
  },
  {
    id: 'entidades',
    nombre: 'Protectoras y entidades',
    ejemplo: 'Refugios, fundaciones, clubes y cooperadoras',
    sistema: 'Adopciones y socios',
    href: '/demos/protectora',
  },
  {
    id: 'servicios',
    nombre: 'Profesionales y servicios',
    ejemplo: 'Estudios, oficios, talleres y academias',
    sistema: 'Página web',
    href: '/demos/web',
  },
] as const;

export const SECCIONES = {
  queArmo: {
    id: 'que-armamos',
    rotulo: 'Productos',
    titulo: 'Elegí qué necesitás.',
  },
  rubros: {
    id: 'rubros',
    titulo: 'Elegí tu rubro y probalo.',
    bajada: 'Se abre la demo, lista para poner tu nombre.',
  },
  zona: {
    texto: 'Atención en San Francisco y San Jorge',
    detalle: 'y toda la zona',
    ver: 'Ver el mapa',
  },
  porque: {
    id: 'por-que-webya',
    titulo: 'Por qué Webya.',
  },
  proyectos: {
    id: 'proyectos',
    rotulo: 'Proyectos',
    titulo: 'Negocios reales. Funcionando.',
    bajada: '',
  },
  nosotros: {
    id: 'nosotros',
    rotulo: 'Quiénes somos',
    titulo: 'Una persona real, de acá.',
  },
} as const;

/** Tarjetas de producto de la home: nombre, una línea y dos acciones. */
export const BENTO = {
  verDemo: 'Ver demo',
  masInfo: 'Más info',
  celdas: {
    turnero: {
      titulo: 'Turnero',
      texto: 'Reservas con seña. Sin faltazos.',
      href: '/turnero',
      demo: '/demos/turnos',
    },
    pedidos: {
      titulo: 'Pedidos online',
      texto: 'La cocina, en orden.',
      href: '/pedidos',
      demo: '/demos/pedidos',
    },
    tienda: {
      titulo: 'Tienda online',
      texto: 'Vendé aunque esté cerrado.',
      href: '/tienda',
      demo: '/demos/tienda',
    },
    web: {
      titulo: 'Página web',
      texto: 'Que te encuentren en Google.',
      href: '/web',
      demo: '/demos/web',
    },
    campo: {
      titulo: 'Campo y agro',
      texto: 'Sistemas para el agro.',
      href: '/campo',
      demo: '',
    },
    entidades: {
      titulo: 'Protectoras',
      texto: 'Adopciones y socios.',
      href: '/protectoras',
      demo: '/demos/protectora',
    },
    medida: {
      titulo: 'A medida',
      texto: 'Lo que hoy hacés a mano.',
      href: '/armar?tipo=medida',
      demo: '',
    },
  },
} as const;

/** Por qué Webya: tres razones en una línea cada una (la cuarta tarjeta es el mapa de la zona). */
export const PORQUE = [
  {
    id: 'demo',
    titulo: 'Probalo antes.',
    texto: 'Demos en vivo, sin registrarte.',
    link: 'Ver demos',
    href: '/demos',
  },
  { id: 'celular', titulo: 'Lo manejás vos.', texto: 'Todo desde tu celular.', link: '', href: '' },
  {
    id: 'persona',
    titulo: 'Te atiende quien lo programa.',
    texto: 'Sin call center.',
    link: 'Conocenos',
    href: '/nosotros',
  },
] as const;

export const PROYECTOS_UI = {
  verTodos: 'Ver todos los proyectos',
  verCaso: 'Ver el caso completo',
  verSitio: 'Ver sitio',
  desafio: 'El desafío',
  armamos: 'Lo que armamos',
  ve: 'Lo que ve el cliente',
  uso: 'Cómo se usa',
  resultado: 'Resultado',
  ver: 'Ver el sitio',
  verDemo: 'Ver demo',
  /** Barra de datos: los números salen del manifiesto, nunca se escriben a mano. */
  datos: (casos: number | string, enProduccion: number | string, rubros: string, lugar: string) =>
    `${casos} casos, ${enProduccion} en producción. ${rubros}. ${lugar}.`,
  filtros: {
    aria: 'Filtrar por tipo de sistema',
    todos: 'Todos',
    tipos: { pedidos: 'Pedidos', turnero: 'Turnos', tienda: 'Tienda', web: 'Web' },
  },
  indice: 'Casos',
  abrir: 'Ver más',
  cerrar: 'Ver menos',
  vacio: 'Todavía no hay casos de este tipo.',
  proximo: {
    titulo: '¿Tu negocio es el próximo?',
  },
  caso: {
    volver: 'Todos los proyectos',
    anterior: 'Caso anterior',
    siguiente: 'Caso siguiente',
    cierre: '¿Querés uno así?',
    cierreBajada: 'Te pasamos una propuesta concreta.',
    mensaje: (cliente: string) =>
      `Hola, vengo de webya.dev. Vi el caso de ${cliente} y quiero algo parecido para mi negocio.`,
    seoTitulo: (cliente: string, sistema: string) => `${cliente}: ${sistema.toLowerCase()}`,
  },
  mockupAlt: (sistema: string) => `Esquema del ${sistema.toLowerCase()}`,
} as const;

export const CIERRE = {
  titulo: '¿Empezamos?',
  bajada: 'Te pasamos una propuesta concreta.',
} as const;

export const PIE = {
  lema: LEMA.join(' '),
  productos: 'Qué armamos',
  webya: 'Webya',
  contacto: 'Contacto',
  legal: 'Legal',
  whatsapp: 'WhatsApp',
  mail: 'Mail',
  instagram: 'Instagram',
  privacidad: 'Privacidad',
  terminos: 'Términos',
  derechos: (anio: number | string) => `© ${anio} Webya, San Jorge, Santa Fe`,
} as const;

/** Las frases de Webya (las de la bio de Instagram): la franja de la home y los fondos vectoriales. */
export const FRASES = {
  lema: LEMA.join(' '),
  promesa: 'Tu negocio. Nuestra tecnología.',
  rubros: 'Web, sistemas y automatización',
} as const;

/** "Te escribimos nosotros": dejan su WhatsApp y el pedido llega al instante (API de leads). */
export const CONTACTO_RAPIDO = {
  titulo: 'O te escribimos nosotros.',
  /** En la tarjeta del menú. */
  tituloCorto: 'Te escribimos nosotros.',
  whatsapp: 'Tu WhatsApp',
  whatsappAyuda: 'Con código de área.',
  negocio: 'Tu negocio (opcional)',
  negocioPlaceholder: 'Ej.: Agronomía del Centro',
  mensaje: '¿Qué necesitás? (opcional)',
  mensajePlaceholder: 'En pocas palabras',
  enviar: 'Enviar',
  enviando: 'Enviando…',
  listoTitulo: 'Enviado.',
  listo: 'Te escribimos por WhatsApp.',
  error: 'No se pudo enviar. Escribinos directo:',
  errorBoton: 'Abrir WhatsApp',
  privacidad: 'Solo para responderte.',
  mensajeRespaldo: (negocio: string, texto: string) =>
    [
      'Hola, vengo de webya.dev.',
      negocio ? `Mi negocio: ${negocio}.` : '',
      texto ? `Necesito: ${texto}` : 'Quiero hablar sobre un sistema para mi negocio.',
    ]
      .filter(Boolean)
      .join('\n'),
} as const;

/**
 * Barra de anuncios (arriba de todo, en todas las páginas): una línea por vez, sin etiquetas.
 * El descuento del primer mes lo pidió Julián; el porcentaje se suma acá cuando lo defina.
 */
/** Un anuncio de la barra: un link interno o, con destino 'whatsapp', un mensaje ya escrito. */
export interface Anuncio {
  texto: string;
  corto: string;
  link: string;
  destino: string;
  mensaje: string;
}

export const ANUNCIOS = {
  etiqueta: 'Novedades',
  items: <readonly Anuncio[]>[
    {
      texto: 'Primer mes con descuento.',
      corto: 'Primer mes con descuento.',
      link: 'Consultá',
      destino: 'whatsapp',
      mensaje: 'Hola, vengo de webya.dev. Quiero saber del descuento del primer mes.',
    },
    {
      texto: 'Probalo en vivo antes de decidir.',
      corto: 'Probalo en vivo antes de decidir.',
      link: 'Ver demos',
      destino: '/demos',
      mensaje: '',
    },
    {
      texto: 'Nuevo: sistemas para el campo.',
      corto: 'Nuevo: sistemas para el campo.',
      link: 'Conocé más',
      destino: '/campo',
      mensaje: '',
    },
  ],
} as const;
