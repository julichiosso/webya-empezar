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
    titulo: 'Webya · Sistemas, tiendas y turnos en San Francisco y San Jorge',
    descripcion:
      'Sistemas, tiendas online y turnos para negocios de San Francisco (Córdoba), San Jorge (Santa Fe) y toda la zona. Atendemos en persona o por WhatsApp.',
  },
  titulo: ['San Francisco', 'y San Jorge.'],
  bajada: 'Y toda la zona. Sistemas, tiendas y turnos para los negocios de la región.',
  /** Los números salen del manifiesto de la zona (nunca a mano). */
  datos: (zonas: number | string, localidades: number | string) =>
    `${zonas} zonas · ${localidades} localidades · En persona o por WhatsApp`,
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

export const CAMPO = {
  seo: {
    titulo: 'Sistemas para el campo y el agro en San Jorge y zona',
    descripcion:
      'Turnos de descarga para acopios, pedidos de insumos, catálogos de maquinaria y páginas para contratistas rurales. Sistemas para el campo de San Jorge, San Francisco y la zona.',
  },
  rotulo: 'Campo y agro',
  titulo: ['Sistemas para el campo,', 'pensados desde acá.'],
  bajada:
    'Agronomías, acopios, veterinarias rurales, contratistas y talleres de maquinaria: ordenamos lo que hoy se resuelve por teléfono, papel y WhatsApp.',
  soluciones: {
    rotulo: 'Qué armamos para el campo',
    titulo: 'Lo que hoy se anota en un cuaderno, en el celular.',
    items: [
      {
        titulo: 'Turnos de descarga',
        texto:
          'En cosecha, cada camión con su horario para descargar en la planta o el acopio. Menos fila en la ruta.',
        href: '/turnero',
        producto: 'Turnero',
      },
      {
        titulo: 'Pedidos de insumos',
        texto:
          'El productor pide semillas, fertilizantes o repuestos desde el celular y el pedido llega ordenado.',
        href: '/pedidos',
        producto: 'Pedidos online',
      },
      {
        titulo: 'Maquinaria y repuestos',
        texto:
          'Equipos usados, repuestos y precios a la vista, con la consulta directa a tu WhatsApp.',
        href: '/tienda',
        producto: 'Catálogo',
      },
      {
        titulo: 'Contratistas rurales',
        texto:
          'Siembra, pulverización, cosecha o fletes: qué hacés, en qué zona y cómo te contratan.',
        href: '/web',
        producto: 'Página web',
      },
      {
        titulo: 'Veterinaria rural',
        texto: 'Visitas al campo y consultas con agenda propia y el aviso al celular.',
        href: '/turnero',
        producto: 'Turnero',
      },
      {
        titulo: 'A medida',
        texto:
          'Stock del galpón, órdenes de trabajo o registro de lotes: lo que hoy vive en una planilla.',
        href: '/armar?tipo=medida',
        producto: 'Sistema a medida',
      },
    ],
  },
  nota: 'Se arman sobre los mismos sistemas que ya funcionan en negocios de la zona, adaptados a cómo trabaja el campo.',
} as const;
