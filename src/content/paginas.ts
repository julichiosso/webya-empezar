/**
 * Copy de las páginas propias: /nosotros, /zona, /proyectos y /armar. Misma voz que la home
 * (plural, voseo, sin cifras inventadas).
 */

export const NOSOTROS = {
  seo: {
    titulo: 'Quiénes somos',
    descripcion:
      'Webya es Julián Chiosso, desarrollador de San Jorge y Técnico Universitario en Programación (UTN). Trabajamos directo con cada negocio, de la primera charla al soporte.',
  },
  rotulo: 'Quiénes somos',
  titulo: ['Detrás de Webya', 'hay una persona de acá.'],
  presentacion:
    'Soy Julián Chiosso, desarrollador de San Jorge y Técnico Universitario en Programación (UTN). Armo sistemas para negocios de la zona y trabajo directo con cada cliente: el que te escucha es el que programa tu sistema.',
  firma: 'Julián Chiosso',
  cargo: 'Desarrollador · Técnico Universitario en Programación (UTN)',
  fotoAlt: 'Julián Chiosso, de Webya',
  /**
   * Foto de Julián. Mientras no esté (null), se muestran sus iniciales. Para cargarla: subir
   * public/nosotros/julian.webp (ver IMAGENES.md) y completar acá.
   */
  foto: null as null | { src: string; ancho: number; alto: number },
  iniciales: 'JC',
  proceso: {
    rotulo: 'Cómo trabajamos',
    titulo: 'Cuatro pasos, sin vueltas.',
    pasos: [
      {
        titulo: 'Hablamos',
        texto: 'Nos contás cómo trabajás hoy y qué querés resolver. Sin formularios ni compromiso.',
      },
      {
        titulo: 'Armamos',
        texto: 'Diseñamos y programamos tu sistema a la medida de tu negocio, no una plantilla.',
      },
      {
        titulo: 'Probás',
        texto: 'Lo usás antes de lanzarlo y ajustamos lo que haga falta, juntos.',
      },
      {
        titulo: 'Lanzamos y te acompañamos',
        texto: 'Lo publicamos, te enseñamos a usarlo y seguimos a un mensaje de distancia.',
      },
    ],
  },
  contacto: {
    rotulo: 'Contacto',
    titulo: 'Escribinos por donde te quede cómodo.',
    whatsapp: 'WhatsApp',
    mail: 'Mail',
    instagram: 'Instagram',
    zona: 'Zona de atención',
  },
} as const;

export const ZONA = {
  seo: {
    titulo: 'Zona de atención: San Jorge y zona, San Francisco y alrededores',
    descripcion:
      'Atendemos negocios de San Jorge y la zona (Santa Fe) y de San Francisco y alrededores (Córdoba). Si estás más lejos, trabajamos a distancia.',
  },
  rotulo: 'Zona de atención',
  titulo: ['Cerca tuyo.'],
  bajada:
    'Atendemos en San Jorge y zona, y en San Francisco y alrededores. Nos juntamos en persona o lo resolvemos por WhatsApp, como te quede mejor.',
  mapaAlt:
    'Mapa de la zona de atención: San Jorge y alrededores, en Santa Fe, y San Francisco y alrededores, en Córdoba.',
  provincias: { cordoba: 'Córdoba', santaFe: 'Santa Fe' },
  ciudades: { sanJorge: 'San Jorge', sanFrancisco: 'San Francisco' },
  pueblos: {
    sastre: 'Sastre',
    mariaJuana: 'María Juana',
    pellegrini: 'Carlos Pellegrini',
    piamonte: 'Piamonte',
    trebol: 'El Trébol',
  },
  areas: [
    {
      nombre: 'San Jorge y zona',
      provincia: 'Santa Fe',
      localidades: [
        'San Jorge',
        'Sastre',
        'Crispi',
        'Traill',
        'María Juana',
        'Carlos Pellegrini',
        'Piamonte',
        'Landeta',
        'Cañada Rosquín',
        'El Trébol',
      ],
    },
    {
      nombre: 'San Francisco y alrededores',
      provincia: 'Córdoba',
      localidades: ['San Francisco', 'Frontera', 'Josefina', 'Devoto', 'Freyre', 'Porteña'],
    },
  ],
  lejos: '¿Estás más lejos? Trabajamos a distancia igual: escribinos y lo vemos.',
} as const;

export const PROYECTOS_PAGINA = {
  seo: {
    titulo: 'Proyectos reales',
    descripcion:
      "Sistemas funcionando en negocios de San Jorge: pedidos online de Micio's Pizzería, tienda de Joyería Petrucci, sitio de la fonoaudióloga Lorena Almagro y más.",
  },
  rotulo: 'Proyectos reales',
  titulo: ['Negocios de acá,', 'con su sistema funcionando.'],
  bajada: 'Trabajos reales, con nombre y apellido. Cada uno resolvió un problema concreto.',
} as const;

export const ARMAR = {
  seo: {
    titulo: 'Armá tu sistema',
    descripcion:
      'Elegí qué querés armar, tu rubro y lo que tiene que tener. Envianos el pedido por WhatsApp y te respondemos con el presupuesto, sin compromiso.',
  },
} as const;
