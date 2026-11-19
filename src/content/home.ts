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
} as const;

export const HEADER = {
  saltar: 'Saltar al contenido',
  navegacion: 'Principal',
  links: [
    { href: '/#que-armo', texto: 'Qué armo' },
    { href: '/turnero', texto: 'Turnero' },
    { href: '/#proyectos', texto: 'Proyectos' },
    { href: '/#como-trabajo', texto: 'Cómo trabajo' },
  ],
} as const;

export const HERO = {
  rotulo: 'Software para negocios de San Jorge y zona',
  /** Cada línea se anima por separado. */
  titulo: ['Tu tienda, tus pedidos,', 'tus turnos.', 'Armados en serio.'],
  bajada:
    'Armo sistemas para comercios: tiendas online, pedidos para pizzerías y turneros con seña. Los usás desde el celular y hablás directo con quien los programa.',
  disponibilidad: 'Tomando proyectos nuevos',
} as const;

export const MARQUESINA = {
  etiqueta: 'Rubros con los que trabajo',
  rubros: [
    'Pizzerías',
    'Joyerías',
    'Kinesiología',
    'Peluquerías',
    'Comercios',
    'Rotiserías',
    'Veterinarias',
    'Fonoaudiología',
    'Estética',
    'Cafeterías',
    'Odontología',
    'Profesionales',
  ],
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
    titulo: 'Negocios de acá que ya lo usan.',
    bajada: 'Sistemas funcionando, con nombre y apellido. Tocá cualquiera para verlo de cerca.',
  },
  rubros: {
    id: 'rubros',
    rotulo: 'Por rubro',
    titulo: 'Buscá tu rubro.',
    bajada: 'Lo que más piden en cada uno. Si el tuyo no está, contámelo igual.',
  },
  comoTrabajo: {
    id: 'como-trabajo',
    rotulo: 'Cómo trabajo',
    titulo: 'Sin vueltas, de principio a fin.',
  },
  faq: {
    id: 'preguntas',
    rotulo: 'Preguntas',
    titulo: 'Lo que todos preguntan antes de arrancar.',
  },
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
    'Ya funciona en Peluquería Canina San Jorge: turnos con Mercado Pago y varios profesionales.',
  cta: 'Armá tu turnero',
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

export const CITAS = {
  directo: {
    texto: 'Hablás directo con quien programa tu sistema. Sin intermediarios, sin call center.',
    autor: 'Julián Chiosso, fundador de Webya',
  },
} as const;

export const PROYECTOS_UI = {
  problema: 'El problema',
  incluye: 'Qué hace',
  ver: 'Ver el sitio',
  verAvance: 'Ver el avance',
  externo: ' (se abre en otra pestaña)',
  pedirDemo: 'Pedí la demo',
  mensajeDemo: (cliente: string) =>
    `Hola Julián, vengo de webya.dev. Vi el proyecto de ${cliente} y quiero ver una demo para mi negocio.`,
  deslizar: 'Deslizá para ver más',
  anterior: 'Proyecto anterior',
  siguiente: 'Proyecto siguiente',
  mockupAlt: (sistema: string) => `Esquema del ${sistema.toLowerCase()}`,
} as const;

export const HECHOS = {
  titulo: 'Lo que hay, sin inflar.',
  items: {
    total: 'sistemas hechos para negocios de la zona',
    enProduccion: 'funcionando en producción',
    rubros: 'rubros distintos',
  },
  persona: {
    cifra: 'Una',
    texto: 'persona: la misma que te atiende es la que programa',
  },
} as const;

export interface FilaRubro {
  nombre: string;
  ejemplos: string;
  arma: string;
  link: { href: string; texto: string };
}

export const RUBROS_INDICE: readonly FilaRubro[] = [
  {
    nombre: 'Pizzerías y comida',
    ejemplos: 'Pizzerías, rotiserías, hamburgueserías',
    arma: 'Pedidos online con horario de retiro, franjas y comandas impresas.',
    link: { href: '/pizzerias', texto: 'Pedidos para pizzerías' },
  },
  {
    nombre: 'Joyerías y comercios',
    ejemplos: 'Joyerías, regalerías, indumentaria',
    arma: 'Tienda o catálogo con panel propio y consulta por WhatsApp.',
    link: { href: '/tiendas', texto: 'Tiendas online' },
  },
  {
    nombre: 'Peluquerías y estética',
    ejemplos: 'Peluquerías, barberías, uñas, estética',
    arma: 'Turnero con seña, agenda por profesional y recordatorios.',
    link: { href: '/turnero', texto: 'Turnero con seña' },
  },
  {
    nombre: 'Salud',
    ejemplos: 'Kinesiología, fonoaudiología, odontología',
    arma: 'Sitio profesional y turnos online con seña.',
    link: { href: '/#proyecto-lorena', texto: 'Ver el caso de Lorena' },
  },
  {
    nombre: 'Mascotas',
    ejemplos: 'Peluquerías caninas, veterinarias',
    arma: 'Turnos con pago por Mercado Pago y varios profesionales.',
    link: { href: '/#proyecto-canina', texto: 'Ver el caso de la peluquería canina' },
  },
  {
    nombre: 'Profesionales y servicios',
    ejemplos: 'Estudios, consultorios, técnicos',
    arma: 'Página web con tus servicios y contacto por WhatsApp.',
    link: { href: '/#armar', texto: 'Armá tu página' },
  },
];

export const PROCESO = {
  pasos: [
    {
      titulo: 'Me contás qué necesitás',
      texto:
        'Armás tu pedido acá y me llega por WhatsApp. Si no sabés bien qué pedir, lo vemos juntos.',
    },
    {
      titulo: 'Te muestro cómo quedaría',
      texto: 'Una demo de tu rubro y el presupuesto por escrito, antes de empezar. Sin compromiso.',
    },
    {
      titulo: 'Lo armamos con vos',
      texto: 'Ves los avances y opinás. Nada se publica hasta que te cierra.',
    },
    {
      titulo: 'Lo usás y te acompaño',
      texto: 'Te enseño a usar el panel desde el celular. Si necesitás un cambio, me escribís.',
    },
  ],
} as const;

export const FAQ_HOME = [
  {
    pregunta: '¿Cuánto sale?',
    respuesta:
      'Depende de lo que armes. Me mandás tu pedido y te paso el presupuesto por escrito antes de empezar, sin compromiso.',
  },
  {
    pregunta: '¿Cuánto tarda?',
    respuesta:
      'Depende del sistema. Junto con el presupuesto te paso una fecha estimada de entrega.',
  },
  {
    pregunta: '¿Tengo que saber de computación?',
    respuesta:
      'No. Te lo dejo funcionando y te enseño a usar el panel desde el celular. Si algo no te sale, me escribís.',
  },
  {
    pregunta: '¿Cómo cobra la seña el turnero?',
    respuesta:
      'Con Mercado Pago. El cliente paga la seña al reservar y el turno recién se confirma cuando el pago entra.',
  },
  {
    pregunta: '¿Trabajás fuera de San Jorge?',
    respuesta:
      'Sí. Atiendo San Jorge y zona, y San Francisco y alrededores. Si estás más lejos, escribime igual y lo vemos.',
  },
  {
    pregunta: '¿Qué pasa si después quiero cambiar algo?',
    respuesta:
      'Me escribís y lo vemos. Hablás siempre con la misma persona, la que conoce tu sistema por dentro.',
  },
] as const;

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
