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
      bajada:
        'El cliente reserva y paga la seña con Mercado Pago. A vos te llega el aviso al celular y al cliente, un recordatorio del turno.',
    },
    bloque: {
      rotulo: 'Cómo funciona',
      titulo: 'El turno que se paga, se cumple.',
      puntos: [
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
            'Apenas entra una reserva te llega una notificación al celular, como un mensaje de WhatsApp.',
        },
        {
          rotulo: 'El bot',
          titulo: 'Confirma y recuerda por vos.',
          texto:
            'Al cliente le llega un mensaje que confirma la reserva y otro que le recuerda el turno.',
        },
        {
          rotulo: 'La agenda',
          titulo: 'Tu semana, ordenada.',
          texto: 'Agenda por profesional, horarios que configurás vos y el día de un vistazo.',
        },
      ],
      prueba:
        'Es el sistema que armamos para Peluquería Canina San Jorge. Probalo en la demo, con datos de ejemplo.',
      alt: 'El turnero en el celular: reserva con seña, aviso al dueño, recordatorio del bot y agenda.',
    },
    paraQuien: {
      rotulo: 'Para quién',
      titulo: 'Para cualquier negocio que trabaje con turnos.',
      rubros: [
        {
          titulo: 'Peluquerías y barberías',
          texto: 'Cortes, color y barba, cada uno con su profesional.',
        },
        { titulo: 'Estética y uñas', texto: 'Tratamientos largos que no podés perder.' },
        { titulo: 'Salud', texto: 'Consultorios, kinesiología, nutrición y psicología.' },
        { titulo: 'Mascotas', texto: 'Baño y corte con horario asegurado.' },
        { titulo: 'Clases y servicios', texto: 'Academias, talleres y profesionales.' },
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
      rotulo: 'Pedidos online para gastronomía',
      titulo: ['Pedidos ordenados,', 'aunque sea viernes a la noche.'],
      bajada:
        'Tus clientes piden desde el celular y eligen la hora de retiro. Vos decidís cuántos pedidos entran por franja y la comanda sale impresa sola.',
    },
    bloque: {
      rotulo: 'Cómo funciona',
      titulo: 'La cocina trabaja a su ritmo.',
      dolor:
        'El teléfono no para, WhatsApp explota y la cocina no da abasto. Se pierden pedidos y se equivocan otros.',
      solucion:
        'Cada cliente arma su pedido desde el celular y elige a qué hora lo retira. Vos ponés cuántos pedidos entran por franja.',
      puntos: [
        { titulo: 'Franjas de 15 minutos', texto: 'Ponés un tope de pedidos por franja.' },
        { titulo: 'Hora exacta de retiro', texto: 'El cliente sabe cuándo pasar.' },
        { titulo: 'Comanda impresa', texto: 'El pedido sale por la impresora solo.' },
        { titulo: 'Panel del dueño', texto: 'Productos, precios y horarios desde el celular.' },
      ],
      prueba: "Así funciona hoy en Micio's Pizzería, en San Jorge.",
      alt: 'El sistema de pedidos en el celular: carrito, elección de la franja de retiro y comanda impresa.',
    },
    paraQuien: {
      rotulo: 'Para quién',
      titulo: 'Para cualquier local que despacha comida.',
      rubros: [
        { titulo: 'Pizzerías y rotiserías', texto: 'Picos de viernes y sábado, sin caos.' },
        { titulo: 'Hamburgueserías', texto: 'Combos, extras y aderezos a elección.' },
        { titulo: 'Heladerías', texto: 'Gustos y tamaños sin errores al tomar el pedido.' },
        { titulo: 'Panaderías y cafés', texto: 'Encargos para retirar a la hora justa.' },
        { titulo: 'Delivery y kioscos', texto: 'Envío o retiro, como prefiera el cliente.' },
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
      rotulo: 'Tienda online y catálogo',
      titulo: ['Tu vidriera,', 'abierta todo el día.'],
      bajada:
        'Todo tu catálogo con fotos y precios. Lo actualizás desde el celular y cada consulta te llega por WhatsApp con el producto ya elegido.',
    },
    bloque: {
      rotulo: 'Cómo funciona',
      titulo: 'Vendés aunque el local esté cerrado.',
      dolor:
        'Mandar fotos una por una por WhatsApp, contestar siempre lo mismo y no saber qué queda en stock.',
      solucion:
        'Con tu tienda el catálogo está siempre a mano: el cliente mira, elige y te consulta o compra.',
      puntos: [
        { titulo: 'Catálogo por categorías', texto: 'Ordenado como tu local.' },
        { titulo: 'Fotos desde el celular', texto: 'Sacás la foto y la subís.' },
        { titulo: 'Consulta por WhatsApp', texto: 'Con el producto ya elegido.' },
        { titulo: 'Panel propio', texto: 'Precios, stock y novedades.' },
      ],
      prueba: 'Así trabaja hoy Joyería Petrucci, en San Jorge.',
      alt: 'Sitio de Joyería Petrucci en el celular: alianzas, categorías y novedades.',
    },
    paraQuien: {
      rotulo: 'Para quién',
      titulo: 'Para cualquier comercio con productos para mostrar.',
      rubros: [
        { titulo: 'Ropa y calzado', texto: 'Talles, colores y novedades de temporada.' },
        { titulo: 'Joyerías y relojerías', texto: 'Piezas con buenas fotos y consulta directa.' },
        { titulo: 'Regalerías y bazares', texto: 'Mucho producto, ordenado por categoría.' },
        {
          titulo: 'Ferreterías y corralones',
          texto: 'Precios a la vista, menos consultas repetidas.',
        },
        { titulo: 'Librerías y kioscos', texto: 'Listas escolares y encargos por WhatsApp.' },
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
      rotulo: 'Página web profesional',
      titulo: ['Que te encuentren', 'y te elijan.'],
      bajada:
        'Una página clara, rápida en el celular y preparada para Google, con WhatsApp a un toque para que te escriban.',
    },
    bloque: {
      rotulo: 'Cómo funciona',
      titulo: 'Tu negocio, bien presentado.',
      dolor:
        'Te buscan en Google y no aparecés, o aparece un perfil viejo con un teléfono que ya no usás.',
      solucion:
        'Armamos tu página con lo que el cliente necesita saber antes de escribirte: qué hacés, cómo trabajás y cómo llegar.',
      puntos: [
        { titulo: 'Preparada para Google', texto: 'Para que te encuentren en tu zona.' },
        { titulo: 'WhatsApp a un toque', texto: 'Con el mensaje ya armado.' },
        { titulo: 'Rápida en el celular', texto: 'Carga al instante, aun con mala señal.' },
        { titulo: 'Dirección propia', texto: 'tunegocio.com.ar, con tu mail.' },
      ],
      prueba: 'Así es el sitio de Lorena Almagro, fonoaudióloga en San Jorge.',
      alt: 'Sitio de Fonosanjorge en el celular: presentación de la fonoaudióloga y sus especialidades.',
    },
    paraQuien: {
      rotulo: 'Para quién',
      titulo: 'Para profesionales y negocios que quieren verse serios.',
      rubros: [
        { titulo: 'Salud', texto: 'Especialidades, obras sociales y cómo atendés.' },
        { titulo: 'Estudios profesionales', texto: 'Contadores, abogados, arquitectos.' },
        { titulo: 'Oficios y servicios', texto: 'Electricistas, talleres, fletes.' },
        { titulo: 'Academias y clases', texto: 'Cursos, horarios e inscripción.' },
        { titulo: 'Inmobiliarias', texto: 'Propiedades con fotos y consulta directa.' },
      ],
    },
  },
} as const satisfies Record<string, Landing>;

/** Bloque "Catálogo digital" de /tienda: la opción sin carrito. */
export const CATALOGO = {
  id: 'catalogo',
  rotulo: 'Catálogo digital',
  titulo: '¿No necesitás carrito?',
  texto:
    'El catálogo muestra tus productos con fotos y precios, y cada consulta te llega directo a tu WhatsApp. Es la forma más simple de empezar.',
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
