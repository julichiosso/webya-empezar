import type { TipoId } from '../servicios';
/**
 * Página para elegir demo (/demos) y la barra común de las demos. Lo que dice "el sistema real, además"
 * sale de los sistemas entregados (Micio's y el turnero): no se agrega nada que no exista.
 */

export const HUB_DEMOS = {
  titulo: 'Probá un sistema',
  bajada: 'Elegí cuál. Se abre como el sistema de verdad, con datos de ejemplo.',
  volver: 'Volver al sitio',
  abrir: 'Ver demo',
  rubros: 'O elegí tu rubro',
  nota: 'Cada demo muestra una parte del sistema. El que se instala en tu negocio tiene más funciones y se ajusta a cómo trabajás.',
  seo: {
    titulo: 'Demos de sistemas para negocios',
    descripcion:
      'Probá el sistema de pedidos para gastronomía, el turnero con seña, una página web y una tienda armada en vivo, con datos de ejemplo.',
  },
} as const;

export interface DemoInfo {
  id: 'pedidos' | 'turnos' | 'web' | 'tienda';
  /** El tipo de sistema que muestra (los proyectos sin sitio publicado enlazan a su demo). */
  sistema: TipoId;
  href: string;
  rubro: string;
  titulo: string;
  texto: string;
  /** Nombre corto para la barra de la demo. */
  barra: string;
  /** Proyecto real (manifiesto de proyectos) que ya usa este sistema, si hay uno en producción. */
  enUso?: string;
  ademas: readonly string[];
  cta: { href: string; texto: string };
}

export const DEMOS: readonly DemoInfo[] = [
  {
    id: 'pedidos',
    sistema: 'pedidos',
    href: '/demos/pedidos',
    rubro: 'Gastronomía',
    titulo: 'Pedidos online',
    texto:
      'El cliente arma el pedido desde el celular, elige a qué hora lo retira y el pedido entra al panel del local.',
    barra: 'Pedidos',
    enUso: 'micios',
    ademas: [
      'Historial de pedidos por día y por mes',
      'Ventas, cantidad de pedidos y ticket promedio',
      'Carga de productos con foto desde el celular',
      'Aumento de precios de una sección en un paso',
      'Se instala en el celular como una app',
    ],
    cta: { href: '/armar?tipo=pedidos&rubro=gastronomia', texto: 'Quiero este sistema' },
  },
  {
    id: 'turnos',
    sistema: 'turnero',
    href: '/demos/turnos',
    rubro: 'Peluquería, estética y salud',
    titulo: 'Turnos con seña',
    texto: 'El cliente elige servicio, día y hora, paga la seña y el turno entra solo a tu agenda.',
    barra: 'Turnos',
    ademas: [
      'Cobra la seña de verdad con Mercado Pago y la acredita sola',
      'Te avisa al celular cada reserva, aunque tengas la app cerrada',
      'Le recuerda el turno al cliente por correo y en su celular',
      'Respuestas automáticas por WhatsApp que reservan y cobran la seña',
      'Te muestra quién faltó antes y cuántas veces',
      'Números: facturación, ocupación por hora y clientes para recuperar',
    ],
    cta: { href: '/armar?tipo=turnero&rubro=estetica', texto: 'Quiero este sistema' },
  },
  {
    id: 'web',
    sistema: 'web',
    href: '/demos/web',
    rubro: 'Profesionales, salud y comercios',
    titulo: 'Página web',
    texto:
      'La misma página para cada rubro: cambiá de negocio, mirala en el celular y en la compu y tocá WhatsApp.',
    barra: 'Página web',
    enUso: 'lorena',
    ademas: [
      'Dirección web propia y mail con el nombre de tu negocio',
      'Preparada para aparecer en Google en tu zona',
      'Textos y fotos de tu negocio, escritos con vos',
      'Formulario o WhatsApp con el mensaje armado',
      'Cambios simples cuando los necesites',
    ],
    cta: { href: '/armar?tipo=web', texto: 'Quiero este sistema' },
  },
  {
    id: 'tienda',
    sistema: 'tienda',
    href: '/demos/tienda',
    rubro: 'Comercios y tiendas',
    titulo: 'Tienda en vivo',
    texto: 'Poné tu nombre, tus colores y tres productos, y mirá tu tienda armada al instante.',
    barra: 'Tienda online',
    enUso: 'petrucci',
    ademas: [
      'Catálogo completo por categorías, sin límite de productos',
      'Panel para cargar productos y fotos desde el celular',
      'Pagos con Mercado Pago o pedido por WhatsApp',
      'Stock, promos y envíos',
      'Dirección web propia y preparada para Google',
    ],
    cta: { href: '/armar?tipo=tienda', texto: 'Quiero este sistema' },
  },
];

export const getDemo = (id: DemoInfo['id']) => DEMOS.find((d) => d.id === id)!;

export const BARRA_DEMOS = {
  marca: 'Demo',
  info: 'Qué más hace',
  infoAria: 'Qué más hace el sistema real',
  reiniciar: 'Reiniciar la demo',
  escribinos: 'Escribinos',
  escribinosAria: 'Escribinos por WhatsApp, se abre en otra pestaña',
  mensaje: (sistema: string) =>
    `Hola, vengo de webya.dev. Probé la demo de ${sistema.toLowerCase()} y quiero algo así para mi negocio.`,
  salir: 'Demos',
  salirAria: 'Volver a la lista de demos',
  enUso: {
    titulo: (cliente: string) => `Conocé cómo ya lo usa ${cliente}`,
    detalle: (rubro: string, ciudad: string) => `${rubro} en ${ciudad}. En producción.`,
  },
  aviso: {
    titulo: 'Esto es una demo',
    texto:
      'Muestra una parte del sistema con datos de ejemplo. Podés tocar todo: no se envía nada.',
    ademas: 'El sistema real, además:',
    cerrar: 'Ir a la demo',
  },
} as const;
