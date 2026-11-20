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
  zona: 'Atención en San Jorge y zona · San Francisco y alrededores',
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
    abrirAria: 'Abrir el menú',
    cerrarAria: 'Cerrar el menú',
    productos: 'Qué armamos',
    webya: 'Webya',
    links: [
      { href: '/turnero', texto: 'Turnero con seña' },
      { href: '/pedidos', texto: 'Pedidos online' },
      { href: '/tienda', texto: 'Tienda y catálogo' },
      { href: '/web', texto: 'Página web' },
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

/** Barra fija del celular: los dos atajos que importan, siempre a mano. */
export const BARRA_CELULAR = {
  etiqueta: 'Atajos',
} as const;

/** La línea de marca de Webya, tal cual se publica en Instagram: tres palabras, una por línea. */
export const LEMA = ['Creá.', 'Digitalizá.', 'Crecé.'] as const;

export const HERO = {
  /** El lema es el H1: cada palabra entra en secuencia y queda fija. */
  titulo: LEMA,
  /** Una sola frase que baja el lema a tierra: qué armamos y para quién. */
  bajada:
    'Armamos los turnos, los pedidos y la venta online de tu negocio, y vos lo manejás desde el celular.',
  rubros: 'Elegí tu rubro y probalo',
  /** Lo que aparece en cada fila al pasar el mouse. */
  probar: 'Ver demo',
  /** Nombre accesible de cada rubro (el link abre la demo en otra pestaña). */
  rubroAria: (rubro: string, sistema: string) =>
    `${rubro}: ver demo de ${sistema.toLowerCase()}, se abre en otra pestaña`,
  /** Prueba al toque, en la primera pantalla: los negocios que ya lo usan. */
  confianza: 'Funcionando en',
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
    rotulo: 'Qué armamos',
    titulo: 'Lo que tu negocio necesita para vender online.',
  },
  proyectos: {
    id: 'proyectos',
    rotulo: 'Proyectos',
    titulo: 'Negocios de acá, con su sistema funcionando.',
    bajada: 'Lo que armamos para negocios de la zona y cómo se usa todos los días.',
  },
  nosotros: {
    id: 'nosotros',
    rotulo: 'Quiénes somos',
    titulo: 'Una persona real, de acá, que te responde.',
  },
} as const;

/** Bento "Qué armamos": cada tarjeta es un link a su página. */
export const BENTO = {
  celdas: {
    turnero: {
      titulo: 'Turnero con seña',
      texto:
        'Tus clientes reservan y pagan la seña con Mercado Pago. El turno queda asegurado y a vos te llega el aviso.',
      href: '/turnero',
    },
    pedidos: {
      titulo: 'Pedidos online',
      texto: 'Carrito, hora de retiro y la comanda impresa sola.',
      href: '/pedidos',
    },
    tienda: {
      titulo: 'Tienda online',
      texto: 'Vendés aunque el local esté cerrado.',
      href: '/tienda',
    },
    catalogo: {
      titulo: 'Catálogo digital',
      texto: 'Fotos, precios y la consulta directo a tu WhatsApp.',
      href: '/tienda#catalogo',
    },
    web: {
      titulo: 'Página web',
      texto: 'Que te encuentren en Google y te escriban con un toque.',
      href: '/web',
    },
    medida: {
      titulo: 'Sistema a medida',
      texto: '¿Algo que hoy hacés a mano? Lo pensamos con vos y lo armamos.',
      href: '/armar?tipo=medida',
    },
  },
} as const;

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
    `${casos} casos · ${enProduccion} en producción · ${rubros} · ${lugar}`,
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
    cierre: '¿Querés algo así para tu negocio?',
    cierreBajada: 'Lo armamos a la medida de cómo trabajás. Contanos y te pasamos una propuesta.',
    mensaje: (cliente: string) =>
      `Hola, vengo de webya.dev. Vi el caso de ${cliente} y quiero algo parecido para mi negocio.`,
    seoTitulo: (cliente: string, sistema: string) => `${cliente}: ${sistema.toLowerCase()}`,
  },
  mockupAlt: (sistema: string) => `Esquema del ${sistema.toLowerCase()}`,
} as const;

/** Quiénes somos, resumido para la home (la versión completa vive en /nosotros). */
export const NOSOTROS_HOME = {
  texto:
    'Webya es Julián Chiosso, desarrollador de San Jorge y Técnico Universitario en Programación (UTN). Trabajamos directo con cada cliente: el que te escucha es el que programa tu sistema.',
  link: 'Conocé cómo trabajamos',
  fotoAlt: 'Julián Chiosso, de Webya',
} as const;

export const CIERRE = {
  titulo: 'Contanos qué necesitás.',
  bajada:
    'Armá tu sistema en tres pasos o escribinos por WhatsApp. Te respondemos con una propuesta concreta.',
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
  derechos: (anio: number | string) => `© ${anio} Webya · San Jorge, Santa Fe`,
} as const;

/** Las frases de Webya (las de la bio de Instagram): la franja de la home y los fondos vectoriales. */
export const FRASES = {
  lema: LEMA.join(' '),
  promesa: 'Tu negocio. Nuestra tecnología.',
  rubros: 'Web · Sistemas · Automatización',
} as const;

export const MANIFIESTO = {
  etiqueta: 'Qué hacemos por tu negocio',
  pasos: [
    { palabra: 'Creá.', texto: 'Tu página, tu tienda o tu sistema, a la medida de tu negocio.' },
    { palabra: 'Digitalizá.', texto: 'Los turnos, pedidos y consultas que hoy hacés a mano.' },
    { palabra: 'Crecé.', texto: 'Tu negocio atiende todo el día, aunque esté cerrado.' },
  ],
} as const;

/** "Te escribimos nosotros": dejan su WhatsApp y el pedido llega al instante (API de leads). */
export const CONTACTO_RAPIDO = {
  titulo: 'O dejanos tu WhatsApp y te escribimos nosotros.',
  whatsapp: 'Tu WhatsApp',
  whatsappAyuda: 'Con código de área, como lo usás en WhatsApp.',
  negocio: 'Tu negocio (opcional)',
  negocioPlaceholder: 'Ej.: Agronomía del Centro',
  mensaje: '¿Qué necesitás? (opcional)',
  mensajePlaceholder: 'Contanos en pocas palabras',
  enviar: 'Enviar',
  enviando: 'Enviando…',
  listoTitulo: 'Enviado.',
  listo: 'Nos ponemos en contacto con vos por WhatsApp a la brevedad.',
  error: 'No se pudo enviar. Escribinos directo, con lo que pusiste ya escrito:',
  errorBoton: 'Abrir WhatsApp',
  privacidad: 'Usamos tu número solo para responderte.',
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
export const ANUNCIOS = {
  etiqueta: 'Novedades',
  items: [
    {
      texto: 'Primer mes con descuento para negocios que arrancan con Webya.',
      corto: 'Primer mes con descuento.',
      link: 'Consultá',
      destino: 'whatsapp',
      mensaje: 'Hola, vengo de webya.dev. Quiero saber del descuento del primer mes.',
    },
    {
      texto: 'Probá cualquier sistema en vivo antes de decidir.',
      corto: 'Probalo en vivo antes de decidir.',
      link: 'Ver demos',
      destino: '/demos',
      mensaje: '',
    },
    {
      texto: 'Ahora también armamos sistemas para el campo y el agro.',
      corto: 'Sistemas para el campo y el agro.',
      link: 'Conocé más',
      destino: '/campo',
      mensaje: '',
    },
  ],
} as const;
