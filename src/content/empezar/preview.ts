/** Vista previa del negocio que se va armando (wizard: panel de escritorio y "Así te queda"). */
export const PREVIEW = {
  /** Nombre que se muestra mientras no hay rubro elegido. */
  sinRubro: 'Tu negocio',
  /** Panel de escritorio, sin módulos activos. */
  sinModulos: 'Lo armamos con vos',
  cantidadModulos: (cantidad: number) => `${cantidad} ${cantidad === 1 ? 'pieza' : 'piezas'}`,
  /**
   * Debajo del celular o del navegador de la vista previa por rubro: los textos de la plantilla
   * son de ejemplo (src/content/rubros/*.ts, `plantilla`). Lo real lo armamos con la persona.
   */
  deEjemplo: 'Vista previa con platos y precios de ejemplo. Después cargás los tuyos.',
  /** Lugar de una pieza cuyo módulo está apagado (hueco punteado del mismo tamaño). */
  hueco: (modulo: string) => `Acá encaja ${modulo}`,
} as const;
