/**
 * Página para elegir demo (/demo) y la barra común de las demos. Lo que dice "el sistema real, además"
 * sale de los sistemas entregados (Micio's y el turnero): no se agrega nada que no exista.
 */

export const HUB_DEMOS = {
  titulo: 'Probá un sistema',
  bajada: 'Elegí cuál. Se abre como el sistema de verdad, con datos de ejemplo.',
  volver: 'Volver al sitio',
  abrir: 'Abrir demo',
  nota: 'Cada demo muestra una parte del sistema. El que se instala en tu negocio tiene más funciones y se ajusta a cómo trabajás.',
  seo: {
    titulo: 'Demos de sistemas para negocios',
    descripcion:
      'Probá el sistema de pedidos para pizzerías y el de turnos para peluquerías, con datos de ejemplo.',
  },
} as const;

export interface DemoInfo {
  id: 'pedidos' | 'turnos';
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
    href: '/demo/pedidos',
    rubro: 'Pizzerías y comida',
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
    cta: { href: '/pizzerias#armar', texto: 'Quiero esto para mi negocio' },
  },
  {
    id: 'turnos',
    href: '/demo/turnos',
    rubro: 'Peluquerías y estética',
    titulo: 'Turnos con seña',
    texto:
      'El cliente elige servicio, día y hora, paga la seña y el turno entra solo a tu agenda.',
    barra: 'Turnos',
    ademas: [
      'Cobra la seña de verdad con Mercado Pago y la acredita sola',
      'Te avisa al celular cada reserva, aunque tengas la app cerrada',
      'Le recuerda el turno al cliente por correo y en su celular',
      'Bot de WhatsApp que reserva y cobra la seña',
      'Te muestra quién faltó antes y cuántas veces',
      'Números: facturación, ocupación por hora y clientes para recuperar',
    ],
    cta: { href: '/turnero#armar', texto: 'Quiero esto para mi negocio' },
  },
];

export const getDemo = (id: DemoInfo['id']) => DEMOS.find((d) => d.id === id)!;

export const BARRA_DEMOS = {
  marca: 'Demo',
  info: 'Qué más hace',
  infoAria: 'Qué más hace el sistema real',
  reiniciar: 'Reiniciar la demo',
  salir: 'Demos',
  salirAria: 'Volver a la lista de demos',
  enUso: {
    titulo: (cliente: string) => `Conocé cómo ya lo usa ${cliente}`,
    detalle: (rubro: string, ciudad: string) => `${rubro} en ${ciudad}. En producción.`,
    externo: ' (se abre en otra pestaña)',
  },
  aviso: {
    titulo: 'Esto es una demo',
    texto:
      'Muestra una parte del sistema con datos de ejemplo. Podés tocar todo: no se envía nada.',
    ademas: 'El sistema real, además:',
    cerrar: 'Ir a la demo',
  },
} as const;
