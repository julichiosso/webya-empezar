import { NAV } from '@/content/empezar/nav';
import { PENDIENTES } from '@/content/pendientes';

/** Pie de /empezar. */
export const FOOTER = {
  lema: 'Creá. Digitalizá. Crecé.',
  /** Debajo del lema: la promesa con su salvedad, en una línea. */
  bajada: 'Todo lo digital para tu negocio, o lo armamos a medida.',
  /** Visible solo fuera de producción, mientras falte el mail de contacto. */
  todoEmail: 'TODO: configurar NEXT_PUBLIC_CONTACT_EMAIL.',
  instagram: 'Instagram @webya.dev',
  copyright: (anio: number) => `© ${anio} WebYa`,
  /** Enlaces secundarios del pie (el CTA principal de la página es el del hero). */
  enlaces: {
    aria: 'Enlaces del pie',
    demo: 'Probar la demo',
    whatsapp: 'Escribinos por WhatsApp',
    /** Se abre en otra pestaña: se avisa a lectores de pantalla. */
    externo: ' (se abre en otra pestaña)',
  },
  /** Hasta que exista la política de privacidad. */
  todoPrivacidad: PENDIENTES.privacidad,
  tema: NAV.tema,
} as const;
