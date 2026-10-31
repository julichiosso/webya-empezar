/**
 * Video de presentación de /empezar (features/explicativo/VideoPresentacion).
 *
 * Mientras `mp4` sea null, el slot muestra la animación en código de las cuatro pantallas del flujo
 * (mismo guion: content/explicativo/flujo.ts). Para usar un video grabado:
 *   1. Subir el archivo a `public/video/presentacion.mp4` (H.264 + AAC, idealmente < 8 MB).
 *   2. Cambiar `mp4: null` por `mp4: '/video/presentacion.mp4'`.
 *   3. Ajustar los tiempos de `public/video/presentacion.es-AR.vtt` al audio real (los textos tienen
 *      que seguir siendo los del guion: lo verifica features/explicativo/subtitulos.test.ts).
 *   4. Opcional: un cuadro del video como `poster` (p. ej. '/video/presentacion.webp'); si no, el
 *      poster es el SVG propio y el <video> arranca recién al tocar play.
 * Nada se descarga hasta tocar play (`preload="none"`). Si el MP4 falla, se ve la animación.
 */
export interface ConfigVideo {
  /** Ruta pública del MP4 (o null: todavía no hay video grabado). */
  mp4: string | null;
  /** Imagen de portada del <video> (o null: se usa el poster SVG de la sección). */
  poster: string | null;
  /** Subtítulos en es-AR (WebVTT), generados desde el guion. */
  subtitulos: string;
}

export const VIDEO_PRESENTACION_CONFIG: ConfigVideo = {
  mp4: null,
  poster: null,
  subtitulos: '/video/presentacion.es-AR.vtt',
};
