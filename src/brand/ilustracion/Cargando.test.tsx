import { render } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Cargando } from './Cargando';

describe('Cargando (spinner Encastre)', () => {
  it('en la grilla 24, con currentColor y decorativo por defecto', () => {
    const { container } = render(<Cargando />);
    const svg = container.querySelector('svg')!;
    expect(svg).toHaveAttribute('viewBox', '0 0 24 24');
    expect(svg).toHaveAttribute('stroke', 'currentColor');
    expect(svg).toHaveAttribute('aria-hidden', 'true');
    expect(svg.querySelector('.ilus-giro')).not.toBeNull();
  });

  it('con title se anuncia como imagen', () => {
    const { container } = render(<Cargando title="Cargando" size={32} />);
    const svg = container.querySelector('svg')!;
    expect(svg).toHaveAttribute('role', 'img');
    expect(svg).toHaveAttribute('width', '32');
    expect(svg.querySelector('title')?.textContent).toBe('Cargando');
  });
});
