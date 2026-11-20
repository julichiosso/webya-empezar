// Genera src/config/zona-geo.ts: el límite entre Santa Fe y Córdoba y las rutas principales, recortados al
// encuadre de las dos zonas, simplificados (Ramer–Douglas–Peucker) y proyectados a la grilla del SVG.
//
// Fuentes (datos abiertos):
// - Límites provinciales: IGN (Instituto Geográfico Nacional), servicio WFS `ign:provincia`
//   (https://wms.ign.gob.ar/geoserver/ign/ows), licencia CC BY 4.0.
// - Rutas: OpenStreetMap (Overpass API), © colaboradores de OpenStreetMap, licencia ODbL.
// - Localidades: API Georef (datos.gob.ar), ver scripts/zona-localidades.mjs.
//
// Uso: node scripts/mapa-zona.mjs <provincias.json (WFS IGN)> <rutas.json (Overpass)>
import { readFileSync, writeFileSync } from 'node:fs';

const [archivoProvincias, archivoRutas] = process.argv.slice(2);

/** Encuadre (grados) y proyección equirectangular con la escala de la latitud media. */
const LON0 = -62.52;
const LON1 = -61.4;
const LAT0 = -30.9; // arriba
const LAT1 = -32.32; // abajo
const KX = Math.cos((((LAT0 + LAT1) / 2) * Math.PI) / 180);
const ANCHO = 600;
const ESCALA = ANCHO / ((LON1 - LON0) * KX);
const ALTO = Math.round((LAT0 - LAT1) * ESCALA);

const x = (lon) => (lon - LON0) * KX * ESCALA;
const y = (lat) => (LAT0 - lat) * ESCALA;
const r1 = (n) => Math.round(n * 10) / 10;
const MARGEN = 0.08; // grados de más alrededor del encuadre, para que las líneas lleguen al borde
const dentro = ([lon, lat]) =>
  lon >= LON0 - MARGEN && lon <= LON1 + MARGEN && lat <= LAT0 + MARGEN && lat >= LAT1 - MARGEN;

function distSeg(p, a, b) {
  const dx = b[0] - a[0];
  const dy = b[1] - a[1];
  const l = dx * dx + dy * dy;
  const t = l ? Math.max(0, Math.min(1, ((p[0] - a[0]) * dx + (p[1] - a[1]) * dy) / l)) : 0;
  return Math.hypot(p[0] - (a[0] + t * dx), p[1] - (a[1] + t * dy));
}
function rdp(pts, tol) {
  if (pts.length < 3) return pts;
  let max = 0;
  let idx = 0;
  for (let i = 1; i < pts.length - 1; i++) {
    const d = distSeg(pts[i], pts[0], pts[pts.length - 1]);
    if (d > max) [max, idx] = [d, i];
  }
  if (max <= tol) return [pts[0], pts[pts.length - 1]];
  return [...rdp(pts.slice(0, idx + 1), tol).slice(0, -1), ...rdp(pts.slice(idx), tol)];
}

/** Tramos consecutivos de una línea que caen dentro del encuadre, proyectados y simplificados. */
function tramos(coords, tol = 0.8) {
  const salida = [];
  let actual = [];
  for (const c of coords) {
    if (dentro(c)) actual.push([x(c[0]), y(c[1])]);
    else if (actual.length) {
      salida.push(actual);
      actual = [];
    }
  }
  if (actual.length) salida.push(actual);
  return salida.filter((t) => t.length > 1).map((t) => rdp(t, tol));
}
const aPath = (t) => t.map((p, i) => `${i ? 'L' : 'M'}${r1(p[0])} ${r1(p[1])}`).join('');

// ---- Límite Santa Fe / Córdoba: el contorno de Córdoba dentro del encuadre --------------------
const provincias = JSON.parse(readFileSync(archivoProvincias, 'utf8'));
const cordoba = provincias.features.find((f) => /c[oó]rdoba/i.test(JSON.stringify(f.properties)));
if (!cordoba) throw new Error('No encontré Córdoba en el archivo de provincias');
const anillos =
  cordoba.geometry.type === 'MultiPolygon'
    ? cordoba.geometry.coordinates.flat()
    : cordoba.geometry.coordinates;
const limite = anillos
  .flatMap((anillo) => tramos(anillo, 0.6))
  .map(aPath)
  .join('');

// ---- Rutas principales -------------------------------------------------------------------------
const RUTAS = ['RN19', 'RN34', 'RN158', 'RP13'];
const osm = JSON.parse(readFileSync(archivoRutas, 'utf8'));
const rutas = RUTAS.map((ref) => {
  const ways = osm.elements.filter((w) =>
    (w.tags.ref ?? '')
      .split(';')
      .map((s) => s.replace(/\s/g, ''))
      .includes(ref),
  );
  const partes = ways.flatMap((w) =>
    tramos(
      w.geometry.map((g) => [g.lon, g.lat]),
      1.2,
    ),
  );
  // Rótulo: el punto medio del tramo más largo.
  const largo = partes.reduce((a, b) => (b.length > a.length ? b : a), []);
  const medio = largo[Math.floor(largo.length / 2)] ?? [0, 0];
  return {
    ref: ref.replace(/^(RN|RP)/, '$1 '),
    d: partes.map(aPath).join(''),
    rotulo: [r1(medio[0]), r1(medio[1])],
  };
}).filter((r) => r.d);

const ts = `// GENERADO por scripts/mapa-zona.mjs (no editar a mano). Fuentes: límites provinciales del IGN (CC BY 4.0) y
// rutas de OpenStreetMap (ODbL). La proyección es la misma que usa lib/mapa.ts para ubicar las localidades.

export const MAPA_PROYECCION = {
  lon0: ${LON0},
  lat0: ${LAT0},
  kx: ${KX},
  escala: ${ESCALA},
  ancho: ${ANCHO},
  alto: ${ALTO},
} as const;

/** Límite entre Santa Fe y Córdoba dentro del encuadre (path del SVG). */
export const MAPA_LIMITE = '${limite}';

/** Rutas principales: trazado y punto para el rótulo. */
export const MAPA_RUTAS: readonly { ref: string; d: string; rotulo: readonly [number, number] }[] = ${JSON.stringify(rutas, null, 2)};
`;
writeFileSync('src/config/zona-geo.ts', ts);
// eslint-disable-next-line no-console -- herramienta de línea de comandos: el reporte es la salida
console.log(
  `zona-geo.ts: ${(ts.length / 1024).toFixed(1)} KB, ${ANCHO}×${ALTO}, rutas: ${rutas.map((r) => r.ref).join(', ')}`,
);
