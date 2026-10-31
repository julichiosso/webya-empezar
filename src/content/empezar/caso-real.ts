import { PENDIENTES_CASO_MICIOS } from '@/content/pendientes';

/**
 * "Hecho para negocios reales": el caso de Micio's Pizzería, un sitio que ya armamos. Solo lo que
 * es cierto (qué incluye), sin cifras, testimonios ni resultados. La sección está APAGADA
 * (config/flags.ts) hasta tener el permiso escrito; los TODO se ven mientras falten.
 */
export const CASO_REAL = {
  titulo: 'Hecho para negocios reales',
  bajada: 'Así quedó el sitio de una pizzería que ya armamos.',
  negocio: "Micio's Pizzería",
  rubro: 'Pizzería',
  /** Ubicación: solo si el usuario confirma mencionarla. Mientras tanto, el TODO. */
  ubicacion: null as string | null,
  incluyeTitulo: 'Qué incluye',
  incluye: [
    'Carta online, para ver desde el celular.',
    'Pedidos que llegan por WhatsApp, ordenados.',
  ],
  /** Dirección del sitio: null hasta tenerla (no hay botón). */
  url: null as string | null,
  cta: 'Ver su sitio',
  /** Texto alternativo de cada captura (cuando estén). */
  capturaAlt: (n: number) => `Captura ${n} del sitio de Micio's Pizzería`,
  capturaPendiente: 'Captura pendiente',
  pendientes: PENDIENTES_CASO_MICIOS,
} as const;
