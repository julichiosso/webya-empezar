import { render, screen, within } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { PreviewPanel } from './PreviewPanel';

describe('PreviewPanel', () => {
  it('muestra el nombre y lista solo los módulos activos', () => {
    render(<PreviewPanel rubroNombre="Comercio y tienda" activos={['catalogo', 'pagos']} />);
    const panel = screen.getByTestId('negocio-preview-panel');
    expect(within(panel).getAllByRole('listitem', { hidden: true })).toHaveLength(2);
    expect(within(panel).getByText('Comercio y tienda')).toBeInTheDocument();
    expect(within(panel).getByText('2 módulos')).toBeInTheDocument();
  });

  it('sin rubro ni módulos muestra el estado vacío', () => {
    render(<PreviewPanel activos={[]} />);
    const panel = screen.getByTestId('negocio-preview-panel');
    expect(within(panel).getByText('Tu negocio')).toBeInTheDocument();
    expect(within(panel).getByText('Acá encajan tus módulos')).toBeInTheDocument();
    expect(within(panel).queryAllByRole('listitem', { hidden: true })).toHaveLength(0);
  });

  it('es decorativa: está oculta a lectores de pantalla', () => {
    render(<PreviewPanel activos={['turnos']} />);
    expect(screen.getByTestId('negocio-preview-panel')).toHaveAttribute('aria-hidden', 'true');
  });
});
