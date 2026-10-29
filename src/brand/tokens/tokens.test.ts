import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';

// Red de seguridad del sistema de diseño: los tokens clave existen en globals.css.
const css = readFileSync(resolve(process.cwd(), 'src/app/globals.css'), 'utf8');

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
    expect(css).toContain('--accent: #ff5b24;');
  });
});
