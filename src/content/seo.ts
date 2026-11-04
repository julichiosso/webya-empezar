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

/** /empezar (metadata y opengraph-image). Mismo mensaje que el hero, para que el clic no sorprenda. */
export const SEO_EMPEZAR = {
  titulo: 'Tu negocio online, armado con vos',
  /** Hasta ~155 caracteres: lo que Google muestra sin cortar. */
  descripcion:
    'Elegí tu rubro y armá la carta con QR y los pedidos de tu negocio. Mirá cómo queda antes de decidir.',
  /** Imagen para compartir (se genera en el build). */
  og: {
    alt: 'WebYa: tu negocio online, armado con vos. Elegí tu rubro y mirá cómo queda.',
    titulo: 'Tu negocio online, armado con vos.',
    subtitulo: 'Elegí tu rubro y mirá cómo queda.',
    /** Pastillas de abajo: módulos de ejemplo y el camino a medida. */
    modulos: ['Carta con QR', 'Pedidos online'],
  },
} as const;

/** /marca (página interna, no se indexa). */
export const SEO_MARCA = {
  titulo: 'Marca',
} as const;
