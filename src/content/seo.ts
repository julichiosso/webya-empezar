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
  titulo: 'Todo lo digital para tu negocio',
  /** Hasta ~155 caracteres: lo que Google muestra sin cortar. */
  descripcion:
    'Tienda, turnos, carta con QR, pedidos y pagos para tu negocio. Activá solo lo que usás; si no está, lo armamos a medida con vos.',
  /** Imagen para compartir (se genera en el build). */
  og: {
    alt: 'WebYa: todo lo digital para tu negocio. Y si no está, lo armamos a medida.',
    titulo: 'Todo lo digital para tu negocio.',
    subtitulo: 'Y si no está, lo armamos a medida.',
    /** Pastillas de abajo: módulos de ejemplo y el camino a medida. */
    modulos: ['Turnos', 'Tienda y catálogo', 'Carta con QR', 'A medida'],
  },
} as const;

/** /marca (página interna, no se indexa). */
export const SEO_MARCA = {
  titulo: 'Marca',
} as const;
