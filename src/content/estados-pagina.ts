import { MICROCOPY } from '@/content/microcopy';

/**
 * Páginas de estado del sitio (404, error y carga). Las ilustraciones son de brand/ilustracion; el texto,
 * de acá. Humor liviano solo en la 404; en el error, nada de chistes: qué pasó y cómo seguir.
 */
export const ESTADOS_PAGINA = {
  noEncontrada: {
    titulo: 'Esta pieza no encaja acá',
    texto: 'La página que buscás no existe o cambió de lugar.',
    cta: 'Volver al inicio',
  },
  error: {
    titulo: 'Algo falló de nuestro lado',
    texto: 'No es nada que hayas hecho vos. Probá de nuevo en un momento.',
    reintentar: MICROCOPY.reintentar,
    whatsapp: 'Escribinos por WhatsApp',
  },
  carga: {
    /** Para lectores de pantalla (el spinner es decorativo). */
    aria: 'Cargando la página',
  },
} as const;
