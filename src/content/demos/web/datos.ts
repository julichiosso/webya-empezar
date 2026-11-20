/**
 * Demo de página web (/demos/web): la misma plantilla navegable, con el contenido de cada rubro.
 * Negocios genéricos ("Tu consultorio", "Tu peluquería"…), direcciones y horarios de ejemplo. La
 * estructura sale de los sitios que entregamos (el de Lorena Almagro es el ejemplo real); el texto no.
 */

export type RubroWebId = 'salud' | 'estetica' | 'gastronomia' | 'comercio' | 'servicios';

export interface RubroWeb {
  id: RubroWebId;
  /** Lo que dice el selector. */
  etiqueta: string;
  /** Color de la marca del negocio de ejemplo. */
  color: string;
  negocio: { nombre: string; inicial: string; actividad: string };
  hero: { titulo: string; bajada: string };
  servicios: { titulo: string; items: readonly { nombre: string; texto: string }[] };
  sobre: { titulo: string; texto: string; puntos: readonly string[] };
  extra: { titulo: string; items: readonly string[] };
  contacto: { horario: string; direccion: string };
  /** Lo que el cliente encuentra escrito al tocar WhatsApp en esa página. */
  mensaje: string;
}

export const RUBROS_WEB: readonly RubroWeb[] = [
  {
    id: 'salud',
    etiqueta: 'Salud',
    color: '#0f6e6e',
    negocio: { nombre: 'Tu consultorio', inicial: 'T', actividad: 'Kinesiología y rehabilitación' },
    hero: {
      titulo: 'Volvé a moverte sin dolor.',
      bajada: 'Atención personalizada con turno, para adultos y deportistas.',
    },
    servicios: {
      titulo: 'Especialidades',
      items: [
        { nombre: 'Rehabilitación', texto: 'Lesiones, cirugías y dolor crónico.' },
        { nombre: 'Deportología', texto: 'Prevención y vuelta a la cancha.' },
        { nombre: 'A domicilio', texto: 'Para quien no puede trasladarse.' },
      ],
    },
    sobre: {
      titulo: 'Cómo trabajo',
      texto:
        'Una primera consulta para evaluarte y un plan a tu medida. Seguimos tu evolución sesión a sesión.',
      puntos: [
        'Primera evaluación completa',
        'Ejercicios para hacer en casa',
        'Informe para tu médico',
      ],
    },
    extra: { titulo: 'Obras sociales', items: ['IAPOS', 'OSDE', 'Swiss Medical', 'Particulares'] },
    contacto: {
      horario: 'Lunes a viernes, 8 a 12 y 16 a 20',
      direccion: 'Calle Ejemplo 123, Tu ciudad',
    },
    mensaje: 'Hola, quiero pedir un turno.',
  },
  {
    id: 'estetica',
    etiqueta: 'Peluquería',
    color: '#8a3b5c',
    negocio: { nombre: 'Tu peluquería', inicial: 'T', actividad: 'Peluquería y barbería' },
    hero: {
      titulo: 'Tu corte, con turno y sin esperas.',
      bajada: 'Cortes, color y barba. Reservá online y pagá el resto en el local.',
    },
    servicios: {
      titulo: 'Servicios',
      items: [
        { nombre: 'Cortes', texto: 'Lavado, corte y peinado.' },
        { nombre: 'Color', texto: 'Tintura, mechas y matices.' },
        { nombre: 'Barbería', texto: 'Perfilado y afeitado clásico.' },
      ],
    },
    sobre: {
      titulo: 'El equipo',
      texto: 'Tres profesionales, cada uno con su agenda. Elegís con quién y a qué hora.',
      puntos: ['Turnos online', 'Productos profesionales', 'Abierto los sábados'],
    },
    extra: {
      titulo: 'Medios de pago',
      items: ['Efectivo', 'Transferencia', 'Mercado Pago', 'Tarjetas'],
    },
    contacto: { horario: 'Martes a sábado, 9 a 20', direccion: 'Calle Ejemplo 123, Tu ciudad' },
    mensaje: 'Hola, quiero reservar un turno.',
  },
  {
    id: 'gastronomia',
    etiqueta: 'Gastronomía',
    color: '#b4471f',
    negocio: {
      nombre: 'Tu cocina',
      inicial: 'T',
      actividad: 'Pizzas y empanadas al horno de barro',
    },
    hero: {
      titulo: 'Al horno de barro, como en casa.',
      bajada: 'Pedí por WhatsApp o pasá a retirar. Abrimos todas las noches.',
    },
    servicios: {
      titulo: 'La carta',
      items: [
        { nombre: 'Pizzas', texto: 'Masa madre y muzzarella de verdad.' },
        { nombre: 'Empanadas', texto: 'Carne cortada a cuchillo, pollo y verdura.' },
        { nombre: 'Postres', texto: 'Flan casero y helado artesanal.' },
      ],
    },
    sobre: {
      titulo: 'Nuestra historia',
      texto: 'Empezamos con un horno en el patio. Hoy cocinamos igual, pero para todo el barrio.',
      puntos: ['Ingredientes de la zona', 'Recetas de familia', 'Opciones sin TACC'],
    },
    extra: { titulo: 'Entrega', items: ['Retiro en el local', 'Envío a domicilio'] },
    contacto: { horario: 'Martes a domingo, 19 a 24', direccion: 'Calle Ejemplo 123, Tu ciudad' },
    mensaje: 'Hola, quiero hacer un pedido.',
  },
  {
    id: 'comercio',
    etiqueta: 'Comercio',
    color: '#1f3a8a',
    negocio: { nombre: 'Tu comercio', inicial: 'T', actividad: 'Indumentaria y accesorios' },
    hero: {
      titulo: 'La temporada nueva ya llegó.',
      bajada: 'Mirá lo nuevo y consultá talles y colores por WhatsApp.',
    },
    servicios: {
      titulo: 'Categorías',
      items: [
        { nombre: 'Mujer', texto: 'Vestidos, jeans y abrigos.' },
        { nombre: 'Hombre', texto: 'Camisas, remeras y buzos.' },
        { nombre: 'Accesorios', texto: 'Carteras, cintos y bijou.' },
      ],
    },
    sobre: {
      titulo: 'El local',
      texto: 'Atendemos en el centro desde hace años. Si no encontrás tu talle, lo pedimos.',
      puntos: ['Cambios sin vueltas', 'Envíos a la zona', 'Novedades cada semana'],
    },
    extra: {
      titulo: 'Medios de pago',
      items: ['Efectivo', 'Transferencia', 'Tarjetas', 'Cuotas sin interés'],
    },
    contacto: {
      horario: 'Lunes a sábado, 9 a 13 y 17 a 21',
      direccion: 'Calle Ejemplo 123, Tu ciudad',
    },
    mensaje: 'Hola, quiero consultar por un producto.',
  },
  {
    id: 'servicios',
    etiqueta: 'Profesional',
    color: '#2f4f3a',
    negocio: { nombre: 'Tu estudio', inicial: 'T', actividad: 'Estudio contable' },
    hero: {
      titulo: 'Tus impuestos al día, sin vueltas.',
      bajada: 'Monotributo, sueldos y sociedades. Te respondemos rápido y en claro.',
    },
    servicios: {
      titulo: 'Servicios',
      items: [
        { nombre: 'Monotributo', texto: 'Alta, recategorización y pagos.' },
        { nombre: 'Sueldos', texto: 'Liquidación y cargas sociales.' },
        { nombre: 'Sociedades', texto: 'Balances y presentaciones.' },
      ],
    },
    sobre: {
      titulo: 'Cómo trabajamos',
      texto: 'Te explicamos cada paso en simple y te avisamos antes de cada vencimiento.',
      puntos: [
        'Atención presencial y online',
        'Recordatorio de vencimientos',
        'Respuesta en el día',
      ],
    },
    extra: {
      titulo: 'Atendemos a',
      items: ['Comercios', 'Profesionales', 'Pymes', 'Particulares'],
    },
    contacto: { horario: 'Lunes a viernes, 8 a 16', direccion: 'Calle Ejemplo 123, Tu ciudad' },
    mensaje: 'Hola, quiero hacer una consulta.',
  },
];

