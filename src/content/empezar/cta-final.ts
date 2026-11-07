import { HERO } from '@/content/empezar/hero';

/**
 * Cierre de /empezar a pantalla completa (fondo imagen), antes del pie: la pregunta que recapitula y
 * el CTA principal, que baja al wizard.
 */
export const CTA_FINAL = {
  titulo: 'Hablemos de tu negocio.',
  bajada: 'Empezá por ver cómo quedaría, sin dejar tu teléfono. Lo que sigue lo charlamos.',
  cta: HERO.cta,
  whatsapp: 'Escribinos por WhatsApp',
  externo: ' (se abre en otra pestaña)',
  /** Debajo del botón: baja la fricción sin prometer nada que no pase. */
  apoyo: 'Sin compromiso.',
} as const;

/** CTA persistente en celular (barra fija abajo). Aparece cuando el CTA del hero ya no se ve. */
export const STICKY_CTA = {
  /** Nombre accesible de la barra. */
  aria: 'Crear mi sistema',
  /** Texto corto a la izquierda del botón; si no entra, se oculta. */
  texto: 'Lo armamos con vos',
  cta: HERO.cta,
} as const;
