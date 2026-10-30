/**
 * Caja que ocupa el `d` de un <path> (en unidades de la grilla), para verificar que cada ícono y
 * cada dibujo quede dentro de su zona viva. La usan los tests; no se importa en la UI.
 * Las curvas Bézier se acotan por sus puntos de control (cota conservadora) y los arcos por sus
 * extremos reales.
 */
export interface Caja {
  minX: number;
  minY: number;
  maxX: number;
  maxY: number;
}

const ARGS: Record<string, number> = { M: 2, L: 2, H: 1, V: 1, C: 6, S: 4, Q: 4, T: 2, A: 7, Z: 0 };

export function cajaDePath(d: string): Caja {
  const caja: Caja = { minX: Infinity, minY: Infinity, maxX: -Infinity, maxY: -Infinity };
  const sumar = (x: number, y: number) => {
    caja.minX = Math.min(caja.minX, x);
    caja.minY = Math.min(caja.minY, y);
    caja.maxX = Math.max(caja.maxX, x);
    caja.maxY = Math.max(caja.maxY, y);
  };
  const tokens = d.match(/[MLHVCSQTAZ]|-?(?:\d*\.\d+|\d+\.?)(?:e[-+]?\d+)?/gi) ?? [];
  let x = 0;
  let y = 0;
  let x0 = 0;
  let y0 = 0;
  let cmd = '';
  let i = 0;
  const num = () => Number(tokens[i++]);

  while (i < tokens.length) {
    if (/^[a-z]$/i.test(tokens[i]!)) cmd = tokens[i++]!;
    else if (!cmd) throw new Error(`path sin comando: ${d}`);
    const C = cmd.toUpperCase();
    const rel = cmd !== C;
    if (C === 'Z') {
      x = x0;
      y = y0;
      continue;
    }
    const n = ARGS[C];
    if (n === undefined) throw new Error(`comando desconocido ${cmd}`);
    const a = Array.from({ length: n }, num);
    if (a.some(Number.isNaN)) throw new Error(`path mal formado: ${d}`);
    const ox = rel ? x : 0;
    const oy = rel ? y : 0;
    if (C === 'H') {
      x = a[0]! + ox;
    } else if (C === 'V') {
      y = a[0]! + oy;
    } else if (C === 'A') {
      const [rx, ry, rot, fa, fs, ax, ay] = a as [
        number,
        number,
        number,
        number,
        number,
        number,
        number,
      ];
      const x2 = ax + ox;
      const y2 = ay + oy;
      if (rot !== 0) throw new Error('arcos rotados no están soportados');
      for (const [px, py] of extremosDeArco(x, y, rx, ry, fa, fs, x2, y2)) sumar(px, py);
      x = x2;
      y = y2;
    } else {
      for (let k = 0; k < n; k += 2) sumar(a[k]! + ox, a[k + 1]! + oy);
      x = a[n - 2]! + ox;
      y = a[n - 1]! + oy;
    }
    sumar(x, y);
    if (C === 'M') {
      x0 = x;
      y0 = y;
      cmd = rel ? 'l' : 'L'; // pares extra después de un M son líneas
    }
  }
  return caja;
}

/** Puntos extremos (en 0°, 90°, 180° y 270°) que el arco realmente recorre. */
function extremosDeArco(
  x1: number,
  y1: number,
  rxIn: number,
  ryIn: number,
  fa: number,
  fs: number,
  x2: number,
  y2: number,
): [number, number][] {
  let rx = Math.abs(rxIn);
  let ry = Math.abs(ryIn);
  if (rx === 0 || ry === 0) return [[x2, y2]];
  const xp = (x1 - x2) / 2;
  const yp = (y1 - y2) / 2;
  const lambda = (xp * xp) / (rx * rx) + (yp * yp) / (ry * ry);
  if (lambda > 1) {
    rx *= Math.sqrt(lambda);
    ry *= Math.sqrt(lambda);
  }
  const num = rx * rx * ry * ry - rx * rx * yp * yp - ry * ry * xp * xp;
  const den = rx * rx * yp * yp + ry * ry * xp * xp;
  const coef = (fa === fs ? -1 : 1) * Math.sqrt(Math.max(0, num / den));
  const cxp = (coef * rx * yp) / ry;
  const cyp = (-coef * ry * xp) / rx;
  const cx = cxp + (x1 + x2) / 2;
  const cy = cyp + (y1 + y2) / 2;
  const t1 = Math.atan2((yp - cyp) / ry, (xp - cxp) / rx);
  const t2 = Math.atan2((-yp - cyp) / ry, (-xp - cxp) / rx);
  let delta = t2 - t1;
  if (fs === 0 && delta > 0) delta -= 2 * Math.PI;
  if (fs === 1 && delta < 0) delta += 2 * Math.PI;

  const puntos: [number, number][] = [[x2, y2]];
  for (let k = -6; k <= 6; k++) {
    const t = (k * Math.PI) / 2;
    const recorrido = delta >= 0 ? t >= t1 && t <= t1 + delta : t <= t1 && t >= t1 + delta;
    if (recorrido) puntos.push([cx + rx * Math.cos(t), cy + ry * Math.sin(t)]);
  }
  return puntos;
}

/** Une varias cajas en una. */
export function unirCajas(cajas: Caja[]): Caja {
  return cajas.reduce(
    (a, c) => ({
      minX: Math.min(a.minX, c.minX),
      minY: Math.min(a.minY, c.minY),
      maxX: Math.max(a.maxX, c.maxX),
      maxY: Math.max(a.maxY, c.maxY),
    }),
    { minX: Infinity, minY: Infinity, maxX: -Infinity, maxY: -Infinity },
  );
}
