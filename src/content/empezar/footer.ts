/**
 * Pie de /empezar (fondo tinta). No repite la nav: contacto, la demo, legales y el wordmark. El
 * interruptor de tema vive en la nav.
 */
export const FOOTER = {
  lema: 'Creá. Digitalizá. Crecé.',
  /** Debajo del lema: la promesa con su salvedad, en una línea. */
  bajada: 'Todo lo digital para tu negocio, o lo armamos a medida.',
  instagram: 'Instagram @webya.dev',
  copyright: (anio: number) => `© ${anio} WebYa`,
  /** Grupos de enlaces del pie (el CTA principal de la página es el del hero). */
  contacto: {
    titulo: 'Hablemos',
    aria: 'Contacto',
    whatsapp: 'Escribinos por WhatsApp',
  },
  probar: {
    titulo: 'Probalo',
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
