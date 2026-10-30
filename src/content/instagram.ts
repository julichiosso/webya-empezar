import { PENDIENTES } from '@/content/pendientes';

/**
 * Instagram de WebYa (@webya.dev): la bio y una caption lista para publicar por cada pilar de contenido.
 * No lo consume ningún componente: se copia y se pega en la app. Reglas en docs/copy-guia.md (sección
 * Instagram) y en webya-copy-comercial. Sin emojis, sin signos de exclamación, sin cifras ni plazos.
 */

/** Bio del perfil. Instagram corta en 150 caracteres; el link va además en su campo propio. */
export const BIO_INSTAGRAM = {
  texto:
    'Todo lo digital para tu negocio. Y si no está, lo armamos a medida. Te escribe una persona, por WhatsApp. Armá el tuyo: webya.ar/empezar',
  /** Campo "Enlace" del perfil. Sin UTM: si no hay origen, el lead queda como "instagram". */
  link: 'https://webya.ar/empezar',
} as const;

export type PilarInstagram =
  'todo_lo_digital' | 'demo_gastronomia' | 'turnos' | 'a_medida' | 'confianza';

export interface CaptionInstagram {
  pilar: PilarInstagram;
  /** Primera línea: lo único que se ve antes del "más". Hasta 8 palabras. */
  gancho: string;
  /** Una o dos líneas cortas. */
  cuerpo: readonly string[];
  /** Un solo pedido, siempre hacia el link de la bio. */
  cta: string;
  /** Entre 3 y 5, sin tildes (Instagram las separa de la versión sin tilde). */
  hashtags: readonly string[];
  /** Qué hay que confirmar antes de publicarla. No se publica. */
  antesDePublicar?: string;
}

/** Arma el texto tal cual se pega en Instagram. */
export const textoCaption = (c: CaptionInstagram) =>
  [c.gancho, '', ...c.cuerpo, '', c.cta, '', c.hashtags.join(' ')].join('\n');

const CAPTIONS: readonly CaptionInstagram[] = [
  {
    pilar: 'todo_lo_digital',
    gancho: 'Todo lo digital para tu negocio.',
    cuerpo: [
      'Tienda, turnos, carta con QR, pedidos y pagos. Activás solo lo que usás.',
      'Y si lo tuyo no está en la lista, lo armamos a medida con vos.',
    ],
    cta: 'Elegí tus piezas desde el link de la bio.',
    hashtags: ['#NegocioLocal', '#Emprendedores', '#Pymes', '#WebYa'],
  },
  {
    pilar: 'demo_gastronomia',
    gancho: 'Pedí como cliente y miralo llegar.',
    cuerpo: [
      'Abrí la demo en el celular, pedí algo de la carta y mirá cómo le entra al dueño en el panel.',
      'Es una demo con datos de ejemplo: no se cobra ni se envía nada.',
    ],
    cta: 'Probala desde el link de la bio, en "Probar la demo".',
    hashtags: ['#Gastronomia', '#CartaQR', '#Pizzeria', '#Resto', '#WebYa'],
  },
  {
    pilar: 'turnos',
    gancho: 'Que tus clientes reserven solos.',
    cuerpo: [
      'Eligen día y horario desde el celular, y vos ves la agenda ordenada.',
      'Dejás de pasar turnos por WhatsApp a las once de la noche.',
    ],
    cta: 'Contanos cómo te organizás hoy: link en la bio.',
    hashtags: ['#Peluqueria', '#Estetica', '#Turnos', '#NegocioLocal'],
    antesDePublicar: `Turnos y reservas: ${PENDIENTES.moduloSinConfirmar}`,
  },
  {
    pilar: 'a_medida',
    gancho: '¿Lo que necesitás no está en la lista?',
    cuerpo: [
      'Contanos con tus palabras qué te falta y lo armamos a medida, con vos.',
      'Antes de arrancar te pasamos un presupuesto sin compromiso.',
    ],
    cta: 'Escribilo en "Otra cosa", desde el link de la bio.',
    hashtags: ['#Emprendedores', '#Pymes', '#NegocioLocal', '#WebYa'],
  },
  {
    pilar: 'confianza',
    gancho: 'Del otro lado hay una persona.',
    cuerpo: [
      'Dejás tu WhatsApp y te escribe alguien del equipo para entender tu negocio.',
      'Lo armamos a mano y con vos, y antes de publicar lo ajustamos juntos.',
    ],
    cta: 'Dejá tu WhatsApp en el link de la bio.',
    hashtags: ['#NegocioLocal', '#Emprendedores', '#HechoConVos', '#WebYa'],
    antesDePublicar: PENDIENTES.plazoRespuesta,
  },
];

/** Las cinco captions, con el texto listo para pegar. */
export const CAPTIONS_INSTAGRAM = CAPTIONS.map((c) => ({ ...c, texto: textoCaption(c) }));
