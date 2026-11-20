// Suaviza el logo calcado (public/webya-logo.svg): saca la escalera de píxeles de los bordes.
// 1) Simplifica cada contorno (Ramer–Douglas–Peucker) y 2) redondea los vértices de giro suave con curvas
// cuadráticas que pasan por los puntos medios; las esquinas marcadas (la w, los cortes) quedan rectas.
// Uso: node scripts/suavizar-logo.mjs [tolerancia] [anguloEsquina] → escribe public/webya-logo-limpio.svg
// (opcional: hoy el sitio usa el SVG original de Julián tal cual)
import { readFileSync, writeFileSync } from 'node:fs';

const TOL = Number(process.argv[2] ?? 1.1);
const ESQUINA = (Number(process.argv[3] ?? 38) * Math.PI) / 180;

const fuente = readFileSync('public/webya-logo.svg', 'utf8');
const paths = [...fuente.matchAll(/<path d="([^"]+)"/g)].map((m) => m[1]);

function contornos(d) {
  return d
    .split(/Z/i)
    .map((s) => [...s.matchAll(/(-?\d+(?:\.\d+)?),(-?\d+(?:\.\d+)?)/g)].map((m) => [+m[1], +m[2]]))
    .filter((c) => c.length > 2 && Math.abs(area(c)) > 40);
}

/** Área con signo (fórmula del cordón): los contornos de pocos píxeles son restos del calco. */
function area(c) {
  return (
    c.reduce((t, p, i) => {
      const q = c[(i + 1) % c.length];
      return t + p[0] * q[1] - q[0] * p[1];
    }, 0) / 2
  );
}

function distSeg(p, a, b) {
  const [x, y] = p;
  const dx = b[0] - a[0];
  const dy = b[1] - a[1];
  const l = dx * dx + dy * dy;
  const t = l ? Math.max(0, Math.min(1, ((x - a[0]) * dx + (y - a[1]) * dy) / l)) : 0;
  return Math.hypot(x - (a[0] + t * dx), y - (a[1] + t * dy));
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

/** Contorno cerrado: se corta en el punto más lejano al primero para que RDP no pierda el cierre. */
function simplificar(c) {
  let lejos = 0;
  let max = 0;
  c.forEach((p, i) => {
    const d = Math.hypot(p[0] - c[0][0], p[1] - c[0][1]);
    if (d > max) [max, lejos] = [d, i];
  });
  const a = rdp(c.slice(0, lejos + 1), TOL);
  const b = rdp([...c.slice(lejos), c[0]], TOL);
  return [...a.slice(0, -1), ...b.slice(0, -1)];
}

const r = (n) => Math.round(n * 10) / 10;
const medio = (a, b) => [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2];

function giro(a, b, c) {
  const u = Math.atan2(b[1] - a[1], b[0] - a[0]);
  const v = Math.atan2(c[1] - b[1], c[0] - b[0]);
  let d = Math.abs(v - u);
  if (d > Math.PI) d = 2 * Math.PI - d;
  return d;
}

function aPath(pts) {
  const n = pts.length;
  const suave = pts.map((p, i) => giro(pts[(i - 1 + n) % n], p, pts[(i + 1) % n]) < ESQUINA);
  // Arranca en una esquina si hay (o en el medio de un tramo suave).
  let inicio = suave.findIndex((s) => !s);
  if (inicio < 0) inicio = 0;
  const p0 = suave[inicio] ? medio(pts[inicio], pts[(inicio + 1) % n]) : pts[inicio];
  let d = `M${r(p0[0])} ${r(p0[1])}`;
  for (let k = 1; k <= n; k++) {
    const i = (inicio + k) % n;
    const p = pts[i];
    const sig = pts[(i + 1) % n];
    if (suave[i]) {
      const m = medio(p, sig);
      d += `Q${r(p[0])} ${r(p[1])} ${r(m[0])} ${r(m[1])}`;
    } else {
      d += `L${r(p[0])} ${r(p[1])}`;
    }
  }
  return `${d}Z`;
}

const nuevos = paths.map((d) =>
  contornos(d)
    .map((c) => aPath(simplificar(c)))
    .join(''),
);
const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1217 281" role="img" aria-label="Webya" width="1217" height="281"><g fill="#000" fill-rule="evenodd">${nuevos
  .map((d) => `<path d="${d}"/>`)
  .join('')}</g></svg>`;
writeFileSync('public/webya-logo-limpio.svg', svg);
// eslint-disable-next-line no-console -- herramienta de línea de comandos: el reporte es la salida
console.log(`logo limpio: ${paths.join('').length} → ${nuevos.join('').length} caracteres`);
