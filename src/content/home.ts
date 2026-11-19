/**
 * Copy de la home (/) y piezas compartidas (header, cierre, pie). Voseo, frases cortas, sin humo.
 * Estructura de cada sección: dolor → solución → prueba → acción.
 */

export const MARCA = {
  nombre: 'Webya',
  fundador: 'Julián Chiosso',
  ciudad: 'San Jorge, Santa Fe',
  zona: 'Atención en San Jorge y zona · San Francisco y alrededores',
  zonaCorta: 'San Jorge y zona · San Francisco',
  inicio: 'Webya, inicio',
} as const;

export const CTA = {
  armar: 'Armá tu sistema',
  armarCorto: 'Armá tu sistema',
  demo: 'Pedí tu demo',
  hablar: 'Hablá con Julián',
  proyectos: 'Ver proyectos reales',
  verDemo: 'Ver demo',
  verDemos: 'Ver demos',
  pestana: ' (se abre en otra pestaña)',
} as const;

export const HEADER = {
  saltar: 'Saltar al contenido',
  navegacion: 'Principal',
  links: [
    { href: '/#que-armo', texto: 'Qué armo' },
    { href: '/turnero', texto: 'Turnero' },
    { href: '/pizzerias', texto: 'Pedidos' },
    { href: '/#proyectos', texto: 'Proyectos' },
  ],
} as const;

export const HERO = {
  rotulo: 'Software para negocios de San Jorge y zona',
  /** Cada línea se anima por separado. */
  titulo: ['Tu tienda, tus pedidos,', 'tus turnos.', 'Armados en serio.'],
  bajada:
    'Armo sistemas para comercios: tiendas online, pedidos para pizzerías y turneros con seña. Los usás desde el celular y hablás directo con quien los programa.',
  /** En el celular: lo mismo en una línea, para que los botones entren en la primera pantalla. */
  bajadaCorta: 'Pedidos, turnos y tiendas online. Hablás directo con quien los programa.',
  disponibilidad: 'Tomando proyectos nuevos',
  probar: 'Probalo vos, ahora',
  abrirDemo: 'Abrir demo',
  verZona: 'Ver en el mapa',
  abrir: ' (se abre en otra pestaña)',
} as const;

export const SECCIONES = {
  queArmo: {
    id: 'que-armo',
    rotulo: 'Qué armo',
    titulo: 'Todo lo que tu negocio puede tener online.',
    bajada:
      'Elegí una pieza o combiná varias. Cada sistema se arma para tu rubro, no es una plantilla genérica.',
  },
  turnero: {
    id: 'turnero',
    rotulo: 'Turnero con seña',
    titulo: 'El turno que se paga, se cumple.',
  },
  pedidos: {
    id: 'pedidos',
    rotulo: 'Sistema de pedidos',
    titulo: 'Pedidos ordenados, aunque sea viernes a la noche.',
  },
  proyectos: {
    id: 'proyectos',
    rotulo: 'Proyectos reales',
    titulo: 'Negocios de acá, con su sistema.',
    bajada: 'Trabajos reales, con nombre y apellido. Tocá cualquiera para verlo de cerca.',
  },
  zona: {
    id: 'zona',
    rotulo: 'Dónde atiendo',
    titulo: 'Cerca tuyo.',
    bajada:
      'Atiendo en San Jorge y zona, y en San Francisco y alrededores. Hablás conmigo, no con un call center.',
  },
} as const;

/** El mapa de la zona de atención (los pueblos son de referencia, para ubicarse). */
export const ZONA_UI = {
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
    { nombre: 'San Jorge y zona', provincia: 'Santa Fe' },
    { nombre: 'San Francisco y alrededores', provincia: 'Córdoba' },
  ],
  lejos: 'Si estás más lejos, escribime igual y lo vemos.',
} as const;

export const BENTO = {
  armar: 'Armá esto',
  celdas: {
    turnero: {
      titulo: 'Turnero con seña',
      texto:
        'Reservan, pagan la seña con Mercado Pago y el turno queda asegurado. Vos te enterás al instante.',
      destacado: 'Producto estrella',
    },
    pedidos: {
      titulo: 'Sistema de pedidos',
      texto: 'Carrito, horario de retiro y la comanda impresa sola.',
    },
    tienda: {
      titulo: 'Tienda online',
      texto: 'Vendés aunque el local esté cerrado.',
    },
    catalogo: {
      titulo: 'Catálogo digital',
      texto: 'Fotos, precios y la consulta directo a tu WhatsApp.',
    },
    web: {
      titulo: 'Página web',
      texto: 'Que te encuentren en Google.',
    },
    panel: {
      titulo: 'Panel de administración',
      texto: 'Cambiás precios, fotos y horarios desde el celular.',
    },
    bot: {
      titulo: 'Bot de WhatsApp',
      texto: 'Confirma y recuerda por vos, a cualquier hora.',
    },
  },
} as const;

