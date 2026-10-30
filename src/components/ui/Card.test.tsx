import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { Card } from './Card';

describe('Card — estados', () => {
  it('default: superficie por tokens de componente (tarjeta < panel) y sin interacción', () => {
    const { rerender } = render(<Card data-testid="c">Turnos</Card>);
    const c = screen.getByTestId('c');
    expect(c.tagName).toBe('DIV');
    expect(c.className).toContain('border-tarjeta-borde');
    expect(c.className).toContain('bg-tarjeta-fondo');
    expect(c.className).toContain('rounded-card');
    expect(c.className).not.toMatch(/hover:|active:/);
    rerender(
      <Card data-testid="c" nivel="panel" como="section">
        Turnos
      </Card>,
    );
    expect(screen.getByTestId('c').tagName).toBe('SECTION');
    expect(screen.getByTestId('c').className).toContain('rounded-panel');
  });

  it('hover: solo la tarjeta enlace reacciona al puntero', () => {
    render(<Card href="/demo/gastronomia">Probá la demo</Card>);
    expect(screen.getByRole('link', { name: 'Probá la demo' }).className).toContain(
      'hover:border-line-strong',
    );
  });

  it('focus: la tarjeta enlace se alcanza con Tab', async () => {
    const user = userEvent.setup();
    render(<Card href="/demo/gastronomia">Probá la demo</Card>);
    await user.tab();
    expect(screen.getByRole('link', { name: 'Probá la demo' })).toHaveFocus();
  });

  it('active: la tarjeta enlace usa la escala de toque única', () => {
    render(<Card href="/demo">Demo</Card>);
    expect(screen.getByRole('link').className).toContain('active:scale-[0.98]');
  });

  it('disabled: enlace deshabilitado, sin destino y fuera del orden de Tab', async () => {
    const user = userEvent.setup();
    render(
      <Card href="/demo" deshabilitada>
        Demo
      </Card>,
    );
    const a = screen.getByRole('link', { name: 'Demo' });
    expect(a).toHaveAttribute('aria-disabled', 'true');
    expect(a).not.toHaveAttribute('href');
    await user.tab();
    expect(a).not.toHaveFocus();
  });

  it('loading: aria-busy, spinner con su anuncio y el contenido reserva el lugar', () => {
    render(
      <Card data-testid="c" estado="cargando" etiquetaCargando="Cargando el pedido">
        Pedido
      </Card>,
    );
    const c = screen.getByTestId('c');
    expect(c).toHaveAttribute('aria-busy', 'true');
    expect(screen.getByRole('status')).toHaveTextContent('Cargando el pedido');
    expect(screen.getByText('Pedido').className).toContain('opacity-0');
  });

  it('error: borde de error y el mensaje va adentro (no solo color)', () => {
    render(
      <Card data-testid="c" estado="error">
        <p>No pudimos cargar tus pedidos.</p>
      </Card>,
    );
    const c = screen.getByTestId('c');
    expect(c).toHaveAttribute('data-estado', 'error');
    expect(c.className).toContain('border-control-error');
    expect(c).toHaveTextContent('No pudimos cargar tus pedidos.');
  });

  it('success: borde de selección (la pieza encajada)', () => {
    render(
      <Card data-testid="c" estado="exito">
        Listo
      </Card>,
    );
    expect(screen.getByTestId('c')).toHaveAttribute('data-estado', 'exito');
    expect(screen.getByTestId('c').className).toContain('border-seleccion-borde');
  });
});
