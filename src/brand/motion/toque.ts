/**
 * Clases de toque (feedback < 100 ms al apretar), con la escala ÚNICA del token `--escala-toque`.
 * Solo texto, sin cálculos: un componente de cliente las importa sin arrastrar el resto de los
 * presets a su JS. Se re-exportan dentro de `TOQUE` (presets.ts).
 */

/** Control que se toca directamente (`<button>`, `<a>`). */
export const TOQUE_CLASE =
  'transition-transform duration-(--duration-instant) ease-(--ease-out) active:scale-(--escala-toque)';

/** Contenido de un `<label class="group">` con el input oculto (chips, tarjetas elegibles). */
export const TOQUE_CLASE_GRUPO =
  'transition-transform duration-(--duration-instant) ease-(--ease-out) group-active:scale-(--escala-toque)';
