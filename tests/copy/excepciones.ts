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
  {
    prefijo: 'demos/turnos/',
    motivo:
      'Demo de turnos: horarios, duraciones, precios y la seña del 50 % del sistema real, con datos de ejemplo.',
  },
  {
    prefijo: 'demos/pedidos/',
    motivo:
      'Demo de pedidos: horarios, tamaños (1/2 XL) y precios de ejemplo, rotulados así en pantalla.',
  },
  {
    prefijo: 'demos/web/',
    motivo: 'Demo de página web: horarios de atención de los negocios de ejemplo.',
  },
  {
    prefijo: 'demos/tienda/',
    motivo: 'Demo de tienda: precios de los productos de ejemplo, rotulados como vista previa.',
  },
  {
    prefijo: 'mockups.ts',
    motivo: 'Datos de ejemplo de las mini pantallas (horarios, cantidades): no son promesas.',
  },
  {
    prefijo: 'configurador.ts.MODULOS_CONFIG',
    motivo:
      'Seña del 50% y franjas de 15 minutos: funciones reales de los sistemas, confirmadas por Julián (2026-11-19).',
  },
  {
    prefijo: 'landings.ts.LANDINGS',
    motivo:
      'Seña del 50% y franjas de 15 minutos en las descripciones SEO: datos reales (2026-11-19).',
  },
  {
    prefijo: 'proyectos.ts.PROYECTOS',
    motivo:
      "Franjas de 15 minutos: función real del sistema de Micio's, confirmada por Julián (2026-11-19).",
  },
];
