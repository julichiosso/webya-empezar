import { render, screen, within } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { MODULO_IDS } from '@/content/modulos';
import { NegocioPreview } from './NegocioPreview';
import { PreviewNegocio } from './PreviewNegocio';

describe('PreviewNegocio', () => {
  it('compacta: pastillas de todos los módulos, sin rubro muestra "Tu negocio"', () => {
    render(<PreviewNegocio layout="compacta" activos={['turnos']} />);
    const p = screen.getByTestId('negocio-preview');
    expect(p).toHaveAttribute('aria-hidden', 'true');
    expect(within(p).getByText('Tu negocio')).toBeInTheDocument();
    const items = within(p).getAllByRole('listitem', { hidden: true });
    expect(items).toHaveLength(MODULO_IDS.length);
    expect(items.filter((li) => li.dataset.on === 'true')).toHaveLength(1);
  });

  it('NegocioPreview sigue siendo la variante compacta (misma API)', () => {
    render(<NegocioPreview rubroNombre="Comercio y tienda" rubroIcono="tienda" activos={[]} />);
    expect(
      within(screen.getByTestId('negocio-preview')).getByText('Comercio y tienda'),
    ).toBeInTheDocument();
  });
});
