import { act, render, screen } from '@testing-library/react';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { PRESUPUESTO } from '@/brand/motion/presets';
import { piezasDe, TituloEncastre } from '@/components/ui/TituloEncastre';

const TEXTO = 'Tu negocio se arma pieza por pieza';

/** IntersectionObserver de mentira: guarda el callback para dispararlo a mano. */
class IOFalso {
  static ultimo: IOFalso | null = null;
  desconectado = false;
  constructor(public cb: IntersectionObserverCallback) {
    IOFalso.ultimo = this;
  }
  observe() {}
  unobserve() {}
  disconnect() {
    this.desconectado = true;
  }
  disparar(visible: boolean) {
    act(() => {
      this.cb([{ isIntersecting: visible } as IntersectionObserverEntry], this as never);
    });
  }
}

function conMovimientoReducido(reducido: boolean) {
  vi.stubGlobal(
    'matchMedia',
    vi.fn((q: string) => ({ matches: reducido && q.includes('reduce'), media: q })),
  );
}

beforeEach(() => {
  IOFalso.ultimo = null;
  vi.stubGlobal('IntersectionObserver', IOFalso);
  conMovimientoReducido(false);
});
afterEach(() => vi.unstubAllGlobals());

describe('TituloEncastre: accesible', () => {
  it('el heading se nombra con el texto completo y las piezas no se leen', () => {
    const { container } = render(<TituloEncastre texto={TEXTO} nivel={1} />);
    const h = screen.getByRole('heading', { level: 1, name: TEXTO });
    expect(h).toHaveAttribute('aria-label', TEXTO);
    const piezas = container.querySelectorAll('[data-pieza]');
    expect(piezas).toHaveLength(7);
    for (const p of piezas) expect(p.closest('[aria-hidden="true"]')).not.toBeNull();
  });

  it('el texto visible es el mismo titular (para buscadores y copiar/pegar)', () => {
    render(<TituloEncastre texto={TEXTO} />);
    expect(screen.getByRole('heading', { level: 2 }).textContent).toBe(TEXTO);
  });

  it('nivel y clases por props', () => {
    render(<TituloEncastre texto={TEXTO} nivel={3} className="text-display" />);
    expect(screen.getByRole('heading', { level: 3 })).toHaveClass('text-display', 'text-balance');
  });

  it('modo letras: una pieza por letra, sin cortar palabras', () => {
    const { container } = render(<TituloEncastre texto="Creá vos" partir="letras" />);
    expect(container.querySelectorAll('[data-pieza]')).toHaveLength(7);
    expect(container.querySelectorAll('[data-palabra]')).toHaveLength(2);
    expect(screen.getByRole('heading', { name: 'Creá vos' })).toBeInTheDocument();
  });
});

describe('TituloEncastre: presupuesto de movimiento', () => {
  it('las piezas alternan de lado y el escalonado entra en el presupuesto', () => {
    const palabras = piezasDe(TEXTO).flat();
    expect(palabras.map((p) => p.lado)).toEqual([1, -1, 1, -1, 1, -1, 1]);
    const letras = piezasDe('Tu negocio, pieza por pieza', 'letras').flat();
    const ultima = Math.max(...letras.map((p) => p.orden));
    expect(ultima).toBeLessThanOrEqual(PRESUPUESTO.maxPiezas - 1);
  });

  const css = readFileSync(resolve('src/components/ui/TituloEncastre.module.css'), 'utf8');

  it('solo anima transform y opacity (nada que dispare layout)', () => {
    const keyframes = css.slice(css.indexOf('@keyframes'), css.indexOf('.piezas'));
    const props = [...keyframes.matchAll(/^\s*([a-z-]+):/gm)].map((m) => m[1]);
    expect(new Set(props)).toEqual(new Set(['opacity', 'transform']));
    expect(css).not.toMatch(/font-variation-settings|infinite|alternate/);
  });

  it('arranca legible (opacidad > 0): el titular cuenta para LCP desde el primer frame', () => {
    const desde = /from\s*{\s*opacity:\s*([\d.]+)/.exec(css)?.[1];
    expect(Number(desde)).toBeGreaterThan(0.4);
  });

  it('reduced-motion: estático (sin animación, en su lugar)', () => {
    const bloque = css.slice(css.indexOf('@media (prefers-reduced-motion: reduce)'));
    expect(bloque).toMatch(/animation:\s*none/);
    expect(bloque).toMatch(/transform:\s*none/);
  });
});

describe('TituloEncastre: entrada "vista" (una sola vez)', () => {
  const contenedor = (c: HTMLElement) => c.querySelector('[aria-hidden="true"]') as HTMLElement;

  it('sin JS / antes de hidratar queda en su estado final (sin atributo)', () => {
    vi.stubGlobal('IntersectionObserver', undefined);
    const { container } = render(<TituloEncastre texto={TEXTO} entrada="vista" />);
    expect(contenedor(container)).not.toHaveAttribute('data-encastre');
  });

  it('fuera de pantalla espera; al entrar se arma y se desconecta', () => {
    const { container } = render(<TituloEncastre texto={TEXTO} entrada="vista" />);
    const io = IOFalso.ultimo!;
    io.disparar(false);
    expect(contenedor(container)).toHaveAttribute('data-encastre', 'espera');
    io.disparar(true);
    expect(contenedor(container)).toHaveAttribute('data-encastre', 'activo');
    expect(io.desconectado).toBe(true);
    // Salir y volver a entrar no lo vuelve a armar.
    io.disparar(false);
    expect(contenedor(container)).toHaveAttribute('data-encastre', 'activo');
  });

  it('si ya estaba a la vista al hidratar, queda quieto (no se re-arma lo que ya se leyó)', () => {
    const { container } = render(<TituloEncastre texto={TEXTO} entrada="vista" />);
    IOFalso.ultimo!.disparar(true);
    expect(contenedor(container)).toHaveAttribute('data-encastre', 'quieto');
    expect(IOFalso.ultimo!.desconectado).toBe(true);
  });

  it('con movimiento reducido no observa ni anima', () => {
    conMovimientoReducido(true);
    const { container } = render(<TituloEncastre texto={TEXTO} entrada="vista" />);
    expect(IOFalso.ultimo).toBeNull();
    expect(contenedor(container)).not.toHaveAttribute('data-encastre');
  });

  it('entrada "carga" no monta observador (CSS puro, cero JS)', () => {
    render(<TituloEncastre texto={TEXTO} />);
    expect(IOFalso.ultimo).toBeNull();
    expect(screen.getByRole('heading')).toHaveAttribute('data-entrada', 'carga');
  });
});
