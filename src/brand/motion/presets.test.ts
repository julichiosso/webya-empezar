// @vitest-environment node
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';
import { generarTokensCss } from '../tokens/css';
import {
  CURVAS,
  demoraPieza,
  DURACIONES_MS,
  duracionEntrada,
  entraEnPresupuesto,
  pieza,
  PRESUPUESTO,
  segunMovimiento,
  SNAP,
  TOQUE,
} from './presets';

const motionCss = readFileSync(resolve(process.cwd(), 'src/brand/motion/motion.css'), 'utf8');
const tokens = generarTokensCss();

/** Cuerpos de cada @keyframes (nombre → declaraciones). */
function keyframes(css: string): Map<string, string> {
  const salida = new Map<string, string>();
  const re = /@keyframes\s+([\w-]+)\s*\{/g;
  let m: RegExpExecArray | null;
  while ((m = re.exec(css))) {
    let nivel = 1;
    let i = re.lastIndex;
    while (nivel > 0 && i < css.length) {
      if (css[i] === '{') nivel++;
      if (css[i] === '}') nivel--;
      i++;
    }
    salida.set(m[1] ?? '', css.slice(re.lastIndex, i - 1));
  }
  return salida;
}
const propiedades = (cuerpo: string) =>
  [...cuerpo.matchAll(/([a-z-]+)\s*:/g)].map((m) => m[1] ?? '');

describe('presets de movimiento', () => {
  it('las duraciones salen de los tokens (tokens.css)', () => {
    expect(tokens).toContain(`--duration-instant: ${DURACIONES_MS.instantaneo}ms;`);
    expect(tokens).toContain(`--duration-fast: ${DURACIONES_MS.rapido}ms;`);
    expect(tokens).toContain(`--duration-base: ${DURACIONES_MS.base}ms;`);
    expect(tokens).toContain(`--duration-slow: ${DURACIONES_MS.lento}ms;`);
    expect(tokens).toContain(`--ease-out: cubic-bezier(${CURVAS.salida.join(', ')});`);
  });

  it('hay UNA escala de toque, y es un token', () => {
    expect(tokens).toContain(`--escala-toque: ${TOQUE.escala};`);
    expect(TOQUE.clase).toContain('active:scale-(--escala-toque)');
    expect(TOQUE.claseGrupo).toContain('group-active:scale-(--escala-toque)');
    // Sin valores arbitrarios: todo por token.
    expect(`${TOQUE.clase} ${TOQUE.claseGrupo}`).not.toMatch(/\[/);
  });

  it('pieza(i) da el orden y demoraPieza la demora en segundos', () => {
    expect(pieza(3)).toEqual({ '--i': 3 });
    expect(demoraPieza(2, 70)).toBeCloseTo(0.14);
  });

  it('el snap se pasa ~2 % y asienta en la duración base', () => {
    expect(SNAP.sobrepaso).toBeCloseTo(1.02);
    expect(SNAP.motion.animate.scale.at(-1)).toBe(1);
    expect(SNAP.motion.transition.duration * 1000).toBe(DURACIONES_MS.base);
  });

  it('con movimiento reducido la transición dura 0', () => {
    expect(segunMovimiento(true, { duration: 0.28 })).toEqual({ duration: 0 });
    expect(segunMovimiento(false, { duration: 0.28 })).toEqual({ duration: 0.28 });
  });

  it('presupuesto: el logo (5 letras) entra; 12 piezas no', () => {
    expect(duracionEntrada(5, 520, 70)).toBe(800);
    expect(entraEnPresupuesto(5)).toBe(true);
    expect(entraEnPresupuesto(12)).toBe(false);
  });
});

describe('motion.css', () => {
  const frames = keyframes(motionCss);

  it('solo anima transform/opacity (el logo puede dibujar su trazo)', () => {
    expect(frames.size).toBeGreaterThan(0);
    for (const [nombre, cuerpo] of frames) {
      const permitidas: readonly string[] = nombre.startsWith('logo-')
        ? [...PRESUPUESTO.propiedades, ...PRESUPUESTO.excepcion.propiedades]
        : PRESUPUESTO.propiedades;
      for (const p of propiedades(cuerpo)) expect(permitidas, `${nombre}: ${p}`).toContain(p);
    }
  });

  it('todo lo que anima tiene su versión quieta con prefers-reduced-motion', () => {
    const reducido = motionCss.slice(motionCss.indexOf('@media (prefers-reduced-motion: reduce)'));
    for (const clase of ['.snap', '.pieza-escalonada', '.logo-escrito .logo-pieza', '.toque']) {
      expect(reducido, clase).toContain(clase);
    }
  });

  it('usa los tokens, no valores sueltos de escala', () => {
    expect(motionCss).toContain('var(--escala-toque)');
    expect(motionCss).toContain('var(--escala-sobrepaso)');
    expect(motionCss).toContain('var(--paso-pieza)');
    expect(motionCss).not.toMatch(/scale\(0\.9\d\)/);
  });
});
