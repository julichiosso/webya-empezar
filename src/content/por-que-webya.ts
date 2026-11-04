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
      texto: 'Gastronomía ya funciona. Los demás rubros los armamos con vos.',
    },
    {
      titulo: 'Una persona atrás',
      texto: 'Si tenés una duda, te contesta una persona por WhatsApp.',
    },
  ],
  /** Objeciones respondidas junto a la sección donde aparecen. */
  objeciones: [
    {
      pregunta: '¿Necesito saber de tecnología?',
      respuesta: 'No. Elegís tu rubro, cargás tu carta y listo.',
    },
    {
      pregunta: '¿Y si no me gusta?',
      respuesta: 'Lo revisás antes de publicarlo. Nada sale online sin tu visto bueno.',
    },
    {
      pregunta: '¿Qué pasa con mis datos?',
      respuesta: 'Los usamos solo para contactarte.',
      enlace: { texto: 'Leer la política de privacidad', href: '/privacidad' },
    },
  ],
} as const;

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
