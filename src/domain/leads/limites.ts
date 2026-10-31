/**
 * Límites del lead y formato del token, sin zod: los usa también código que viaja en el JS inicial
 * de /empezar (el estado del wizard, que comparte con el hero), donde zod no tiene que entrar.
 */

/** Límites que no dependen del catálogo (se aplican igual en cliente y servidor). */
export const LIMITES_BASE = {
  nombre: 80,
  nombreNegocio: 100,
  /** Ciudad o localidad (opcional, pantalla 2 del flujo). */
  ciudad: 60,
  rubroOtro: 80,
  email: 254,
  mensaje: 1000,
  objetivos: 8,
  utm: 100,
  userAgent: 400,
  /** Lead parcial: necesidades marcadas, texto libre "a medida" y módulos (igual que la base). */
  necesidades: 8,
  necesidadLibreMin: 3,
  necesidadLibre: 500,
  modulosParcial: 16,
} as const;

/** Token para completar un lead parcial: 32 bytes en base64url, sin relleno. */
export const TOKEN_LEAD_REGEX = /^[A-Za-z0-9_-]{43}$/;
