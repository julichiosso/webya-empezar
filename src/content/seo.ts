/**
 * Textos de SEO y de compartir: títulos, descripciones, imagen Open Graph y datos estructurados.
 * Lo que se ve en la pestaña, en Google y en la vista previa de WhatsApp/Instagram.
 */
import { LEMA, MARCA } from './home';
import { NOSOTROS } from './paginas';
import { LOCALIDADES } from './zona';
import { SERVICIOS, type Servicio } from './servicios';

/** Del sitio entero (app/layout.tsx). */
export const SEO_SITIO = {
  nombre: 'Webya',
  /** Título de la home (sin plantilla) y por defecto. */
  tituloInicio: `Webya · ${LEMA.join(' ')} Turnos, pedidos y tiendas online en San Jorge y zona`,
  descripcion:
    'Sistemas para negocios de San Jorge, San Francisco y la zona: turnero con seña, pedidos online para gastronomía, tiendas y páginas web. Armá el tuyo y envianos el pedido por WhatsApp.',
  /** Plantilla de Next: cada página reemplaza "%s" por su título. */
  plantillaTitulo: '%s | Webya',
  /** El mismo formato, para los títulos de Open Graph y Twitter (que no usan la plantilla). */
  tituloConMarca: (titulo: string) => `${titulo} | Webya`,
  og: {
    alt: `Webya: ${LEMA.join(' ')} Turnos, pedidos y tiendas online para negocios de San Jorge y zona.`,
    titulo: LEMA.join(' '),
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

/** Zona de atención para schema.org: cada localidad de /zona, con su provincia. */
const ZONA_LD = LOCALIDADES.map((l) => ({
  '@type': 'City',
  name: l.nombre,
  geo: { '@type': 'GeoCoordinates', latitude: l.lat, longitude: l.lng },
  containedInPlace: {
    '@type': 'State',
    name: l.provincia,
    containedInPlace: { '@type': 'Country', name: 'Argentina' },
  },
}));

const id = (url: string, frag: string) => `${url}/#${frag}`;

function servicioLd(url: string, s: Servicio) {
  return {
    '@type': 'Service',
    '@id': id(url, `servicio-${s.id}`),
    name: s.nombre,
    serviceType: s.nombre,
    description: s.descripcionSeo,
    provider: { '@id': id(url, 'negocio') },
    areaServed: ZONA_LD,
    url: `${url}${s.pagina ?? `/armar?tipo=${s.id}`}`,
  };
}

/**
 * Grafo del sitio: la organización (Webya), el negocio local (ProfessionalService, con dirección y zona),
 * la persona detrás (Julián), el sitio y un Service por producto. Todo enlazado por @id.
 */
export function jsonLdNegocio(opts: {
  url: string;
  email: string;
  instagram: string;
  telefono?: string;
}) {
  const { url } = opts;
  const telefono = opts.telefono ? { telephone: `+${opts.telefono}` } : {};
  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Organization',
        '@id': id(url, 'organizacion'),
        name: SEO_SITIO.nombre,
        url,
        logo: `${url}/icon.svg`,
        email: opts.email,
        ...telefono,
        founder: { '@id': id(url, 'julian') },
        sameAs: [opts.instagram],
      },
      {
        '@type': 'ProfessionalService',
        '@id': id(url, 'negocio'),
        name: SEO_SITIO.nombre,
        url,
        logo: `${url}/icon.svg`,
        image: `${url}/opengraph-image`,
        description: SEO_SITIO.descripcion,
        email: opts.email,
        ...telefono,
        parentOrganization: { '@id': id(url, 'organizacion') },
        founder: { '@id': id(url, 'julian') },
        address: {
          '@type': 'PostalAddress',
          addressLocality: 'San Jorge',
          addressRegion: 'Santa Fe',
          addressCountry: 'AR',
        },
        areaServed: ZONA_LD,
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
        '@type': 'Person',
        '@id': id(url, 'julian'),
        name: MARCA.fundador,
        jobTitle: NOSOTROS.cargo,
        url: `${url}/nosotros`,
        alumniOf: { '@type': 'CollegeOrUniversity', name: 'Universidad Tecnológica Nacional' },
        worksFor: { '@id': id(url, 'organizacion') },
        homeLocation: { '@type': 'City', name: 'San Jorge' },
      },
      {
        '@type': 'WebSite',
        '@id': id(url, 'sitio'),
        url,
        name: SEO_SITIO.nombre,
        inLanguage: 'es-AR',
        publisher: { '@id': id(url, 'organizacion') },
      },
      ...SERVICIOS.map((s) => servicioLd(url, s)),
    ],
  };
}

/** Página de un servicio: el Service y la miga de pan. */
export function jsonLdServicio(
  url: string,
  s: Servicio,
  nombrePagina: string,
  ruta: string = s.pagina ?? '/',
) {
  return {
    '@context': 'https://schema.org',
    '@graph': [
      servicioLd(url, s),
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: SEO_SITIO.nombre, item: url },
          { '@type': 'ListItem', position: 2, name: nombrePagina, item: `${url}${ruta}` },
        ],
      },
    ],
  };
}

/** Serializa para <script type="application/ld+json">: "<" escapado (nada puede cerrar la etiqueta). */
export const serializarLd = (dato: unknown) => JSON.stringify(dato).replace(/</g, '\\u003c');
