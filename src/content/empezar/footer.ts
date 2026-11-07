/**
 * Pie de /empezar (fondo tinta). No repite la nav: contacto, la demo, legales y el wordmark. El
 * interruptor de tema vive en la nav.
 */
export const FOOTER = {
  lema: 'Somos la parte digital de tu negocio.',
  /** Debajo del lema: la promesa con su salvedad, en una línea. */
  bajada: 'Elegís tu rubro, lo armamos juntos y lo revisás antes de publicar.',
  instagram: 'Instagram @webya.dev',
  copyright: (anio: number) => `© ${anio} WebYa`,
  /** Grupos de enlaces del pie (el CTA principal de la página es el del hero). */
  empresa: {
    titulo: 'WebYa',
    queHacemos: 'Qué hacemos',
    trabajos: 'Trabajos',
    comoTrabajamos: 'Cómo trabajamos',
    preguntas: 'Preguntas frecuentes',
  },
  contacto: {
    titulo: 'Hablemos',
    aria: 'Contacto',
    whatsapp: 'Escribinos por WhatsApp',
  },
  probar: {
    titulo: 'Probalo',
    crear: 'Armar mi sitio',
    turnos: 'El bot de turnos',
    demo: 'Probar la demo',
  },
  legales: {
    titulo: 'Legales',
    privacidad: 'Privacidad',
    terminos: 'Términos',
  },
  /** Se abre en otra pestaña: se avisa a lectores de pantalla. */
  externo: ' (se abre en otra pestaña)',
} as const;
