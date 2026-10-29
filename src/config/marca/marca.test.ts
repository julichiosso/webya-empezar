import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join, relative, resolve } from 'node:path';
import { describe, expect, it } from 'vitest';
import { contraste } from '@/lib/color';
import {
  ALFA_SELECCION,
  BASE,
  combinaciones,
  COMBINACIONES_BASE,
  getPaletaMarca,
  PALETA_POR_DEFECTO,
  PALETAS_MARCA,
  TEMA_CLARO,
} from './colores';

const raiz = process.cwd();
const css = readFileSync(resolve(raiz, 'src/app/globals.css'), 'utf8');

/** Bloque de declaraciones de un selector de globals.css (`:root {` … `}`). */
function bloque(selector: string): string {
  const inicio = css.indexOf(`${selector} {`);
  expect(inicio, selector).toBeGreaterThanOrEqual(0);
  return css.slice(inicio, css.indexOf('}', inicio));
}
const valor = (decl: string, token: string) =>
  new RegExp(`${token}:\\s*([^;]+);`).exec(decl)?.[1]?.trim().toLowerCase();

function archivos(dir: string): string[] {
  return readdirSync(dir).flatMap((n) => {
    const p = join(dir, n);
    return statSync(p).isDirectory() ? archivos(p) : [p];
  });
}

describe('paletas de marca: contraste AA medido', () => {
  it.each(PALETAS_MARCA.map((p) => [p.nombre, p] as const))('%s', (_n, paleta) => {
    for (const c of combinaciones(paleta)) {
      expect(contraste(c.texto, c.fondo), `${paleta.nombre}: ${c.nombre}`).toBeGreaterThanOrEqual(
        c.minimo,
      );
    }
  });

  it('combinaciones base y tema claro', () => {
    for (const c of COMBINACIONES_BASE) {
      expect(contraste(c.texto, c.fondo), c.nombre).toBeGreaterThanOrEqual(c.minimo);
    }
  });

  it('hay exactamente 3 alternativas y Brasa es la paleta por defecto', () => {
    expect(PALETAS_MARCA.map((p) => p.id)).toEqual(['brasa', 'mostaza', 'frambuesa']);
    expect(PALETA_POR_DEFECTO).toBe('brasa');
  });
});

describe('globals.css coincide con la config de marca', () => {
  const brasa = getPaletaMarca('brasa');

  it('tema oscuro (default)', () => {
    const root = bloque(':root');
    expect(valor(root, '--bg')).toBe(BASE.bg);
    expect(valor(root, '--fg')).toBe(BASE.fg);
    expect(valor(root, '--muted')).toBe(BASE.muted);
    expect(valor(root, '--subtle')).toBe(BASE.subtle);
    expect(valor(root, '--paper')).toBe(BASE.paper);
    expect(valor(root, '--paper-fg')).toBe(BASE.paperFg);
    expect(valor(root, '--paper-muted')).toBe(BASE.paperMuted);
    expect(valor(root, '--accent')).toBe(brasa.accent);
    expect(valor(root, '--accent-fg')).toBe(brasa.accentFg);
    expect(valor(root, '--accent-ink')).toBe(brasa.accentInk);
    expect(valor(root, '--danger')).toBe(brasa.danger);
    expect(valor(root, '--accent-soft')).toBe(`rgb(255 91 36 / ${ALFA_SELECCION})`);
  });

  it('tema claro', () => {
    const claro = bloque(":root[data-theme='light']");
    expect(valor(claro, '--bg')).toBe(TEMA_CLARO.bg);
    expect(valor(claro, '--accent')).toBe(TEMA_CLARO.accent);
    expect(valor(claro, '--accent-fg')).toBe(TEMA_CLARO.accentFg);
    expect(valor(claro, '--danger')).toBe(TEMA_CLARO.danger);
  });
});

describe('sin restos ni colores sueltos', () => {
  const propio = resolve(raiz, 'src/config/marca/marca.test.ts');
  const revisables = [
    ...archivos(resolve(raiz, 'src')),
    ...archivos(resolve(raiz, 'e2e')).filter((f) => !f.endsWith('.png')),
    ...archivos(resolve(raiz, '.claude/skills')),
    resolve(raiz, 'README.md'),
  ].filter((f) => f !== propio);

  it('cero verde menta residual', () => {
    // Valores y nombre del acento anterior (dark y light).
    const restos = /34e5a1|52 229 161|0a7a52|10 122 82|04140d|\bmenta\b/i;
    const con = revisables.filter((f) => restos.test(readFileSync(f, 'utf8')));
    expect(con.map((f) => relative(raiz, f))).toEqual([]);
  });

  it('cero hex ni rgb() sueltos en componentes y páginas (todo va por tokens)', () => {
    const codigo = archivos(resolve(raiz, 'src')).filter(
      (f) =>
        /\.tsx?$/.test(f) &&
        !/\.test\.tsx?$/.test(f) &&
        // Únicos lugares con valores de color: la config de marca y la utilidad que los calcula.
        !f.includes(join('config', 'marca')) &&
        !f.endsWith(join('lib', 'color.ts')),
    );
    const suelto = /['"`(\s]#(?:[0-9a-f]{3}|[0-9a-f]{6}|[0-9a-f]{8})['"`;)\s]|\b(?:rgba?|hsla?)\(/i;
    const con = codigo.filter((f) => suelto.test(readFileSync(f, 'utf8')));
    expect(con.map((f) => relative(raiz, f))).toEqual([]);
  });
});
