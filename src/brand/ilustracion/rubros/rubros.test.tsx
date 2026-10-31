import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { render } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
// Solo el test mira content (la arquitectura excluye tests): verifica que cada rubro real tenga escena.
import { RUBRO_IDS, RUBRO_OTRO_ID } from '@/content/rubros';
import { cajaDePath, unirCajas, type Caja } from '../geometria';
import { GRILLA_DIBUJO } from '../grilla';
import { ESCENAS_RUBRO, esEscenaRubro } from './ids';
import { IlustracionRubro } from './IlustracionRubro';

const TODAS = [...ESCENAS_RUBRO, 'generico-de-prueba'] as const;

function cajaDe(el: Element): Caja {
  const n = (a: string) => Number(el.getAttribute(a) ?? 0);
  switch (el.tagName) {
    case 'path':
      return cajaDePath(el.getAttribute('d') ?? '');
    case 'circle':
      return {
        minX: n('cx') - n('r'),
        minY: n('cy') - n('r'),
        maxX: n('cx') + n('r'),
        maxY: n('cy') + n('r'),
      };
    default:
      throw new Error(`figura no soportada: ${el.tagName}`);
  }
}

const dibujar = (rubro: string) =>
  render(<IlustracionRubro rubro={rubro} />).container.querySelector('svg')!;

const figuras = (svg: Element) => [...svg.querySelectorAll('path, circle, ellipse, rect, line')];

describe('escenas de rubro: grilla 96', () => {
  it.each(TODAS)('%s: 96×96, trazo 2, redondo, currentColor, decorativa', (rubro) => {
    const svg = dibujar(rubro);
    expect(svg).toHaveAttribute('viewBox', GRILLA_DIBUJO.viewBox);
    expect(svg).toHaveAttribute('stroke-width', '2');
    expect(svg).toHaveAttribute('stroke', 'currentColor');
    expect(svg).toHaveAttribute('fill', 'none');
    expect(svg).toHaveAttribute('stroke-linecap', 'round');
    expect(svg).toHaveAttribute('stroke-linejoin', 'round');
    expect(svg).toHaveAttribute('aria-hidden', 'true');
    expect(svg).not.toHaveAttribute('role');
    expect(svg.textContent).toBe('');
    expect(
      svg.querySelector('title, text, linearGradient, radialGradient, filter, image'),
    ).toBeNull();
  });

  it.each(TODAS)('%s: todo dentro de la zona viva [8, 88], sin transform', (rubro) => {
    const svg = dibujar(rubro);
    const f = figuras(svg);
    expect(f.length).toBeGreaterThan(0);
    // Sin transform en las figuras: la caja calculada es la real.
    expect(svg.querySelector('[transform]')).toBeNull();
    const c = unirCajas(f.map(cajaDe));
    const [min, max] = GRILLA_DIBUJO.zona;
    expect(Math.min(c.minX, c.minY)).toBeGreaterThanOrEqual(min);
    expect(Math.max(c.maxX, c.maxY)).toBeLessThanOrEqual(max);
  });

  it.each(TODAS)('%s: precisión de la grilla (entero o un decimal)', (rubro) => {
    const svg = dibujar(rubro);
    const numeros = figuras(svg).flatMap((el) => [
      ...[...(el.getAttribute('d') ?? '').matchAll(/-?(?:\d*\.\d+|\d+)/g)].map((m) => m[0]),
      ...['cx', 'cy', 'r'].map((a) => el.getAttribute(a)).filter((v): v is string => v !== null),
    ]);
    expect(numeros.length).toBeGreaterThan(0);
    for (const n of numeros) expect(n, `${rubro}: ${n}`).toMatch(/^-?\d*(\.\d)?$/);
  });

  it.each(TODAS)('%s: trazo único (2) y dos tonos: currentColor + el acento', (rubro) => {
    const svg = dibujar(rubro);
    // Nadie pisa el grosor ni pone colores sueltos.
    expect(
      svg.querySelector('[stroke-width]:not(svg), [stroke]:not(svg), [fill]:not(svg)'),
    ).toBeNull();
    expect(svg.outerHTML).not.toMatch(/#[0-9a-f]{3,8}\b|rgb\(|hsl\(/i);
    const tonos = new Set(
      [...svg.querySelectorAll('[class]')]
        .flatMap((el) => (el.getAttribute('class') ?? '').split(/\s+/))
        .filter((c) => /^(fill|stroke|text)-/.test(c)),
    );
    // `fill-accent` lee `--accent` en el elemento: la vista previa lo re-tiñe con la paleta.
    expect([...tonos]).toEqual(['fill-accent']);
  });

  it.each(TODAS)('%s: una pieza encaja (en acento, y es la que se mueve)', (rubro) => {
    const svg = dibujar(rubro);
    const piezas = svg.querySelectorAll('.ilus-encaja');
    expect(piezas).toHaveLength(1);
    expect(piezas[0]!.querySelector('.fill-accent')).not.toBeNull();
    // Todo el acento está dentro de la pieza que encaja.
    expect(svg.querySelectorAll('.fill-accent')).toHaveLength(
      piezas[0]!.querySelectorAll('.fill-accent').length,
    );
  });
});

describe('escenas de rubro: ids', () => {
  it('cada rubro del catálogo tiene escena, salvo "otro" (usa el genérico)', () => {
    for (const id of RUBRO_IDS) {
      if (id === RUBRO_OTRO_ID) continue;
      expect(esEscenaRubro(id), id).toBe(true);
    }
    expect(esEscenaRubro(RUBRO_OTRO_ID)).toBe(false);
  });

  it.each(ESCENAS_RUBRO)('%s dibuja su escena, distinta del genérico', (rubro) => {
    const svg = dibujar(rubro);
    expect(svg).toHaveAttribute('data-escena', rubro);
    expect(svg.innerHTML).not.toBe(dibujar('generico-de-prueba').innerHTML);
  });

  it('las seis escenas son distintas entre sí', () => {
    const dibujos = ESCENAS_RUBRO.map((r) => dibujar(r).innerHTML);
    expect(new Set(dibujos).size).toBe(ESCENAS_RUBRO.length);
  });

  it('un id desconocido (o "otro") dibuja el genérico, con el hueco punteado', () => {
    for (const id of ['', 'otro', 'panaderia']) {
      const svg = dibujar(id);
      expect(svg).toHaveAttribute('data-escena', 'generico');
      expect(svg.querySelector('[stroke-dasharray]')).toHaveAttribute(
        'stroke-dasharray',
        GRILLA_DIBUJO.punteado,
      );
    }
  });

  it('el tamaño lo pone quien la usa', () => {
    const { container } = render(<IlustracionRubro rubro="comercio" className="size-16" />);
    expect(container.querySelector('svg')).toHaveClass('size-16');
  });
});

describe('escenas de rubro: movimiento', () => {
  const css = readFileSync(resolve(__dirname, '../movimiento.css'), 'utf8');

  it('la pieza encaja una sola vez (sin loop) y queda quieta con movimiento reducido', () => {
    const regla = css.match(/\.ilus-encaja \{([^}]*)\}/)?.[1] ?? '';
    expect(regla).toMatch(/animation: ilus-encaja/);
    expect(regla).not.toMatch(/infinite/);
    expect(css).toMatch(/prefers-reduced-motion: reduce\) \{\s*\.ilus-encaja \{\s*animation: none/);
  });
});
