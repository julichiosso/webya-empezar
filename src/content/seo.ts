/**
 * Textos de SEO y de compartir: títulos, descripciones y la imagen Open Graph.
 * Lo que se ve en la pestaña, en Google y en la vista previa de WhatsApp/Instagram.
 */

/** Del sitio entero (app/layout.tsx). */
export const SEO_SITIO = {
  nombre: 'WebYa',
  /** Plantilla de Next: cada página reemplaza "%s" por su título. */
  plantillaTitulo: '%s | WebYa',
  /** El mismo formato, para los títulos de Open Graph y Twitter (que no usan la plantilla). */
  tituloConMarca: (titulo: string) => `${titulo} | WebYa`,
} as const;

/** /empezar (metadata y opengraph-image). */
export const SEO_EMPEZAR = {
  titulo: 'Creá tu negocio online',
  descripcion:
    'Elegí tu rubro y activá solo lo que tu negocio necesita: turnos, tienda, carta con QR, pagos. Lo armamos con vos.',
  /** Imagen para compartir (se genera en el build). */
  og: {
    alt: 'WebYa: creá tu negocio online. Elegí tu rubro. Activá lo que necesitás.',
    titulo: 'Creá tu negocio online.',
    subtitulo: 'Elegí tu rubro. Activá lo que necesitás.',
    /** Pastillas de abajo: módulos de ejemplo. */
    modulos: ['Turnos', 'Tienda y catálogo', 'Carta con QR', 'Pagos online'],
  },
} as const;

/** /marca (página interna, no se indexa). */
export const SEO_MARCA = {
  titulo: 'Marca',
} as const;
