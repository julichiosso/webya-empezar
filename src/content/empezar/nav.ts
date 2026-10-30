import { HERO } from '@/content/empezar/hero';

/** Nav mínima de /empezar: el logo y UN solo CTA (el mismo del hero, para no sumar decisiones). */
export const NAV = {
  /** Nombre accesible del <nav>. */
  aria: 'Principal',
  /** Enlace del logo, para lectores de pantalla. */
  inicio: 'WebYa, ir al inicio',
  /** Enlace para saltar la navegación con el teclado (primer foco de la página). */
  saltar: 'Saltar al contenido',
  cta: HERO.cta,
  /** Interruptor discreto de tema (docs/plan-sprint.md §3). Dice lo que va a pasar al tocarlo. */
  tema: {
    aClaro: 'Pasar a modo claro',
    aOscuro: 'Pasar a modo oscuro',
  },
} as const;
