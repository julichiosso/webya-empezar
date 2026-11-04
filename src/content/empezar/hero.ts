/**
 * Hero de /empezar: la promesa con su salvedad, el CTA que baja al wizard y las señales de confianza.
 * Es la variante `todo_lo_digital` de content/empezar/hero-variantes.ts (un test verifica que coincidan).
 */
export const HERO = {
  titulo: 'Tu negocio online, armado con vos.',
  /** Segunda línea del título (más apagada): la salvedad honesta de "todo". */
  subtitulo: 'Elegí tu rubro y mirá cómo queda.',
  bajada:
    'Tienda, turnos, carta con QR, pedidos y pagos. Activá solo lo que usás y lo armamos con vos.',
  cta: 'Crear mi sistema',
  /**
   * Señales de confianza (solo escritorio). Son promesas que ya cumplimos, sin sellos, métricas
   * ni testimonios.
   */
  senales: ['Sin saber de tecnología', 'Armado para tu rubro', 'Te escribimos por WhatsApp'],
  /** Enlace secundario (no botón) a la demo real, debajo del CTA. */
  enlaceDemo: 'O mirá una demo funcionando',
} as const;
