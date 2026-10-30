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
  /** Mientras algo se descarga o se guarda (con spinner). */
  cargando: 'Cargando…',
  /** Botón para reintentar después de un error. */
  reintentar: 'Probar de nuevo',
  /** Botón de copiar un enlace y su confirmación (se anuncia). */
  copiar: 'Copiar enlace',
  copiado: 'Enlace copiado',
  /** Pegado al texto de un enlace que se abre en otra pestaña (para lectores de pantalla). */
  otraPestana: ' (se abre en otra pestaña)',
} as const;
