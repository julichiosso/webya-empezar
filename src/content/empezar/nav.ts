import { HERO } from '@/content/empezar/hero';

/** Nav mínima de /empezar: el logo, el interruptor de tema y UN solo CTA (el mismo del hero). */
export const NAV = {
  /** Nombre accesible del <nav>. */
  aria: 'Principal',
  /** Enlace del logo, para lectores de pantalla. */
  inicio: 'WebYa, ir al inicio',
  /** Enlace para saltar la navegación con el teclado (primer foco de la página). */
  saltar: 'Saltar al contenido',
  cta: HERO.cta,
  /** Enlace a los ejemplos reales ("Ya lo usan"). */
  ejemplos: 'Ver ejemplos',
  /**
   * Interruptor de tema (docs/plan-sprint.md §3), solo ícono: la etiqueta es su nombre accesible.
   * Nombre fijo: nombra lo que queda activo cuando está presionado (aria-pressed dice si lo está),
   * no la acción.
   */
  tema: {
    etiqueta: 'Modo claro',
  },
} as const;
