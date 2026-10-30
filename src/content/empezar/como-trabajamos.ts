import { PENDIENTES } from '@/content/pendientes';

/**
 * Sección "Cómo trabajamos": qué pasa después de dejar tus datos. Dice de frente que hoy la entrega es
 * manual (la hacemos nosotros) y deja visible lo que todavía no está definido (TODO:).
 */
export const COMO_TRABAJAMOS = {
  titulo: 'Qué pasa después de dejar tus datos',
  bajada: 'Hoy lo armamos nosotros, a mano y con vos. Así sigue:',
  pasos: [
    {
      titulo: 'Te escribimos por WhatsApp',
      texto: 'Una persona lee lo que elegiste y te escribe para conocer tu negocio.',
      todo: PENDIENTES.plazoRespuesta,
    },
    {
      titulo: 'Te pasamos un presupuesto',
      texto: 'Según lo que actives, sin compromiso. Si no te cierra, no seguimos.',
      todo: PENDIENTES.precios,
    },
    {
      titulo: 'Lo armamos nosotros',
      texto: 'Cargamos tus productos, tu carta o tus servicios. Vos no configurás nada.',
    },
    {
      titulo: 'Lo revisás antes de publicar',
      texto: 'Lo ajustamos con vos hasta que te guste, y recién ahí lo ponemos online.',
      todo: PENDIENTES.plazoEntrega,
    },
  ],
  /** Aclaración honesta debajo de los pasos. */
  aclaracion: 'Todavía no hay una plataforma para armarlo por tu cuenta: lo hacemos nosotros.',
} as const;
