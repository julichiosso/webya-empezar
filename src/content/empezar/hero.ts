import { PENDIENTES } from '@/content/pendientes';

/**
 * Hero de /empezar: la promesa con su salvedad, el CTA que baja al wizard y las señales de confianza.
 * Es la variante `todo_lo_digital` de content/empezar/hero-variantes.ts (un test verifica que coincidan).
 */
export const HERO = {
  titulo: 'Todo lo digital para tu negocio.',
  /** Segunda línea del título (más apagada): la salvedad honesta de "todo". */
  subtitulo: 'Y si no está, lo armamos a medida.',
  bajada:
    'Tienda, turnos, carta con QR, pedidos y pagos. Activá solo lo que usás y lo armamos con vos.',
  cta: 'Empezar a crear',
  /**
   * Señales de confianza (solo escritorio). Son promesas que ya cumplimos, sin sellos, métricas
   * ni testimonios.
   */
  senales: ['Sin saber de tecnología', 'Armado para tu rubro', 'Te escribimos por WhatsApp'],
  /** Visible junto a las señales hasta que el usuario confirme el plazo de respuesta. */
  todoPlazo: PENDIENTES.plazoRespuesta,
  /** Enlace secundario (no botón) a la demo real, debajo del CTA. */
  enlaceDemo: 'O mirá una demo funcionando',
} as const;

/** Mockup interactivo del hero: la mini web que se arma tocando módulos. */
export const HERO_MOCKUP = {
  ariaGrupo: 'Armá tu negocio: activá los módulos que necesitás',
  /** Pista que aparece una vez si nadie tocó nada; se va sola. */
  pista: 'Tocá para activar',
  /** Resumen (y aviso a lectores de pantalla) cuando hay al menos un módulo activo. */
  activados: (cantidad: number) =>
    `${cantidad} ${cantidad === 1 ? 'módulo activado' : 'módulos activados'}`,
} as const;
