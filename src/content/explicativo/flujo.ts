import { PASO_DATOS } from '@/content/empezar/pasos';
import { FLUJO } from '@/content/empezar/wizard-flujo';
import { getModulo } from '@/content/modulos';
import { rubro as gastronomia } from '@/content/rubros/gastronomia';

/**
 * Presentación de /empezar ("Mirá cómo funciona"): las cuatro pantallas del flujo, armándose.
 * Es el guion del video: la animación en código (features/explicativo/escenas-flujo) lo usa como
 * narración y subtítulo, y el archivo de subtítulos del MP4 (public/video/presentacion.es-AR.vtt)
 * sale de este mismo texto (lo verifica features/explicativo/subtitulos.test.ts).
 *
 * Reglas (webya-copy-comercial): voseo, frases cortas, SIN plazos, precios ni cifras. La entrega es
 * manual: lo armamos nosotros, con una persona, y seguimos por WhatsApp. El plazo de la primera
 * respuesta no está confirmado (PENDIENTES.plazoRespuesta): no se nombra.
 * Cada narración dura menos de ~12 s: algunos navegadores cortan las frases largas de la voz.
 */
export const ESCENAS_FLUJO = [
  {
    id: 'rubro',
    capitulo: 'Tu rubro',
    narracion:
      'Primero elegís qué negocio tenés: peluquería, gastronomía, comercio… Un toque y seguís.',
  },
  {
    id: 'datos',
    capitulo: 'Tus datos',
    narracion: 'Después nos contás cómo se llama, tu WhatsApp y, si querés, la ciudad. Nada más.',
  },
  {
    id: 'vista',
    capitulo: 'Así te queda',
    narracion:
      'Y ahí lo ves: tu negocio armado pieza por pieza, con tu nombre. Probás colores y sacás o sumás partes.',
  },
  {
    id: 'whatsapp',
    capitulo: 'Seguimos por WhatsApp',
    narracion:
      '¿Te gusta? Tocás «Quiero esto para mi negocio» y se abre WhatsApp con lo que armaste. Lo armamos nosotros, con vos.',
  },
] as const;

export type EscenaFlujo = (typeof ESCENAS_FLUJO)[number];
export type EscenaFlujoId = EscenaFlujo['id'];

/** Negocio de ejemplo que recorre las escenas (el mismo de los placeholders del formulario). */
const NEGOCIO = 'Lo de Tito';
const plantilla = gastronomia.plantilla!;

/**
 * Texto que aparece DENTRO de las escenas y del poster (SVG de ancho fijo: los textos largos no se
 * cortan solos). Lo que ya existe en el flujo se reutiliza tal cual, para que el video muestre las
 * mismas palabras que la pantalla.
 */
export const TEXTOS_ESCENAS_FLUJO = {
  rubro: {
    titulo: FLUJO.rubro.titulo,
    /** El rubro que se elige en la animación. */
    elegido: { id: gastronomia.id, nombre: gastronomia.nombre },
  },
  datos: {
    titulo: FLUJO.negocio.titulo,
    campos: [
      { etiqueta: PASO_DATOS.campos.nombreNegocio.etiqueta, valor: NEGOCIO },
      { etiqueta: PASO_DATOS.campos.whatsapp.etiqueta, valor: '11 2345 6789' },
      { etiqueta: FLUJO.negocio.campos.ciudad.etiqueta, valor: 'Rosario' },
    ],
    enviar: FLUJO.negocio.enviar,
  },
  vista: {
    negocio: NEGOCIO,
    bajada: plantilla.portada.bajada,
    accion: plantilla.portada.accion.texto,
    /** Primera sección de la plantilla (la carta) y sus platos de ejemplo. */
    seccion: plantilla.secciones[0]!.titulo,
    items:
      plantilla.secciones[0]!.tipo === 'lista'
        ? plantilla.secciones[0]!.items.map((i) => i.nombre)
        : [],
    /** Las piezas que se prenden al costado (nombres del catálogo de módulos). */
    piezas: (['carta_qr', 'pedidos', 'pagos'] as const).map((m) => getModulo(m).nombre),
    colores: FLUJO.resultado.colores.leyenda,
  },
  whatsapp: {
    cta: FLUJO.resultado.cta,
    contacto: 'WebYa',
    /** Lo que la persona encuentra escrito (versión corta del mensaje real). */
    mensaje: ['Hola, WebYa.', `Quiero esto para ${NEGOCIO}.`],
    /** Del otro lado contesta una persona: sin plazos ni promesas. */
    respuesta: ['¡Hola! Buenísimo.', 'Contanos un poco más.'],
  },
} as const;
