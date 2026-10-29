/**
 * Palabras genéricas de interfaz que usan los componentes base (components/ui). Son de todo el
 * sitio (/empezar y las demos): cambiar algo acá lo cambia en todos lados.
 */
export const MICROCOPY = {
  /** Junto a la etiqueta de un campo que no es obligatorio. */
  opcional: 'Opcional',
  /** Texto accesible del check de un campo ya válido. */
  valido: 'Válido',
  /** Botón (ícono) que cierra una hoja o diálogo. */
  cerrar: 'Cerrar',
  /** Módulo que el rubro elegido sugiere (por eso ya viene marcado). */
  sugeridoParaTuRubro: 'Sugerido para tu rubro',
  /** Progreso de un flujo por pasos (barra y texto). */
  pasoDeTotal: (paso: number, total: number) => `Paso ${paso} de ${total}`,
} as const;
