/** Marco del wizard de /empezar (lo que rodea a los pasos) y sus mensajes de validación. */
export const WIZARD = {
  /** Nombre accesible de la sección (y del esqueleto mientras se descarga). */
  ariaSeccion: 'Creá tu negocio',
  cargando: 'Cargando…',
  atras: 'Atrás',
  ariaProgreso: 'Progreso del formulario',
  /** Si vino de la demo: así entiende por qué ya hay cosas elegidas. */
  avisoDemo: (cocina: string, paleta: string) =>
    `Trajimos lo que armaste en la demo: ${cocina}, paleta ${paleta}.`,
  /** Rubro "Otro" sin descripción escrita: lo que se muestra y va al mensaje de WhatsApp. */
  rubroOtroSinTexto: 'Otro',
  /** Mensajes amables cuando todavía no se puede avanzar. */
  errores: {
    sinRubro: 'Elegí el rubro que más se parezca a tu negocio.',
    sinRubroOtro: 'Contanos a qué se dedica tu negocio.',
    sinModulos: 'Activá al menos un módulo para seguir.',
  },
} as const;
