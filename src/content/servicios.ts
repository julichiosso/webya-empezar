/**
 * Lo que se puede armar con Webya. Una sola fuente para el bento, el configurador, las páginas por
 * servicio y el JSON-LD (`Service`). Cada frase describe lo que el sistema hace, sin prometer cifras.
 */

export type TipoId = 'tienda' | 'pedidos' | 'turnero' | 'catalogo' | 'web' | 'medida';

export interface Servicio {
  id: TipoId;
  nombre: string;
  /** Una línea: el beneficio concreto. */
  frase: string;
  /** Para SEO y JSON-LD: qué es, en una oración. */
  descripcionSeo: string;
  /** Página propia, si la tiene. */
  pagina?: string;
}

export const SERVICIOS: readonly Servicio[] = [
  {
    id: 'turnero',
    nombre: 'Turnero con seña',
    frase: 'Reservan, pagan la seña y el turno queda asegurado. Te avisa al celular al instante.',
    descripcionSeo:
      'Sistema de turnos online con seña por Mercado Pago, agenda por profesional y aviso al celular del dueño.',
    pagina: '/turnero',
  },
  {
    id: 'pedidos',
    nombre: 'Pedidos online',
    frase: 'Piden desde el celular, eligen la hora de retiro y el pedido te llega ordenado.',
    descripcionSeo:
      'Pedidos online para gastronomía (pizzerías, hamburgueserías, heladerías, cafés y delivery): carrito, franjas de retiro, panel e impresión de comandas.',
    pagina: '/pedidos',
  },
  {
    id: 'tienda',
    nombre: 'Tienda online',
    frase: 'Tu catálogo con carrito y pagos. Vendés aunque el local esté cerrado.',
    descripcionSeo:
      'Tienda online con catálogo, carrito, panel para cargar productos desde el celular y consulta por WhatsApp.',
    pagina: '/tienda',
  },
  {
    id: 'catalogo',
    nombre: 'Catálogo digital',
    frase: 'Tus productos con fotos y precios, y cada consulta llega directo a tu WhatsApp.',
    descripcionSeo:
      'Catálogo digital con fotos, categorías y consulta por WhatsApp en cada producto.',
    pagina: '/tienda#catalogo',
  },
  {
    id: 'web',
    nombre: 'Página web',
    frase: 'Tu negocio en Google: quién sos, qué hacés y cómo te contactan.',
    descripcionSeo:
      'Página web profesional para comercios y profesionales, preparada para aparecer en búsquedas locales.',
    pagina: '/web',
  },
  {
    id: 'medida',
    nombre: 'Sistema a medida',
    frase: '¿Hay algo que hoy hacés a mano? Lo pensamos con vos y lo armamos.',
    descripcionSeo:
      'Desarrollo de sistemas a medida para negocios: paneles, automatizaciones e integraciones.',
  },
];

export const getServicio = (id: string) => SERVICIOS.find((s) => s.id === id);
