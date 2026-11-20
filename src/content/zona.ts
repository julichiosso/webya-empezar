/**
 * MANIFIESTO DE LA ZONA DE ATENCIÓN. Única fuente de la página /zona: el mapa, las listas, el contador, el
 * JSON-LD (areaServed) y el buscador. Coordenadas oficiales de la API Georef (datos.gob.ar, IGN), verificadas
 * con scripts/zona-localidades.mjs. Para sumar o sacar una localidad alcanza con editar esta lista.
 *
 * Lista final elegida por Julián. Otras localidades verificadas que se pueden sumar con una línea (distancia
 * en línea recta a su ciudad principal): Josefina (9 km), Quebracho Herrado (19), Colonia Iturraspe (24),
 * Colonia Marina (33), Colonia Prosperidad (35), Brinkmann (62); Crispi (24), Traill (15), Landeta (23).
 */

export type ZonaId = 'san-francisco' | 'san-jorge';

/** Dónde va el nombre respecto del punto (para que no se pisen). */
export type LadoEtiqueta = 'derecha' | 'izquierda' | 'arriba' | 'abajo';

export interface Localidad {
  slug: string;
  nombre: string;
  provincia: 'Santa Fe' | 'Córdoba';
  zona: ZonaId;
  lat: number;
  lng: number;
  principal: boolean;
  etiqueta: LadoEtiqueta;
}

export const ZONAS: Record<ZonaId, { nombre: string; provincia: string }> = {
  'san-francisco': { nombre: 'San Francisco y alrededores', provincia: 'Córdoba' },
  'san-jorge': { nombre: 'San Jorge y zona', provincia: 'Santa Fe' },
};

/** San Francisco primero (va primero en el título de la página). */
export const ORDEN_ZONAS: readonly ZonaId[] = ['san-francisco', 'san-jorge'];

export const LOCALIDADES: readonly Localidad[] = [
  // San Francisco y alrededores
  {
    slug: 'san-francisco',
    nombre: 'San Francisco',
    provincia: 'Córdoba',
    zona: 'san-francisco',
    lat: -31.4249,
    lng: -62.0839,
    principal: true,
    etiqueta: 'izquierda',
  },
  {
    slug: 'frontera',
    nombre: 'Frontera',
    provincia: 'Santa Fe',
    zona: 'san-francisco',
    lat: -31.4265,
    lng: -62.0592,
    principal: false,
    etiqueta: 'derecha',
  },
  {
    slug: 'devoto',
    nombre: 'Devoto',
    provincia: 'Córdoba',
    zona: 'san-francisco',
    lat: -31.4018,
    lng: -62.3062,
    principal: false,
    etiqueta: 'arriba',
  },
  {
    slug: 'freyre',
    nombre: 'Freyre',
    provincia: 'Córdoba',
    zona: 'san-francisco',
    lat: -31.1646,
    lng: -62.0963,
    principal: false,
    etiqueta: 'derecha',
  },
  {
    slug: 'portena',
    nombre: 'Porteña',
    provincia: 'Córdoba',
    zona: 'san-francisco',
    lat: -31.014,
    lng: -62.062,
    principal: false,
    etiqueta: 'derecha',
  },
  // San Jorge y zona
  {
    slug: 'san-jorge',
    nombre: 'San Jorge',
    provincia: 'Santa Fe',
    zona: 'san-jorge',
    lat: -31.8962,
    lng: -61.8597,
    principal: true,
    etiqueta: 'izquierda',
  },
  {
    slug: 'sastre',
    nombre: 'Sastre',
    provincia: 'Santa Fe',
    zona: 'san-jorge',
    lat: -31.7676,
    lng: -61.8289,
    principal: false,
    etiqueta: 'derecha',
  },
  {
    slug: 'maria-juana',
    nombre: 'María Juana',
    provincia: 'Santa Fe',
    zona: 'san-jorge',
    lat: -31.6756,
    lng: -61.7517,
    principal: false,
    etiqueta: 'derecha',
  },
  {
    slug: 'carlos-pellegrini',
    nombre: 'Carlos Pellegrini',
    provincia: 'Santa Fe',
    zona: 'san-jorge',
    lat: -32.0505,
    lng: -61.7827,
    principal: false,
    etiqueta: 'izquierda',
  },
  {
    slug: 'piamonte',
    nombre: 'Piamonte',
    provincia: 'Santa Fe',
    zona: 'san-jorge',
    lat: -32.1439,
    lng: -61.9804,
    principal: false,
    etiqueta: 'izquierda',
  },
  {
    slug: 'canada-rosquin',
    nombre: 'Cañada Rosquín',
    provincia: 'Santa Fe',
    zona: 'san-jorge',
    lat: -32.0544,
    lng: -61.6019,
    principal: false,
    etiqueta: 'abajo',
  },
  {
    slug: 'el-trebol',
    nombre: 'El Trébol',
    provincia: 'Santa Fe',
    zona: 'san-jorge',
    lat: -32.198,
    lng: -61.7019,
    principal: false,
    etiqueta: 'abajo',
  },
];

export const localidadesDe = (zona: ZonaId) => LOCALIDADES.filter((l) => l.zona === zona);
export const principalDe = (zona: ZonaId) =>
  LOCALIDADES.find((l) => l.zona === zona && l.principal)!;

/** Datos del hero, siempre desde la lista (nunca escritos a mano). */
export const datosZona = () => ({ zonas: ORDEN_ZONAS.length, localidades: LOCALIDADES.length });
