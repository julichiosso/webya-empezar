// Consulta las coordenadas oficiales de cada localidad candidata en la API Georef (datos.gob.ar, IGN) y
// calcula la distancia real (haversine) a su ciudad principal. Sirve para armar y verificar
// src/content/zona.ts. Uso: node scripts/zona-localidades.mjs
const CANDIDATAS = [
  ['San Jorge', 'santa fe', 'san-jorge'],
  ['Sastre', 'santa fe', 'san-jorge'],
  ['Crispi', 'santa fe', 'san-jorge'],
  ['Traill', 'santa fe', 'san-jorge'],
  ['María Juana', 'santa fe', 'san-jorge'],
  ['Carlos Pellegrini', 'santa fe', 'san-jorge'],
  ['Piamonte', 'santa fe', 'san-jorge'],
  ['Landeta', 'santa fe', 'san-jorge'],
  ['Cañada Rosquín', 'santa fe', 'san-jorge'],
  ['El Trébol', 'santa fe', 'san-jorge'],
  ['San Francisco', 'cordoba', 'san-francisco'],
  ['Frontera', 'santa fe', 'san-francisco'],
  ['Josefina', 'santa fe', 'san-francisco'],
  ['Devoto', 'cordoba', 'san-francisco'],
  ['Freyre', 'cordoba', 'san-francisco'],
  ['Porteña', 'cordoba', 'san-francisco'],
  ['Brinkmann', 'cordoba', 'san-francisco'],
  ['Colonia Vignaud', 'cordoba', 'san-francisco'],
  ['Alicia', 'cordoba', 'san-francisco'],
  ['Sacanta', 'cordoba', 'san-francisco'],
  ['Las Varillas', 'cordoba', 'san-francisco'],
  ['Morteros', 'cordoba', 'san-francisco'],
  ['La Francia', 'cordoba', 'san-francisco'],
  ['Colonia Marina', 'cordoba', 'san-francisco'],
  ['Colonia Iturraspe', 'cordoba', 'san-francisco'],
  ['Quebracho Herrado', 'cordoba', 'san-francisco'],
  ['Colonia Prosperidad', 'cordoba', 'san-francisco'],
  ['Luxardo', 'cordoba', 'san-francisco'],
];

const R = 6371;
const rad = (g) => (g * Math.PI) / 180;
function km(a, b) {
  const d =
    Math.sin(rad(b.lat - a.lat) / 2) ** 2 +
    Math.cos(rad(a.lat)) * Math.cos(rad(b.lat)) * Math.sin(rad(b.lon - a.lon) / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(d));
}

const salida = [];
for (const [nombre, provincia, zona] of CANDIDATAS) {
  const url = `https://apis.datos.gob.ar/georef/api/localidades?nombre=${encodeURIComponent(nombre)}&provincia=${encodeURIComponent(provincia)}&campos=nombre,centroide,provincia.nombre,departamento.nombre&max=5&exacto=true`;
  const r = await fetch(url).then((x) => x.json());
  const l = r.localidades?.[0];
  if (!l) {
    salida.push({ nombre, provincia, zona, error: 'sin resultado' });
    continue;
  }
  salida.push({
    nombre: l.nombre,
    provincia: l.provincia.nombre,
    departamento: l.departamento?.nombre,
    zona,
    lat: Number(l.centroide.lat.toFixed(4)),
    lng: Number(l.centroide.lon.toFixed(4)),
  });
}
const centro = {
  'san-jorge': salida.find((s) => s.nombre === 'San Jorge'),
  'san-francisco': salida.find((s) => s.nombre === 'San Francisco'),
};
for (const s of salida) {
  if (s.error) continue;
  const c = centro[s.zona];
  s.km = Math.round(km({ lat: s.lat, lon: s.lng }, { lat: c.lat, lon: c.lng }));
}
// eslint-disable-next-line no-console -- herramienta de línea de comandos: el reporte es la salida
console.log(JSON.stringify(salida, null, 1));
const sj = centro['san-jorge'];
const sf = centro['san-francisco'];
// eslint-disable-next-line no-console -- idem
console.log(
  'San Jorge → San Francisco:',
  Math.round(km({ lat: sj.lat, lon: sj.lng }, { lat: sf.lat, lon: sf.lng })),
  'km en línea recta',
);
