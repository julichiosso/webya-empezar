/**
 * Sugerencias del celular: un aviso chico que aparece según la sección que la persona está mirando (no
 * por reloj). Cada una dice una sola cosa y ofrece una sola acción. `seccion` es el selector CSS de la
 * sección que la dispara; `href: 'whatsapp'` abre WhatsApp con el mensaje de contacto.
 */
export interface Sugerencia {
  id: string;
  ruta: string;
  seccion: string;
  texto: string;
  accion: string;
  href: string;
}

export const SUGERENCIAS: readonly Sugerencia[] = [
  {
    id: 'inicio-escenas',
    ruta: '/',
    seccion: 'section[aria-labelledby="titulo-escenas"]',
    texto: '¿Tenés peluquería o consultorio? Mirá cómo reservan tus clientes.',
    accion: 'Ver demo',
    href: '/demos/turnos',
  },
  {
    id: 'inicio-que-armamos',
    ruta: '/',
    seccion: '#que-armamos',
    texto: '¿No sabés por dónde empezar? Elegí lo que necesitás.',
    accion: 'Armá tu sistema',
    href: '/armar',
  },
  {
    id: 'inicio-proyectos',
    ruta: '/',
    seccion: '#proyectos',
    texto: 'Mirá cómo lo usan negocios de la zona, todos los días.',
    accion: 'Ver proyectos',
    href: '/proyectos',
  },
  {
    id: 'turnero',
    ruta: '/turnero',
    seccion: 'section[aria-labelledby="titulo-producto"]',
    texto: '¿Tenés peluquería o consultorio? Probá la demo de turnos.',
    accion: 'Ver demo',
    href: '/demos/turnos',
  },
  {
    id: 'pedidos',
    ruta: '/pedidos',
    seccion: 'section[aria-labelledby="titulo-producto"]',
    texto: 'Hacé un pedido de prueba y mirá cómo llega la comanda.',
    accion: 'Ver demo',
    href: '/demos/pedidos',
  },
  {
    id: 'tienda',
    ruta: '/tienda',
    seccion: 'section[aria-labelledby="titulo-producto"]',
    texto: 'Armá una tienda de prueba con tu rubro y tus colores.',
    accion: 'Ver demo',
    href: '/demos/tienda',
  },
  {
    id: 'web',
    ruta: '/web',
    seccion: 'section[aria-labelledby="titulo-producto"]',
    texto: 'Recorré una página de ejemplo para tu rubro.',
    accion: 'Ver demo',
    href: '/demos/web',
  },
  {
    id: 'campo',
    ruta: '/campo',
    seccion: 'section[aria-labelledby="titulo-soluciones"]',
    texto: '¿Algo del campo que hoy hacés a mano? Contanos.',
    accion: 'Escribinos',
    href: 'whatsapp',
  },
  {
    id: 'zona',
    ruta: '/zona',
    seccion: 'section[aria-label]',
    texto: 'Estamos en tu zona. Escribinos y lo hablamos.',
    accion: 'Escribinos',
    href: 'whatsapp',
  },
  {
    id: 'proyectos',
    ruta: '/proyectos',
    seccion: '#proyectos',
    texto: '¿Querés algo así para tu negocio?',
    accion: 'Armá tu sistema',
    href: '/armar',
  },
];

export const SUGERENCIAS_UI = {
  etiqueta: 'Sugerencia',
  cerrar: 'Cerrar sugerencia',
} as const;

/** Reglas anti-molestia: una a la vez, tres por visita, unos segundos a la vista. */
export const REGLAS_SUGERENCIAS = {
  maxPorVisita: 3,
  esperaMs: 1200,
  duraMs: 7000,
} as const;
