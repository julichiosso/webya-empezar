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
  titulo: 'Tu negocio atiende mientras vos trabajás',
  /** Zona que atiende WebYa (datos estructurados de la página). */
  zona: 'Argentina',
  /** Hasta ~155 caracteres: lo que Google muestra sin cortar. */
  descripcion:
    'Carta con QR y pedidos, bot de turnos con agenda y estadísticas, y el sitio de tu negocio. Elegí tu rubro y mirá cómo te queda.',
  /** Imagen para compartir (se genera en el build). */
  og: {
    alt: 'WebYa: tu negocio atiende mientras vos trabajás. Pedidos, turnos con bot y tu sitio.',
    titulo: 'Tu negocio atiende mientras vos trabajás.',
    subtitulo: 'Pedidos, turnos con bot y tu sitio.',
    /** Pastillas de abajo: módulos de ejemplo y el camino a medida. */
    modulos: ['Carta con QR', 'Pedidos online', 'Bot de turnos'],
  },
} as const;

/** /marca (página interna, no se indexa). */
export const SEO_MARCA = {
  titulo: 'Marca',
} as const;
