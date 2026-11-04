import { act, render } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { RUBROS_FLOTANTES } from '@/content/rubros-flotantes';
import { EVENTO_RUBRO } from '@/lib/eventos';
import { RubrosFlotantes } from './RubrosFlotantes';

afterEach(() => vi.unstubAllGlobals());

describe('RubrosFlotantes', () => {
  it('es decorativa: aria-hidden y con palabras', () => {
    const { container } = render(
      <RubrosFlotantes cantidad={5} rubros={RUBROS_FLOTANTES.slice(0, 8)} />,
    );
    const capa = container.firstElementChild as HTMLElement;
    expect(capa).toHaveAttribute('aria-hidden', 'true');
    expect(capa.children).toHaveLength(5);
  });

  it('funciona con una lista más corta que la cantidad pedida', () => {
    const { container } = render(<RubrosFlotantes rubros={RUBROS_FLOTANTES.slice(0, 3)} />);
    expect(container.firstElementChild?.children).toHaveLength(3);
  });

  it('enciende la familia del rubro elegido en el wizard', () => {
    const { container } = render(<RubrosFlotantes />);
    act(() => {
      window.dispatchEvent(new CustomEvent(EVENTO_RUBRO, { detail: 'gastronomia' }));
    });
    expect(container.firstElementChild).toHaveAttribute('data-elegido', 'si');
    expect(container.querySelector('[data-activo]')).not.toBeNull();
  });

  it('espera a que termine la intro del telón: oculta mientras está en pantalla', () => {
    const intro = document.createElement('div');
    intro.setAttribute('data-telon', '');
    document.body.append(intro);
    const callbacks: ((e: { isIntersecting: boolean }[]) => void)[] = [];
    vi.stubGlobal(
      'IntersectionObserver',
      class {
        constructor(cb: (e: { isIntersecting: boolean }[]) => void) {
          callbacks.push(cb);
        }
        observe() {}
        disconnect() {}
      },
    );
    const { container } = render(<RubrosFlotantes cantidad={3} />);
    const capa = container.firstElementChild as HTMLElement;
    expect(capa).toHaveAttribute('data-intro', 'no');
    // El último observador es el del telón (el primero es el de hero y cierre).
    act(() => callbacks.at(-1)?.([{ isIntersecting: true }]));
    expect(capa).toHaveAttribute('data-intro', 'si');
    act(() => callbacks.at(-1)?.([{ isIntersecting: false }]));
    expect(capa).toHaveAttribute('data-intro', 'no');
    intro.remove();
  });

  it('hay más de 80 rubros únicos', () => {
    expect(new Set(RUBROS_FLOTANTES.map((r) => r.id)).size).toBeGreaterThan(80);
  });
});
