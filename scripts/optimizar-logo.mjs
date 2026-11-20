// Optimiza con SVGO los trazos del logo que van en línea en cada página (src/brand/logo/trazos.ts):
// misma forma, menos bytes (comandos relativos y abreviados). Uso: node scripts/optimizar-logo.mjs
import { readFileSync, writeFileSync } from 'node:fs';
import { optimize } from 'svgo';

const ARCHIVO = 'src/brand/logo/trazos.ts';
const fuente = readFileSync(ARCHIVO, 'utf8');
const trazos = [...fuente.matchAll(/d: '([^']+)'/g)].map((m) => m[1]);

const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1217 281">${trazos
  .map((d) => `<path d="${d}"/>`)
  .join('')}</svg>`;
const { data } = optimize(svg, {
  multipass: true,
  plugins: [{ name: 'preset-default', params: { overrides: { mergePaths: false } } }],
});
const nuevos = [...data.matchAll(/ d="([^"]+)"/g)].map((m) => m[1]);
if (nuevos.length !== trazos.length) throw new Error('SVGO cambió la cantidad de trazos');

let salida = fuente;
trazos.forEach((d, i) => {
  salida = salida.replace(`d: '${d}'`, `d: '${nuevos[i]}'`);
});
writeFileSync(ARCHIVO, salida);
const antes = trazos.join('').length;
const despues = nuevos.join('').length;
// eslint-disable-next-line no-console -- herramienta de línea de comandos: el reporte es la salida
console.log(`trazos del logo: ${antes} → ${despues} caracteres`);
