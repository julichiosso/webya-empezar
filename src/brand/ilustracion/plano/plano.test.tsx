import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { render } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { FondoPlano } from './FondoPlano';
import { ESCENAS_PLANO, IlustracionPlano } from './IlustracionPlano';

/** Lo que el plano no puede tener: texto, filtros, degradés, imágenes ni colores sueltos. */
function revisarSvg(svg: SVGSVGElement) {
  expect(svg.getAttribute('aria-hidden')).toBe('true');
  expect(
    svg.querySelectorAll('text, filter, linearGradient, radialGradient, image, foreignObject'),
  ).toHaveLength(0);
  const html = svg.outerHTML;
  expect(html).not.toMatch(/#[0-9a-f]{3,8}\b(?!\))|rgb\(|hsl\(/i);
  expect(html).not.toMatch(/TODO/i);
  // Todo trazo pinta con currentColor (el color lo pone la sección).
  for (const el of svg.querySelectorAll('[stroke]')) {
    expect(['currentColor', 'none']).toContain(el.getAttribute('stroke'));
  }
}

describe('FondoPlano', () => {
  it.each(['grilla', 'cotas'] as const)('%s: decorativo, liviano y en currentColor', (variante) => {
    const { container } = render(<FondoPlano variante={variante} />);
    const svg = container.querySelector('svg') as SVGSVGElement;
    expect(svg.dataset.plano).toBe(variante);
    revisarSvg(svg);
    expect(svg.outerHTML.length).toBeLessThan(variante === 'grilla' ? 1500 : 5000);
  });

  it('cotas suma marcas de registro y cotas; grilla no', () => {
    const grilla = render(<FondoPlano />).container.querySelectorAll('svg svg');
    const cotas = render(<FondoPlano variante="cotas" />).container.querySelectorAll('svg svg');
    expect(grilla).toHaveLength(0);
    expect(cotas.length).toBeGreaterThanOrEqual(4);
  });

  it('dos fondos en la misma página no comparten id de patrón', () => {
    const { container } = render(
      <>
        <FondoPlano />
        <FondoPlano variante="cotas" />
      </>,
    );
    const ids = [...container.querySelectorAll('pattern')].map((p) => p.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it('pasa className sin perder el posicionamiento', () => {
    const { container } = render(<FondoPlano className="text-seccion-tinta-fg" />);
    expect(container.querySelector('svg')?.getAttribute('class')).toMatch(
      /absolute inset-0 .*text-seccion-tinta-fg/,
    );
  });
});

describe('IlustracionPlano', () => {
  it.each(ESCENAS_PLANO.map((e) => [e]))(
    '%s: terminada, decorativa y en currentColor',
    (escena) => {
      const { container } = render(<IlustracionPlano escena={escena} className="size-full" />);
      const svg = container.querySelector('svg') as SVGSVGElement;
      expect(svg.dataset.escenaPlano).toBe(escena);
      expect(svg.getAttribute('class')).toBe('size-full');
      revisarSvg(svg);
      // La pieza que encaja va en el acento (por token) y es UNA.
      expect(svg.querySelectorAll('.text-plano-pieza')).toHaveLength(1);
      // Liviana: SVG inline de pocos KB.
      expect(svg.outerHTML.length).toBeLessThan(9000);
    },
  );

  it('las tres escenas son distintas', () => {
    const html = ESCENAS_PLANO.map(
      (e) =>
        render(<IlustracionPlano escena={e} />).container.querySelector('svg[viewBox]')?.innerHTML,
    );
    expect(new Set(html).size).toBe(3);
  });

  it('solo el hero se mueve, y con la clase que tiene versión quieta', () => {
    const anima = (e: (typeof ESCENAS_PLANO)[number]) =>
      render(<IlustracionPlano escena={e} />).container.querySelectorAll('.ilus-plano-encaja')
        .length;
    expect(anima('hero')).toBe(1);
    expect(anima('como-funciona')).toBe(0);
    expect(anima('cierre')).toBe(0);
    const css = readFileSync(resolve(__dirname, '../movimiento.css'), 'utf8');
    const reducido = css.slice(css.indexOf('prefers-reduced-motion'));
    expect(reducido).toContain('.ilus-plano-encaja');
  });
});
