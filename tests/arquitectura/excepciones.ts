/**
 * Deuda registrada. Esta lista SOLO puede achicarse: el test falla si una entrada ya no hace falta.
 * Cada entrada dice quién la saca y en qué ola (docs/plan-sprint.md).
 */

/** "origen -> destino" (rutas dentro de src/, sin extensión) → motivo y dueño. */
export const EXCEPCIONES_CAPAS: Record<string, string> = {
  'brand/ilustracion/modulos/ModuloArte.tsx -> content/modulos':
    'Ola 2, ilustracion: el arte define sus ids y content los elige',
  'components/marketing/Hero.tsx -> features/explicativo/BotonExplicativo':
    'Ola 3, paginas: la página compone el botón (prop o slot)',
  'components/marketing/HeroMockup.tsx -> features/empezar/modulos-store':
    'Ola 3, paginas: el estado entra por props',
  'domain/leads/lead.ts -> content/demos/gastronomia/paletas':
    'Ola 1, integrador: el esquema recibe los catálogos por parámetro',
  'domain/leads/lead.ts -> content/demos/gastronomia/types':
    'Ola 1, integrador: el esquema recibe los catálogos por parámetro',
  'domain/leads/lead.ts -> content/modulos':
    'Ola 1, integrador: el esquema recibe los catálogos por parámetro',
  'domain/leads/lead.ts -> content/rubros':
    'Ola 1, integrador: el esquema recibe los catálogos por parámetro',
  'features/demo/gastronomia/compartir.ts -> features/empezar/desde-demo':
    'Ola 3, paginas: el traspaso demo → wizard baja a una capa común',
  'features/demo/gastronomia/DemoGastronomia.tsx -> features/empezar/desde-demo':
    'Ola 3, paginas: el traspaso demo → wizard baja a una capa común',
};

/** Archivo (ruta dentro de src/) → motivo y dueño. */
export const EXCEPCIONES_COPY: Record<string, string> = {};
