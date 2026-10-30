import { render, screen } from '@testing-library/react';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';
import { COLOR } from '../tokens/primitivos';
import { Logo } from './Logo';
import { LOGO_TRAZOS, LOGO_VIEWBOX } from './trazos';
import { cajaDe, svgTejaCompacta, TEJA, zonaDeRespeto } from './variantes';

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

  it('compacta: solo la "w" del wordmark, en un cuadro centrado en la letra', () => {
    const { container } = render(<Logo variante="compacta" />);
    const svg = screen.getByRole('img', { name: 'WebYa' });
    const paths = container.querySelectorAll('path');
    expect(paths).toHaveLength(1);
    expect(paths[0]).toHaveAttribute('d', LOGO_TRAZOS[0].d);
    const [, , ancho, alto] = (svg.getAttribute('viewBox') ?? '').split(' ').map(Number);
    expect(ancho).toBe(alto);
    expect(ancho).toBe(cajaDe(LOGO_TRAZOS[0].d).ancho);
    expect(svg).toHaveClass('text-fg');
  });

  it('monocromo: no fija color, hereda la tinta del contenedor', () => {
    render(<Logo variante="monocromo" />);
    const svg = screen.getByRole('img', { name: 'WebYa' });
    expect(svg).not.toHaveClass('text-fg');
    expect(svg).toHaveAttribute('fill', 'currentColor');
  });

  it('escribir: trazos normalizados para el dibujado; armar tiene prioridad', () => {
    const { container, rerender } = render(<Logo escribir />);
    expect(screen.getByRole('img')).toHaveClass('logo-escrito');
    expect(container.querySelector('path')).toHaveAttribute('pathLength', '1');
    rerender(<Logo escribir armar />);
    expect(screen.getByRole('img')).toHaveClass('logo-armado');
    expect(screen.getByRole('img')).not.toHaveClass('logo-escrito');
  });

  it('decorativo: se oculta a lectores de pantalla', () => {
    const { container } = render(<Logo decorativo />);
    expect(screen.queryByRole('img')).toBeNull();
    expect(container.querySelector('svg')).toHaveAttribute('aria-hidden', 'true');
  });
});

describe('variantes del logo (geometría para favicon, app icons y export)', () => {
  const w = LOGO_TRAZOS[0];

  it('la teja compacta centra la "w" y usa los colores que recibe', () => {
    const svg = svgTejaCompacta(w, {
      lado: 32,
      fondo: COLOR.negro[950],
      tinta: COLOR.blanco[0],
      radio: 8,
      ocupacion: TEJA.ocupacion,
    });
    expect(svg).toContain(`d="${w.d}"`);
    expect(svg).toContain(`fill="${COLOR.negro[950]}"`);
    // Centro de la letra → centro del cuadro.
    const [, tx, ty, s] = /translate\(([-\d.]+) ([-\d.]+)\) scale\(([-\d.]+)\)/.exec(svg)!.map(
      Number,
    ) as [number, number, number, number];
    const c = cajaDe(w.d);
    expect(tx! + (c.x + c.ancho / 2) * s!).toBeCloseTo(16, 1);
    expect(ty! + (c.y + c.alto / 2) * s!).toBeCloseTo(16, 1);
    expect(c.ancho * s!).toBeCloseTo(32 * TEJA.ocupacion, 1);
  });

  it('src/app/icon.svg es la teja compacta generada (si falla: node scripts/exportar-marca.mjs)', () => {
    const icono = readFileSync(resolve(process.cwd(), 'src/app/icon.svg'), 'utf8').trim();
    expect(icono).toBe(
      svgTejaCompacta(w, {
        lado: 32,
        fondo: COLOR.negro[950],
        tinta: COLOR.blanco[0],
        radio: 32 * TEJA.radioRelativo,
        ocupacion: TEJA.ocupacion,
      }),
    );
  });

  it('la zona de respeto es media altura de la "x"', () => {
    expect(zonaDeRespeto(w)).toBe(cajaDe(w.d).alto / 2);
  });
});
