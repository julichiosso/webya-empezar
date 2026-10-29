/**
 * Guion del video explicativo ("Mirá cómo funciona"). Cada escena es una pieza con su animación
 * (features/explicativo/escenas) y lo que dice la voz, que también se muestra como subtítulo.
 *
 * Reglas (skill webya-brand): voseo, frases cortas, CERO promesas que el producto no cumpla. La
 * entrega es manual (lo armamos nosotros); lo único con plazo es el primer contacto (< 24 hs).
 * Cada narración dura menos de ~12 s: algunos navegadores cortan las frases largas de la voz.
 */
export const ESCENAS_EXPLICATIVO = [
  {
    id: 'problema',
    capitulo: 'El problema',
    narracion:
      '¿Te pasa? Pedidos por WhatsApp, anotados en un papel, y en la hora pico se te escapa alguno.',
  },
  {
    id: 'encastre',
    capitulo: 'Armalo a tu medida',
    narracion:
      'Con WebYa armás el sistema de tu negocio pieza por pieza: elegís tu rubro y activás solo lo que necesitás.',
  },
  {
    id: 'carta',
    capitulo: 'Tu carta',
    narracion:
      'Tus clientes ven tu carta en el celular, desde el QR de la mesa o tu link. Buscan, eligen y arman su pedido.',
  },
  {
    id: 'pedido',
    capitulo: 'El pedido',
    narracion:
      'Confirman en segundos: para retirar, para comer en el local o con envío. Y pagan como vos elijas.',
  },
  {
    id: 'panel',
    capitulo: 'Tu panel',
    narracion:
      'Del otro lado, vos ves cada pedido llegar al instante y en orden: nuevo, preparando, listo.',
  },
  {
    id: 'seguimiento',
    capitulo: 'Seguimiento',
    narracion:
      'Tu cliente sigue su pedido en vivo. Menos mensajes de “¿falta mucho?” y menos errores.',
  },
  {
    id: 'marca',
    capitulo: 'Tu marca',
    narracion: 'Todo con tu nombre, tus colores y tu carta. No es una plantilla más: es tu local.',
  },
  {
    id: 'nosotros',
    capitulo: 'Lo armamos con vos',
    narracion: 'No tenés que saber de tecnología: lo armamos nosotros y lo ponemos online con vos.',
  },
  {
    id: 'cta',
    capitulo: 'Empezá',
    narracion:
      'Probá la demo ahora mismo, o dejanos tus datos y te escribimos en menos de veinticuatro horas.',
  },
] as const;

export type EscenaExplicativo = (typeof ESCENAS_EXPLICATIVO)[number];
export type EscenaId = EscenaExplicativo['id'];

/**
 * Caso real para mostrar en el video (p. ej. el sistema de una pizzería que ya armaron).
 * TODO: completarlo SOLO con permiso escrito del negocio; mientras sea null no se muestra nada.
 */
export const CASO_REAL: { nombre: string; url: string } | null = null;
