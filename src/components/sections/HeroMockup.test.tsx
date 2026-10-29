import { act, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { reiniciarModulos } from '@/features/empezar/modulos-store';
import { registerSink } from '@/lib/analytics';
import { HeroMockup } from './HeroMockup';

beforeEach(() => {
  window.sessionStorage.clear();
  act(() => reiniciarModulos());
});

afterEach(() => {
  vi.useRealTimers();
});

const tarjeta = (nombre: RegExp) => screen.getByRole('button', { name: nombre });

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

  it('al primer toque muestra "Tocá para activar", se va sola y no vuelve a aparecer', async () => {
    vi.useFakeTimers({ shouldAdvanceTime: true });
    const u = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
    render(<HeroMockup />);
    expect(screen.queryByText('Tocá para activar')).not.toBeInTheDocument();

    await u.click(tarjeta(/turnos/i));
    expect(screen.getByText('Tocá para activar')).toBeInTheDocument();

    act(() => void vi.advanceTimersByTime(3000));
    expect(screen.queryByText('Tocá para activar')).not.toBeInTheDocument();
    // En su lugar queda el resumen de lo activado.
    expect(screen.getByText('1 módulo activado')).toBeInTheDocument();

    await u.click(tarjeta(/pagos/i));
    expect(screen.queryByText('Tocá para activar')).not.toBeInTheDocument();
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