export const TURNERO = {
  pasos: [
    {
      rotulo: 'El problema',
      titulo: 'Reservan, no avisan y no vienen.',
      texto: 'Ese hueco ya no lo llenás. Es tiempo y plata que se pierden, todas las semanas.',
    },
    {
      rotulo: 'La seña',
      titulo: 'Sin seña, no hay turno.',
      texto:
        'El cliente elige día, hora y profesional, y paga una seña del 50% con Mercado Pago. Recién ahí el turno queda asegurado.',
    },
    {
      rotulo: 'El aviso',
      titulo: 'Te enterás en el momento.',
      texto:
        'Apenas entra una reserva te llega una notificación al celular, igual que un mensaje de WhatsApp. El sistema se instala como una app.',
    },
    {
      rotulo: 'El bot',
      titulo: 'Confirma y recuerda por vos.',
      texto:
        'El bot le confirma la reserva al cliente y le recuerda el turno. Vos no escribís nada.',
    },
    {
      rotulo: 'La agenda',
      titulo: 'Tu semana, ordenada.',
      texto:
        'Agenda por profesional, horarios que configurás vos y un panel simple para ver el día de un vistazo.',
    },
  ],
  prueba:
    'Lo desarrollé para Peluquería Canina San Jorge: turnos con Mercado Pago y varios profesionales.',
  cta: 'Armá tu turnero',
  demo: 'Probá la demo',
  verMas: 'Cómo funciona el turnero',
} as const;

export const PEDIDOS = {
  dolor:
    'Viernes, nueve de la noche: el teléfono no para, WhatsApp explota y la cocina no da abasto.',
  solucion:
    'Con el sistema de pedidos, cada cliente arma su pedido desde el celular y elige la hora de retiro. Vos ponés cuántos pedidos entran por franja y la cocina trabaja a su ritmo.',
  puntos: [
    { titulo: 'Franjas de 15 minutos', texto: 'Ponés un tope de pedidos por franja.' },
    { titulo: 'Hora exacta de retiro', texto: 'El cliente sabe cuándo pasar.' },
    { titulo: 'Comanda impresa', texto: 'El pedido sale por la impresora solo.' },
    { titulo: 'Panel del dueño', texto: 'Productos, precios y horarios.' },
  ],
  prueba: "Así funciona hoy en Micio's Pizzería, en San Jorge.",
  cta: 'Armá tu sistema de pedidos',
  demo: 'Probá la demo',
} as const;

export const PROYECTOS_UI = {
  problema: 'El problema',
  incluye: 'Qué hace',
  ver: 'Ver el sitio',
  verAvance: 'Ver el avance',
  externo: ' (se abre en otra pestaña)',
  pedirDemo: 'Pedí la demo',
  probarDemo: 'Probá la demo',
  mensajeDemo: (cliente: string) =>
    `Hola Julián, vengo de webya.dev. Vi el proyecto de ${cliente} y quiero ver una demo para mi negocio.`,
  deslizar: 'Deslizá para ver más',
  anterior: 'Proyecto anterior',
  siguiente: 'Proyecto siguiente',
  mockupAlt: (sistema: string) => `Esquema del ${sistema.toLowerCase()}`,
} as const;

export const CIERRE = {
  titulo: 'Tu sistema, armado por alguien de acá.',
  bajada: 'Contame qué necesitás. Te respondo yo, no un formulario.',
} as const;

export const PIE = {
  lema: 'Sistemas para negocios que quieren trabajar en serio.',
  servicios: 'Servicios',
  contacto: 'Contacto',
  legal: 'Legal',
  whatsapp: 'WhatsApp',
  mail: 'Mail',
  instagram: 'Instagram',
  privacidad: 'Privacidad',
  terminos: 'Términos',
  derechos: (anio: number | string) => `© ${anio} Webya · San Jorge, Santa Fe`,
} as const;
