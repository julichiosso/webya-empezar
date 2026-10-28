import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';

// Red de seguridad del sistema de diseño: los tokens clave existen en globals.css.
const css = readFileSync(resolve(process.cwd(), 'src/app/globals.css'), 'utf8');

describe('tokens de diseño', () => {
  it.each(['--bg', '--fg', '--accent', '--accent-fg', '--line', '--ease-out', '--radius-control'])(
    'define %s',
    (token) => {
      expect(css).toContain(`${token}:`);
    },
  );

  it('define el modo claro y respeta prefers-reduced-motion', () => {
    expect(css).toContain(":root[data-theme='light']");
    expect(css).toContain('prefers-reduced-motion: reduce');
  });

  it('tiene un único color de acento marcado para confirmar', () => {
    expect(css).toContain('TODO: confirmar el verde menta');
  });
});
