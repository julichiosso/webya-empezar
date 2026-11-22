import { ExtrudeGeometry, Shape, Vector2 } from 'three';

/**
 * El símbolo `<w>`: los corchetes de `<webya>` y la "w" del logo de Julián, redibujados como trazos de
 * ancho horizontal constante (como el logo) para extruirlos limpios. Tres piezas: `<`, `w`, `>`.
 * Unidades de escena: la "w" mide 2 de alto.
 */

/** Alto (mitad) de los trazos y ancho horizontal del trazo. */
const H = 1;
const ANCHO = 0.44;

/** Intersección de las rectas a1→a2 y b1→b2 (nunca son paralelas en este dibujo). */
function cruce(a1: Vector2, a2: Vector2, b1: Vector2, b2: Vector2): Vector2 {
  const d = (a1.x - a2.x) * (b1.y - b2.y) - (a1.y - a2.y) * (b1.x - b2.x);
  const t = ((a1.x - b1.x) * (b1.y - b2.y) - (a1.y - b1.y) * (b1.x - b2.x)) / d;
  return new Vector2(a1.x + t * (a2.x - a1.x), a1.y + t * (a2.y - a1.y));
}

function forma(puntos: Vector2[]): Shape {
  return new Shape(puntos);
}

/** `<` con la punta a la izquierda; `espejo` da `>`. Centrado en su caja. */
export function formaCorchete(espejo = false): Shape {
  const a = 0.78; // cuánto entra la punta
  const s = espejo ? -1 : 1;
  const x0 = (a - ANCHO) / 2; // centra la caja (de -a a ANCHO) en 0
  const p = (x: number, y: number) => new Vector2(s * (x + x0), y);
  const alto = H * 0.82;
  return forma(
    espejo
      ? [p(0, -alto), p(-a, 0), p(0, alto), p(ANCHO, alto), p(-a + ANCHO, 0), p(ANCHO, -alto)]
      : [p(0, alto), p(-a, 0), p(0, -alto), p(ANCHO, -alto), p(-a + ANCHO, 0), p(ANCHO, alto)],
  );
}

/**
 * La "w": cuatro trazos en zigzag, con el pico del medio más bajo (como en el logo). El contorno se arma
 * recorriendo los bordes y cortando en los encuentros internos.
 */
export function formaW(): Shape {
  const paso = 0.62;
  const medio = H * 0.42; // alto del pico del medio
  const x = [0, 1, 2, 3, 4].map((i) => (i - 2) * paso - ANCHO / 2);
  const y = [H, -H, medio, -H, H];
  const v = (i: number, dx = 0) => new Vector2(x[i]! + dx, y[i]!);
  // Bordes izquierdo (L) y derecho (R) de cada trazo i (de i a i+1).
  const L = (i: number) => [v(i), v(i + 1)] as const;
  const R = (i: number) => [v(i, ANCHO), v(i + 1, ANCHO)] as const;
  const I1 = cruce(...R(0), ...L(1));
  const J = cruce(...R(1), ...L(2));
  const I2 = cruce(...R(2), ...L(3));
  return forma([
    v(0),
    v(0, ANCHO),
    I1,
    v(2),
    v(2, ANCHO),
    I2,
    v(4),
    v(4, ANCHO),
    v(3, ANCHO),
    v(3),
    J,
    v(1, ANCHO),
    v(1),
  ]);
}

/** Profundidad de la extrusión y bisel: aristas que agarran la luz sin redondear la marca. */
export const EXTRUSION = {
  depth: 0.42,
  bevelEnabled: true,
  bevelThickness: 0.07,
  bevelSize: 0.05,
  bevelSegments: 4,
  curveSegments: 1,
} as const;

export function extruir(shape: Shape): ExtrudeGeometry {
  const g = new ExtrudeGeometry(shape, EXTRUSION);
  g.center();
  g.computeVertexNormals();
  return g;
}

/** Posiciones de las tres piezas armadas (Crecé) y separadas (Creá). */
export const PIEZAS = {
  armado: [
    { x: -2.24, y: 0, z: 0, rx: 0, ry: 0, rz: 0 },
    { x: 0, y: 0, z: 0, rx: 0, ry: 0, rz: 0 },
    { x: 2.24, y: 0, z: 0, rx: 0, ry: 0, rz: 0 },
  ],
  separado: [
    { x: -3.0, y: 0.45, z: 0.6, rx: 0.18, ry: 0.55, rz: 0.14 },
    { x: 0.1, y: -0.25, z: -0.8, rx: -0.3, ry: -0.28, rz: -0.06 },
    { x: 2.95, y: -0.5, z: 0.4, rx: 0.22, ry: -0.5, rz: -0.16 },
  ],
} as const;
