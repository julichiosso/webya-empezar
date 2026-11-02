import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { act, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { ESCENAS_FLUJO } from '@/content/explicativo/flujo';
import { VIDEO_PRESENTACION } from '@/content/explicativo/presentacion';
import { EscenaFlujo } from './escenas-flujo';
import { duracionEstimadaMs, PAUSA_ENTRE_ESCENAS_MS } from './narracion';
import { PosterArte } from './PosterPresentacion';
import { PresentacionFlujo } from './PresentacionFlujo';

const subtitulo = () => screen.getByTestId('subtitulo');
const [PRIMERA, SEGUNDA] = ESCENAS_FLUJO;

describe('PresentacionFlujo (animación en código del video de /empezar)', () => {
  beforeEach(() => vi.useFakeTimers());
  afterEach(() => {
    vi.useRealTimers();
    vi.unstubAllGlobals();
  });

  it('es un grupo con nombre (no otro landmark), con los cuatro capítulos del flujo y el foco en pausa', () => {
    render(<PresentacionFlujo />);
    expect(
      screen.getByRole('group', { name: VIDEO_PRESENTACION.reproductor }),
    ).toBeInTheDocument();
    expect(screen.queryByRole('dialog')).toBeNull();
    expect(screen.getAllByRole('button', { name: /^Capítulo \d/ })).toHaveLength(4);
    expect(subtitulo()).toHaveTextContent(PRIMERA.narracion);
    expect(screen.getByRole('button', { name: 'Pausar' })).toHaveFocus();
  });

  it('avanza solo con la duración estimada (sin voz en jsdom) y se maneja con flechas', () => {
    render(<PresentacionFlujo />);
    act(() => {
      vi.advanceTimersByTime(duracionEstimadaMs(PRIMERA.narracion) + PAUSA_ENTRE_ESCENAS_MS + 10);
    });
    expect(subtitulo()).toHaveTextContent(SEGUNDA.narracion);
    fireEvent.keyDown(screen.getByRole('group'), { key: 'ArrowLeft' });
    expect(subtitulo()).toHaveTextContent(PRIMERA.narracion);
  });

  it('la última escena lleva a la pantalla 1 del flujo, con un solo CTA', () => {
    render(<PresentacionFlujo />);
    fireEvent.click(screen.getByRole('button', { name: /^Capítulo 4:/ }));
    expect(subtitulo()).toHaveTextContent(ESCENAS_FLUJO[3].narracion);
    expect(screen.getAllByRole('link')).toHaveLength(1);
    expect(screen.getByRole('link', { name: VIDEO_PRESENTACION.cta })).toHaveAttribute(
      'href',
      '#wizard',
    );
  });

  it('se pausa si sale de la pantalla', () => {
    let alCambiar: IntersectionObserverCallback = () => {};
    vi.stubGlobal(
      'IntersectionObserver',
      class {
        constructor(cb: IntersectionObserverCallback) {
          alCambiar = cb;
        }
        observe() {}
        disconnect() {}
      },
    );
    render(<PresentacionFlujo />);
    act(() => alCambiar([{ isIntersecting: false } as IntersectionObserverEntry], {} as never));
    expect(screen.getByRole('button', { name: 'Reproducir' })).toBeInTheDocument();
    act(() => {
      vi.advanceTimersByTime(60_000);
    });
    expect(subtitulo()).toHaveTextContent(PRIMERA.narracion);
  });
});

describe('escenas del flujo: movimiento y versión quieta', () => {
  const ANIMACIONES = /^mg-(entra|encaja|pop|desliza|sale|pulso)$/;

  it.each(ESCENAS_FLUJO.map((e) => e.id))(
    '"%s" anima solo con las clases .mg (una vez, sin loops) y es decorativa',
    (id) => {
      const { container } = render(<EscenaFlujo id={id} />);
      const svg = container.querySelector('svg')!;
      expect(svg).toHaveAttribute('aria-hidden', 'true');
      const animados = [...svg.querySelectorAll('[class*="mg-"]')];
      expect(animados.length).toBeGreaterThan(0);
      for (const el of animados) {
        const clases = [...el.classList].filter((c) => c.startsWith('mg-'));
        expect(el.classList.contains('mg'), clases.join(' ')).toBe(true);
        // Nada de mg-recorre (el único con recorrido largo) ni clases fuera del presupuesto.
        for (const c of clases) expect(c).toMatch(ANIMACIONES);
      }
      // Sin filtros ni máscaras (caros de pintar).
      expect(svg.querySelector('filter, mask, foreignObject')).toBeNull();
    },
  );

  it('con prefers-reduced-motion, la regla global deja cada escena quieta en su cuadro final', () => {
    const css = readFileSync(resolve(process.cwd(), 'src/app/globals.css'), 'utf8');
    const reducido = css.slice(css.indexOf('@media (prefers-reduced-motion: reduce)'));
    expect(reducido).toMatch(/\.mg\s*\{\s*animation:\s*none !important;\s*opacity:\s*1;/);
    expect(reducido).toMatch(/\.mg-sale\s*\{\s*opacity:\s*0;/);
    expect(reducido).toMatch(/\.mg-progreso\s*\{?[^}]*animation:\s*none !important/);
  });

  it('el poster es el cuadro final, quieto siempre (con o sin movimiento reducido)', () => {
    const { container } = render(<PosterArte />);
    const svg = container.querySelector('svg[data-poster]')!;
    expect(svg.getAttribute('class')).toContain('[&_.mg]:animate-none!');
    expect(svg.getAttribute('class')).toContain('[&_.mg-sale]:opacity-0!');
    expect(svg).toHaveAttribute('aria-hidden', 'true');
  });
});
