import { HERO } from '@/content/empezar/hero';

/**
 * Cierre de /empezar a pantalla completa (fondo imagen), antes del pie: la pregunta que recapitula y
 * el CTA principal, que baja al wizard.
 */
export const CTA_FINAL = {
  titulo: '¿Qué le falta a tu negocio?',
  bajada: 'Elegilo en pocos pasos. Te escribimos por WhatsApp y lo armamos con vos.',
  cta: HERO.cta,
  /** Debajo del botón: baja la fricción sin prometer nada que no pase. */
  apoyo: 'Para empezar, solo te pedimos el WhatsApp. Sin compromiso.',
  /**
   * Texto alternativo de la foto de fondo. Vacío: es decorativa (el titular dice todo).
   * TODO: foto real del cierre; mientras tanto se ve el plano (IlustracionPlano, escena "cierre").
   */
  alt: '',
} as const;

/** CTA persistente en celular (barra fija abajo). Aparece cuando el CTA del hero ya no se ve. */
export const STICKY_CTA = {
  /** Nombre accesible de la barra. */
  aria: 'Empezar a crear tu negocio',
  /** Texto corto a la izquierda del botón; si no entra, se oculta. */
  texto: 'Lo armamos con vos',
  cta: HERO.cta,
} as const;
