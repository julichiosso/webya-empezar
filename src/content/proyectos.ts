import type { TipoId } from './servicios';

/**
 * MANIFIESTO DE PROYECTOS. Único lugar para cambiar textos e imágenes de los casos.
 *
 * Reglas: solo trabajos reales; `incluye` cuenta lo que el sistema hace hoy; nada de cifras ni
 * testimonios inventados. Para reemplazar un placeholder por una captura real: completá `imagenes`
 * con el archivo de /public/proyectos (ver la lista pedida en el reporte final). Mientras una imagen
 * falte, se dibuja el mockup vectorial de `mockup`.
 */

export type EstadoProyecto = 'produccion' | 'construccion' | 'sinUso';

/** Mockups vectoriales disponibles (components/home/mockups). */
export type MockupId = 'pedidos' | 'tienda' | 'web' | 'turnero';

export interface ImagenProyecto {
  src: string;
  ancho: number;
  alto: number;
  alt: string;
}

export interface Testimonio {
  cita: string;
  autor: string;
  cargo: string;
}

export interface Proyecto {
  id: string;
  cliente: string;
  rubro: string;
  ciudad: string;
  tipo: TipoId;
  /** Nombre del sistema, como se vende. */
  sistema: string;
  estado: EstadoProyecto;
  /** Sitio publicado (sin URL, no se muestra enlace). */
  url?: string;
  /** El problema que resuelve el sistema, en una oración. */
  problema: string;
  /** Lo que el sistema hace hoy, punto por punto. */
  incluye: readonly string[];
  /** Lo que se ve funcionando. */
  resultado: string;
  mockup: MockupId;
  /** Capturas reales. La primera es la portada del caso. */
  imagenes: readonly ImagenProyecto[];
  /** Vacío hasta tener uno real y autorizado. */
  testimonio?: Testimonio;
}

export const PROYECTOS: readonly Proyecto[] = [
  {
    id: 'micios',
    cliente: "Micio's Pizzería",
    rubro: 'Pizzería',
    ciudad: 'San Jorge',
    tipo: 'pedidos',
    sistema: 'Sistema de pedidos online',
    estado: 'produccion',
    url: 'https://www.miciospizzas.com.ar',
    problema: 'En el horario pico los pedidos se amontonan y la cocina no da abasto.',
    incluye: [
      'Carrito y pedido desde el celular',
      'Límite de pedidos por franja de 15 minutos',
      'Hora exacta de retiro',
      'Impresión automática de comandas',
      'Panel de administración, horarios y turnos',
      'Se instala como app (PWA)',
    ],
    resultado: 'Funcionando en producción: la pizzería recibe sus pedidos con este sistema.',
    mockup: 'pedidos',
    imagenes: [
      {
        src: '/clientes/micios.webp',
        ancho: 375,
        alto: 2198,
        alt: "Sitio de Micio's Pizzería en el celular: carta con pizzas, bebidas y postres.",
      },
    ],
  },
  {
    id: 'canina',
    cliente: 'Peluquería Canina San Jorge',
    rubro: 'Mascotas',
    ciudad: 'San Jorge',
    tipo: 'turnero',
    sistema: 'Turnero con Mercado Pago',
    estado: 'sinUso',
    problema: 'Turnos reservados que después nadie viene a ocupar.',
    incluye: [
      'Reserva online con pago por Mercado Pago',
      'Agenda para varios profesionales',
      'Horarios configurables',
      'Panel simple para ver el día',
    ],
    resultado: 'Desarrollado para la peluquería; todavía no está en uso. Pedí la demo y lo ves funcionando.',
    mockup: 'turnero',
    imagenes: [],
  },
  {
    id: 'petrucci',
    cliente: 'Joyería Petrucci',
    rubro: 'Joyería',
    ciudad: 'San Jorge',
    tipo: 'tienda',
    sistema: 'Tienda online con panel propio',
    estado: 'produccion',
    url: 'https://www.joyeriapetrucci.com.ar',
    problema: 'Mostrar todo el catálogo sin depender de mandar fotos una por una.',
    incluye: [
      'Catálogo completo por categorías',
      'Panel interno para el dueño',
      'Sube las fotos de los productos desde el celular',
      'Consulta por WhatsApp en cada producto',
    ],
    resultado: 'El dueño carga y actualiza su catálogo solo, desde el celular.',
    mockup: 'tienda',
    imagenes: [
      {
        src: '/clientes/petrucci.webp',
        ancho: 375,
        alto: 4200,
        alt: 'Sitio de Joyería Petrucci en el celular: alianzas, categorías y novedades.',
      },
    ],
  },
  {
    id: 'lorena',
    cliente: 'Lorena Almagro · Fonoaudióloga',
    rubro: 'Salud',
    ciudad: 'San Jorge',
    tipo: 'web',
    sistema: 'Sitio web profesional',
    estado: 'produccion',
    url: 'https://www.fonosanjorge.com.ar',
    problema: 'Que las familias encuentren a la profesional y sepan cómo trabaja antes de llamar.',
    incluye: [
      'Especialidades y talleres',
      'Obras sociales que cubre',
      'Cómo trabaja con cada familia',
      'Consultas por WhatsApp con el mensaje ya armado',
    ],
    resultado: 'Publicado con dominio propio: fonosanjorge.com.ar.',
    mockup: 'web',
    imagenes: [
      {
        src: '/clientes/fonosanjorge.webp',
        ancho: 375,
        alto: 4200,
        alt: 'Sitio de Fonosanjorge en el celular: presentación de la fonoaudióloga y sus especialidades.',
      },
    ],
  },
  {
    id: 'abelardo',
    cliente: 'Abelardo Pizzería',
    rubro: 'Pizzería',
    ciudad: 'San Jorge',
    tipo: 'pedidos',
    sistema: 'Pedidos con stock, promos y envío',
    estado: 'construccion',
    url: 'https://abelardo.vercel.app',
    problema: 'Más productos, más variantes y envíos: todo tiene que cerrar con el stock real.',
    incluye: ['Control de stock', 'Promos', 'Productos personalizables', 'Envío a domicilio'],
    resultado: 'En construcción. Se puede ver el avance.',
    mockup: 'pedidos',
    imagenes: [
      {
        src: '/clientes/abelardo.webp',
        ancho: 375,
        alto: 2178,
        alt: 'Avance del sitio de Abelardo en el celular: promos del día y categorías.',
      },
    ],
  },
];

export const ESTADO_PROYECTO: Record<EstadoProyecto, string> = {
  produccion: 'En producción',
  construccion: 'En construcción',
  sinUso: 'Todavía sin uso',
};

export const getProyecto = (id: string) => PROYECTOS.find((p) => p.id === id);

/** Dominio para mostrar: sin protocolo ni www. */
export const dominioDe = (url: string) => new URL(url).host.replace(/^www\./, '');

/** Testimonios reales: se muestran solo los que existen. Hoy no hay ninguno cargado. */
export const testimonios = (lista: readonly Proyecto[] = PROYECTOS) =>
  lista.flatMap((p) => (p.testimonio ? [{ ...p.testimonio, proyecto: p.cliente }] : []));
