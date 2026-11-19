import type { TipoId } from './servicios';

/**
 * "Armá tu sistema": catálogo del configurador y el mensaje de WhatsApp que arma.
 * Todo vive en el cliente: no hay requests hasta que la persona toca el botón (y el botón es un link).
 */

export interface RubroConfig {
  id: string;
  nombre: string;
  /** A dónde lleva "Ver demo de mi rubro": un proyecto real (#proyecto-id) o la demo interactiva. */
  demo: { href: string; texto: string };
}

export const RUBROS_CONFIG: readonly RubroConfig[] = [
  {
    id: 'gastronomia',
    nombre: 'Pizzería o comida',
    demo: { href: '/demo/pedidos', texto: 'Probá la demo de pedidos' },
  },
  {
    id: 'comercio',
    nombre: 'Joyería o comercio',
    demo: { href: '/#proyecto-petrucci', texto: 'Mirá la tienda de Joyería Petrucci' },
  },
  {
    id: 'salud',
    nombre: 'Salud',
    demo: { href: '/#proyecto-lorena', texto: 'Mirá el sitio de una fonoaudióloga' },
  },
  {
    id: 'estetica',
    nombre: 'Peluquería o estética',
    demo: { href: '/demo/peluqueria', texto: 'Probá la demo del turnero' },
  },
  {
    id: 'mascotas',
    nombre: 'Mascotas',
    demo: { href: '/demo/peluqueria', texto: 'Probá la demo del turnero' },
  },
  {
    id: 'servicios',
    nombre: 'Profesional o servicios',
    demo: { href: '/#proyecto-lorena', texto: 'Mirá el sitio de una profesional' },
  },
  {
    id: 'otro',
    nombre: 'Otro',
    demo: { href: '/#proyectos', texto: 'Mirá los proyectos reales' },
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
  titulo: 'Elegí lo que necesitás. Le llega a Julián con un toque.',
  bajada:
    'Tres pasos, sin formularios. Al final se abre WhatsApp con tu pedido ya escrito: lo mandás y listo.',
  pasos: {
    tipo: '¿Qué querés armar?',
    rubro: '¿De qué es tu negocio?',
    modulos: '¿Qué tiene que tener?',
  },
  ayudaModulos: 'Ya marcamos lo más pedido. Tocá para sumar o sacar.',
  otroPlaceholder: 'Contame en pocas palabras',
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
  enviar: 'Mandarle mi pedido a Julián por WhatsApp',
  enviarMail: 'Mandarle mi pedido a Julián por mail',
  falta: 'Elegí qué querés armar para mandar el pedido.',
  aclaracion:
    'No se crea nada solo: es el pedido que le llega a Julián. Lo arman juntos y te pasa el presupuesto sin compromiso.',
  verDemo: 'Ver demo de mi rubro',
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
    'Hola Julián, vengo de webya.dev.',
    `Quiero armar: ${p.tipo}.`,
    negocio && rubro ? `Mi negocio: ${negocio} (${rubro}).` : '',
    negocio && !rubro ? `Mi negocio: ${negocio}.` : '',
    !negocio && rubro ? `Rubro: ${rubro}.` : '',
    p.modulos.length > 0
      ? `Me interesa que tenga:\n${p.modulos.map((m) => `- ${m}`).join('\n')}`
      : '',
    '¿Me contás cómo lo armamos y cuánto sale?',
  ];
  return lineas.filter(Boolean).join('\n');
}

/** Contacto general (header, cierre, pie): sin datos elegidos. */
export const MENSAJE_CONTACTO =
  'Hola Julián, vengo de webya.dev. Quiero hablar sobre un sistema para mi negocio.';

export const ASUNTO_MAIL = 'Pedido desde webya.dev';
