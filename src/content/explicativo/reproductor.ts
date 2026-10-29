/** Textos del botón que abre el video explicativo (features/explicativo/BotonExplicativo). */
export const BOTON_EXPLICATIVO = {
  texto: 'Mirá cómo funciona',
} as const;

/** Textos del reproductor del video explicativo (features/explicativo/Reproductor). */
export const REPRODUCTOR = {
  titulo: 'Cómo funciona WebYa',
  ariaCerrar: 'Cerrar el video',
  /** CTAs de la última escena. */
  probarDemo: 'Probar la demo',
  quieroElMio: 'Quiero el mío',
  sinVozEnEspanol: 'Tu dispositivo no tiene voz en español: seguilo con los subtítulos.',
  ariaCapitulos: 'Capítulos',
  ariaCapitulo: (numero: number, capitulo: string) => `Capítulo ${numero}: ${capitulo}`,
  anterior: 'Capítulo anterior',
  siguiente: 'Capítulo siguiente',
  verDeNuevo: 'Ver de nuevo',
  pausar: 'Pausar',
  reproducir: 'Reproducir',
  voz: 'Voz',
} as const;
