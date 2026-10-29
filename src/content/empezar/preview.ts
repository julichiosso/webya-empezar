/** Vista previa en vivo del negocio que se va armando (wizard: panel de escritorio y mobile). */
export const PREVIEW = {
  /** Nombre que se muestra mientras no hay rubro elegido. */
  sinRubro: 'Tu negocio',
  /** Panel de escritorio, sin módulos activos. */
  sinModulos: 'Acá encajan tus módulos',
  cantidadModulos: (cantidad: number) => `${cantidad} ${cantidad === 1 ? 'módulo' : 'módulos'}`,
} as const;
