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
  titulo: ['Software hecho', 'en San Jorge.'],
  presentacion:
    'Diseñamos y programamos sistemas para negocios de la zona. Quien te escucha es quien programa tu sistema.',
  firma: 'Webya',
  cargo: 'Fundada por Julián Chiosso, Técnico Universitario en Programación (UTN)',
  fotoAlt: 'Webya, San Jorge, Santa Fe',
  /**
   * Foto del equipo o del lugar de trabajo. Mientras no esté (null), se muestra la marca (nunca iniciales).
   * Para cargarla: subir public/nosotros/equipo.webp (ver IMAGENES.md) y completar acá.
   */
  foto: null as null | { src: string; ancho: number; alto: number },
  ciudad: 'San Jorge, Santa Fe',
  proceso: {
    rotulo: 'Cómo trabajamos',
    titulo: 'Cuatro pasos.',
    pasos: [
      {
        titulo: 'Hablamos',
        texto: 'Contás qué querés resolver.',
      },
      {
        titulo: 'Armamos',
        texto: 'A tu medida, no una plantilla.',
      },
      {
        titulo: 'Probás',
        texto: 'Lo usás y ajustamos.',
      },
      {
        titulo: 'Lanzamos',
        texto: 'Y seguimos a un mensaje.',
      },
    ],
  },
  contacto: {
    rotulo: 'Contacto',
    titulo: 'Escribinos.',
    whatsapp: 'WhatsApp',
    mail: 'Mail',
    instagram: 'Instagram',
    zona: 'Zona de atención',
  },
} as const;

export const ZONA = {
  seo: {
    titulo: 'Webya · Sistemas, tiendas y turnos en San Francisco y San Jorge',
    descripcion:
      'Sistemas, tiendas online y turnos para negocios de San Francisco (Córdoba), San Jorge (Santa Fe) y toda la zona. Atendemos en persona o por WhatsApp.',
  },
  titulo: ['San Francisco', 'y San Jorge.'],
  bajada: 'Y toda la zona. En persona o por WhatsApp.',
  /** Los números salen del manifiesto de la zona (nunca a mano). */
  datos: (zonas: number | string, localidades: number | string) =>
    `${zonas} zonas, ${localidades} localidades. En persona o por WhatsApp.`,
  mapaAlt: (localidades: string) =>
    `Mapa de la zona de atención, con el límite entre Santa Fe y Córdoba, las rutas principales y las localidades donde atendemos: ${localidades}.`,
  provincias: { cordoba: 'CÓRDOBA', santaFe: 'SANTA FE' },
  distancia: (km: number | string) => `${km} km en línea recta`,
  lista: {
    ayuda: 'Tocá una localidad para verla en el mapa.',
    aria: (zona: string) => `Localidades de ${zona}`,
  },
  seleccion: {
    texto: (localidad: string) => `${localidad}: atendemos en persona o por WhatsApp.`,
    link: 'Escribinos',
    mensaje: (localidad: string) =>
      `Hola, soy de ${localidad} y quiero armar un sistema para mi negocio.`,
  },
} as const;

export const PROYECTOS_PAGINA = {
  seo: {
    titulo: 'Proyectos reales',
    descripcion:
      "Sistemas funcionando en negocios de San Jorge: pedidos online de Micio's Pizzería, tienda de Joyería Petrucci, sitio de la fonoaudióloga Lorena Almagro y más.",
  },
  rotulo: 'Proyectos reales',
  titulo: ['Negocios reales.', 'Funcionando.'],
  bajada: 'Con nombre y apellido.',
} as const;

export const ARMAR = {
  seo: {
    titulo: 'Armá tu sistema',
    descripcion:
      'Elegí qué querés armar, tu rubro y lo que tiene que tener. Envianos el pedido por WhatsApp y te respondemos con el presupuesto, sin compromiso.',
  },
} as const;

export const CAMPO = {
  seo: {
    titulo: 'Sistemas para el campo y el agro en San Jorge y zona',
    descripcion:
      'Turnos de descarga para acopios, pedidos de insumos, catálogos de maquinaria y páginas para contratistas rurales. Sistemas para el campo de San Jorge, San Francisco y la zona.',
  },
  rotulo: 'Campo y agro',
  titulo: ['Sistemas', 'para el campo.'],
  bajada: 'Lo que hoy va por papel y WhatsApp, ordenado.',
  soluciones: {
    rotulo: 'Qué armamos para el campo',
    titulo: 'Del cuaderno al celular.',
    items: [
      {
        titulo: 'Turnos de descarga',
        texto: 'Cada camión con su horario.',
        href: '/turnero',
        producto: 'Turnero',
      },
      {
        titulo: 'Pedidos de insumos',
        texto: 'Semillas y repuestos, desde el celular.',
        href: '/pedidos',
        producto: 'Pedidos online',
      },
      {
        titulo: 'Maquinaria y repuestos',
        texto: 'Precios a la vista y consulta por WhatsApp.',
        href: '/tienda',
        producto: 'Catálogo',
      },
      {
        titulo: 'Contratistas rurales',
        texto: 'Qué hacés y cómo te contratan.',
        href: '/web',
        producto: 'Página web',
      },
      {
        titulo: 'Veterinaria rural',
        texto: 'Visitas y consultas con agenda.',
        href: '/turnero',
        producto: 'Turnero',
      },
      {
        titulo: 'A medida',
        texto: 'Lo que hoy vive en una planilla.',
        href: '/armar?tipo=medida',
        producto: 'Sistema a medida',
      },
    ],
  },
  nota: 'Sobre sistemas que ya funcionan en la zona.',
} as const;
