import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';

// Red de seguridad del sistema de diseño: los tokens clave existen (globals.css + tokens.css generado).
const leer = (f: string) => readFileSync(resolve(process.cwd(), f), 'utf8');
const css = leer('src/app/globals.css') + leer('src/brand/tokens/tokens.css');

describe('tokens de diseño', () => {
  it.each([
    '--bg',
    '--fg',
    '--accent',
    '--accent-fg',
    '--accent-ink',
    '--paper',
    '--paper-fg',
    '--line',
    '--ease-out',
    '--radius-control',
  ])('define %s', (token) => {
    expect(css).toContain(`${token}:`);
  });

  it('define el modo claro y respeta prefers-reduced-motion', () => {
    expect(css).toContain(":root[data-theme='light']");
    expect(css).toContain('prefers-reduced-motion: reduce');
  });

  it('el acento es Brasa (los valores exactos los verifica brand/tokens/marca.test.ts)', () => {
    // 3 capas: el semántico apunta al primitivo, y el primitivo es Brasa.
    expect(css).toContain('--accent: var(--brasa-500);');
    expect(css).toContain('--brasa-500: #ff5b24;');
  });
});
