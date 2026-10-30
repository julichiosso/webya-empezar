import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Spinner } from './Spinner';

describe('Spinner', () => {
  it('decorativo por defecto: lo anuncia el control que lo contiene (aria-busy)', () => {
    const { container } = render(<Spinner />);
    const svg = container.querySelector('svg');
    expect(svg).toHaveAttribute('aria-hidden', 'true');
    expect(screen.queryByRole('status')).not.toBeInTheDocument();
  });

  it('con etiqueta se anuncia como estado', () => {
    render(<Spinner etiqueta="Cargando la carta" />);
    expect(screen.getByRole('status')).toHaveTextContent('Cargando la carta');
  });

  it('gira solo si no se pidió movimiento reducido (motion-safe)', () => {
    const { container } = render(<Spinner />);
    expect(container.querySelector('svg')?.getAttribute('class')).toBe('motion-safe:animate-spin');
  });
});
