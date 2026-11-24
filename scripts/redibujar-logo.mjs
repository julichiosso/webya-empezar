// Redibuja el wordmark de Webya en vector limpio: las mismas letras del SVG de Julián (public/webya-logo.svg,
// un calco con bordes serruchados), reconstruidas con rectas, elipses y curvas medidas sobre el calco, en
// sus mismas coordenadas (encuadre 0 0 1217 281). Así ningún componente cambia y el logo se ve nítido a
// cualquier tamaño.
//
// Cada letra es un solo trazo con regla nonzero: las formas van en sentido horario y los huecos (ojos de
// la e, la b y la a) en antihorario.
//
// Uso: node scripts/redibujar-logo.mjs → escribe src/brand/logo/trazos.ts y public/webya-logo-vector.svg
import { readFileSync, writeFileSync } from 'node:fs';

const n = (v) => +v.toFixed(2);
const pt = (x, y) => `${n(x)} ${n(y)}`;
const rad = (g) => (g * Math.PI) / 180;
/** Punto de una elipse a un ángulo (grados, sentido horario en pantalla desde las 3). */
const enElipse = (e, g) => [e.cx + e.rx * Math.cos(rad(g)), e.cy + e.ry * Math.sin(rad(g))];
/** Ángulo de la elipse a una altura dada, del lado derecho (0..90 o -90..0). */
const anguloAltura = (e, y) => (Math.asin((y - e.cy) / e.ry) * 180) / Math.PI;

/** Elipse completa como dos arcos. `horario`: forma; antihorario: hueco. */
function elipse(e, horario = true) {
  const s = horario ? 1 : 0;
  return (
    `M${pt(e.cx + e.rx, e.cy)}` +
    `A${n(e.rx)} ${n(e.ry)} 0 1 ${s} ${pt(e.cx - e.rx, e.cy)}` +
    `A${n(e.rx)} ${n(e.ry)} 0 1 ${s} ${pt(e.cx + e.rx, e.cy)}Z`
  );
}
const rect = (x0, y0, x1, y1) => `M${pt(x0, y0)}H${n(x1)}V${n(y1)}H${n(x0)}Z`;

// ── w: dos V con el pico del medio redondeado. Brazos de 37 de ancho horizontal, pies planos de 22.
const w =
  `M${pt(140, 59)}L${pt(176.5, 59)}L${pt(221, 155)}L${pt(249.5, 99.5)}` +
  `A22 22 0 0 1 ${pt(281.5, 99)}L${pt(310, 155)}L${pt(355.5, 59)}L${pt(394, 59)}` +
  `L${pt(321, 209)}L${pt(299.5, 209)}L${pt(266, 141.5)}L${pt(231, 209)}L${pt(209.5, 209)}Z`;

// ── e: anillo con la barra al ras del borde derecho y el corte del remate a ~30°.
const eExt = { cx: 461, cy: 134.5, rx: 81, ry: 78.5 };
const eInt = { cx: 461.5, cy: 134, rx: 47.5, ry: 48 };
const barra = { arriba: 119, abajo: 145 };
const e = (() => {
  const remateExt = enElipse(eExt, 31);
  const remateInt = enElipse(eInt, 33);
  const gBarraExt = anguloAltura(eExt, barra.abajo); // borde exterior a la altura de la barra
  const finExt = enElipse(eExt, gBarraExt);
  // Ojo de abajo: la barra se une al interior por la izquierda.
  const gIntAbajo = 180 - anguloAltura(eInt, barra.abajo);
  const izqAbajo = enElipse(eInt, gIntAbajo);
  const contorno =
    `M${pt(...remateExt)}` +
    // de 31° a 360°+gBarraExt pasando por abajo, izquierda y arriba: arco grande, horario
    `A${eExt.rx} ${eExt.ry} 0 1 1 ${pt(...finExt)}` +
    `L${pt(izqAbajo[0], barra.abajo)}` +
    // interior de abajo, de la izquierda al remate, en antihorario (por abajo)
    `A${eInt.rx} ${eInt.ry} 0 0 0 ${pt(...remateInt)}Z`;
  // Ojo de arriba: entre el interior y la barra, antihorario.
  const gIntArriba = anguloAltura(eInt, barra.arriba); // negativo (arriba del centro)
  const derArriba = enElipse(eInt, gIntArriba);
  const izqArriba = enElipse(eInt, 180 - gIntArriba);
  const ojo = `M${pt(...derArriba)}A${eInt.rx} ${eInt.ry} 0 0 0 ${pt(...izqArriba)}Z`;
  return contorno + ojo;
})();

// ── b: asta y panza; el ojo toca el asta.
const b =
  rect(552, 4, 584, 209) +
  elipse({ cx: 642, cy: 134.5, rx: 80, ry: 79.5 }) +
  elipse({ cx: 636, cy: 133.5, rx: 52, ry: 48.5 }, false) +
  // Relleno de la muesca de abajo (panza con asta): a tamaño chico parecía un corte.
  rect(584, 189, 614, 209);

// ── y: brazo izquierdo recto y el derecho que se curva en la cola, terminada en punta.
const y =
  // brazo izquierdo (paralelogramo que se mete en el derecho)
  `M${pt(706, 59)}L${pt(747, 59)}L${pt(817, 188)}L${pt(793, 210)}Z` +
  // brazo derecho y cola: borde exterior bajando, borde interior subiendo
  `M${pt(875, 59)}L${pt(915, 59)}L${pt(840, 183)}` +
  `C${pt(796, 255.3)} ${pt(752.3, 292)} ${pt(671, 267)}` +
  `C${pt(721, 264)} ${pt(766.4, 233.7)} ${pt(806, 170)}Z`;

// ── a: panza y asta a la derecha; el ojo toca el asta.
const a =
  elipse({ cx: 977, cy: 134.5, rx: 80, ry: 79.5 }) +
  elipse({ cx: 982, cy: 133.5, rx: 52, ry: 48.5 }, false) +
  rect(1034, 59, 1065, 209) +
  // Relleno de la muesca de arriba (panza con asta): a tamaño chico parecía un corte.
  rect(1001, 59, 1034, 80);

const TRAZOS = { w, e, b, y, a };

// trazos.ts: reemplaza cada `d` manteniendo el resto del archivo.
const ARCHIVO = 'src/brand/logo/trazos.ts';
let ts = readFileSync(ARCHIVO, 'utf8');
ts = ts.replace(
  /^\/\/ GENERADO[^\n]*\n/,
  '// GENERADO con scripts/redibujar-logo.mjs: el wordmark de Julián (public/webya-logo.svg) redibujado en vector limpio, en las mismas coordenadas. No editar a mano.\n',
);
for (const [letra, d] of Object.entries(TRAZOS)) {
  const re = new RegExp(`(letra: '${letra}',\\s*d: ')[^']+(')`);
  if (!re.test(ts)) throw new Error(`no encontré la letra ${letra}`);
  ts = ts.replace(re, (_m, i, f) => `${i}${d}${f}`);
}
writeFileSync(ARCHIVO, ts);

const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="136 0 934 281" width="934" height="281" role="img" aria-label="Webya"><g fill="#000">${Object.values(
  TRAZOS,
)
  .map((d) => `<path d="${d}"/>`)
  .join('')}</g></svg>\n`;
writeFileSync('public/webya-logo-vector.svg', svg);
process.stdout.write(
  `listo: ${Object.entries(TRAZOS)
    .map(([l, d]) => `${l} ${d.length}`)
    .join(', ')}
`,
);
