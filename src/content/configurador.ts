import type { TipoId } from './servicios';

/**
 * "Armá tu sistema": catálogo del configurador y el mensaje de WhatsApp que arma.
 * Todo vive en el cliente: no hay requests hasta que la persona toca el botón (y el botón es un link).
 */

export interface RubroConfig {
  id: string;
  nombre: string;
  /** A dónde lleva "Ver demo" desde el resumen: la demo interactiva de su rubro o los proyectos. */
  demo: { href: string; texto: string };
}

export const RUBROS_CONFIG: readonly RubroConfig[] = [
  {
    id: 'gastronomia',
    nombre: 'Pizzería o comida',
    demo: { href: '/demos/pedidos', texto: 'Ver demo de pedidos' },
  },
  {
    id: 'comercio',
    nombre: 'Joyería o comercio',
    demo: { href: '/demos/tienda', texto: 'Ver demo de tienda' },
  },
  {
    id: 'salud',
    nombre: 'Salud',
    demo: { href: '/demos/turnos', texto: 'Ver demo de turnos' },
  },
  {
    id: 'estetica',
    nombre: 'Peluquería o estética',
    demo: { href: '/demos/turnos', texto: 'Ver demo de turnos' },
  },
  {
    id: 'mascotas',
    nombre: 'Mascotas',
    demo: { href: '/demos/turnos', texto: 'Ver demo de turnos' },
  },
  {
    id: 'servicios',
    nombre: 'Profesional o servicios',
    demo: { href: '/demos/web', texto: 'Ver demo de página web' },
  },
  {
    id: 'otro',
    nombre: 'Otro',
    demo: { href: '/proyectos', texto: 'Ver proyectos reales' },
  },
];

export interface ModuloConfig {
  id: string;
  nombre: string;
  /** Qué resuelve, en pocas palabras. */
  ayuda: string;
  /** Tipos de sistema donde tiene sentido. */
  aplica: readonly TipoId[];
}

export const MODULOS_CONFIG: readonly ModuloConfig[] = [
  {
    id: 'sena',
    nombre: 'Seña del 50% al reservar',
    ayuda: 'El turno se asegura con el pago.',
    aplica: ['turnero'],
  },
  {
    id: 'profesionales',
    nombre: 'Agenda por profesional',
    ayuda: 'Cada uno con sus horarios.',
    aplica: ['turnero'],
  },
  {
    id: 'carrito',
    nombre: 'Carrito de compras',
    ayuda: 'Arman el pedido completo.',
    aplica: ['tienda', 'pedidos'],
  },
  {
    id: 'franjas',
    nombre: 'Pedidos por franja de 15 minutos',
    ayuda: 'Ponés un tope y la cocina no se satura.',
    aplica: ['pedidos'],
  },
  {
    id: 'comandas',
    nombre: 'Impresión de comandas',
    ayuda: 'El pedido sale impreso solo.',
    aplica: ['pedidos'],
  },
  {
    id: 'mercadopago',
    nombre: 'Pagos con Mercado Pago',
    ayuda: 'Cobrás online, sin efectivo.',
    aplica: ['tienda', 'pedidos', 'turnero', 'medida'],
  },
  {
    id: 'avisos',
    nombre: 'Aviso al celular al instante',
    ayuda: 'Como un mensaje de WhatsApp.',
    aplica: ['pedidos', 'turnero', 'tienda', 'medida'],
  },
  {
    id: 'bot',
    nombre: 'Bot de WhatsApp',
    ayuda: 'Confirma y recuerda por vos.',
    aplica: ['turnero', 'pedidos', 'medida'],
  },
  {
    id: 'panel',
    nombre: 'Panel de administración',
    ayuda: 'Cargás y cambiás todo vos.',
    aplica: ['tienda', 'pedidos', 'turnero', 'catalogo', 'medida'],
  },
  {
    id: 'fotos',
    nombre: 'Fotos desde el celular',
    ayuda: 'Sacás la foto y la subís.',
    aplica: ['tienda', 'catalogo'],
  },
  {
    id: 'stock',
    nombre: 'Control de stock',
    ayuda: 'No vendés lo que no tenés.',
    aplica: ['tienda', 'pedidos', 'catalogo'],
  },
  {
    id: 'promos',
    nombre: 'Promos y descuentos',
    ayuda: 'Las activás cuando querés.',
    aplica: ['tienda', 'pedidos', 'catalogo'],
  },
  {
    id: 'envios',
    nombre: 'Envío a domicilio',
    ayuda: 'Retiro o envío, a elección.',
    aplica: ['tienda', 'pedidos'],
  },
  {
    id: 'consulta',
    nombre: 'Consulta por WhatsApp en cada producto',
    ayuda: 'Te escriben con el producto ya elegido.',
    aplica: ['catalogo', 'tienda'],
  },
  {
    id: 'app',
    nombre: 'Se instala como app',
    ayuda: 'Un ícono más en el celular.',
    aplica: ['pedidos', 'turnero', 'tienda'],
  },
  {
    id: 'google',
    nombre: 'Preparada para Google',
    ayuda: 'Que te encuentren en tu zona.',
    aplica: ['web', 'catalogo', 'tienda'],
  },
  {
    id: 'whatsapp-web',
    nombre: 'Botón de WhatsApp con mensaje armado',
    ayuda: 'Te escriben con un toque.',
    aplica: ['web'],
  },
  {
    id: 'dominio',
    nombre: 'Dominio propio',
    ayuda: 'tunegocio.com.ar',
    aplica: ['web', 'tienda', 'catalogo'],
  },
];

