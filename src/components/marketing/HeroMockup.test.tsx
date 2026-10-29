import { act, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { alternarModuloStore, reiniciarModulos } from '@/features/empezar/modulos-store';
import { registerSink } from '@/lib/analytics';
import { HeroMockup } from './HeroMockup';

// jsdom no trae IntersectionObserver: uno falso, que el test dispara a mano.
type Oyente = IntersectionObserverCallback;
let oyentes: Oyente[] = [];
let opciones: IntersectionObserverInit[] = [];

class FakeIntersectionObserver {
  constructor(cb: Oyente, init: IntersectionObserverInit = {}) {
    oyentes.push(cb);
    opciones.push(init);
  }
  observe() {}
  unobserve() {}
  disconnect() {}
  takeRecords() {
    return [];
  }
}

/** El mockup entra (o sale) de pantalla. */
function visibleEnPantalla(visible = true) {
  act(() => {
    for (const cb of oyentes) {
      cb(
        [{ isIntersecting: visible } as IntersectionObserverEntry],
        {} as unknown as IntersectionObserver,
      );
    }
  });
}

beforeEach(() => {
  oyentes = [];
  opciones = [];
  vi.stubGlobal('IntersectionObserver', FakeIntersectionObserver);
  window.sessionStorage.clear();
  act(() => reiniciarModulos());
});

afterEach(() => {
  vi.useRealTimers();
  vi.unstubAllGlobals();
});

const tarjeta = (nombre: RegExp) => screen.getByRole('button', { name: nombre });
const PISTA = 'Tocá para activar';

describe('HeroMockup', () => {
  it('muestra cuatro módulos como botones con aria-pressed, todos apagados al principio', () => {
    render(<HeroMockup />);
    const botones = screen.getAllByRole('button');
    expect(botones.map((b) => b.textContent)).toEqual([
      'Turnos y reservas',
      'Tienda y catálogo',
      'Carta con QR',
      'Pagos online',
    ]);
    for (const b of botones) expect(b).toHaveAttribute('aria-pressed', 'false');
  });

  it('un toque activa y otro apaga', async () => {
    const u = userEvent.setup();
    render(<HeroMockup />);
    await u.click(tarjeta(/turnos/i));
    await u.click(tarjeta(/pagos/i));
    expect(tarjeta(/turnos/i)).toHaveAttribute('aria-pressed', 'true');
    expect(tarjeta(/pagos/i)).toHaveAttribute('aria-pressed', 'true');

    await u.click(tarjeta(/turnos/i));
    expect(tarjeta(/turnos/i)).toHaveAttribute('aria-pressed', 'false');
  });

  it('se opera con teclado: Tab llega a las tarjetas y Espacio o Enter alternan', async () => {
    const u = userEvent.setup();
    render(<HeroMockup />);
    await u.tab();
    expect(tarjeta(/turnos/i)).toHaveFocus();
    await u.keyboard(' ');
    expect(tarjeta(/turnos/i)).toHaveAttribute('aria-pressed', 'true');
    await u.tab();
    expect(tarjeta(/tienda/i)).toHaveFocus();
    await u.keyboard('{Enter}');
    expect(tarjeta(/tienda/i)).toHaveAttribute('aria-pressed', 'true');
  });

  it('avisa los cambios con una región aria-live', () => {
    render(<HeroMockup />);
    expect(document.querySelector('[aria-live="polite"]')).toBeInTheDocument();
  });

  it('cuenta lo activado cuando no hay pista', async () => {
    const u = userEvent.setup();
    render(<HeroMockup />);
    await u.click(tarjeta(/turnos/i));
    await u.click(tarjeta(/pagos/i));
    expect(screen.getByText('2 módulos activados')).toBeInTheDocument();
  });

  it('registra el evento modulo_alternado con origen hero', async () => {
    const eventos: Array<[string, unknown]> = [];
    const quitar = registerSink((e, props) => void eventos.push([e, props]));
    const u = userEvent.setup();
    render(<HeroMockup />);
    await u.click(tarjeta(/carta con qr/i));
    quitar();
    expect(eventos).toContainEqual([
      'modulo_alternado',
      { modulo: 'carta_qr', activo: true, origen: 'hero' },
    ]);
  });
});

describe('HeroMockup — pista "Tocá para activar"', () => {
  it('no aparece mientras el mockup no esté en pantalla', () => {
    render(<HeroMockup />);
    expect(screen.queryByText(PISTA)).not.toBeInTheDocument();
    visibleEnPantalla(false);
    expect(screen.queryByText(PISTA)).not.toBeInTheDocument();
  });

  it('aparece cuando el mockup entra en pantalla y no se tocó ninguna tarjeta', () => {
    render(<HeroMockup />);
    visibleEnPantalla();
    expect(screen.getByText(PISTA)).toBeInTheDocument();
    // Se pide que se vea al menos la mitad del mockup.
    expect(opciones[0]?.threshold).toBe(0.5);
  });

  it('se va sola si nadie toca nada, y no vuelve', () => {
    vi.useFakeTimers();
    render(<HeroMockup />);
    visibleEnPantalla();
    expect(screen.getByText(PISTA)).toBeInTheDocument();

    act(() => void vi.advanceTimersByTime(4100));
    expect(screen.queryByText(PISTA)).not.toBeInTheDocument();

    visibleEnPantalla(); // sale y vuelve a entrar
    expect(screen.queryByText(PISTA)).not.toBeInTheDocument();
  });

  it('se oculta al primer toque y no vuelve a aparecer', async () => {
    const u = userEvent.setup();
    render(<HeroMockup />);
    visibleEnPantalla();
    expect(screen.getByText(PISTA)).toBeInTheDocument();

    await u.click(tarjeta(/turnos/i));
    expect(screen.queryByText(PISTA)).not.toBeInTheDocument();
    expect(screen.getByText('1 módulo activado')).toBeInTheDocument();

    visibleEnPantalla();
    expect(screen.queryByText(PISTA)).not.toBeInTheDocument();
  });

  it('no aparece si ya se tocó una tarjeta antes de que el mockup se viera', async () => {
    const u = userEvent.setup();
    render(<HeroMockup />);
    await u.click(tarjeta(/pagos/i));
    visibleEnPantalla();
    expect(screen.queryByText(PISTA)).not.toBeInTheDocument();
  });

  it('no aparece si la persona ya había activado módulos (estado guardado del tab)', () => {
    act(() => void alternarModuloStore('turnos'));
    render(<HeroMockup />);
    visibleEnPantalla();
    expect(screen.queryByText(PISTA)).not.toBeInTheDocument();
  });

  it('sin IntersectionObserver (navegador viejo) no rompe y no muestra pista', () => {
    vi.stubGlobal('IntersectionObserver', undefined);
    render(<HeroMockup />);
    expect(screen.queryByText(PISTA)).not.toBeInTheDocument();
    expect(screen.getAllByRole('button')).toHaveLength(4);
  });
});
