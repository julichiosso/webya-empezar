// Genera public/fondos/curvas.svg: curvas de nivel finas (como un mapa topográfico) para el fondo de las
// secciones claras. Determinista (sin azar): siempre el mismo dibujo. Uso: node scripts/fondos.mjs
import { mkdirSync, writeFileSync } from 'node:fs';

const ANCHO = 1200;
const ALTO = 900;
const CX = 860;
const CY = 300;
const ANILLOS = 16;
const PASOS = 48;

const r = (n) => Math.round(n * 10) / 10;

function anillo(k) {
  const base = 40 + k * 46;
  const pts = Array.from({ length: PASOS }, (_, i) => {
    const t = (i / PASOS) * Math.PI * 2;
    // Ondulación suave que crece hacia afuera: cada anillo se deforma un poco distinto.
    const onda =
      1 +
      0.09 * Math.sin(3 * t + k * 0.35) +
      0.05 * Math.sin(5 * t - k * 0.2) +
      0.03 * Math.cos(7 * t + k * 0.5);
    return [CX + Math.cos(t) * base * 1.25 * onda, CY + Math.sin(t) * base * onda];
  });
  // Curva suave: cada punto es control de una cuadrática entre los puntos medios vecinos.
  const medio = (a, b) => [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2];
  const m0 = medio(pts[PASOS - 1], pts[0]);
  let d = `M${r(m0[0])} ${r(m0[1])}`;
  pts.forEach((p, i) => {
    const m = medio(p, pts[(i + 1) % PASOS]);
    d += `Q${r(p[0])} ${r(p[1])} ${r(m[0])} ${r(m[1])}`;
  });
  return `${d}Z`;
}

const caminos = Array.from({ length: ANILLOS }, (_, k) => `<path d="${anillo(k)}"/>`).join('');
const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${ANCHO} ${ALTO}" width="${ANCHO}" height="${ALTO}"><g fill="none" stroke="#0a0a0a" stroke-width="1">${caminos}</g></svg>`;
mkdirSync('public/fondos', { recursive: true });
writeFileSync('public/fondos/curvas.svg', svg);
