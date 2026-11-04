import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { CLIENTES } from '@/content/clientes';
import { TELON } from '@/content/telon';
import { Telon } from './Telon';

describe('Telon', () => {
  it('tiene el enlace para saltar y el resto es decorativo', () => {
    const { container } = render(<Telon />);
    expect(screen.getByRole('link', { name: TELON.saltar })).toHaveAttribute('href', '#hero-title');
    expect(container.querySelector('[aria-hidden="true"]')).not.toBeNull();
  });

  it('muestra un rótulo por cliente, tomado de content/clientes', () => {
    render(<Telon />);
    for (const c of CLIENTES) expect(screen.getByText(c.rotulo)).toBeInTheDocument();
  });

  it('las capturas traen width y height (CLS 0) y alt vacío', () => {
    const { container } = render(<Telon />);
    const imgs = container.querySelectorAll('img');
    expect(imgs.length).toBeGreaterThan(3);
    for (const img of imgs) {
      expect(img).toHaveAttribute('width');
      expect(img).toHaveAttribute('height');
      expect(img).toHaveAttribute('alt', '');
    }
  });
});
