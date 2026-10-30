import { HERO } from '@/content/empezar/hero';

/** Cierre de /empezar, antes del footer: recapitula y repite el CTA principal. */
export const CTA_FINAL = {
  titulo: '¿Qué le falta a tu negocio?',
  bajada: 'Elegilo en pocos pasos. Te escribimos por WhatsApp y lo armamos con vos.',
  cta: HERO.cta,
  /** Debajo del botón: baja la fricción sin prometer nada que no pase. */
  apoyo: 'Para empezar, solo te pedimos el WhatsApp. Sin compromiso.',
} as const;

/** CTA persistente en celular (barra fija abajo). Aparece cuando el CTA del hero ya no se ve. */
export const STICKY_CTA = {
  /** Nombre accesible de la barra. */
  aria: 'Empezar a crear tu negocio',
  /** Texto corto a la izquierda del botón; si no entra, se oculta. */
  texto: 'Lo armamos con vos',
  cta: HERO.cta,
} as const;
