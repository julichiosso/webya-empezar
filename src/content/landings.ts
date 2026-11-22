import type { TipoId } from './servicios';

/**
 * Páginas por producto (/turnero, /pedidos, /tienda, /web). Cada una sigue el mismo orden:
 * dolor → solución → prueba → acción, y dice para qué rubros sirve con el lenguaje de cada uno.
 * Sin keyword stuffing: un título claro y el texto que la persona busca.
 */

export interface Punto {
  /** Rótulo corto del paso (solo el turnero, que se cuenta en pasos). */
  rotulo?: string;
  titulo: string;
  texto: string;
}

export interface Landing {
  ruta: string;
  tipo: TipoId;
  /** Nombre corto (miga de pan, JSON-LD). */
  nombre: string;
  /** Demo del producto. */
  demo: string;
  seo: { titulo: string; descripcion: string };
  hero: { rotulo: string; titulo: readonly string[]; bajada: string };
  bloque: {
    rotulo: string;
    titulo: string;
    /** El turnero no los usa: su dolor es el primer paso. */
    dolor?: string;
    solucion?: string;
    puntos: readonly Punto[];
    prueba: string;
    alt: string;
  };
  paraQuien: { rotulo: string; titulo: string; rubros: readonly Punto[] };
}

export const LANDINGS = {
  turnero: {
    ruta: '/turnero',
    tipo: 'turnero',
    nombre: 'Turnero con seña',
    demo: '/demos/turnos',
    seo: {
      titulo: 'Turnero online con seña para San Jorge y zona',
      descripcion:
        'Turnos online con seña del 50% por Mercado Pago, aviso al celular y bot que recuerda. Para peluquerías, estética, salud y servicios de San Jorge, San Francisco y la zona.',
    },
    hero: {
      rotulo: 'Turnero con seña',
      titulo: ['Turnos con seña.', 'Clientes que vienen.'],
      bajada: 'Reservan, pagan la seña y vos recibís el aviso.',
    },
    bloque: {
      rotulo: 'Cómo funciona',
      titulo: 'El turno que se paga, se cumple.',
      puntos: [
        {
          rotulo: 'El problema',
          titulo: 'Reservan y no vienen.',
          texto: 'Ese hueco ya no lo llenás.',
        },
        { rotulo: 'La seña', titulo: 'Sin seña, no hay turno.', texto: 'Pagan con Mercado Pago.' },
        {
          rotulo: 'El aviso',
          titulo: 'Te enterás al instante.',
          texto: 'Una notificación al celular.',
        },
        { rotulo: 'El bot', titulo: 'Confirma y recuerda.', texto: 'Al cliente, por mensaje.' },
        {
          rotulo: 'La agenda',
          titulo: 'Tu semana, ordenada.',
          texto: 'Por profesional, de un vistazo.',
        },
      ],
      prueba: 'Funcionando en Peluquería Canina San Jorge.',
      alt: 'El turnero en el celular: reserva con seña, aviso al dueño, recordatorio del bot y agenda.',
    },
    paraQuien: {
      rotulo: 'Para quién',
      titulo: 'Para todo negocio con turnos.',
      rubros: [
        { titulo: 'Peluquerías y barberías', texto: '' },
        { titulo: 'Estética y uñas', texto: '' },
        { titulo: 'Salud', texto: '' },
        { titulo: 'Mascotas', texto: '' },
        { titulo: 'Clases y servicios', texto: '' },
      ],
    },
  },
  pedidos: {
    ruta: '/pedidos',
    tipo: 'pedidos',
    nombre: 'Pedidos online',
    demo: '/demos/pedidos',
    seo: {
      titulo: 'Sistema de pedidos online para gastronomía en San Jorge y zona',
      descripcion:
        'Pedidos desde el celular con hora de retiro, tope de pedidos por franja de 15 minutos e impresión de comandas. Para pizzerías, hamburgueserías, heladerías, cafés y delivery. El sistema que usa Micio’s Pizzería en San Jorge.',
    },
    hero: {
      rotulo: 'Pedidos online',
      titulo: ['Pedidos en orden.', 'Hasta un viernes.'],
      bajada: 'Piden del celular, eligen la hora y la comanda sale sola.',
    },
    bloque: {
      rotulo: 'Cómo funciona',
      titulo: 'La cocina, a su ritmo.',
      dolor: 'Sin teléfono que no para ni WhatsApp que explota.',
      solucion: 'Cada cliente arma su pedido y elige a qué hora lo retira.',
      puntos: [
        { titulo: 'Tope por franja', texto: 'Vos decidís cuántos entran.' },
        { titulo: 'Hora de retiro', texto: 'El cliente sabe cuándo pasar.' },
        { titulo: 'Comanda impresa', texto: 'Sale sola.' },
        { titulo: 'Tu panel', texto: 'Precios y horarios desde el celular.' },
      ],
      prueba: "Funcionando en Micio's Pizzería, San Jorge.",
      alt: 'El sistema de pedidos en el celular: carrito, elección de la franja de retiro y comanda impresa.',
    },
    paraQuien: {
      rotulo: 'Para quién',
      titulo: 'Para todo local de comida.',
      rubros: [
        { titulo: 'Pizzerías y rotiserías', texto: '' },
        { titulo: 'Hamburgueserías', texto: '' },
        { titulo: 'Heladerías', texto: '' },
        { titulo: 'Panaderías y cafés', texto: '' },
        { titulo: 'Delivery y kioscos', texto: '' },
      ],
    },
  },
  tienda: {
    ruta: '/tienda',
    tipo: 'tienda',
    nombre: 'Tienda online',
    demo: '/demos/tienda',
    seo: {
      titulo: 'Tienda online y catálogo para comercios de San Jorge y zona',
      descripcion:
        'Tienda o catálogo online con panel propio: cargás productos y fotos desde el celular y cada consulta te llega por WhatsApp. Como la de Joyería Petrucci, en San Jorge.',
    },
    hero: {
      rotulo: 'Tienda online',
      titulo: ['Tu vidriera,', 'abierta siempre.'],
      bajada: 'Tu catálogo con fotos y precios. Las consultas, a tu WhatsApp.',
    },
    bloque: {
      rotulo: 'Cómo funciona',
      titulo: 'Vendé aunque esté cerrado.',
      dolor: 'Basta de mandar fotos una por una.',
      solucion: 'El cliente mira, elige y te consulta o compra.',
      puntos: [
        { titulo: 'Por categorías', texto: 'Ordenado como tu local.' },
        { titulo: 'Fotos del celular', texto: 'Sacás y subís.' },
        { titulo: 'Consulta por WhatsApp', texto: 'Con el producto elegido.' },
        { titulo: 'Tu panel', texto: 'Precios, stock y novedades.' },
      ],
      prueba: 'Funcionando en Joyería Petrucci, San Jorge.',
      alt: 'Sitio de Joyería Petrucci en el celular: alianzas, categorías y novedades.',
    },
    paraQuien: {
      rotulo: 'Para quién',
      titulo: 'Para todo comercio.',
      rubros: [
        { titulo: 'Ropa y calzado', texto: '' },
        { titulo: 'Joyerías y relojerías', texto: '' },
        { titulo: 'Regalerías y bazares', texto: '' },
        { titulo: 'Ferreterías y corralones', texto: '' },
        { titulo: 'Librerías y kioscos', texto: '' },
      ],
    },
  },
  web: {
    ruta: '/web',
    tipo: 'web',
    nombre: 'Página web',
    demo: '/demos/web',
    seo: {
      titulo: 'Página web profesional para negocios de San Jorge y zona',
      descripcion:
        'Páginas web para comercios y profesionales: preparadas para Google, rápidas en el celular y con WhatsApp a un toque. Como el sitio de la fonoaudióloga Lorena Almagro, en San Jorge.',
    },
    hero: {
      rotulo: 'Página web',
      titulo: ['Que te encuentren.', 'Y te elijan.'],
      bajada: 'Rápida, lista para Google y con WhatsApp a un toque.',
    },
    bloque: {
      rotulo: 'Cómo funciona',
      titulo: 'Tu negocio, bien presentado.',
      dolor: 'Que te busquen en Google y aparezcas.',
      solucion: 'Qué hacés, cómo trabajás y cómo llegar. Claro.',
      puntos: [
        { titulo: 'Lista para Google', texto: 'Que te encuentren en tu zona.' },
        { titulo: 'WhatsApp a un toque', texto: 'Con el mensaje armado.' },
        { titulo: 'Rápida', texto: 'Carga al instante en el celular.' },
        { titulo: 'Dominio propio', texto: 'tunegocio.com.ar y tu mail.' },
      ],
      prueba: 'Funcionando en el sitio de Lorena Almagro, San Jorge.',
      alt: 'Sitio de Fonosanjorge en el celular: presentación de la fonoaudióloga y sus especialidades.',
    },
    paraQuien: {
      rotulo: 'Para quién',
      titulo: 'Para verse profesional.',
      rubros: [
        { titulo: 'Salud', texto: '' },
        { titulo: 'Estudios profesionales', texto: '' },
        { titulo: 'Oficios y servicios', texto: '' },
        { titulo: 'Academias y clases', texto: '' },
        { titulo: 'Inmobiliarias', texto: '' },
      ],
    },
  },
} as const satisfies Record<string, Landing>;

/** Bloque "Catálogo digital" de /tienda: la opción sin carrito. */
export const CATALOGO = {
  id: 'catalogo',
  rotulo: 'Catálogo digital',
  titulo: '¿Sin carrito?',
  texto: 'Catálogo con fotos y precios. Las consultas, a tu WhatsApp.',
} as const;

/**
 * Vidriera del hero de cada página de producto: los trabajos hechos, con el del producto primero. Las
 * capturas salen del manifiesto de proyectos; el aviso del turnero es la captura real de la notificación.
 */
export const VIDRIERA = {
  etiqueta: 'Trabajos hechos',
  /** Ids del manifiesto en el orden en que se muestran, por producto (los que están en construcción no). */
  orden: {
    turnero: ['canina', 'micios', 'petrucci', 'lorena'],
    pedidos: ['micios', 'canina', 'petrucci', 'lorena'],
    tienda: ['petrucci', 'micios', 'lorena', 'canina'],
    web: ['lorena', 'petrucci', 'micios', 'canina'],
  },
} as const;
