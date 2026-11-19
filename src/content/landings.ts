import { FAQ_HOME } from './home';
import type { TipoId } from './servicios';

/**
 * Páginas por servicio (/turnero, /pizzerias, /tiendas): mismo sistema, mensaje enfocado en una
 * búsqueda local concreta. Sin keyword stuffing: un título claro y el texto que la persona busca.
 */

export interface Landing {
  ruta: string;
  tipo: TipoId;
  /** Nombre corto para la miga de pan. */
  nombre: string;
  seo: { titulo: string; descripcion: string };
  hero: { rotulo: string; titulo: readonly string[]; bajada: string };
  preguntas: readonly { pregunta: string; respuesta: string }[];
}

const faq = (...indices: number[]) => indices.map((i) => FAQ_HOME[i]!);

export const LANDINGS = {
  turnero: {
    ruta: '/turnero',
    tipo: 'turnero',
    nombre: 'Turnero con seña',
    seo: {
      titulo: 'Turnero online con seña para San Jorge y zona',
      descripcion:
        'Turnos online con seña del 50% por Mercado Pago, aviso al celular y bot que recuerda. Para peluquerías, estética, salud y mascotas de San Jorge y zona.',
    },
    hero: {
      rotulo: 'Turnero con seña · San Jorge y zona',
      titulo: ['Turnos con seña.', 'Clientes que vienen.'],
      bajada:
        'El cliente reserva y paga la seña con Mercado Pago. Vos recibís el aviso al instante y el bot le recuerda el turno. Se acabaron los huecos en la agenda.',
    },
    preguntas: faq(3, 0, 2, 4),
  },
  pizzerias: {
    ruta: '/pizzerias',
    tipo: 'pedidos',
    nombre: 'Pedidos para pizzerías',
    seo: {
      titulo: 'Sistema de pedidos online para pizzerías en San Jorge',
      descripcion:
        'Pedidos desde el celular con horario de retiro, tope de pedidos por franja de 15 minutos e impresión de comandas. El sistema que usa Micio’s Pizzería en San Jorge.',
    },
    hero: {
      rotulo: 'Pedidos para pizzerías · San Jorge y zona',
      titulo: ['Tu pizzería,', 'con pedidos ordenados.'],
      bajada:
        'Tus clientes piden desde el celular y eligen la hora de retiro. Vos decidís cuántos pedidos entran por franja y la comanda sale impresa sola.',
    },
    preguntas: faq(0, 1, 2, 4),
  },
  tiendas: {
    ruta: '/tiendas',
    tipo: 'tienda',
    nombre: 'Tiendas online',
    seo: {
      titulo: 'Tienda online para comercios de San Jorge y zona',
      descripcion:
        'Tienda o catálogo online con panel propio: cargás productos y fotos desde el celular y cada consulta te llega por WhatsApp. Como la de Joyería Petrucci.',
    },
    hero: {
      rotulo: 'Tiendas online · San Jorge y zona',
      titulo: ['Tu tienda online,', 'manejada desde el celular.'],
      bajada:
        'Todo tu catálogo con fotos y precios. Cargás productos desde el celular y cada consulta te llega por WhatsApp con el producto ya elegido.',
    },
    preguntas: faq(0, 1, 2, 5),
  },
} as const satisfies Record<string, Landing>;

/** Bloque propio de /tiendas (las otras dos reutilizan las secciones de la home). */
export const TIENDA = {
  rotulo: 'Tienda online',
  titulo: 'Tu vidriera abierta todo el día.',
  dolor:
    'Mandar fotos una por una por WhatsApp, contestar siempre lo mismo, no saber qué queda en stock.',
  solucion:
    'Con tu tienda online el catálogo está siempre a mano: el cliente mira, elige y te consulta o compra. Vos lo actualizás desde el celular, en un minuto.',
  puntos: [
    { titulo: 'Catálogo por categorías', texto: 'Ordenado como tu local.' },
    { titulo: 'Fotos desde el celular', texto: 'Sacás la foto y la subís.' },
    { titulo: 'Consulta por WhatsApp', texto: 'Con el producto ya elegido.' },
    { titulo: 'Panel propio', texto: 'Precios, stock y novedades.' },
  ],
  prueba: 'Así trabaja hoy Joyería Petrucci, en San Jorge.',
  cta: 'Armá tu tienda',
  alt: 'Ejemplo de una tienda online en el celular: categorías y productos con botón de consulta.',
} as const;