/** Lo que ya viene marcado al elegir el tipo: lo más pedido. La persona lo cambia con un toque. */
export const MODULOS_POR_DEFECTO: Record<TipoId, readonly string[]> = {
  turnero: ['sena', 'avisos', 'profesionales'],
  pedidos: ['carrito', 'franjas', 'panel', 'avisos'],
  tienda: ['carrito', 'panel', 'consulta'],
  catalogo: ['consulta', 'fotos', 'panel'],
  web: ['google', 'whatsapp-web', 'dominio'],
  medida: ['panel'],
};

export const modulosDe = (tipo: TipoId | null) =>
  tipo ? MODULOS_CONFIG.filter((m) => m.aplica.includes(tipo)) : [];

export const CONFIGURADOR = {
  id: 'armar',
  rotulo: 'Armá tu sistema',
  titulo: 'Elegí lo que necesitás. Te respondemos con el presupuesto.',
  bajada: 'Tres pasos, un toque cada uno. Al final se abre WhatsApp con tu pedido ya escrito.',
  pasos: {
    tipo: '¿Qué querés armar?',
    rubro: '¿De qué es tu negocio?',
    modulos: '¿Qué tiene que tener?',
  },
  ayudaModulos: 'Ya marcamos lo más pedido. Tocá para sumar o sacar.',
  otroPlaceholder: 'Contanos en pocas palabras',
  otroEtiqueta: 'Tu rubro',
  nombreEtiqueta: 'Nombre de tu negocio (opcional)',
  nombrePlaceholder: 'Ej.: Pizzería Don Pepe',
  resumen: {
    titulo: 'Tu pedido',
    vacio: 'Elegí qué querés armar y lo vas viendo acá.',
    tipo: 'Sistema',
    rubro: 'Rubro',
    negocio: 'Negocio',
    modulos: 'Incluye',
    sinModulos: 'Sin extras por ahora',
  },
  enviar: 'Enviarnos mi pedido por WhatsApp',
  enviarMail: 'Enviarnos mi pedido por mail',
  falta: 'Elegí qué querés armar para enviarnos el pedido.',
  aclaracion:
    'Se abre WhatsApp con todo escrito. Te respondemos con el presupuesto, sin compromiso.',
  verDemo: 'Ver demo',
  reiniciar: 'Empezar de nuevo',
} as const;

export interface PedidoWhatsApp {
  tipo: string;
  rubro?: string;
  negocio?: string;
  modulos: readonly string[];
}

const limpiar = (t: string) => t.replace(/\s+/g, ' ').trim().slice(0, 80);

/** Mensaje prellenado: en primera persona, corto, con todo lo elegido y una pregunta para seguir. */
export function mensajePedido(p: PedidoWhatsApp): string {
  const negocio = p.negocio ? limpiar(p.negocio) : '';
  const rubro = p.rubro ? limpiar(p.rubro) : '';
  const lineas = [
    'Hola, vengo de webya.dev.',
    `Quiero armar: ${p.tipo}.`,
    negocio && rubro ? `Mi negocio: ${negocio} (${rubro}).` : '',
    negocio && !rubro ? `Mi negocio: ${negocio}.` : '',
    !negocio && rubro ? `Rubro: ${rubro}.` : '',
    p.modulos.length > 0
      ? `Me interesa que tenga:\n${p.modulos.map((m) => `- ${m}`).join('\n')}`
      : '',
    '¿Me cuentan cómo lo armamos y cuánto sale?',
  ];
  return lineas.filter(Boolean).join('\n');
}

/** Contacto general (header, cierre, pie): sin datos elegidos. */
export const MENSAJE_CONTACTO =
  'Hola, vengo de webya.dev. Quiero hablar sobre un sistema para mi negocio.';

export const ASUNTO_MAIL = 'Pedido desde webya.dev';
