/**
 * Números que no son promesas (formatos y datos de ejemplo). Esta lista SOLO puede achicarse.
 */

/**
 * Formatos que no afirman nada: ejemplo de teléfono, la ayuda "sin el 15 ni el +54", colores (#ff5b24) de las
 * paletas y el "#24" de una comanda.
 */
export const CIFRAS_PERMITIDAS = /\b11 2345 6789\b|el 15 ni el \+54|#[0-9a-f]{6}\b|#\d+/gi;

/** Prefijos de ruta dentro de src/content (archivo + clave) cuyos números son datos de ejemplo. */
export const EXCEPCIONES_CIFRAS: { prefijo: string; motivo: string }[] = [
  { prefijo: 'demos/gastronomia/cocinas/', motivo: 'Datos de ejemplo (demo): no son promesas.' },
  { prefijo: 'demos/gastronomia/index.ts', motivo: 'Datos de ejemplo (demo): no son promesas.' },
  {
    prefijo: 'demos/gastronomia/ui/carta.ts.CARTA.escaneaste',
    motivo: 'Datos de ejemplo (demo): no son promesas.',
  },
  {
    prefijo: 'empezar/vitrina-demo.ts.VITRINA_DEMO.comanda',
    motivo: 'Datos de ejemplo (demo): no son promesas.',
  },
  { prefijo: 'marca.ts.MARCA.pedidoMuestra', motivo: 'Datos de ejemplo (demo): no son promesas.' },
  {
    prefijo: 'explicativo/escenas.ts.TEXTOS_ESCENAS.carta',
    motivo: 'Datos de ejemplo (demo): no son promesas.',
  },
  {
    prefijo: 'empezar/hero.ts.HERO.senales',
    motivo:
      'Ola 2, copy-conversion: "menos de 24 hs" es un plazo; confirmarlo con el usuario o pasarlo a TODO:.',
  },
  {
    prefijo: 'empezar/confianza.ts.CONFIANZA.compromisos',
    motivo:
      'Ola 2, copy-conversion: "menos de 24 hs" es un plazo; confirmarlo con el usuario o pasarlo a TODO:.',
  },
  {
    prefijo: 'empezar/pasos.ts.PASO_LISTO.contacto',
    motivo:
      'Ola 2, copy-conversion: "menos de 24 hs" es un plazo; confirmarlo con el usuario o pasarlo a TODO:.',
  },
  {
    prefijo: 'faq.ts.FAQ',
    motivo:
      'Ola 2, copy-conversion: "menos de 24 hs" es un plazo; confirmarlo con el usuario o pasarlo a TODO:.',
  },
  {
    prefijo: 'marca.ts.MARCA.heroMuestra',
    motivo:
      'Ola 2, copy-conversion: "menos de 24 hs" es un plazo; confirmarlo con el usuario o pasarlo a TODO:.',
  },
];
