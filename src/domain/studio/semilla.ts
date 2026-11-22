/**
 * Datos de ejemplo con semilla: la misma semilla da siempre la misma secuencia (las demos y sus tests son
 * reproducibles). Nombres argentinos ficticios combinados al azar: nunca una persona real.
 */

/** Generador mulberry32: chico, rápido y suficiente para datos de ejemplo. */
export function generador(semilla: number) {
  let t = semilla >>> 0;
  return () => {
    t = (t + 0x6d2b79f5) >>> 0;
    let r = Math.imul(t ^ (t >>> 15), 1 | t);
    r = (r + Math.imul(r ^ (r >>> 7), 61 | r)) ^ r;
    return ((r ^ (r >>> 14)) >>> 0) / 4294967296;
  };
}

export const NOMBRES = [
  'Lucía',
  'Martina',
  'Sofía',
  'Valentina',
  'Camila',
  'Julieta',
  'Agustina',
  'Florencia',
  'Paula',
  'Carla',
  'Mateo',
  'Tomás',
  'Santiago',
  'Benjamín',
  'Joaquín',
  'Lautaro',
  'Franco',
  'Nicolás',
  'Facundo',
  'Ignacio',
] as const;

export const APELLIDOS = [
  'Bianchi',
  'Ferreyra',
  'Gaitán',
  'Rossi',
  'Quiroga',
  'Medina',
  'Cáceres',
  'Bustos',
  'Peralta',
  'Sosa',
  'Gómez',
  'Acosta',
  'Villalba',
  'Ledesma',
  'Molina',
  'Aguirre',
  'Correa',
  'Ojeda',
  'Paz',
  'Luna',
] as const;

export function elegir<T>(azar: () => number, lista: readonly T[]): T {
  return lista[Math.floor(azar() * lista.length)]!;
}

/** "Nombre Apellido" ficticio. */
export const persona = (azar: () => number) =>
  `${elegir(azar, NOMBRES)} ${elegir(azar, APELLIDOS)}`;

/** Pesos argentinos sin decimales: $ 12.500. */
export const pesos = (n: number) =>
  new Intl.NumberFormat('es-AR', {
    style: 'currency',
    currency: 'ARS',
    maximumFractionDigits: 0,
  }).format(n);
