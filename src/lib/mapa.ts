/**
 * Geometría del mapa de la zona, en el servidor: proyección de coordenadas reales a la grilla del SVG, el
 * polígono suavizado que cubre las localidades de cada zona y la distancia real entre dos puntos.
 */

export interface Proyeccion {
  lon0: number;
  lat0: number;
  kx: number;
  escala: number;
}

export type Punto = readonly [number, number];

/** Coordenadas (grados) → punto del SVG, con la misma proyección que los trazados generados. */
export const proyectar = (p: Proyeccion, lat: number, lng: number): Punto => [
  (lng - p.lon0) * p.kx * p.escala,
  (p.lat0 - lat) * p.escala,
];

/** Distancia en línea recta (haversine), en km. */
export function distanciaKm(a: { lat: number; lng: number }, b: { lat: number; lng: number }) {
  const rad = (g: number) => (g * Math.PI) / 180;
  const d =
    Math.sin(rad(b.lat - a.lat) / 2) ** 2 +
    Math.cos(rad(a.lat)) * Math.cos(rad(b.lat)) * Math.sin(rad(b.lng - a.lng) / 2) ** 2;
  return 2 * 6371 * Math.asin(Math.sqrt(d));
}

/** Envolvente convexa (cadena monótona de Andrew). */
export function envolvente(puntos: readonly Punto[]): Punto[] {
  const p = [...puntos].sort((a, b) => a[0] - b[0] || a[1] - b[1]);
  if (p.length < 3) return p;
  const cruz = (o: Punto, a: Punto, b: Punto) =>
    (a[0] - o[0]) * (b[1] - o[1]) - (a[1] - o[1]) * (b[0] - o[0]);
  const abajo: Punto[] = [];
  for (const q of p) {
    while (abajo.length >= 2 && cruz(abajo[abajo.length - 2]!, abajo[abajo.length - 1]!, q) <= 0)
      abajo.pop();
    abajo.push(q);
  }
  const arriba: Punto[] = [];
  for (const q of [...p].reverse()) {
    while (
      arriba.length >= 2 &&
      cruz(arriba[arriba.length - 2]!, arriba[arriba.length - 1]!, q) <= 0
    )
      arriba.pop();
    arriba.push(q);
  }
  return [...abajo.slice(0, -1), ...arriba.slice(0, -1)];
}

/**
 * La zona como forma suave: la envolvente de sus localidades, agrandada `margen` unidades hacia afuera desde
 * el centro y redondeada (Chaikin). Nunca un círculo: sigue a las localidades reales.
 */
export function zonaSuave(puntos: readonly Punto[], margen: number, vueltas = 4): string {
  const h = envolvente(puntos);
  const cx = h.reduce((t, q) => t + q[0], 0) / h.length;
  const cy = h.reduce((t, q) => t + q[1], 0) / h.length;
  let anillo: Punto[] = h.map(([x, y]) => {
    const dx = x - cx;
    const dy = y - cy;
    const l = Math.hypot(dx, dy) || 1;
    return [x + (dx / l) * margen, y + (dy / l) * margen];
  });
  for (let v = 0; v < vueltas; v++) {
    const n: Punto[] = [];
    anillo.forEach((a, i) => {
      const b = anillo[(i + 1) % anillo.length]!;
      n.push([0.75 * a[0] + 0.25 * b[0], 0.75 * a[1] + 0.25 * b[1]]);
      n.push([0.25 * a[0] + 0.75 * b[0], 0.25 * a[1] + 0.75 * b[1]]);
    });
    anillo = n;
  }
  const r = (n: number) => Math.round(n * 10) / 10;
  return `${anillo.map((q, i) => `${i ? 'L' : 'M'}${r(q[0])} ${r(q[1])}`).join('')}Z`;
}

/** Rectángulo de vista (viewBox) de un mapa. */
export interface Vista {
  x: number;
  y: number;
  w: number;
  h: number;
}

/**
 * El encuadre justo para unos puntos: su caja más un margen (para nombres y zonas), sin salirse del mapa.
 * Así el mapa usa todo el ancho del celular en lo que importa, en lugar de mostrar campo vacío.
 */
export function encuadre(
  puntos: readonly (readonly [number, number])[],
  margen: { x: number; y: number },
  limites: { ancho: number; alto: number },
): Vista {
  const xs = puntos.map((p) => p[0]);
  const ys = puntos.map((p) => p[1]);
  const x = Math.max(0, Math.min(...xs) - margen.x);
  const y = Math.max(0, Math.min(...ys) - margen.y);
  const w = Math.min(limites.ancho, Math.max(...xs) + margen.x) - x;
  const h = Math.min(limites.alto, Math.max(...ys) + margen.y) - y;
  return { x: Math.round(x), y: Math.round(y), w: Math.round(w), h: Math.round(h) };
}
