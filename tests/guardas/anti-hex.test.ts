// @vitest-environment node
import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join, relative, resolve } from 'node:path';
import { describe, expect, it } from 'vitest';

/**
 * Anti-hex: cero colores literales en componentes, features y páginas. Todo color sale de un token
 * (src/brand/tokens). Cubre `#rgb`, `#rrggbb` (y con alfa), `rgb()`/`rgba()`, `hsl()`/`hsla()` y
 * `oklch()` en .ts, .tsx y .css.
 *
 * Excepciones: las mismas de src/brand/tokens/marca.test.ts (tokens, content/demos,
 * content/paletas.ts y lib/color.ts), que caen fuera de estas carpetas. No se agregan nuevas.
 */
const RAIZ = process.cwd();
const CARPETAS = ['src/components', 'src/features', 'src/app'];

function archivos(dir: string): string[] {
  return readdirSync(dir).flatMap((n) => {
    const p = join(dir, n);
    return statSync(p).isDirectory() ? archivos(p) : [p];
  });
}

const revisables = CARPETAS.flatMap((c) => archivos(resolve(RAIZ, c))).filter(
  (f) => /\.(tsx?|css)$/.test(f) && !/\.test\.tsx?$/.test(f) && !f.endsWith('.d.ts'),
);

/** Hex con borde (no toma `#seccion` ni `#123abc` dentro de una palabra) y funciones de color. */
const HEX = /(?<![\w&#%-])#(?:[0-9a-f]{3,4}|[0-9a-f]{6}|[0-9a-f]{8})(?![\w-])/i;
const FUNCION = /\b(?:rgba?|hsla?|oklch)\(/i;

/** `archivo:línea «fragmento»` de cada color literal. */
function coloresLiterales(archivo: string): string[] {
  const salida: string[] = [];
  readFileSync(archivo, 'utf8')
    .split('\n')
    .forEach((linea, i) => {
      const m = HEX.exec(linea) ?? FUNCION.exec(linea);
      if (m) salida.push(`${relative(RAIZ, archivo).split('\\').join('/')}:${i + 1} «${m[0]}»`);
    });
  return salida;
}

describe('anti-hex: cero colores literales en components, features y app', () => {
  it('revisa archivos de verdad', () => {
    expect(revisables.length).toBeGreaterThan(20);
  });

  it('el detector encuentra lo que tiene que encontrar', () => {
    const casos = [
      'color: #fff;',
      "fill='#ff5b24'",
      'rgb(0 0 0)',
      'hsla(0,0%,0%,.5)',
      'oklch(0.7 0.1 30)',
    ];
    for (const c of casos) expect(HEX.test(c) || FUNCION.test(c), c).toBe(true);
    const sanos = [
      'href="#como-funciona"',
      "'#seccion'",
      'url(%23n)',
      'bg-seccion-brasa',
      'var(--bg)',
    ];
    for (const c of sanos) expect(HEX.test(c) || FUNCION.test(c), c).toBe(false);
  });

  it('ningún color literal (todo por tokens)', () => {
    expect(revisables.flatMap(coloresLiterales)).toEqual([]);
  });
});
