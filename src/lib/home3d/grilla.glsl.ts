/**
 * Shaders de la grilla de "Digitalizá" (hero 3D de la home): líneas finas en espacio de objeto, con
 * antialias por derivadas. Solo x e y: la cara de adelante es plana en z (ahí fwidth(z) es 0).
 */
export const GRILLA_VERTICE = /* glsl */ `
varying vec3 vPos;
void main() {
  vPos = position;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}`;

export const GRILLA_FRAGMENTO = /* glsl */ `
uniform float uCantidad;
uniform vec3 uColor;
varying vec3 vPos;
float linea(float v, float k) {
  float d = max(fwidth(v * k), 1e-4);
  float f = abs(fract(v * k - 0.5) - 0.5) / d;
  return 1.0 - min(f, 1.0);
}
void main() {
  float g = max(linea(vPos.x, 4.0), linea(vPos.y, 4.0));
  gl_FragColor = vec4(uColor, g * uCantidad * 0.9);
}`;
