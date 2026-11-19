/**
 * Textos de SEO y de compartir: títulos, descripciones, imagen Open Graph y datos estructurados.
 * Lo que se ve en la pestaña, en Google y en la vista previa de WhatsApp/Instagram.
 */
import { MARCA } from './home';
import { SERVICIOS, type Servicio } from './servicios';

/** Del sitio entero (app/layout.tsx). */
export const SEO_SITIO = {
  nombre: 'Webya',
  /** Título de la home (sin plantilla) y por defecto. */
  tituloInicio: 'Webya · Tiendas, pedidos y turneros para negocios de San Jorge',
  descripcion:
    'Sistemas para comercios de San Jorge y zona: tienda online, pedidos para pizzerías y turnero con seña por Mercado Pago. Armá el tuyo y mandalo por WhatsApp.',
  /** Plantilla de Next: cada página reemplaza "%s" por su título. */
  plantillaTitulo: '%s | Webya',
  /** El mismo formato, para los títulos de Open Graph y Twitter (que no usan la plantilla). */
  tituloConMarca: (titulo: string) => `${titulo} | Webya`,
  og: {
    alt: 'Webya: tiendas, pedidos y turneros para negocios de San Jorge y zona.',
    titulo: 'Tu tienda, tus pedidos, tus turnos. Armados en serio.',
    pie: 'San Jorge y zona · San Francisco',
  },
} as const;

/** /empezar quedó como redirección a la home; se conserva el texto por las páginas que lo citan. */
export const SEO_EMPEZAR = {
  titulo: 'Tu negocio online, armado con vos',
  descripcion:
    'Elegí tu rubro y armá la carta con QR y los pedidos de tu negocio. Mirá cómo queda antes de decidir.',
  og: {
    alt: 'Webya: tu negocio online, armado con vos. Elegí tu rubro y mirá cómo queda.',
    titulo: 'Tu negocio online, armado con vos.',
    subtitulo: 'Elegí tu rubro y mirá cómo queda.',
    modulos: ['Carta con QR', 'Pedidos online'],
  },
} as const;

/** /marca (página interna, no se indexa). */
export const SEO_MARCA = {
  titulo: 'Marca',
} as const;

/** Zona de atención para schema.org. */
const ZONA = [
  {
    '@type': 'City',
    name: 'San Jorge',
    containedInPlace: { '@type': 'State', name: 'Santa Fe' },
  },
  {
    '@type': 'City',
    name: 'San Francisco',
    containedInPlace: { '@type': 'State', name: 'Córdoba' },
  },
] as const;

const id = (url: string, frag: string) => `${url}/#${frag}`;

function servicioLd(url: string, s: Servicio) {
  return {
    '@type': 'Service',
    '@id': id(url, `servicio-${s.id}`),
    name: s.nombre,
    serviceType: s.nombre,
    description: s.descripcionSeo,
    provider: { '@id': id(url, 'negocio') },
    areaServed: ZONA,
    url: `${url}${s.pagina ?? '/#armar'}`,
  };
}

/** Grafo del negocio: ProfessionalService (LocalBusiness), sitio y un Service por servicio. */
export function jsonLdNegocio(opts: {
  url: string;
  email: string;
  instagram: string;
  telefono?: string;
}) {
  const { url } = opts;
  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'ProfessionalService',
        '@id': id(url, 'negocio'),
        name: SEO_SITIO.nombre,
        url,
        logo: `${url}/icon.svg`,
        image: `${url}/opengraph-image`,
        description: SEO_SITIO.descripcion,
        email: opts.email,
        ...(opts.telefono ? { telephone: `+${opts.telefono}` } : {}),
        founder: { '@type': 'Person', name: MARCA.fundador },
        address: {
          '@type': 'PostalAddress',
          addressLocality: 'San Jorge',
          addressRegion: 'Santa Fe',
          addressCountry: 'AR',
        },
        areaServed: ZONA,
        sameAs: [opts.instagram],
        hasOfferCatalog: {
          '@type': 'OfferCatalog',
          name: 'Sistemas para negocios',
          itemListElement: SERVICIOS.map((s) => ({
            '@type': 'Offer',
            itemOffered: { '@id': id(url, `servicio-${s.id}`) },
          })),
        },
      },
      {
        '@type': 'WebSite',
        '@id': id(url, 'sitio'),
        url,
        name: SEO_SITIO.nombre,
        inLanguage: 'es-AR',
        publisher: { '@id': id(url, 'negocio') },
      },
      ...SERVICIOS.map((s) => servicioLd(url, s)),
    ],
  };
}

/** Página de un servicio: el Service y la miga de pan. */
export function jsonLdServicio(url: string, s: Servicio, nombrePagina: string) {
  return {
    '@context': 'https://schema.org',
    '@graph': [
      servicioLd(url, s),
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: SEO_SITIO.nombre, item: url },
          { '@type': 'ListItem', position: 2, name: nombrePagina, item: `${url}${s.pagina}` },
        ],
      },
    ],
  };
}

/** Serializa para <script type="application/ld+json">: "<" escapado (nada puede cerrar la etiqueta). */
export const serializarLd = (dato: unknown) => JSON.stringify(dato).replace(/</g, '\\u003c');
