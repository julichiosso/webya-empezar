import { render, screen } from '@testing-library/react';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';
import { Logo } from './Logo';
import { LOGO_TRAZOS, LOGO_VIEWBOX } from './trazos';

/** Coordenadas del trazo como números, para comparar sin depender del formato del texto. */
const numeros = (d: string) => (d.match(/-?\d+(?:\.\d+)?/g) ?? []).map(Number);

describe('Logo', () => {
  it('usa exactamente los trazos de public/webya-logo.svg (uno por letra)', () => {
    const svg = readFileSync(resolve(process.cwd(), 'public/webya-logo.svg'), 'utf8');
    const originales = [...svg.matchAll(/<path d="([^"]+)"/g)].map((m) => numeros(m[1] ?? ''));
    const generados = LOGO_TRAZOS.map((t) => numeros(t.d));
    expect(LOGO_TRAZOS.map((t) => t.letra)).toEqual(['w', 'e', 'b', 'y', 'a']);
    // Mismo conjunto de trazos (el generado va en orden de lectura, el original no).
    const clave = (n: number[]) => n.join(' ');
    expect(generados.map(clave).sort()).toEqual(originales.map(clave).sort());
    expect(svg).toContain(`viewBox="${LOGO_VIEWBOX}"`);
  });

  it('es una imagen accesible con nombre y toma el color del texto', () => {
    render(<Logo />);
    const logo = screen.getByRole('img', { name: 'WebYa' });
    expect(logo).toHaveAttribute('fill', 'currentColor');
    expect(logo).not.toHaveClass('logo-armado');
  });

  it('con armar, cada letra es una pieza con su orden de entrada', () => {
    const { container } = render(<Logo armar />);
    expect(screen.getByRole('img', { name: 'WebYa' })).toHaveClass('logo-armado');
    const piezas = container.querySelectorAll('path.logo-pieza');
    expect(piezas).toHaveLength(5);
    expect((piezas[4] as SVGPathElement).style.getPropertyValue('--i')).toBe('4');
  });
});
