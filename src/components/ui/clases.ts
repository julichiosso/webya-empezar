/**
 * Utilidades de clases compartidas por las primitivas de UI.
 *
 * Escala de toque: UNA sola en todo el sistema (antes había 0.96, 0.97, 0.98 y 0.99 sueltos).
 * Feedback inmediato (< 100 ms) con transform; con movimiento reducido el cambio es instantáneo.
 * TODO(marca-sistema): cuando `src/brand/motion` publique la escala de toque, estas constantes pasan a
 * leerla de ahí. Las clases van escritas enteras para que Tailwind las encuentre al compilar.
 */
export const TOQUE =
  'transition-transform duration-100 active:scale-[0.98] motion-reduce:transition-none';

/** Igual que TOQUE, para cuando el que se toca es el contenedor `.group` (label de un input oculto). */
export const TOQUE_GRUPO =
  'transition-transform duration-100 group-active:scale-[0.98] motion-reduce:transition-none';

/** Une clases condicionales sin dependencias (lo falso se descarta). */
export function cn(...clases: (string | false | null | undefined)[]): string {
  return clases.filter(Boolean).join(' ');
}
