/**
 * Textos del slot de video de /empezar (features/explicativo/VideoPresentacion y SlotVideo). Van
 * aparte del guion (./flujo) a propósito: el poster y su botón viajan en el JS inicial de /empezar, y
 * este archivo no importa nada.
 */
export const VIDEO_PRESENTACION = {
  titulo: 'Mirá cómo se arma tu negocio',
  bajada:
    'Son cuatro pantallas: elegís tu rubro, nos contás de tu negocio, ves cómo te queda y lo seguimos por WhatsApp.',
  /** Botón de play del poster (el mismo texto que tenía el botón de antes). */
  play: 'Mirá cómo funciona',
  cargando: 'Cargando…',
  /** Si no se pudo descargar la animación (sin conexión): el botón queda para reintentar. */
  errorCarga: 'No pudimos cargar el video. Revisá tu conexión y tocá de nuevo.',
  /** Nombre accesible del reproductor embebido y del video. */
  reproductor: 'Video de presentación',
  /** Lista de capítulos del poster (es el índice del video). */
  indice: 'Qué vas a ver',
  /** Pista del <track> de subtítulos. */
  subtitulos: 'Español (Argentina)',
  /** CTA de la última escena: vuelve a la pantalla 1 del flujo. */
  cta: 'Elegí tu rubro',
} as const;
