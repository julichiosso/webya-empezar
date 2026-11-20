// Pasa los trazos de un SVG del logo (por defecto public/webya-logo.svg, el de Julián) a
// src/brand/logo/trazos.ts, en el orden de lectura (w, e, b, y, a). Después: node scripts/optimizar-logo.mjs
// Uso: node scripts/usar-logo.mjs [archivo.svg]
import { readFileSync, writeFileSync } from 'node:fs';

const svg = readFileSync(process.argv[2] ?? 'public/webya-logo.svg', 'utf8');
const trazos = [...svg.matchAll(/ d="([^"]+)"/g)].map((m) => m[1]);
// El calco original guarda las letras en este orden.
const ORDEN_FUENTE = ['y', 'w', 'e', 'a', 'b'];
if (trazos.length !== ORDEN_FUENTE.length)
  throw new Error(`se esperaban 5 trazos, hay ${trazos.length}`);
const por = Object.fromEntries(ORDEN_FUENTE.map((l, i) => [l, trazos[i]]));

const ARCHIVO = 'src/brand/logo/trazos.ts';
let ts = readFileSync(ARCHIVO, 'utf8');
for (const letra of ['w', 'e', 'b', 'y', 'a']) {
  const re = new RegExp(`(letra: '${letra}',\\s*d: ')[^']+(')`);
  if (!re.test(ts)) throw new Error(`no encontré la letra ${letra}`);
  ts = ts.replace(re, (_m, a, b) => `${a}${por[letra]}${b}`);
}
writeFileSync(ARCHIVO, ts);
