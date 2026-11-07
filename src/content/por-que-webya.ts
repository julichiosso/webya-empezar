/**
 * "Por qué WebYa": solo cosas ciertas hoy. Y las objeciones más comunes, respondidas en el lugar donde
 * aparecen. Sin cifras, plazos ni precios inventados.
 */
export const POR_QUE_WEBYA = {
  titulo: 'Por qué WebYa',
  puntos: [
    {
      titulo: 'Hecho en Argentina',
      texto: 'En español rioplatense, pensado para negocios de acá.',
    },
    {
      titulo: 'Pensado para WhatsApp',
      texto: 'Ahí ya hablan tus clientes. Tus pedidos y consultas llegan por ahí, ordenados.',
    },
    {
      titulo: 'Para cualquier rubro',
      texto: 'Gastronomía y peluquerías ya funcionan. Los demás rubros los armamos con vos.',
    },
    {
      titulo: 'Una persona atrás',
      texto: 'Si tenés una duda, te contesta una persona por WhatsApp.',
    },
  ],
} as const;

export type DondeObjecion = 'hero' | 'modulos' | 'clientes';

export interface Objecion {
  donde: DondeObjecion;
  pregunta: string;
  respuesta: string;
  /** true: la respuesta es el texto de precios (content/precios.ts), que no inventa montos. */
  precio?: boolean;
  enlace?: { texto: string; href: string };
}

/** Objeciones respondidas junto a la sección que las genera. Cortas y verdaderas; sin plazos ni precios. */
export const OBJECIONES: readonly Objecion[] = [
  {
    donde: 'hero',
    pregunta: '¿Necesito saber de tecnología?',
    respuesta: 'No. Vos nos contás tu negocio y lo armamos con vos.',
  },
  {
    donde: 'hero',
    pregunta: '¿Y si no me gusta?',
    respuesta: 'Lo revisás antes de publicarlo. Nada sale online sin tu visto bueno.',
  },
  {
    donde: 'modulos',
    pregunta: '¿Cuánto cuesta?',
    respuesta: '',
    precio: true,
  },
  {
    donde: 'modulos',
    pregunta: '¿Y mi dominio?',
    respuesta: 'Si ya tenés uno, contanos cuál es y lo vemos juntos.',
  },
  {
    donde: 'clientes',
    pregunta: '¿Qué pasa con mis datos?',
    respuesta: 'Los usamos solo para contactarte por tu negocio.',
    enlace: { texto: 'Leer la política de privacidad', href: '/privacidad' },
  },
];

/**
 * Quién está detrás. Mientras `FUNDADOR` sea null el bloque no se muestra. PENDIENTE DEL DUEÑO:
 * nombre real y foto (en /public/equipo/).
 */
export interface Fundador {
  nombre: string;
  rol: string;
  foto: string;
  alt: string;
}

export const FUNDADOR: Fundador | null = null;