export const DEMO_WEB_UI = {
  titulo: 'Demo de página web',
  descripcion:
    'Así se ve una página web armada por Webya, en el celular y en la computadora, según el rubro.',
  rubro: 'Rubro',
  vista: 'Ver en',
  celular: 'Celular',
  computadora: 'Computadora',
  ladoSitio: 'Así la ven tus clientes',
  nav: { inicio: 'Inicio', servicios: 'Servicios', sobre: 'Nosotros', contacto: 'Contacto' },
  navAria: 'Secciones de la página',
  whatsapp: 'Escribinos por WhatsApp',
  horario: 'Horario',
  direccion: 'Dirección',
  contactoTitulo: 'Contacto',
  pie: (nombre: string) => `${nombre} · Página de ejemplo`,
  aviso: (mensaje: string) => `En tu página, este botón abre WhatsApp con «${mensaje}» ya escrito.`,
  cerrarAviso: 'Entendido',
  dominio: 'tunegocio.com.ar',
  guia: {
    aria: 'Qué probar',
    pasos: [
      {
        titulo: 'Cambiá de rubro',
        texto: 'La misma estructura, con el contenido de cada negocio.',
      },
      { titulo: 'Mirala en la compu', texto: 'Se acomoda sola a cada pantalla.' },
      { titulo: 'Tocá WhatsApp', texto: 'Así te escriben, con el mensaje armado.' },
    ],
  },
} as const;
