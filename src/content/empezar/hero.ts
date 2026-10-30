import { PENDIENTES } from '@/content/pendientes';

/** Hero de /empezar: la promesa ("Creá"), el CTA que baja al wizard y las señales de confianza. */
export const HERO = {
  titulo: 'Creá tu negocio online.',
  /** Segunda línea del título (más apagada). */
  subtitulo: 'Elegí tu rubro. Activá lo que necesitás.',
  bajada: 'Turnos, tienda, carta, pagos: sumá solo las piezas que tu negocio necesita.',
  cta: 'Empezar a crear',
  /**
   * Señales de confianza (solo escritorio). Son promesas que ya cumplimos, sin sellos, métricas
   * ni testimonios.
   */
  senales: ['Sin saber de tecnología', 'Armado para tu rubro', 'Te escribimos por WhatsApp'],
  /** Visible junto a las señales hasta que el usuario confirme el plazo de respuesta. */
  todoPlazo: PENDIENTES.plazoRespuesta,
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
