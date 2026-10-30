import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { render } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { cajaDePath, unirCajas, type Caja } from '../geometria';
import { GRILLA_DIBUJO } from '../grilla';
import { DIBUJOS, ICONOS } from '../index';
import { DIBUJO_IDS, ESTADOS, esIlustracion, ILUSTRACIONES } from './ids';
import { Ilustracion } from './Ilustracion';

/** Caja de cada figura del SVG (sin aplicar transform: alcanza para piezas apenas rotadas). */
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
    case 'ellipse':
      return {
        minX: n('cx') - n('rx'),
        minY: n('cy') - n('ry'),
        maxX: n('cx') + n('rx'),
        maxY: n('cy') + n('ry'),
      };
    case 'rect':
      return { minX: n('x'), minY: n('y'), maxX: n('x') + n('width'), maxY: n('y') + n('height') };
    default:
      throw new Error(`figura no soportada: ${el.tagName}`);
  }
}

describe('dibujos: grilla 96', () => {
  it.each(DIBUJO_IDS)('%s: 96×96, trazo 2, redondo, currentColor y dentro de [8, 88]', (id) => {
    const { container } = render(<Ilustracion id={id} />);
    const svg = container.querySelector('svg')!;
    expect(svg).toHaveAttribute('viewBox', '0 0 96 96');
    expect(svg).toHaveAttribute('stroke-width', '2');
    expect(svg).toHaveAttribute('stroke', 'currentColor');
    expect(svg).toHaveAttribute('fill', 'none');
    expect(svg).toHaveAttribute('stroke-linecap', 'round');
    expect(svg).toHaveAttribute('aria-hidden', 'true');
    // Sin texto adentro, sin degradés ni filtros.
    expect(svg.textContent).toBe('');
    expect(svg.querySelector('text, linearGradient, radialGradient, filter, image')).toBeNull();

    const figuras = [...svg.querySelectorAll('path, circle, ellipse, rect')];
    expect(figuras.length).toBeGreaterThan(0);
    const c = unirCajas(figuras.map(cajaDe));
    const [min, max] = GRILLA_DIBUJO.zona;
    expect(Math.min(c.minX, c.minY)).toBeGreaterThanOrEqual(min);
    expect(Math.max(c.maxX, c.maxY)).toBeLessThanOrEqual(max);
  });

  it.each(DIBUJO_IDS)('%s: como máximo dos tonos (currentColor + un token)', (id) => {
    const { container } = render(<Ilustracion id={id} />);
    const clases = (el: Element) => (el.getAttribute('class') ?? '').split(/\s+/);
    const tokens = new Set(
      [...container.querySelectorAll('[class]')]
        .flatMap(clases)
        .filter((c) => /^(fill|stroke)-/.test(c))
        .map((c) => c.replace(/^(fill|stroke)-/, '')),
    );
    // Una figura sin clase de trazo (ni en su grupo) se pinta con currentColor: cuenta como tono.
    const conTrazoPropio = (el: Element | null): boolean =>
      !!el &&
      el.tagName !== 'svg' &&
      (clases(el).some((c) => c.startsWith('stroke-')) || conTrazoPropio(el.parentElement));
    const usaCurrentColor = [...container.querySelectorAll('path, circle, ellipse, rect')].some(
      (el) => !conTrazoPropio(el),
    );
    expect(tokens.size + (usaCurrentColor ? 1 : 0)).toBeLessThanOrEqual(2);
  });

  it('con title comunica: role img y <title>', () => {
    const { container } = render(<Ilustracion id="no-encontrado" title="Página no encontrada" />);
    const svg = container.querySelector('svg')!;
    expect(svg).toHaveAttribute('role', 'img');
    expect(svg).not.toHaveAttribute('aria-hidden');
    expect(svg.querySelector('title')?.textContent).toBe('Página no encontrada');
  });
});

describe('ids de dibujos', () => {
  it('los platos siguen siendo los mismos y los estados no se mezclan con ellos', () => {
    expect(ILUSTRACIONES).toHaveLength(21);
    for (const e of ESTADOS) expect(esIlustracion(e)).toBe(false);
    expect(ESTADOS).toEqual(['vacio', 'sin-resultados', 'no-encontrado', 'error', 'cargando']);
  });

  it('los listados para la vitrina cubren todo, sin repetidos', () => {
    expect(DIBUJOS.map((d) => d.id)).toEqual([...DIBUJO_IDS]);
    const nombres = ICONOS.map((i) => i.nombre);
    expect(new Set(nombres).size).toBe(nombres.length);
  });
});

describe('cargando: movimiento con presupuesto', () => {
  const css = readFileSync(resolve(__dirname, '../movimiento.css'), 'utf8');

  it('los keyframes animan solo transform y opacity', () => {
    const cuerpos = [...css.matchAll(/@keyframes[^{]+\{([\s\S]*?)\n\}/g)].map((m) => m[1]!);
    expect(cuerpos.length).toBeGreaterThan(0);
    const props = cuerpos.flatMap((c) => [...c.matchAll(/([a-z-]+)\s*:/g)].map((m) => m[1]));
    expect(new Set(props)).toEqual(new Set(['transform', 'opacity']));
  });

  it('tiene versión quieta con movimiento reducido', () => {
    expect(css).toMatch(/prefers-reduced-motion: reduce[\s\S]*\.ilus-cae[\s\S]*animation: none/);
    const { container } = render(<Ilustracion id="cargando" />);
    // Quieto: la primera pieza queda encajada.
    expect(container.querySelectorAll('[data-quieta="true"]')).toHaveLength(1);
  });
});
